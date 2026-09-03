import { rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type MetroDefinition,
  type MetroId,
  REGIONS,
  type TownshipFeature,
  type TransitLayerFeatureCollection,
} from "@karta/app";
import type { FeatureCollection } from "geojson";
import {
  fetchMetroBoundariesForMetros,
  type NormalizedTownship,
  normalizeBoundaries,
} from "./adapters/boundaries";
import { pruneCache } from "./cache";
import { isDirectExecution } from "./cliEntry";
import { getJobCentersForMetro } from "./constants/jobCenters";
import { isUsingCustomOsrmEndpoint } from "./constants/serviceUrls";
import { createDisplayPolygons } from "./displayTownships";
import { createDisplayTransit } from "./displayTransit";
import { writeGeoJsonFile } from "./export";
import { joinTownshipData } from "./join";
import { getNearestJobCenter } from "./osrmClient";
import {
  buildOutputManifest,
  countTransitNetworks,
  validateOutputDirectory,
} from "./outputManifest";
import type { RegionPipelineConfig } from "./pipelineSource";
import {
  getRegionPipelineConfig,
  REGION_PIPELINE_CONFIGS,
} from "./regionPipelineConfigs";
import {
  assertCompleteNetworkCoverage,
  assertMetroSetup,
  assertNoUnmatchedTownshipAreas,
  cleanupStagingDirectories,
  formatDuration,
  mergeNetworkCoverage,
  promoteStagedOutput,
} from "./runHelpers";
import { createTownshipAreas } from "./townshipAreas";
import {
  computeNearestTransitKm,
  flattenTransitGeometries,
  type TransitDistanceGeometry,
} from "./transitDistance";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Root directory every region's dataset is staged under and published into. */
export const OUTPUT_ROOT = resolve(__dirname, "../../packages/web/public/data");

async function timedStep<T>(
  label: string,
  work: () => Promise<T>,
  successMessage?: (result: T) => string,
): Promise<T> {
  const startedAt = Date.now();
  console.log(`${label}...`);
  try {
    const result = await work();
    const elapsed = Date.now() - startedAt;
    const suffix = successMessage ? ` ${successMessage(result)}` : "";
    console.log(`  done in ${formatDuration(elapsed)}${suffix}`);
    return result;
  } catch (error) {
    const elapsed = Date.now() - startedAt;
    console.log(`  failed after ${formatDuration(elapsed)}`);
    throw error;
  }
}

/** One metro's processed output: its `TownshipFeature`s plus the raw normalized townships behind them, for `runRegion` to concatenate in metro order. */
interface MetroProcessingResult {
  metroId: string;
  townshipFeatures: TownshipFeature[];
  normalizedTownships: NormalizedTownship[];
}

/**
 * Computes one metro's drive times, nearest-transit distances, and joined
 * `TownshipFeature`s.
 * @remarks `getNearestJobCenter` (network-bound, OSRM) and
 *   `computeNearestTransitKm` (pure local math, no I/O) have no data
 *   dependency on each other, so they run via `Promise.all` rather than
 *   sequential `await`s — the CPU-bound transit-distance pass overlaps
 *   OSRM's network latency instead of adding on top of it.
 * @throws If the metro has no job centres configured.
 */
async function processMetro(
  metro: MetroDefinition,
  rawBoundaries: FeatureCollection,
  transitGeometries: TransitDistanceGeometry[],
): Promise<MetroProcessingResult> {
  console.log(`\n=== ${metro.id} ===`);
  const townships = normalizeBoundaries(rawBoundaries);
  console.log(`  ${townships.length} sub-places loaded`);

  const jobCenters = getJobCentersForMetro(metro.id);
  if (jobCenters.length === 0) {
    throw new Error(`No job centers configured for ${metro.id}`);
  }

  const [nearestJobCenters, nearestTransitKm] = await Promise.all([
    timedStep("Computing drive times", () =>
      getNearestJobCenter(
        townships.map((township) => township.centroid),
        jobCenters,
      ),
    ),
    timedStep("Computing nearest-transit distances", async () =>
      computeNearestTransitKm(
        townships.map((township) => township.centroid),
        transitGeometries,
      ),
    ),
  ]);

  return {
    metroId: metro.id,
    townshipFeatures: joinTownshipData(
      townships,
      nearestJobCenters,
      nearestTransitKm,
    ),
    normalizedTownships: townships,
  };
}

/**
 * Processes `metros` one at a time, each fully awaited before the next
 * starts.
 * @remarks The correct mode against the public OSRM demo server: its
 *   `BATCH_SIZE`/`BATCH_DELAY_MS` rate-limiting in `osrmClient.ts` assumes
 *   only one metro's requests are in flight, so this stays the default —
 *   see `runRegion`'s branch on `isUsingCustomOsrmEndpoint()`.
 */
async function processMetrosSequentially(
  metros: MetroDefinition[],
  metroBoundaries: Record<MetroId, FeatureCollection>,
  transitGeometries: TransitDistanceGeometry[],
): Promise<MetroProcessingResult[]> {
  const results: MetroProcessingResult[] = [];
  for (const metro of metros) {
    results.push(
      await processMetro(metro, metroBoundaries[metro.id], transitGeometries),
    );
  }
  return results;
}

/**
 * Builds one region's full dataset — transit sources, per-metro sub-place
 * boundaries, drive times and nearest-transit distances — into a staging
 * directory, then publishes it into `<outputRoot>/<regionId>` only once every
 * output file has been written, manifested and validated.
 * @param outputRoot - Root directory to stage and publish under; defaults to
 *   the published `packages/web/public/data`. Overridden by tests so a run
 *   never touches the real published dataset.
 * @throws If the region is misconfigured, any step fails, or the built output
 *   fails validation — in which case the staged directory is deleted and the
 *   previously published dataset is left exactly as it was.
 */
