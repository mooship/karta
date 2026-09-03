import { distance } from "@turf/distance";
import { lineString, point } from "@turf/helpers";
import { pointToLineDistance } from "@turf/point-to-line-distance";
import type { LineString, Point, Position } from "geojson";

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
    if (geometry.type === "Point" && geometry.coordinates.length < 2) {
      throw new Error(
        `Point must have at least 2 coordinates, got ${geometry.coordinates.length}`,
      );
    }
    if (geometry.type === "LineString" && geometry.coordinates.length < 2) {
      throw new Error(
        `LineString must have at least 2 coordinates, got ${geometry.coordinates.length}`,
      );
    }
    const km =
      geometry.type === "Point"
        ? distance(origin_, point(geometry.coordinates), {
            units: "kilometers",
          })
        : pointToLineDistance(origin_, lineString(geometry.coordinates), {
            units: "kilometers",
          });
    if (km < nearestKm) {
      nearestKm = km;
    }
  }

  return nearestKm;
}
