import { describe, expect, it } from "vitest";
import { findVanillaExtractFiles } from "./findVanillaExtractFiles";

describe("findVanillaExtractFiles", () => {
  it("finds every .css.ts file under packages/map/src", () => {
    const files = findVanillaExtractFiles();

    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(file).toMatch(/\.css\.ts$/);
    }
  });

  it("includes a known .css.ts file by absolute path", () => {
    const files = findVanillaExtractFiles();

    expect(files.some((file) => file.endsWith("shared.css.ts"))).toBe(true);
  });
});
