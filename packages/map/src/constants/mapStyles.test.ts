import { describe, expect, it } from "vitest";
import { AREA_OUTLINE } from "./mapStyles";

describe("AREA_OUTLINE", () => {
  it("uses a hex colour Leaflet can pass straight to the canvas renderer", () => {
    expect(AREA_OUTLINE.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("uses a hex colour for its dark-theme counterpart too", () => {
    expect(AREA_OUTLINE.darkColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("keeps a stroke weight thick enough to read as a boundary at overview zooms", () => {
    expect(AREA_OUTLINE.weight).toBeGreaterThan(0);
    expect(AREA_OUTLINE.weight).toBe(4);
  });

  it("exposes only the properties MapView resolves its computed outline style from", () => {
    expect(Object.keys(AREA_OUTLINE).sort()).toEqual([
      "color",
      "darkColor",
      "weight",
    ]);
  });
});
