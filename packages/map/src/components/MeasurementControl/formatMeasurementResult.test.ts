import { describe, expect, it } from "vitest";
import { formatMeasurementResult } from "./formatMeasurementResult";

describe("formatMeasurementResult", () => {
  it("returns null in distance mode with fewer than two points", () => {
    expect(formatMeasurementResult("distance", [])).toBeNull();
    expect(
      formatMeasurementResult("distance", [{ lat: -26, lng: 28 }]),
    ).toBeNull();
  });

  it("returns null in area mode with fewer than three points", () => {
    expect(
      formatMeasurementResult("distance", [
        { lat: -26, lng: 28 },
        { lat: -26.001, lng: 28.001 },
      ]),
    ).not.toBeNull();
    expect(
      formatMeasurementResult("area", [
        { lat: -26, lng: 28 },
        { lat: -26.001, lng: 28.001 },
      ]),
    ).toBeNull();
  });

  it("formats a short distance in metres", () => {
    const label = formatMeasurementResult("distance", [
      { lat: -26.0, lng: 28.0 },
      { lat: -26.001, lng: 28.0 },
    ]);

    expect(label).toMatch(/^\d+ m$/);
  });

  it("formats a long distance in kilometres", () => {
    const label = formatMeasurementResult("distance", [
      { lat: -26.0, lng: 28.0 },
      { lat: -25.0, lng: 28.0 },
    ]);

    expect(label).toMatch(/^\d+(\.\d+)? km$/);
  });

  it("formats a small area in square metres", () => {
    const label = formatMeasurementResult("area", [
      { lat: -26.0, lng: 28.0 },
      { lat: -26.0001, lng: 28.0 },
      { lat: -26.0001, lng: 28.0001 },
    ]);

    expect(label).toMatch(/^\d+(\.\d+)? m²$/);
  });

  it("formats a mid-sized area in hectares", () => {
    const label = formatMeasurementResult("area", [
      { lat: -26.0, lng: 28.0 },
      { lat: -26.01, lng: 28.0 },
      { lat: -26.01, lng: 28.005 },
      { lat: -26.0, lng: 28.005 },
    ]);

    expect(label).toMatch(/^\d+(\.\d+)? ha$/);
  });

  it("formats a large area in square kilometres", () => {
    const label = formatMeasurementResult("area", [
      { lat: -26.0, lng: 28.0 },
      { lat: -26.2, lng: 28.0 },
      { lat: -26.2, lng: 28.2 },
      { lat: -26.0, lng: 28.2 },
    ]);

    expect(label).toMatch(/^\d+(\.\d+)? km²$/);
  });
});
