import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findVanillaExtractFiles } from "../testUtils/findVanillaExtractFiles";
import { Z_INDEX_CSS_VAR_DEFAULTS } from "./zIndexTokens";

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

  it("never reaches a documented z-index var from a .css.ts file except through mapTokens.ts's typed helper", () => {
    const tsFiles = findVanillaExtractFiles();
    expect(tsFiles.length).toBeGreaterThan(0);

    for (const file of tsFiles) {
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
