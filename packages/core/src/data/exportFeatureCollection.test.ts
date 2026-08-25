import type { FeatureCollection } from "geojson";
import { describe, expect, it } from "vitest";
import { featureCollectionToCsv } from "./exportFeatureCollection";

describe("featureCollectionToCsv", () => {
  it("returns an empty string for an empty collection", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };

    expect(featureCollectionToCsv(collection)).toBe("");
  });

  it("writes a header row from the union of every feature's property keys, plus centroid columns", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Alexandra", population: 179624 },
          geometry: { type: "Point", coordinates: [28.0958, -26.1036] },
        },
      ],
    };

    const csv = featureCollectionToCsv(collection);
    const [header] = csv.split("\r\n");

    expect(header).toBe("name,population,centroid_lon,centroid_lat");
  });

  it("fills a missing property with an empty field when features have different keys", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Alexandra", population: 179624 },
          geometry: { type: "Point", coordinates: [28.0958, -26.1036] },
        },
        {
          type: "Feature",
          properties: { name: "Soweto" },
          geometry: { type: "Point", coordinates: [27.8546, -26.2678] },
        },
      ],
    };

    const csv = featureCollectionToCsv(collection);
    const rows = csv.split("\r\n");

    expect(rows[2]).toBe("Soweto,,27.8546,-26.2678");
  });

  it("computes a centroid for non-point geometry", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Square" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [28.0, -26.0],
                [28.01, -26.0],
                [28.01, -25.99],
                [28.0, -25.99],
                [28.0, -26.0],
              ],
            ],
          },
        },
      ],
    };

    const csv = featureCollectionToCsv(collection);
    const rows = csv.split("\r\n");
    const [, lon, lat] = rows[1]?.split(",") ?? [];

    expect(Number(lon)).toBeCloseTo(28.005, 2);
    expect(Number(lat)).toBeCloseTo(-25.995, 2);
  });

  it("quotes a field containing a comma, quote, or newline, doubling any embedded quotes", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: 'Township, "informal" area\nnote' },
          geometry: { type: "Point", coordinates: [28.0, -26.0] },
        },
      ],
    };

    const csv = featureCollectionToCsv(collection);
    const rows = csv.split("\r\n");

    expect(rows[1]).toBe('"Township, ""informal"" area\nnote",28,-26');
  });

  it("treats a feature with no properties object at all as having no columns of its own", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: null,
          geometry: { type: "Point", coordinates: [28.0, -26.0] },
        },
      ],
    };

    const csv = featureCollectionToCsv(collection);
    const rows = csv.split("\r\n");

    expect(rows[0]).toBe("centroid_lon,centroid_lat");
    expect(rows[1]).toBe("28,-26");
  });

  it("does not throw for a feature with null geometry, leaving its centroid columns blank", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Unlocated" },
          geometry: null,
        },
      ],
    };

    expect(() => featureCollectionToCsv(collection)).not.toThrow();

    const rows = featureCollectionToCsv(collection).split("\r\n");

    expect(rows[1]).toBe("Unlocated,,");
  });

  it('treats a null or missing property value as an empty field, not the string "null"', () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: null },
          geometry: { type: "Point", coordinates: [28.0, -26.0] },
        },
      ],
    };

    const csv = featureCollectionToCsv(collection);
    const rows = csv.split("\r\n");

    expect(rows[1]).toBe(",28,-26");
  });
});
