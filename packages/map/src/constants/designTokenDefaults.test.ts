import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DESIGN_TOKEN_CSS_VAR_DEFAULTS } from "./designTokenDefaults";

/** Counts `var(--name)` references with no fallback argument at all. */
function countUnguardedUsages(css: string, varName: string): number {
  const pattern = new RegExp(`var\\(${varName}\\s*\\)`, "g");
  return (css.match(pattern) ?? []).length;
}

describe("DESIGN_TOKEN_CSS_VAR_DEFAULTS", () => {
  it("names every entry as a CSS custom property", () => {
    for (const name of Object.keys(DESIGN_TOKEN_CSS_VAR_DEFAULTS)) {
      expect(name).toMatch(/^--[a-z][a-z0-9-]*$/);
    }
  });

  it("gives every entry a non-empty default value", () => {
    for (const value of Object.values(DESIGN_TOKEN_CSS_VAR_DEFAULTS)) {
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("never references a documented design token in any of this package's stylesheets without a fallback", () => {
    const srcDir = path.join(__dirname, "..");
    const cssFiles = readdirSync(srcDir, { recursive: true })
      .filter(
        (entry): entry is string =>
          typeof entry === "string" && entry.endsWith(".module.css"),
      )
      .map((entry) => path.join(srcDir, entry));

    expect(cssFiles.length).toBeGreaterThan(0);

    for (const file of cssFiles) {
      const css = readFileSync(file, "utf8");
      for (const name of Object.keys(DESIGN_TOKEN_CSS_VAR_DEFAULTS)) {
        expect(
          countUnguardedUsages(css, name),
          `${path.relative(srcDir, file)} references ${name} without a fallback`,
        ).toBe(0);
      }
    }
  });
});
