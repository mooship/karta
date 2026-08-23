import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("mobile breakpoint consistency", () => {
  it("never hardcodes a pixel breakpoint literal in a .css.ts file", () => {
    const srcDir = path.join(__dirname, "..");
    const vanillaExtractFiles = readdirSync(srcDir, { recursive: true })
      .filter(
        (entry): entry is string =>
          typeof entry === "string" && entry.endsWith(".css.ts"),
      )
      .map((entry) => path.join(srcDir, entry));

    expect(vanillaExtractFiles.length).toBeGreaterThan(0);

    for (const file of vanillaExtractFiles) {
      const source = readFileSync(file, "utf8");
      expect(
        source,
        `${path.relative(srcDir, file)} should build its breakpoint from MOBILE_BREAKPOINT_PX, not a literal`,
      ).not.toMatch(/\((?:max|min)-width:\s*\d+px\)/);
    }
  });
});
