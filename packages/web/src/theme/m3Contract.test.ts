import { readFileSync } from "node:fs";
import path from "node:path";
import { mapLabelVars, vars } from "@karta/theme";
import { describe, expect, it } from "vitest";

/** Extracts every `--custom-property-name` a `vars`-shaped contract resolves to. */
function customPropertyNames(contract: unknown): string[] {
  if (typeof contract === "string") {
    const match = contract.match(/^var\((--[a-z0-9-]+)\)$/);
    return match ? [match[1] as string] : [];
  }
  return Object.values(contract as Record<string, unknown>).flatMap(
    customPropertyNames,
  );
}

describe("@karta/theme's M3 contract against this app's index.css", () => {
  it("defines every custom property @karta/theme's vars/mapLabelVars declare", () => {
    const indexCss = readFileSync(path.join(__dirname, "../index.css"), "utf8");
    for (const name of [
      ...customPropertyNames(vars),
      ...customPropertyNames(mapLabelVars),
    ]) {
      expect(
        indexCss.includes(`${name}:`),
        `index.css never declares ${name}`,
      ).toBe(true);
    }
  });
});
