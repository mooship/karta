import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DESIGN_TOKEN_CSS_VAR_DEFAULTS } from "./designTokenDefaults";

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

  it("never reaches a documented design token from a .css.ts file except through mapTokens.ts's typed helper", () => {
    const tsFiles = findVanillaExtractFiles();
    expect(tsFiles.length).toBeGreaterThan(0);

    for (const file of tsFiles) {
      const source = readFileSync(file, "utf8");
      for (const name of Object.keys(DESIGN_TOKEN_CSS_VAR_DEFAULTS)) {
        expect(
          source.includes(name),
          `${path.relative(path.join(__dirname, ".."), file)} references ${name} directly instead of through mapTokens.ts's designTokens object`,
        ).toBe(false);
      }
    }
  });
});
