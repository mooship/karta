import { getProvinceRegionIds } from "@karta/app";

/**
 * Builds one `/data/<regionId>/<fileName>` URL per province-kind region, for
 * a layer's `dataSource` array. `@karta/core`'s `fetchFeatureCollection` (via
 * `mergeFeatureCollections`) fetches every URL and merges the results into
 * one `FeatureCollection`.
 * @remarks Filtered to `kind: "province"` regions via `getProvinceRegionIds()`
 *   rather than every `REGIONS` entry: `App.tsx`'s only caller fetches
 *   `townships`/`township-areas`, both published per-province by the data
 *   pipeline — a future `national`/`custom`-kind region wouldn't have that
 *   data published under its id, so including it here would 404.
 */
export function buildRegionDataUrls(fileName: string): string[] {
  return getProvinceRegionIds().map(
    (regionId) => `/data/${regionId}/${fileName}`,
  );
}
