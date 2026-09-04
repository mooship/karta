import { bbox } from "@turf/bbox";
import { distance } from "@turf/distance";
import { lineString, point } from "@turf/helpers";
import { pointToLineDistance } from "@turf/point-to-line-distance";
import type { BBox, LineString, Point, Position } from "geojson";
import { assertValidPosition } from "./assertValidPosition";

/**
 * A lower bound (kilometres) on the distance from `origin` to any point
 * inside `box`, found by clamping `origin`'s coordinates into the box
 * (per-axis, independently) and measuring the exact distance to that
 * clamped point.
 * @remarks Every point of a geometry lies within its own bounding box, so
 *   this is always `<=` the geometry's true nearest distance — safe to use
 *   as a cheap pre-check before the expensive exact calculation. Assumes a
 *   regional (not global/antimeridian-crossing) extent, matching this
 *   function's callers. Passes `origin`/`clamped` to Turf's `distance`
 *   directly as raw positions (Turf's `Coord` type accepts a bare
 *   `Position`) rather than wrapping each in a `point()` Feature, since this
 *   runs once per `LineString` comparison and the Feature wrapper adds
 *   allocation with no benefit here.
 */
function distanceToBoundingBox(origin: Position, box: BBox): number {
  const [minLng, minLat, maxLng, maxLat] = box;
  const clamped: Position = [
    Math.min(Math.max(origin[0] as number, minLng), maxLng),
    Math.min(Math.max(origin[1] as number, minLat), maxLat),
  ];
  return distance(origin, clamped, { units: "kilometers" });
}

const lineStringBoundingBoxCache = new WeakMap<LineString, BBox>();

/**
 * `bbox(geometry)`, memoized by object identity.
 * @remarks `nearestFeatureDistance` is typically called once per origin
 *   against the same, unchanging array of candidate geometries (e.g.
 *   `computeNearestTransitKm` in `data-pipeline` calls it once per township
 *   centroid, reusing the same flattened transit geometries every time) — a
 *   `LineString`'s bounding box never changes between those calls, so
 *   recomputing it on every call wastes work that scales with the number of
 *   origins, not just the number of geometries. A `WeakMap` keyed by the
 *   geometry object lets memory reclaim an entry once its geometry is no
 *   longer referenced, unlike a plain `Map`.
 */
function boundingBoxOf(geometry: LineString): BBox {
  const cached = lineStringBoundingBoxCache.get(geometry);
  if (cached) {
    return cached;
  }
  const box = bbox(geometry);
  lineStringBoundingBoxCache.set(geometry, box);
  return box;
}

/**
 * Finds the straight-line distance (kilometres) from `origin` to the nearest
 * of `geometries`.
 * @param origin - The point to measure from, as a `[lon, lat]` position.
 * @param geometries - Candidate `Point` or `LineString` geometries. A
 *   `LineString` is measured to its nearest point along the line, not just
 *   its vertices, so a route geometry isn't penalised for having sparse points.
 * @returns The minimum distance in kilometres, or `null` if `geometries` is empty.
 * @remarks Throws a descriptive `Error` for a degenerate `Point` (fewer than
 *   2 coordinates) or `LineString` (fewer than 2 positions) rather than
 *   letting the call into Turf below fail with an opaque low-level message.
 *   For each `LineString`, a cheap bounding-box lower bound
 *   (`distanceToBoundingBox`) is checked before running the expensive
 *   per-segment `pointToLineDistance` — a geometry whose lower bound already
 *   meets or exceeds the current best is skipped entirely, since it cannot
 *   possibly be nearer. This never changes the result (a lower bound can
 *   never exceed the true distance, so a true minimum is never skipped), it
 *   only reduces how much geodesic segment math runs against geometries
 *   that are obviously too far away to matter. `Point` geometries skip this
 *   check, since a point's own bounding box is itself — the check would just
 *   duplicate the exact distance calculation for no benefit. The bounding-box
 *   lower bound (`distanceToBoundingBox`) assumes a regional, non-antimeridian
 *   -crossing extent: it is not valid for a `LineString` whose bounding box
 *   wraps ±180° longitude (`minLng > maxLng`), since the per-axis clamp isn't
 *   meaningful there. This holds for every current caller — this package has
 *   no domain/region assumptions of its own, but a future caller measuring
 *   against geometries that cross the antimeridian should not rely on this
 *   function's bounding-box pruning being correct for those geometries.
 */
export function nearestFeatureDistance(
  origin: Position,
  geometries: readonly (Point | LineString)[],
): number | null {
  if (geometries.length === 0) {
    return null;
  }

  const origin_ = point(origin);
  let nearestKm = Number.POSITIVE_INFINITY;

  for (const geometry of geometries) {
    let km: number;

    if (geometry.type === "Point") {
      assertValidPosition(geometry.coordinates, "Point");
      km = distance(origin_, point(geometry.coordinates), {
        units: "kilometers",
      });
    } else {
      if (geometry.coordinates.length < 2) {
        throw new Error(
          `LineString must have at least 2 coordinates, got ${geometry.coordinates.length}`,
        );
      }

      const lowerBoundKm = distanceToBoundingBox(
        origin,
        boundingBoxOf(geometry),
      );
      if (lowerBoundKm >= nearestKm) {
        continue;
      }

      km = pointToLineDistance(origin_, lineString(geometry.coordinates), {
        units: "kilometers",
      });
    }

    if (km < nearestKm) {
      nearestKm = km;
    }
  }

  return nearestKm;
}
