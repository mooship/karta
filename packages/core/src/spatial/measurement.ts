import * as turf from "@turf/turf";
import type { Position } from "geojson";

/**
 * Measures the total length (kilometres) of a line drawn through `positions`,
 * in order.
 * @param positions - Vertices as `[lon, lat]`, e.g. points a user has clicked
 *   while measuring on a map.
 * @returns The summed distance across every segment, or `0` if there are
 *   fewer than two positions to form a segment from.
 */
export function measureLineDistance(positions: readonly Position[]): number {
  if (positions.length < 2) {
    return 0;
  }

  return turf.length(turf.lineString(positions as Position[]), {
    units: "kilometers",
  });
}

/**
 * Measures the area (square metres) enclosed by `positions`.
 * @param positions - Ring vertices as `[lon, lat]`, e.g. points a user has
 *   clicked while measuring on a map. The ring is closed automatically if
 *   `positions` doesn't already repeat its first point as its last.
 * @returns The enclosed area, or `0` if there are fewer than three positions
 *   to form a polygon from.
 */
export function measurePolygonArea(positions: readonly Position[]): number {
  if (positions.length < 3) {
    return 0;
  }

  const first = positions[0] as Position;
  const last = positions[positions.length - 1] as Position;
  const ring =
    first[0] === last[0] && first[1] === last[1]
      ? (positions as Position[])
      : [...positions, first];

  return turf.area(turf.polygon([ring]));
}
