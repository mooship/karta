import type { TransitLayerFeatureCollection } from "@karta/app";
import { nearestFeatureDistance } from "@karta/core";
import type { LineString, Point } from "geojson";
import type { LatLon } from "./adapters/boundaries";

/** The geometry kinds `computeNearestTransitKm` measures straight-line distance against. */
export type TransitDistanceGeometry = Point | LineString;

/**
 * Flattens every transit collection's features down to the Point/LineString
 * geometries `computeNearestTransitKm` measures distance against, dropping
 * any other geometry kind.
 * @remarks Pure and loop-invariant across a region's metros: `transitCollections`
 *   is fetched once per region, not once per metro, so a caller computing
 *   nearest-transit distance for several metros (as `runRegion` in
 *   `src/run.ts` does) should call this once and pass the same flattened
 *   array to every `computeNearestTransitKm` call, rather than re-flattening
 *   the same input on every metro.
 */
export function flattenTransitGeometries(
  transitCollections: TransitLayerFeatureCollection[],
): TransitDistanceGeometry[] {
  return transitCollections
    .flatMap((collection) => collection.features)
    .map((feature) => feature.geometry)
    .filter(
      (geometry): geometry is TransitDistanceGeometry =>
        geometry.type === "Point" || geometry.type === "LineString",
    );
}

/**
 * For each centroid, finds the straight-line distance (km) to the nearest of
 * the given transit geometries.
 * @remarks Pure transform. Uses the real station/stop `Point` where one was
 *   fetched (Gautrain rail, PRASA), and falls back to the nearest point
 *   along the route `LineString` where only route geometry is available
 *   (Gautrain Bus, A Re Yeng) — never a fabricated or averaged number.
 *   Returns `null` for every centroid if `geometries` is empty. Takes the
 *   already-flattened geometry array (see `flattenTransitGeometries`)
 *   rather than raw collections, so a caller processing multiple metros'
 *   centroids against the same transit fetch flattens once and reuses it.
 */
export function computeNearestTransitKm(
  centroids: LatLon[],
  geometries: TransitDistanceGeometry[],
): (number | null)[] {
  return centroids.map((centroid) =>
    nearestFeatureDistance([centroid.lon, centroid.lat], geometries),
  );
}
