import { REGIONS } from "@karta/app";

/**
 * Builds one `/data/<regionId>/<fileName>` URL per configured
 * `"province"`-kind region, for a layer's `dataSource` array. `@karta/core`'s
 * `fetchFeatureCollection` (via `mergeFeatureCollections`) fetches every URL
 * and merges the results into one `FeatureCollection`.
 * @remarks Filtered to `"province"`-kind regions because that's the only
 *   `data-pipeline`-produced shape this app's township/area files exist
 *   for — mirroring `runAllProvinceRegions`'s own filter
 *   (`data-pipeline/src/run.ts`). A `"national"`-kind region like
 *   `south-africa` (`heritage-sites`'s region) has no such per-region
 *   output directory; including it here would build a URL to a file that
 *   was never written.
 */
export function buildRegionDataUrls(fileName: string): string[] {
  return REGIONS.filter((region) => region.kind === "province").map(
    (region) => `/data/${region.id}/${fileName}`,
  );
}
