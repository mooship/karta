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
 *   function's callers.
 */
function distanceToBoundingBox(origin: Position, box: BBox): number {
  const [minLng, minLat, maxLng, maxLat] = box;
  const clamped: Position = [
    Math.min(Math.max(origin[0] as number, minLng), maxLng),
    Math.min(Math.max(origin[1] as number, minLat), maxLat),
  ];
  return distance(point(origin), point(clamped), { units: "kilometers" });
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
 *   duplicate the exact distance calculation for no benefit.
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
    if (geometry.type === "Point") {
      assertValidPosition(geometry.coordinates, "Point");
      const km = distance(origin_, point(geometry.coordinates), {
        units: "kilometers",
      });
      if (km < nearestKm) {
        nearestKm = km;
      }
      continue;
    }

    if (geometry.coordinates.length < 2) {
      throw new Error(
        `LineString must have at least 2 coordinates, got ${geometry.coordinates.length}`,
      );
    }

    const lowerBoundKm = distanceToBoundingBox(origin, bbox(geometry));
    if (lowerBoundKm >= nearestKm) {
      continue;
    }

    const km = pointToLineDistance(origin_, lineString(geometry.coordinates), {
      units: "kilometers",
    });
    if (km < nearestKm) {
      nearestKm = km;
    }
  }

  return nearestKm;
}
