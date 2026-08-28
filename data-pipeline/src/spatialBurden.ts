/** Relative weight each metric contributes to a combined spatial-burden score. */
export interface SpatialBurdenWeights {
  commuteWeight: number;
  transitWeight: number;
}

/**
 * Default weighting: commute time to a job centre is a more direct proxy for
 * jobs access than straight-line distance to transit, so it counts for more.
 */
const DEFAULT_WEIGHTS: SpatialBurdenWeights = {
  commuteWeight: 0.6,
  transitWeight: 0.4,
};

/**
 * Fixed-scale normalization bounds, chosen a bit past the existing
 * `townships`/`nearest-transit` choropleths' top bucket ceilings (60 min,
 * 8 km) so the burden score's top bucket isn't saturated for most features,
 * and fixed (not sample min-max) so a score stays comparable across pipeline
 * runs and metros.
 */
const MAX_COMMUTE_MINUTES = 90;
const MAX_TRANSIT_KM = 10;

/** Clamps `value` to `[0, max]` and scales it to `[0, 1]`, or `null` if `value` is `null`. */
function normalize(value: number | null, max: number): number | null {
  if (value === null) {
    return null;
  }
  return Math.min(Math.max(value, 0), max) / max;
}

/**
 * Combines modelled job-centre commute time and straight-line transit
 * distance into a single 0–1 "spatial burden" score for a township, feeding
 * the `spatial-burden` choropleth layer.
 * @remarks Each metric is independently clamped and min-max normalized
 *   against a fixed scale (see `MAX_COMMUTE_MINUTES`/`MAX_TRANSIT_KM`) before
 *   being combined, so the two differently-scaled inputs (minutes vs.
 *   kilometres) contribute comparably. If only one metric is known, its
 *   normalized value is returned directly rather than treating the missing
 *   metric as zero, which would understate burden. Returns `null` only when
 *   both metrics are unknown.
 */
export function computeSpatialBurdenScore(
  commuteMinutes: number | null,
  nearestTransitKm: number | null,
  weights: SpatialBurdenWeights = DEFAULT_WEIGHTS,
): number | null {
  const normalizedCommute = normalize(commuteMinutes, MAX_COMMUTE_MINUTES);
  const normalizedTransit = normalize(nearestTransitKm, MAX_TRANSIT_KM);

  if (normalizedCommute === null && normalizedTransit === null) {
    return null;
  }
  if (normalizedTransit === null) {
    return normalizedCommute;
  }
  if (normalizedCommute === null) {
    return normalizedTransit;
  }
  return (
    normalizedCommute * weights.commuteWeight +
    normalizedTransit * weights.transitWeight
  );
}
