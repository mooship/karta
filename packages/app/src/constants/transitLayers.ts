/**
 * Basenames of the per-metro `<name>.display.v1.geojson` transit files that
 * `data-pipeline/src/buildDisplayData.ts` (the legacy per-metro display
 * rebuild helper, see `npm run display` in `data-pipeline/README.md`) knows
 * how to look up and rebuild.
 * @remarks Legacy, and scoped to that one helper only — a second, disconnected
 *   transit-operator naming scheme (per-operator basenames like `"gautrain"`,
 *   `"prasa"`) from the current shipped `gauteng-spatial-legacy` layer ids
 *   (`rapid-rail`, `bus-rapid-transit`, `commuter-rail`, `bus`, defined in
 *   `domains/gauteng-spatial-legacy/layers.ts`), which group multiple
 *   operators per network layer. Do not treat this as the current
 *   transit-layer id scheme, and do not extend it for new layers — it exists
 *   only because `buildDisplayData.ts`'s legacy per-metro rebuild predates
 *   that grouping and still operates per-operator.
 */
export const TRANSIT_OPERATOR_LAYER_NAMES = [
  "gautrain",
  "gautrain-bus",
  "prasa",
  "a-re-yeng",
  "rea-vaya",
] as const;

/**
 * One of `TRANSIT_OPERATOR_LAYER_NAMES`.
 * @remarks Legacy, scoped to `data-pipeline/src/buildDisplayData.ts` only —
 *   see `TRANSIT_OPERATOR_LAYER_NAMES`'s remarks.
 */
export type TransitOperatorLayerName =
  (typeof TRANSIT_OPERATOR_LAYER_NAMES)[number];
