import type { FeatureCollection } from "geojson";
import { describe, expect, it } from "vitest";
import { featureCollectionBounds, unionBoundingBoxes } from "./boundingBox";

describe("unionBoundingBoxes", () => {
  it("throws when given no boxes", () => {
    expect(() => unionBoundingBoxes([])).toThrow(
      "At least one bounding box is required",
    );
  });

  it("returns the box unchanged when given a single box", () => {
    const box: [number, number, number, number] = [27.5, -26.5, 28.5, -25.5];
    expect(unionBoundingBoxes([box])).toEqual(box);
  });

  it("returns the smallest box containing every given box", () => {
    const a: [number, number, number, number] = [27.5, -26.5, 28.0, -26.0];
    const b: [number, number, number, number] = [28.0, -27.0, 28.7, -25.9];

    expect(unionBoundingBoxes([a, b])).toEqual([27.5, -27.0, 28.7, -25.9]);
  });

  it("preserves a single antimeridian-crossing input box unchanged", () => {
    const crossing: [number, number, number, number] = [170, -10, -170, 10];
    expect(unionBoundingBoxes([crossing])).toEqual(crossing);
  });

  it("unions two adjacent boxes wrapping across the antimeridian into a crossing result", () => {
    const east: [number, number, number, number] = [170, -5, 175, 5];
    const west: [number, number, number, number] = [-175, -5, -170, 5];

    const union = unionBoundingBoxes([east, west]);

    expect(union[0]).toBeCloseTo(170);
    expect(union[1]).toBeCloseTo(-5);
    expect(union[2]).toBeCloseTo(-170);
    expect(union[3]).toBeCloseTo(5);
  });
});

describe("featureCollectionBounds", () => {
  it("throws when given an empty collection, rather than Turf's Infinity placeholder box", () => {
    expect(() =>
      featureCollectionBounds({ type: "FeatureCollection", features: [] }),
    ).toThrow("At least one feature is required");
  });

  it("returns the bounding box spanning every feature's geometry", () => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: null,
          geometry: { type: "Point", coordinates: [28.0, -26.0] },
        },
        {
          type: "Feature",
          properties: null,
          geometry: { type: "Point", coordinates: [28.5, -25.5] },
        },
      ],
    };

    expect(featureCollectionBounds(collection)).toEqual([
      28.0, -26.0, 28.5, -25.5,
    ]);
  });
});
