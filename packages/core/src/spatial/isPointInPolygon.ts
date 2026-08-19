import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";

/**
 * Tests whether `point` falls within `polygon`.
 * @param point - The point to test, as a `[lon, lat]` position.
 * @param polygon - A `Polygon`/`MultiPolygon` geometry, or a `Feature` wrapping one.
 * @returns `true` if `point` is inside (or on the boundary of) `polygon`.
 */
export function isPointInPolygon(
  point: Position,
  polygon: Polygon | MultiPolygon | Feature<Polygon | MultiPolygon>,
): boolean {
  const geometry = polygon.type === "Feature" ? polygon.geometry : polygon;
  return booleanPointInPolygon(turfPoint(point), geometry);
}
