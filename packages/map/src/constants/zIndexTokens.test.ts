import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { Z_INDEX_CSS_VAR_DEFAULTS } from "./zIndexTokens";

/** Counts `var(--name)` references with no fallback argument at all. */
function countUnguardedUsages(css: string, varName: string): number {
  const pattern = new RegExp(`var\\(${varName}\\s*\\)`, "g");
  return (css.match(pattern) ?? []).length;
}

describe("Z_INDEX_CSS_VAR_DEFAULTS", () => {
  it("names every entry as a CSS custom property", () => {
    for (const name of Object.keys(Z_INDEX_CSS_VAR_DEFAULTS)) {
      expect(name).toMatch(/^--[a-z][a-z0-9-]*$/);
    }
  });

  it("gives every entry a value that parses as a plain integer", () => {
    for (const value of Object.values(Z_INDEX_CSS_VAR_DEFAULTS)) {
      expect(value).toMatch(/^-?\d+$/);
    }
  });

  it.each([
    "../components/DesktopLegend/DesktopLegend.module.css",
    "../components/MobileLegend/MobileLegend.module.css",
    "../components/MeasurementControl/MeasurementControl.module.css",
  ])(
    "never references a documented z-index var in %s without a fallback",
    (relativePath) => {
      const css = readFileSync(path.join(__dirname, relativePath), "utf8");
      for (const name of Object.keys(Z_INDEX_CSS_VAR_DEFAULTS)) {
        expect(countUnguardedUsages(css, name)).toBe(0);
      }
    },
  );
});
