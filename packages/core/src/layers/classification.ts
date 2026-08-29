import type {
  CategorizedClassification,
  Classification,
  GraduatedClassification,
} from "../types/layer";

/**
 * Returns the cached value for `key`, computing and storing it via `compute`
 * on first access. Shared by `getSortedStops`/`getStopsByMatch` so each
 * derived-from-a-`Classification` value (graduated or categorized) is
 * computed once per object identity rather than on every `styleFn` call —
 * a layer's `Classification` object is a stable reference reused across
 * every feature of that layer.
 */
function getOrCompute<K extends object, V>(
  cache: WeakMap<K, V>,
  key: K,
  compute: () => V,
): V {
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }
  const computed = compute();
  cache.set(key, computed);
  return computed;
}

/** Cache of each graduated classification's stops sorted by `max`. */
const sortedStopsCache = new WeakMap<object, unknown[]>();

function getSortedStops<T>(
  classification: GraduatedClassification<T>,
): GraduatedClassification<T>["stops"] {
  return getOrCompute(sortedStopsCache, classification, () =>
    [...classification.stops].sort((a, b) => a.max - b.max),
  ) as GraduatedClassification<T>["stops"];
}

/** Cache of each categorized classification's stops indexed by `match` value. */
const stopsByMatchCache = new WeakMap<object, Map<string, unknown>>();

function getStopsByMatch<T>(
  classification: CategorizedClassification<T>,
): Map<string, T> {
  return getOrCompute(stopsByMatchCache, classification, () => {
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
    return indexed;
  }) as Map<string, T>;
}

/**
 * Resolves a feature property through a `Classification` to its style output value.
 * @param classification - Graduated (numeric range) or categorized (exact match) rules.
 * @param properties - The feature's properties, as passed to a Leaflet `styleFn`.
 * @returns The matching stop's `value`. `classification.fallback` is used
 *   when the property is missing or the wrong type, or (categorized only)
 *   when no stop matches — a graduated value above every stop's `max`
 *   clamps to the highest-`max` stop instead of falling back (see
 *   {@link GraduatedClassification}).
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
