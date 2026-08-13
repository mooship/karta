import { describe, expect, it } from "vitest";
import { AREA_OUTLINE } from "./mapStyles";

describe("AREA_OUTLINE", () => {
  it("uses a hex colour Leaflet can pass straight to the canvas renderer", () => {
    expect(AREA_OUTLINE.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("keeps a stroke weight thick enough to read as a boundary at overview zooms", () => {
    expect(AREA_OUTLINE.weight).toBeGreaterThan(0);
    expect(AREA_OUTLINE.weight).toBe(4);
  });

  it("exposes only the properties MapView spreads over its computed outline style", () => {
    expect(Object.keys(AREA_OUTLINE).sort()).toEqual(["color", "weight"]);
  });
});
