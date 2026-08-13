import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type TownshipFeature,
  TRANSIT_OPERATOR_LAYER_NAMES,
  type TransitLayerFeatureCollection,
} from "@karta/app";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { isDirectExecution } from "./cliEntry";
import { createDisplayPolygons } from "./displayTownships";
import { createDisplayTransit } from "./displayTransit";
import { writeGeoJsonFile } from "./export";
import { REGION_PIPELINE_CONFIGS } from "./regionPipelineConfigs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = resolve(__dirname, "../../packages/web/public/data");

async function readPolygonCollection<Properties extends object>(
  dataDir: string,
  name: string,
): Promise<FeatureCollection<Polygon | MultiPolygon, Properties>> {
  return JSON.parse(
    await readFile(resolve(dataDir, name), "utf8"),
  ) as FeatureCollection<Polygon | MultiPolygon, Properties>;
}

/**
 * Rebuilds a metro's `townships`/`township-areas` compact display files from
 * whichever source file exists (`.display.v1.geojson`, falling back to the
 * plain `.v1.geojson`).
 * @returns `false` if the metro has no township source file at all yet.
 */
export async function rebuildTownshipDisplay(
  dataDir: string,
): Promise<boolean> {
  try {
    const source = await readPolygonCollection<TownshipFeature["properties"]>(
      dataDir,
      "townships.display.v1.geojson",
    ).catch(async () => {
      return readPolygonCollection<TownshipFeature["properties"]>(
        dataDir,
        "townships.v1.geojson",
      );
    });
    const areas = await readPolygonCollection<Record<string, unknown>>(
      dataDir,
      "township-areas.display.v1.geojson",
    ).catch(async () => {
      return readPolygonCollection<Record<string, unknown>>(
        dataDir,
        "township-areas.v1.geojson",
      );
    });
    await writeGeoJsonFile(
      resolve(dataDir, "townships.display.v1.geojson"),
      createDisplayPolygons(source),
      { compact: true },
    );
    await writeGeoJsonFile(
      resolve(dataDir, "township-areas.display.v1.geojson"),
      createDisplayPolygons(areas),
      { compact: true },
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Rebuilds a metro's transit-operator compact display files from whichever
 * source file exists (`.display.v1.geojson`, falling back to the plain
 * `.v1.geojson`), logging and skipping any operator with no source file.
 */
export async function rebuildTransitDisplay(
  dataDir: string,
  metroId: string,
): Promise<void> {
  for (const name of TRANSIT_OPERATOR_LAYER_NAMES) {
    try {
      const collection = JSON.parse(
        await readFile(resolve(dataDir, `${name}.display.v1.geojson`), "utf8"),
      ) as TransitLayerFeatureCollection;
      await writeGeoJsonFile(
        resolve(dataDir, `${name}.display.v1.geojson`),
        createDisplayTransit(collection),
        { compact: true },
      );
    } catch {
      try {
        const collection = JSON.parse(
          await readFile(resolve(dataDir, `${name}.v1.geojson`), "utf8"),
        ) as TransitLayerFeatureCollection;
        await writeGeoJsonFile(
          resolve(dataDir, `${name}.display.v1.geojson`),
          createDisplayTransit(collection),
          { compact: true },
        );
      } catch {
        console.log(`  skipping ${metroId}/${name} (no source file)`);
      }
    }
  }
}

/**
 * Rebuilds display files for every metro in every configured region's
 * pipeline, per {@link REGION_PIPELINE_CONFIGS}.
 * @remarks Loops `config.metros` per region rather than the flat, global
 *   `METROS` list, so a metro registered for a region this helper hasn't
 *   been pointed at yet doesn't get processed here regardless — the same
 *   region-scoping `runRegion` (`src/run.ts`) already applies via
 *   `assertMetroSetup`.
 */
async function main() {
  for (const config of REGION_PIPELINE_CONFIGS) {
    for (const metro of config.metros) {
      const dataDir = resolve(DATA_ROOT, metro.id);
      const hasTownships = await rebuildTownshipDisplay(dataDir);
      if (!hasTownships) {
        console.log(`  skipping ${metro.id} townships (no source file yet)`);
        continue;
      }
      await rebuildTransitDisplay(dataDir, metro.id);
    }
  }
}

/* v8 ignore start -- exercised via `npm run display`, not unit tests */
if (isDirectExecution(process.argv, import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
/* v8 ignore stop */
