import { centroid } from "@turf/centroid";
import type { FeatureCollection } from "geojson";

const CSV_ROW_SEPARATOR = "\r\n";

/** Wraps `value` in quotes (doubling any embedded quotes) if it needs escaping for CSV. */
function csvField(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Converts `collection` to CSV text: one row per feature, one column per
 * property key seen across the collection (missing keys fill in as empty
 * fields), plus trailing `centroid_lon`/`centroid_lat` columns giving every
 * feature a plottable location regardless of its geometry type. A feature
 * with `geometry: null` (GeoJSON's "unlocated" feature — see
 * `reprojectFeatureCollection` for the same allowance elsewhere in this
 * package) has no centroid to compute, so its `centroid_lon`/`centroid_lat`
 * fields are left blank rather than thrown on.
 * @param collection - The collection to export, e.g. layer data a caller
 *   wants to offer as a spreadsheet-friendly download alongside the raw
 *   GeoJSON.
 * @returns CSV text (`\r\n` row endings, per RFC 4180), or `""` for an empty
 *   collection.
 */
export function featureCollectionToCsv(collection: FeatureCollection): string {
  if (collection.features.length === 0) {
    return "";
  }

  const propertyKeys: string[] = [];
  const seenKeys = new Set<string>();
  for (const feature of collection.features) {
    for (const key of Object.keys(feature.properties ?? {})) {
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        propertyKeys.push(key);
      }
    }
  }

  const columns = [...propertyKeys, "centroid_lon", "centroid_lat"];
  const rows = [columns.join(",")];

  for (const feature of collection.features) {
    const [centroidLon, centroidLat] =
      feature.geometry === null
        ? [undefined, undefined]
        : centroid(feature).geometry.coordinates;
    const propertyValues = propertyKeys.map((key) =>
      csvField(feature.properties?.[key]),
    );
    rows.push(
      [...propertyValues, csvField(centroidLon), csvField(centroidLat)].join(
        ",",
      ),
    );
  }

  return rows.join(CSV_ROW_SEPARATOR);
}
