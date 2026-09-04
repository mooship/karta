import type { LineString, Point } from "geojson";
import { describe, expect, it } from "vitest";
import { nearestFeatureDistance } from "./nearestFeatureDistance";

describe("nearestFeatureDistance", () => {
  it("returns null when there are no geometries to measure against", () => {
    expect(nearestFeatureDistance([28.2293, -25.7479], [])).toBeNull();
  });

  it("returns the distance in kilometres to the nearest Point geometry", () => {
    const origin: [number, number] = [28.0, -26.0];
    const near: Point = { type: "Point", coordinates: [28.0, -25.99] };
    const far: Point = { type: "Point", coordinates: [28.0, -24.0] };

    const distance = nearestFeatureDistance(origin, [far, near]);

    expect(distance).not.toBeNull();
    expect(distance).toBeCloseTo(1.11, 1);
  });

  it("falls back to the nearest point along a LineString when only route geometry is available", () => {
    const origin: [number, number] = [28.05, -26.0];
    const route: LineString = {
      type: "LineString",
      coordinates: [
        [28.0, -26.0],
        [28.1, -26.0],
      ],
    };

    const distance = nearestFeatureDistance(origin, [route]);

    expect(distance).not.toBeNull();
    expect(distance).toBeCloseTo(0, 1);
  });

  it("throws a descriptive error for a LineString with no coordinates", () => {
    const origin: [number, number] = [28.0, -26.0];
    const degenerate: LineString = { type: "LineString", coordinates: [] };

    expect(() => nearestFeatureDistance(origin, [degenerate])).toThrow(
      "LineString must have at least 2 coordinates, got 0",
    );
  });

  it("throws a descriptive error for a LineString with a single coordinate", () => {
    const origin: [number, number] = [28.0, -26.0];
    const degenerate: LineString = {
      type: "LineString",
      coordinates: [[28.0, -26.0]],
    };

    expect(() => nearestFeatureDistance(origin, [degenerate])).toThrow(
      "LineString must have at least 2 coordinates, got 1",
    );
  });

  it("throws a descriptive error for a Point with no coordinates", () => {
    const origin: [number, number] = [28.0, -26.0];
    const degenerate: Point = { type: "Point", coordinates: [] as never };

    expect(() => nearestFeatureDistance(origin, [degenerate])).toThrow(
      "Point must have at least 2 coordinates, got 0",
    );
  });

  it("throws a descriptive error for a Point with a single coordinate", () => {
    const origin: [number, number] = [28.0, -26.0];
    const degenerate: Point = { type: "Point", coordinates: [28.0] as never };

    expect(() => nearestFeatureDistance(origin, [degenerate])).toThrow(
      "Point must have at least 2 coordinates, got 1",
    );
  });

  it("picks the minimum distance across a mix of Point and LineString geometries", () => {
    const origin: [number, number] = [28.0, -26.0];
    const closePoint: Point = { type: "Point", coordinates: [28.0, -26.001] };
    const farLine: LineString = {
      type: "LineString",
      coordinates: [
        [29.0, -27.0],
        [29.1, -27.0],
      ],
    };

    expect(nearestFeatureDistance(origin, [farLine, closePoint])).toBeLessThan(
      1,
    );
    expect(nearestFeatureDistance(origin, [closePoint, farLine])).toBeLessThan(
      1,
    );
  });

  it("still finds the true nearest across a mix of near/far LineStrings and a Point, regardless of array order", () => {
    const origin: [number, number] = [28.0, -26.0];
    const nearLine: LineString = {
      type: "LineString",
      coordinates: [
        [28.0, -25.995],
        [28.05, -25.995],
      ],
    };
    const midPoint: Point = { type: "Point", coordinates: [28.0, -25.99] };
    const farLine: LineString = {
      type: "LineString",
      coordinates: [
        [30.0, -30.0],
        [30.1, -30.0],
      ],
    };

    expect(
      nearestFeatureDistance(origin, [farLine, midPoint, nearLine]),
    ).toBeCloseTo(0.555, 1);
    expect(
      nearestFeatureDistance(origin, [nearLine, midPoint, farLine]),
    ).toBeCloseTo(0.555, 1);
  });

  it("does not skip a LineString whose bounding box is much larger than its actual footprint, even when its far corner would appear farther than the current best", () => {
    const origin: [number, number] = [28.0, -26.0];
    // A Point close enough to establish a small "current best" before the
    // long LineString below is checked.
    const establishedNearby: Point = {
      type: "Point",
      coordinates: [28.5, -26.0],
    };
    // Starts ~5km west of the origin's longitude but stretches ~1300km east,
    // so its bounding box's far corner is much farther than
    // `establishedNearby` even though the line's actual nearest point (its
    // western end) is much closer. A pre-filter that measures against the
    // wrong bbox corner (rather than clamping per-axis) would wrongly skip
    // this geometry and miss the true minimum.
    const wideBoundingBoxLine: LineString = {
      type: "LineString",
      coordinates: [
        [27.95, -26.001],
        [40.0, -26.001],
      ],
    };

    const distance = nearestFeatureDistance(origin, [
      establishedNearby,
      wideBoundingBoxLine,
    ]);

    expect(distance).not.toBeNull();
    expect(distance).toBeLessThan(10);
  });
});
