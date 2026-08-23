import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { Z_INDEX_CSS_VAR_DEFAULTS } from "./zIndexTokens";

/** Counts `var(--name)` references with no fallback argument at all. */
function countUnguardedUsages(css: string, varName: string): number {
  const pattern = new RegExp(`var\\(${varName}\\s*\\)`, "g");
  return (css.match(pattern) ?? []).length;
}

/**
 * `.module.css` files that used to hand-type z-index vars directly.
 * Migrating to vanilla-extract will empty this list out entirely -- when it
 * does, drop this scan in favour of the `.css.ts`-only one below.
 */
function findModuleCssFiles(): string[] {
  const srcDir = path.join(__dirname, "..");
  return readdirSync(srcDir, { recursive: true })
    .filter(
      (entry): entry is string =>
        typeof entry === "string" && entry.endsWith(".module.css"),
    )
    .map((entry) => path.join(srcDir, entry));
}

/** Every `.css.ts` (vanilla-extract) file in this package. */
function findVanillaExtractFiles(): string[] {
  const srcDir = path.join(__dirname, "..");
  return readdirSync(srcDir, { recursive: true })
    .filter(
      (entry): entry is string =>
        typeof entry === "string" && entry.endsWith(".css.ts"),
    )
    .map((entry) => path.join(srcDir, entry));
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

  it("never references a documented z-index var in any remaining .module.css file without a fallback", () => {
    for (const file of findModuleCssFiles()) {
      const css = readFileSync(file, "utf8");
      for (const name of Object.keys(Z_INDEX_CSS_VAR_DEFAULTS)) {
        expect(
          countUnguardedUsages(css, name),
          `${path.relative(path.join(__dirname, ".."), file)} references ${name} without a fallback`,
        ).toBe(0);
      }
    }
  });

  it("never reaches a documented z-index var from a .css.ts file except through mapTokens.ts's typed helper", () => {
    for (const file of findVanillaExtractFiles()) {
      const source = readFileSync(file, "utf8");
      for (const name of Object.keys(Z_INDEX_CSS_VAR_DEFAULTS)) {
        expect(
          source.includes(name),
          `${path.relative(path.join(__dirname, ".."), file)} references ${name} directly instead of through mapTokens.ts's zIndexTokens object`,
        ).toBe(false);
      }
    }
  });
});
