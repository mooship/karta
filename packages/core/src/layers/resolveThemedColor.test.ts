import { describe, expect, it } from "vitest";
import { resolveThemedColor } from "./createLayerConfig";

describe("resolveThemedColor", () => {
  it("returns color when dark is false, even if darkColor is set", () => {
    expect(resolveThemedColor("#111111", "#EEEEEE", false)).toBe("#111111");
  });

  it("returns darkColor when dark is true and darkColor is set", () => {
    expect(resolveThemedColor("#111111", "#EEEEEE", true)).toBe("#EEEEEE");
  });

  it("falls back to color when dark is true but darkColor is unset", () => {
    expect(resolveThemedColor("#111111", undefined, true)).toBe("#111111");
  });

  it("returns color when dark is false and darkColor is unset", () => {
    expect(resolveThemedColor("#111111", undefined, false)).toBe("#111111");
  });
});
