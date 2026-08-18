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
 * The regions covered by this reference implementation. The data pipeline
 * and `@karta/web` are written to loop over however many are configured
 * here; `south-africa` is a `"national"`-kind region with no `data-pipeline`
 * output of its own — it exists only so the `heritage-sites` domain (whose
 * one hand-curated `FeatureCollection` needs no per-region fetch/join) has a
 * `RegionId` to associate with in `DOMAINS` (`./domains.ts`). Both
 * `runAllProvinceRegions` (`data-pipeline/src/run.ts`) and
 * `runAllRegionsOutputValidation` (`data-pipeline/src/validateOutput.ts`)
 * already skip a region with no matching output directory, so its absence
 * from the pipeline is a non-issue rather than something either needed to
 * special-case.
 */
export const REGIONS: readonly RegionDefinition[] = [
  { id: "gauteng", label: "Gauteng", kind: "province" },
  { id: "south-africa", label: "South Africa", kind: "national" },
] as const satisfies readonly RegionDefinition[];

/** Looks up a region's definition by id, or `undefined` if `id` isn't configured. */
export function getRegionDefinition(id: string): RegionDefinition | undefined {
  return REGIONS.find((region) => region.id === id);
}

/**
 * Union of the ids actually configured in `REGIONS`, derived from `REGIONS`
 * itself rather than hand-typed. `MetroDefinition.regionId` (`./metros.ts`)
 * is typed against this instead of plain `string` so a typo'd or renamed
 * region id fails typechecking instead of silently producing a metro that
 * belongs to no configured region.
 */
export type RegionId = (typeof REGIONS)[number]["id"];
