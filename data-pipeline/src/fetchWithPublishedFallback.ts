import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { TransitLayerFeatureCollection } from "@karta/app";
import { pathExists } from "./fsUtils";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_ROOT = resolve(__dirname, "../../packages/web/public/data");

async function readExistingTransitLayer(
  regionId: string,
  layerName: string,
): Promise<TransitLayerFeatureCollection | null> {
  const publishedOutputDir = resolve(OUTPUT_ROOT, regionId);
  const candidates = [
    resolve(publishedOutputDir, `${layerName}.display.v1.geojson`),
    resolve(publishedOutputDir, `${layerName}.v1.geojson`),
  ];

  for (const filePath of candidates) {
    if (!(await pathExists(filePath))) {
      continue;
    }
    try {
      const raw = await readFile(filePath, "utf8");
      const parsed = JSON.parse(raw) as TransitLayerFeatureCollection;
      if (Array.isArray(parsed.features) && parsed.features.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to read fallback candidate", filePath, error);
    }
  }

  return null;
}

/** Options for one `fetchWithPublishedFallback` call. */
export interface FetchWithPublishedFallbackOptions {
  /** Human-readable name used in log/error messages (e.g. "MyCiTi"). */
  sourceName: string;
  /** Basename `readExistingTransitLayer` looks up (e.g. `"bus-rapid-transit"`). */
  fallbackLayerName: string;
  fetch: () => Promise<TransitLayerFeatureCollection>;
  /**
   * Transforms the raw fallback `FeatureCollection` into the final result,
   * e.g. filtering a merged fallback file down to just this source's
   * features. Defaults to using the fallback as-is.
   */
  recoverFromFallback?: (
    fallback: TransitLayerFeatureCollection,
  ) => TransitLayerFeatureCollection;
}

/**
 * Builds a `fetchWithPublishedFallback` function bound to one region, so a
 * region's pipeline config (e.g. `regions/gautengPipelineConfig.ts`,
 * `regions/westernCapePipelineConfig.ts`) doesn't need to thread `regionId`
 * through every source's fetch wrapper by hand.
 * @remarks Extracted out of `gautengPipelineConfig.ts` once a second region
 *   needed the identical fallback-on-fetch-failure behaviour — see that
 *   file's history for the original single-region version.
 */
export function createFetchWithPublishedFallback(regionId: string) {
  /**
   * Runs `fetch`, falling back to the last published output for
   * `fallbackLayerName` if it throws, so a single unreachable/rate-limited
   * source doesn't fail the whole pipeline run.
   * @throws If `fetch` fails and no usable fallback output exists.
   */
  return async function fetchWithPublishedFallback({
    sourceName,
    fallbackLayerName,
    fetch,
    recoverFromFallback = (fallback) => fallback,
  }: FetchWithPublishedFallbackOptions): Promise<TransitLayerFeatureCollection> {
    try {
      return await fetch();
    } catch (error) {
      console.error(
        `Skipping ${sourceName} due to fetch failure, falling back to last published output`,
        error,
      );
      const fallback = await readExistingTransitLayer(
        regionId,
        fallbackLayerName,
      );
      if (!fallback) {
        throw new Error(
          `Failed to fetch ${sourceName} and no fallback output exists`,
        );
      }
      const recovered = recoverFromFallback(fallback);
      if (recovered.features.length === 0) {
        throw new Error(`Failed to recover ${sourceName} from fallback output`);
      }
      return recovered;
    }
  };
}
