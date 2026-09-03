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
});
