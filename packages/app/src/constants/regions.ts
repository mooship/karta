/** The kind of geography a region represents. */
export type RegionKind = "province" | "national" | "custom";

/**
 * A geographic region the data pipeline produces one dataset for.
 * @remarks `id` drives the region's output directory
 *   (`packages/web/public/data/<id>/`) and the URLs `@karta/web` fetches
 *   data from.
 */
export interface RegionDefinition {
  id: string;
  label: string;
  kind: RegionKind;
}

/**
 * The regions covered by this reference implementation.
 * @remarks The data pipeline and `@karta/web` are written to loop over
 *   however many are configured here.
 */
export const REGIONS: readonly RegionDefinition[] = [
  { id: "gauteng", label: "Gauteng", kind: "province" },
  { id: "western-cape", label: "Western Cape", kind: "province" },
] as const satisfies readonly RegionDefinition[];

/**
 * Union of the ids actually configured in `REGIONS`, derived from `REGIONS`
 * itself rather than hand-typed. `MetroDefinition.regionId` (`./metros.ts`)
 * is typed against this instead of plain `string` so a typo'd or renamed
 * region id fails typechecking instead of silently producing a metro that
 * belongs to no configured region.
 */
export type RegionId = (typeof REGIONS)[number]["id"];

/**
 * The ids of every `kind: "province"` region in `REGIONS`, in registration
 * order.
 * @remarks The single source of truth for "every province region" — used
 *   wherever a multi-region layer/dataset needs to cover all of them
 *   (`domains/spatial-apartheid-legacy/layers.ts`'s multi-region
 *   `dataSource`s, `data-pipeline`'s `runAllProvinceRegions`) instead of
 *   each call site re-filtering `REGIONS` itself, which drifted out of sync
 *   in the past when a new region was added to `REGIONS` but a hardcoded
 *   list elsewhere wasn't updated to match.
 */
export function getProvinceRegionIds(): readonly RegionId[] {
  return REGIONS.filter((region) => region.kind === "province").map(
    (region) => region.id,
  );
}
