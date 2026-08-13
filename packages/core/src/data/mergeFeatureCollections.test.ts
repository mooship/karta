import type { Feature, FeatureCollection } from "geojson";
import { describe, expect, it } from "vitest";
import { mergeFeatureCollections } from "./mergeFeatureCollections";

describe("mergeFeatureCollections", () => {
  it("concatenates features from every collection in order", () => {
    const a = {
      type: "FeatureCollection" as const,
      features: [
        { type: "Feature" as const, properties: { id: 1 }, geometry: null },
      ],
    };
    const b = {
      type: "FeatureCollection" as const,
      features: [
        { type: "Feature" as const, properties: { id: 2 }, geometry: null },
      ],
    };

    expect(mergeFeatureCollections([a, b])).toEqual({
      type: "FeatureCollection",
      features: [
        { type: "Feature", properties: { id: 1 }, geometry: null },
        { type: "Feature", properties: { id: 2 }, geometry: null },
      ],
    });
  });

  it("returns an empty collection when given no collections", () => {
    expect(mergeFeatureCollections([])).toEqual({
      type: "FeatureCollection",
      features: [],
    });
  });

  it("merges collections with well over 65k features without hitting the call-stack argument limit", () => {
    const makePointFeatures = (count: number): Feature[] =>
      Array.from({ length: count }, () => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [0, 0] },
        properties: {},
      }));

    const a = {
      type: "FeatureCollection" as const,
      features: makePointFeatures(140_000),
    };
    const b = {
      type: "FeatureCollection" as const,
      features: makePointFeatures(60_000),
    };

    let result: FeatureCollection | undefined;
    expect(() => {
      result = mergeFeatureCollections([a, b]);
    }).not.toThrow();
    expect(result?.features).toHaveLength(200_000);
  });
});
