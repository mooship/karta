import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";

/**
 * Tests whether `point` falls within `polygon`.
 * @param point - The point to test, as a `[lon, lat]` position.
 * @param polygon - A `Polygon`/`MultiPolygon` geometry, or a `Feature` wrapping one.
 * @returns `true` if `point` is inside (or on the boundary of) `polygon`.
 * @remarks Throws a descriptive `Error` for a degenerate `point` (fewer than
 *   2 coordinates) or `polygon` (no rings, an empty ring, or — for a
 *   `MultiPolygon` — no constituent polygons) rather than letting Turf fail
 *   with an opaque low-level message (e.g. "Cannot read properties of
 *   undefined").
 */
export function isPointInPolygon(
  point: Position,
  polygon: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon>,
): boolean {
  if (point.length < 2) {
    throw new Error(
      `point must have at least 2 coordinates, got ${point.length}`,
    );
  }

  const geometry = polygon.type === "Feature" ? polygon.geometry : polygon;

  if (geometry.type === "Polygon") {
    assertValidPolygonRings(geometry.coordinates);
  } else {
    if (geometry.coordinates.length < 1) {
      throw new Error("MultiPolygon must have at least one polygon");
    }
    for (const rings of geometry.coordinates) {
      assertValidPolygonRings(rings);
    }
  }

  return booleanPointInPolygon(turfPoint(point), geometry);
}

/** Throws a descriptive `Error` if `rings` (a `Polygon`'s coordinates) is empty or contains an empty ring. */
function assertValidPolygonRings(rings: Position[][]): void {
  if (rings.length < 1) {
    throw new Error("Polygon must have at least one ring");
  }
  for (const ring of rings) {
    if (ring.length < 1) {
      throw new Error("Polygon ring must have at least one coordinate");
    }
  }
}
