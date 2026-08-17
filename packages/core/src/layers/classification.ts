import type {
  CategorizedClassification,
  Classification,
  GraduatedClassification,
} from "../types/layer";

/**
 * Cache of each graduated classification's stops sorted by `max`, keyed by
 * object identity. A layer's `Classification` object is a stable reference
 * reused across every feature's `styleFn` call, so this avoids re-sorting
 * the same stops on every single feature of a layer.
 */
const sortedStopsCache = new WeakMap<object, unknown[]>();

function getSortedStops<T>(
  classification: GraduatedClassification<T>,
): GraduatedClassification<T>["stops"] {
  const cached = sortedStopsCache.get(classification);
  if (cached) {
    return cached as GraduatedClassification<T>["stops"];
  }
  const sorted = [...classification.stops].sort((a, b) => a.max - b.max);
  sortedStopsCache.set(classification, sorted);
  return sorted;
}

/**
 * Cache of each categorized classification's stops indexed by `match` value,
 * keyed by object identity — the same rationale as `sortedStopsCache`, so a
 * feature's `styleFn` call resolves its category with a `Map` lookup instead
 * of a linear `Array.find` scan repeated per feature.
 */
const stopsByMatchCache = new WeakMap<object, Map<string, unknown>>();

function getStopsByMatch<T>(
  classification: CategorizedClassification<T>,
): Map<string, T> {
  const cached = stopsByMatchCache.get(classification);
  if (cached) {
    return cached as Map<string, T>;
  }
  /**
   * @remarks Built with an explicit `has` guard, rather than `new Map(stops.map(...))`,
   *   so an (unexpected) duplicate `match` value keeps the first stop's value —
   *   matching `Array.find`'s first-match semantics exactly rather than the
   *   last-write-wins behaviour a plain `Map` construction from pairs would give.
   */
  const indexed = new Map<string, T>();
  for (const stop of classification.stops) {
    if (!indexed.has(stop.match)) {
      indexed.set(stop.match, stop.value);
    }
  }
  stopsByMatchCache.set(classification, indexed);
  return indexed;
}

/**
 * Resolves a feature property through a `Classification` to its style output value.
 * @param classification - Graduated (numeric range) or categorized (exact match) rules.
 * @param properties - The feature's properties, as passed to a Leaflet `styleFn`.
 * @returns The matching stop's `value`, or `classification.fallback` when the
 *   property is missing, the wrong type, or matches no stop.
 * @example
 * const color = resolveClassification(style.colorClassification, feature.properties);
 */
export function resolveClassification<T>(
  classification: Classification<T>,
  properties: Record<string, unknown> | null | undefined,
): T {
  const raw = properties?.[classification.propertyKey];

  if (classification.kind === "graduated") {
    if (typeof raw !== "number") {
      return classification.fallback;
    }
    const sortedStops = getSortedStops(classification);
    const stop = sortedStops.find((s) => raw <= s.max);
    return stop?.value ?? sortedStops.at(-1)?.value ?? classification.fallback;
  }

  if (typeof raw !== "string") {
    return classification.fallback;
  }
  const stopsByMatch = getStopsByMatch(classification);
  return stopsByMatch.get(raw) ?? classification.fallback;
}
