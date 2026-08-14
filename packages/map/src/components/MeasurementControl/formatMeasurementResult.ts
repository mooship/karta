import { measureLineDistance, measurePolygonArea } from "@karta/core";
import type { MeasurementMode } from "./MeasurementControl";

const METRES_PER_KM = 1000;
const SQM_PER_HECTARE = 10_000;
const SQM_PER_SQKM = 1_000_000;

/** A vertex clicked while measuring, duck-typed against Leaflet's `LatLng` so this module doesn't need to import it. */
interface MeasuredPoint {
  lat: number;
  lng: number;
}

/**
 * Formats the current measurement as a short, human-readable readout, e.g.
 * `"320 m"`, `"1.24 km"`, `"850 m²"`, `"3.20 ha"` or `"12.50 km²"`.
 * @param mode - Whether `points` describes a line to measure the length of,
 *   or a polygon to measure the area of.
 * @param points - Vertices clicked so far, in order.
 * @returns `null` if there aren't yet enough points to measure (two for a
 *   line, three for a polygon).
 */
export function formatMeasurementResult(
  mode: MeasurementMode,
  points: readonly MeasuredPoint[],
): string | null {
  const positions = points.map(
    (point) => [point.lng, point.lat] as [number, number],
  );

  if (mode === "distance") {
    const km = measureLineDistance(positions);
    if (km === null) {
      return null;
    }
    return km < 1
      ? `${Math.round(km * METRES_PER_KM)} m`
      : `${km.toFixed(2)} km`;
  }

  const sqm = measurePolygonArea(positions);
  if (sqm === null) {
    return null;
  }
  if (sqm < SQM_PER_HECTARE) {
    return `${Math.round(sqm)} m²`;
  }
  if (sqm < SQM_PER_SQKM) {
    return `${(sqm / SQM_PER_HECTARE).toFixed(2)} ha`;
  }
  return `${(sqm / SQM_PER_SQKM).toFixed(2)} km²`;
}
