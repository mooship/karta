import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { describe, expect, it } from "vitest";

/**
 * Every `@media (max-width: ...)` breakpoint declared as a literal pixel
 * value across this package's own `.module.css`/`.css.ts` files, alongside
 * the file it came from.
 * @remarks CSS custom properties can't be referenced inside a `.module.css`
 *   media query condition, so `.module.css` files stay literal pixel values
 *   rather than `var(...)` references to `MOBILE_BREAKPOINT_PX` — this scan
 *   is what actually guards against one of them silently drifting from that
 *   shared constant (see `useIsDesktopViewport.ts`, `@karta/react`) instead
 *   of a code comment alone. A `.css.ts` file has no such excuse — it's real
 *   TypeScript, so it should build its breakpoint from `MOBILE_BREAKPOINT_PX`
 *   directly (see the test below) rather than a literal, and so should never
 *   show up in this scan at all.
 */
function findMobileBreakpointDeclarations(): Array<{
  file: string;
  breakpointPx: number;
}> {
  const srcDir = path.join(__dirname, "..");
  const styleFiles = readdirSync(srcDir, { recursive: true })
    .filter(
      (entry): entry is string =>
        typeof entry === "string" &&
        (entry.endsWith(".module.css") || entry.endsWith(".css.ts")),
    )
    .map((entry) => path.join(srcDir, entry));

  const declarations: Array<{ file: string; breakpointPx: number }> = [];
  for (const file of styleFiles) {
    const css = readFileSync(file, "utf8");
    for (const match of css.matchAll(/@media\s*\(max-width:\s*(\d+)px\)/g)) {
      declarations.push({ file, breakpointPx: Number(match[1]) });
    }
  }
  return declarations;
}

describe("mobile breakpoint consistency", () => {
  it("finds at least one @media (max-width) declaration to check", () => {
    expect(findMobileBreakpointDeclarations().length).toBeGreaterThan(0);
  });

  it("never declares a mobile breakpoint that disagrees with MOBILE_BREAKPOINT_PX", () => {
    for (const { file, breakpointPx } of findMobileBreakpointDeclarations()) {
      expect(breakpointPx, `${file} declares ${breakpointPx}px`).toBe(
        MOBILE_BREAKPOINT_PX,
      );
    }
  });

  it("never hardcodes a pixel breakpoint literal in a .css.ts file", () => {
    const srcDir = path.join(__dirname, "..");
    const vanillaExtractFiles = readdirSync(srcDir, { recursive: true })
      .filter(
        (entry): entry is string =>
          typeof entry === "string" && entry.endsWith(".css.ts"),
      )
      .map((entry) => path.join(srcDir, entry));

    for (const file of vanillaExtractFiles) {
      const source = readFileSync(file, "utf8");
      expect(
        source,
        `${path.relative(srcDir, file)} should build its breakpoint from MOBILE_BREAKPOINT_PX, not a literal`,
      ).not.toMatch(/\((?:max|min)-width:\s*\d+px\)/);
    }
  });
});
