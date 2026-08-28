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
