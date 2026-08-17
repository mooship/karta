import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MOBILE_LAYOUT_CSS_VAR_DEFAULTS } from "./mobileLayoutTokens";

/** Counts `var(--name)` references with no fallback argument at all. */
function countUnguardedUsages(css: string, varName: string): number {
  const pattern = new RegExp(`var\\(${varName}\\s*\\)`, "g");
  return (css.match(pattern) ?? []).length;
}

describe("MOBILE_LAYOUT_CSS_VAR_DEFAULTS", () => {
  it("names every entry as a CSS custom property", () => {
    for (const name of Object.keys(MOBILE_LAYOUT_CSS_VAR_DEFAULTS)) {
      expect(name).toMatch(/^--[a-z][a-z0-9-]*$/);
    }
  });

  it("gives every entry a non-empty default value", () => {
    for (const value of Object.values(MOBILE_LAYOUT_CSS_VAR_DEFAULTS)) {
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it.each([
    "../components/MobileLegend/MobileLegend.module.css",
    "../components/MeasurementControl/MeasurementControl.module.css",
  ])(
    "never references a documented mobile layout var in %s without a fallback",
    (relativePath) => {
      const css = readFileSync(path.join(__dirname, relativePath), "utf8");
      for (const name of Object.keys(MOBILE_LAYOUT_CSS_VAR_DEFAULTS)) {
        expect(countUnguardedUsages(css, name)).toBe(0);
      }
    },
  );
});
