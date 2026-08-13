import type { TransitLayerFeatureCollection } from "@karta/app";
import { describe, expect, it } from "vitest";
import {
  computeNearestTransitKm,
  flattenTransitGeometries,
} from "./transitDistance";

describe("flattenTransitGeometries", () => {
  it("flattens every collection's Point/LineString geometries into one array", () => {
    const gautrain = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { id: "node/1", name: "Hatfield", network: "Gautrain" },
          geometry: {
            type: "Point" as const,
            coordinates: [28.2379, -25.7487],
          },
        },
      ],
    };
    const aReYeng = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { id: "way/1", name: "Line 1A", network: "A Re Yeng" },
          geometry: {
            type: "LineString" as const,
            coordinates: [
              [28.0, -25.75],
              [28.05, -25.75],
            ],
          },
        },
      ],
    };

    const result = flattenTransitGeometries([gautrain, aReYeng]);

    expect(result).toEqual([
      gautrain.features[0]?.geometry,
      aReYeng.features[0]?.geometry,
    ]);
  });

  it("drops any non-Point/LineString geometry kind", () => {
    const withPolygon = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { id: "area/1", name: "Depot", network: "Gautrain" },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [28, -26],
                [28.1, -26],
                [28.1, -25.9],
                [28, -25.9],
                [28, -26],
              ],
            ],
          },
        },
      ],
    };

    expect(
      flattenTransitGeometries([
        withPolygon as unknown as TransitLayerFeatureCollection,
      ]),
    ).toEqual([]);
  });

  it("returns an empty array for no transit collections", () => {
    expect(flattenTransitGeometries([])).toEqual([]);
  });
});

describe("computeNearestTransitKm", () => {
  it("returns the distance in km to the nearest given geometry", () => {
    const gautrain = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { id: "node/1", name: "Hatfield", network: "Gautrain" },
          geometry: {
            type: "Point" as const,
            coordinates: [28.2379, -25.7487],
          },
        },
      ],
    };
    const aReYeng = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { id: "way/1", name: "Line 1A", network: "A Re Yeng" },
          geometry: {
            type: "LineString" as const,
            coordinates: [
              [28.0, -25.75],
              [28.05, -25.75],
            ],
          },
        },
      ],
    };
    const geometries = flattenTransitGeometries([gautrain, aReYeng]);

    const result = computeNearestTransitKm(
      [
        { lat: -25.7487, lon: 28.2379 },
        { lat: -25.75, lon: 28.025 },
      ],
      geometries,
    );

    expect(result[0]).toBeCloseTo(0, 3);
    expect(result[1]).toBeCloseTo(0, 1);
  });

  it("returns null for every centroid when no transit geometries are given", () => {
    const result = computeNearestTransitKm(
      [{ lat: -25.75, lon: 28.2 }],
      flattenTransitGeometries([
        { type: "FeatureCollection", features: [] },
        { type: "FeatureCollection", features: [] },
      ]),
    );

    expect(result).toEqual([null]);
  });

  it("reuses one flattened geometry array across multiple centroid batches without re-flattening", () => {
    const gautrain = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { id: "node/1", name: "Hatfield", network: "Gautrain" },
          geometry: {
            type: "Point" as const,
            coordinates: [28.2379, -25.7487],
          },
        },
      ],
    };
    const geometries = flattenTransitGeometries([gautrain]);

    const first = computeNearestTransitKm(
      [{ lat: -25.7487, lon: 28.2379 }],
      geometries,
    );
    const second = computeNearestTransitKm(
      [{ lat: -25.75, lon: 28.2 }],
      geometries,
    );

    expect(first[0]).toBeCloseTo(0, 3);
    expect(second[0]).toBeGreaterThan(0);
  });
});
