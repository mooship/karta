import { describe, expect, it } from "vitest";
import settings from "../project.inlang/settings.json";

/**
 * Every `messages/{locale}.json` file, discovered by glob rather than a
 * hand-maintained import list — a new locale file with no matching entry
 * here was exactly the kind of thing that slipped through when this suite
 * imported each locale by name: isiXhosa's addition updated this list, but
 * Afrikaans's initially didn't, and nothing caught it until reviewed by eye.
 * Globbing means adding `messages/{locale}.json` is enough on its own.
 */
const localeModules = import.meta.glob<{ default: Record<string, string> }>(
  "./*.json",
  { eager: true },
);

const LOCALES: Record<string, Record<string, string>> = {};
for (const [path, mod] of Object.entries(localeModules)) {
  const locale = path.replace(/^\.\//, "").replace(/\.json$/, "");
  LOCALES[locale] = mod.default;
}

const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

function placeholders(value: string): string[] {
  return [...value.matchAll(PLACEHOLDER_PATTERN)]
    .map((match) => match[1] ?? "")
    .sort();
}

const baseMessages = LOCALES.en;
if (!baseMessages) {
  throw new Error("messages/en.json is missing — cannot establish a baseline");
}
const baseKeys = Object.keys(baseMessages).filter((key) => key !== "$schema");

describe("locale message parity", () => {
  it("project.inlang/settings.json's locales match the messages/*.json files present", () => {
    expect(new Set(Object.keys(LOCALES))).toEqual(new Set(settings.locales));
  });

  it.each(Object.entries(LOCALES))(
    "%s has exactly the same message keys as en",
    (_locale, messages) => {
      const keys = Object.keys(messages).filter((key) => key !== "$schema");
      expect(new Set(keys)).toEqual(new Set(baseKeys));
    },
  );

  it.each(Object.entries(LOCALES))(
    "%s uses the same interpolation placeholders as en for every key",
    (_locale, messages) => {
      for (const key of baseKeys) {
        expect(placeholders(messages[key] ?? "")).toEqual(
          placeholders(baseMessages[key] ?? ""),
        );
      }
    },
  );

  it.each(Object.entries(LOCALES))(
    "%s has no empty message values",
    (_locale, messages) => {
      for (const key of baseKeys) {
        expect(messages[key]?.trim()).not.toBe("");
      }
    },
  );
});