export async function runRegion(
  config: RegionPipelineConfig,
  outputRoot = OUTPUT_ROOT,
): Promise<void> {
  const { regionId, metros } = config;

  await pruneCache(7 * 24 * 60 * 60 * 1000);
  assertMetroSetup(metros);
  await cleanupStagingDirectories(outputRoot, regionId);

  if (metros.length === 0) {
    throw new Error(`No metros configured for region: ${regionId}`);
  }

  const publishDir = resolve(outputRoot, regionId);
  const stagedDir = resolve(outputRoot, `${regionId}.__staging__${Date.now()}`);

  try {
    const outputDir = stagedDir;

    const fetchedSources = await Promise.all(
      config.sources.map(async (source) => ({
        source,
        collection: await timedStep(
          `Fetching ${source.layerId} for ${regionId}`,
          source.fetch,
          (raw) => `(${raw.features.length} features)`,
        ),
      })),
    );
    const transitCollections = fetchedSources.map(
      (entry) => entry.collection as TransitLayerFeatureCollection,
    );
    const transitGeometries = flattenTransitGeometries(transitCollections);

    const metroBoundaries = await timedStep(
      `Fetching sub-place boundaries for ${regionId}'s ${metros.length} metros`,
      () => fetchMetroBoundariesForMetros(metros.map((metro) => metro.id)),
    );

    const allTownships = [];
    const allNormalizedTownships = [];
    const metroTownshipCounts: Record<string, number> = {};

    const metroResults = isUsingCustomOsrmEndpoint()
      ? await Promise.all(
          metros.map((metro) =>
            processMetro(metro, metroBoundaries[metro.id], transitGeometries),
          ),
        )
      : await processMetrosSequentially(
          metros,
          metroBoundaries,
          transitGeometries,
        );

    for (const result of metroResults) {
      allTownships.push(...result.townshipFeatures);
      allNormalizedTownships.push(...result.normalizedTownships);
      metroTownshipCounts[result.metroId] = result.townshipFeatures.length;
    }

    console.log(`Writing ${regionId} files...`);

    const townshipCollection = {
      type: "FeatureCollection" as const,
      features: allTownships,
    };
    await writeGeoJsonFile(
      resolve(outputDir, "townships.display.v1.geojson"),
      createDisplayPolygons(townshipCollection),
      { compact: true },
    );

    const townshipAreas = createTownshipAreas(allNormalizedTownships);
    assertNoUnmatchedTownshipAreas(
      townshipAreas,
      metros.map((metro) => metro.id),
    );
    await writeGeoJsonFile(
      resolve(outputDir, "township-areas.display.v1.geojson"),
      createDisplayPolygons(townshipAreas),
      { compact: true },
    );

    const networkCoverage = mergeNetworkCoverage(
      ...fetchedSources.map((entry) => countTransitNetworks(entry.collection)),
    );
    assertCompleteNetworkCoverage(networkCoverage, config.requiredNetworks);

    await Promise.all(
      fetchedSources.map(({ source, collection }) =>
        writeGeoJsonFile(
          resolve(outputDir, source.outputFileName),
          createDisplayTransit(collection as TransitLayerFeatureCollection),
          { compact: true },
        ),
      ),
    );

    const manifest = await buildOutputManifest(
      outputDir,
      metros.map((metro) => metro.id),
      networkCoverage,
      config,
    );
    await writeGeoJsonFile(resolve(outputDir, "manifest.v1.json"), manifest);

    const issues = await validateOutputDirectory(outputDir, config);
    if (issues.length > 0) {
      throw new Error(`Output validation failed: ${issues.join("; ")}`);
    }

    await promoteStagedOutput(stagedDir, publishDir);

    console.log(`\nPublished ${regionId} dataset:`);
    for (const metro of metros) {
      console.log(
        `  ${metro.id}: ${metroTownshipCounts[metro.id] ?? 0} sub-places`,
      );
    }
    for (const [network, count] of Object.entries(networkCoverage)) {
      console.log(`  ${network}: ${count} features`);
    }
  } catch (error) {
    await rm(stagedDir, { recursive: true, force: true });
    throw error;
  }
}

/**
 * `npm run run`'s default entry point: builds and publishes every configured
 * region whose `REGIONS` entry is a province, in registration order.
 * @param outputRoot - Root directory each region is published under, passed
 *   straight through to `runRegion`; defaults to `OUTPUT_ROOT`.
 * @remarks Deliberately sequential and fail-fast — a region that throws
 *   aborts the whole run, leaving every later region unbuilt rather than
 *   publishing a partial set of regions from a run that already failed.
 */
export async function runAllProvinceRegions(
  outputRoot = OUTPUT_ROOT,
): Promise<void> {
  const provinceRegionIds = new Set(
    REGIONS.filter((region) => region.kind === "province").map(
      (region) => region.id,
    ),
  );
  for (const config of REGION_PIPELINE_CONFIGS) {
    if (!provinceRegionIds.has(config.regionId)) {
      continue;
    }
    console.log(`\n### Region: ${config.regionId} ###`);
    await runRegion(config, outputRoot);
  }
}

/* v8 ignore start -- exercised via `npm run run`, not unit tests: runs the real pipeline against live external services */
if (isDirectExecution(process.argv, import.meta.url)) {
  const regionArgIndex = process.argv.indexOf("--region");
  const requestedRegionId =
    regionArgIndex >= 0 ? process.argv[regionArgIndex + 1] : undefined;

  const work = requestedRegionId
    ? runRegion(getRegionPipelineConfig(requestedRegionId))
    : runAllProvinceRegions();

  work.catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
/* v8 ignore stop */
