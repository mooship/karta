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
 *   kilometres) contribute comparably. The two are then combined as a true
 *   weighted average — the weighted sum of whichever metrics are known,
 *   divided by the sum of *their* weights — rather than a weighted sum that
 *   silently assumes `weights` sums to 1; `SpatialBurdenWeights` is
 *   documented as "relative", so a caller passing e.g. `{0.3, 0.3}` still
 *   gets a full 0–1 range instead of one capped at 0.6. When only one
 *   metric is known, dividing by that single metric's own weight cancels
 *   it out, so the result is just that metric's normalized value — the
 *   same number the old ad hoc single-metric branch returned, but now as a
 *   natural consequence of the general formula rather than a special case
 *   that happened to coincide with it only when weights summed to 1.
 *   Returns `null` only when both metrics are unknown.
 */
export function computeSpatialBurdenScore(
  commuteMinutes: number | null,
  nearestTransitKm: number | null,
  weights: SpatialBurdenWeights = DEFAULT_WEIGHTS,
): number | null {
  const normalizedCommute = normalize(commuteMinutes, MAX_COMMUTE_MINUTES);
  const normalizedTransit = normalize(nearestTransitKm, MAX_TRANSIT_KM);

  let weightedSum = 0;
  let weightTotal = 0;
  if (normalizedCommute !== null) {
    weightedSum += normalizedCommute * weights.commuteWeight;
    weightTotal += weights.commuteWeight;
  }
  if (normalizedTransit !== null) {
    weightedSum += normalizedTransit * weights.transitWeight;
    weightTotal += weights.transitWeight;
  }

  if (weightTotal === 0) {
    return null;
  }
  return weightedSum / weightTotal;
}
