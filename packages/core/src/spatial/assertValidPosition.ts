import type { Position } from "geojson";

/**
 * Throws a descriptive `Error` if `position` has fewer than 2 coordinates.
 * @param position - The `[lon, lat, ...]` position to validate.
 * @param label - Name of the geometry kind being validated, used verbatim in
 *   the thrown error message (e.g. `"Point"`, `"point"`) — callers keep
 *   their own established casing/wording rather than this helper imposing one.
 * @remarks Shared by `isPointInPolygon` and `nearestFeatureDistance` so a
 *   degenerate position fails with one clear message instead of an opaque
 *   low-level error from the Turf call that follows.
 */
export function assertValidPosition(position: Position, label: string): void {
  if (position.length < 2) {
    throw new Error(
      `${label} must have at least 2 coordinates, got ${position.length}`,
    );
  }
}
