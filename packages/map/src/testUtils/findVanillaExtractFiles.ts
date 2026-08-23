import { readdirSync } from "node:fs";
import path from "node:path";

/**
 * Every `.css.ts` (vanilla-extract) file under `packages/map/src`.
 * @remarks Shared by the architecture tests that scan this package's own
 *   style files for token-contract violations (`designTokenDefaults.test.ts`,
 *   `zIndexTokens.test.ts`, `mobileLayoutTokens.test.ts`,
 *   `breakpointConsistency.test.ts`) so the directory walk is defined once
 *   rather than hand-copied per test file.
 */
export function findVanillaExtractFiles(): string[] {
  const srcDir = path.join(__dirname, "..");
  return readdirSync(srcDir, { recursive: true })
    .filter(
      (entry): entry is string =>
        typeof entry === "string" && entry.endsWith(".css.ts"),
    )
    .map((entry) => path.join(srcDir, entry));
}
