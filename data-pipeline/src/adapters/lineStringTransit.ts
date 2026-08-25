import type { TransitLayerFeatureCollection, TransitStop } from "@karta/app";
import type {
  FeatureCollection,
  Geometry,
  LineString,
  MultiLineString,
} from "geojson";

/**
 * Returns `props[key]`, coerced to a string, for the first `key` in `keys`
 * whose value is neither `undefined` nor `null`; returns `fallback` if none is.
 * @remarks Shared by every line-string transit adapter (`aReYeng.ts`,
 *   `ekurhuleniIrptn.ts`) whose upstream source may expose the same logical
 *   id/name field under a different raw property name (open-data-portal vs.
 *   ArcGIS field names).
 */
export function firstDefinedProperty(
  props: Record<string, unknown>,
  keys: readonly string[],
  fallback: string,
): string {
  for (const key of keys) {
    const value = props[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }
  return fallback;
}

/**
 * Normalizes a `FeatureCollection`'s `LineString`/`MultiLineString` geometry
 * into one `LineString` feature per line. A `MultiLineString` is split into
 * its constituent parts rather than concatenated, which would draw phantom
 * segments between disjoint branches; all parts share the same route id.
 * Features with any other geometry type are skipped.
 * @param resolveStop - Derives each feature's `id`/`name` from its raw
 *   GeoJSON properties (shape varies by source: open-data-portal vs ArcGIS).
 * @param network - Value written to every produced feature's `network` property.
 */
export function normalizeLineStringTransitFeatureCollection<TProps>(
  raw: FeatureCollection,
  resolveStop: (properties: TProps) => { id: string; name: string },
  network: string,
): TransitLayerFeatureCollection {
  const features: TransitLayerFeatureCollection["features"] = [];

  for (const feature of raw.features) {
    const props = (feature.properties ?? {}) as TProps;
    const { id, name } = resolveStop(props);
    const stop: TransitStop = { id, name, network };
    const geometry = feature.geometry as Geometry;

    if (geometry.type === "MultiLineString") {
      for (const part of (geometry as MultiLineString).coordinates) {
        features.push({
          type: "Feature",
          properties: stop,
          geometry: {
            type: "LineString",
            coordinates: part.map((p) => [p[0], p[1]] as [number, number]),
          },
        });
      }
    } else if (geometry.type === "LineString") {
      const line = geometry as LineString;
      features.push({
        type: "Feature",
        properties: stop,
        geometry: {
          type: "LineString",
          coordinates: line.coordinates.map(
            (p) => [p[0], p[1]] as [number, number],
          ),
        },
      });
    }
  }

  return { type: "FeatureCollection", features };
}
