import type { Feature, FeatureCollection } from "geojson";

/**
 * Concatenates the features from multiple FeatureCollections into one.
 * @param collections - Collections to merge, in order.
 * @returns A new `FeatureCollection` containing all features, typed the same
 *   as the input collections (e.g. merging `FeatureCollection<Point, Foo>[]`
 *   returns a `FeatureCollection<Point, Foo>`) rather than widening to the
 *   bare `FeatureCollection` type.
 */
export function mergeFeatureCollections<T extends FeatureCollection>(
  collections: readonly T[],
): T {
  const features: Feature[] = collections.flatMap(
    (collection) => collection.features,
  );
  return { type: "FeatureCollection", features } as T;
}
