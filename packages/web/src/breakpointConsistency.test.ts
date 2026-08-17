import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { describe, expect, it } from "vitest";

/**
 * Every `@media (max-width: ...)` breakpoint declared across this app's own
 * stylesheets, alongside the file it came from.
 * @remarks CSS custom properties can't be referenced inside a media query
 *   condition, so these stay literal pixel values rather than `var(...)`
 *   references to `MOBILE_BREAKPOINT_PX` (App.tsx's own single source of
 *   truth, re-exported from `@karta/react`) — this scan is what actually
 *   guards against one of them silently drifting from it instead of a code
 *   comment alone.
 */
function findMobileBreakpointDeclarations(): Array<{
  file: string;
  breakpointPx: number;
}> {
  const srcDir = path.join(__dirname);
  const cssFiles = readdirSync(srcDir, { recursive: true })
    .filter(
      (entry): entry is string =>
        typeof entry === "string" &&
        (entry.endsWith(".module.css") || entry.endsWith("index.css")),
    )
    .map((entry) => path.join(srcDir, entry));

  const declarations: Array<{ file: string; breakpointPx: number }> = [];
  for (const file of cssFiles) {
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
});
