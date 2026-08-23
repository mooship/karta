import { describe, expect, it } from "vitest";
import { DESIGN_TOKEN_CSS_VAR_DEFAULTS } from "../constants/designTokenDefaults";
import { MOBILE_LAYOUT_CSS_VAR_DEFAULTS } from "../constants/mobileLayoutTokens";
import { Z_INDEX_CSS_VAR_DEFAULTS } from "../constants/zIndexTokens";
import { designTokens, mobileLayoutTokens, zIndexTokens } from "./mapTokens";

describe("designTokens", () => {
  it("pairs every DESIGN_TOKEN_CSS_VAR_DEFAULTS entry with its documented fallback", () => {
    expect(designTokens.fontBody).toBe(
      `var(--font-body, ${DESIGN_TOKEN_CSS_VAR_DEFAULTS["--font-body"]})`,
    );
    expect(designTokens.controlHeight).toBe(
      `var(--control-height, ${DESIGN_TOKEN_CSS_VAR_DEFAULTS["--control-height"]})`,
    );
    expect(Object.keys(designTokens).length).toBe(
      Object.keys(DESIGN_TOKEN_CSS_VAR_DEFAULTS).length,
    );
  });

  it("never resolves to a var() with no fallback", () => {
    for (const value of Object.values(designTokens)) {
      expect(value).toMatch(/^var\(--[a-z0-9-]+, .+\)$/);
    }
  });
});

describe("zIndexTokens", () => {
  it("pairs every Z_INDEX_CSS_VAR_DEFAULTS entry with its documented fallback", () => {
    expect(zIndexTokens.floatingControlZIndex).toBe(
      `var(--floating-control-z-index, ${Z_INDEX_CSS_VAR_DEFAULTS["--floating-control-z-index"]})`,
    );
    expect(Object.keys(zIndexTokens).length).toBe(
      Object.keys(Z_INDEX_CSS_VAR_DEFAULTS).length,
    );
  });
});

describe("mobileLayoutTokens", () => {
  it("pairs every MOBILE_LAYOUT_CSS_VAR_DEFAULTS entry with its documented fallback", () => {
    expect(mobileLayoutTokens.mobileControlEdge).toBe(
      `var(--mobile-control-edge, ${MOBILE_LAYOUT_CSS_VAR_DEFAULTS["--mobile-control-edge"]})`,
    );
    expect(mobileLayoutTokens.panelRepositionDuration).toBe(
      `var(--panel-reposition-duration, ${MOBILE_LAYOUT_CSS_VAR_DEFAULTS["--panel-reposition-duration"]})`,
    );
    expect(Object.keys(mobileLayoutTokens).length).toBe(
      Object.keys(MOBILE_LAYOUT_CSS_VAR_DEFAULTS).length,
    );
  });

  it("never resolves to a var() with no fallback", () => {
    for (const value of Object.values(mobileLayoutTokens)) {
      expect(value).toMatch(/^var\(--[a-z0-9-]+, .+\)$/);
    }
  });
});
