import { describe, expect, it } from "vitest";
import en from "./en.json";
import st from "./st.json";
import xh from "./xh.json";
import zu from "./zu.json";

/**
 * Every configured locale, keyed by its `messages/{locale}.json` content.
 * `en` is the baseline every other locale is checked against — add a new
 * locale here (and to `project.inlang/settings.json`'s `locales`) and this
 * suite starts covering it automatically.
 */
const LOCALES: Record<string, Record<string, string>> = { en, st, zu, xh };

const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

function placeholders(value: string): string[] {
  return [...value.matchAll(PLACEHOLDER_PATTERN)]
    .map((match) => match[1] ?? "")
    .sort();
}

const baseKeys = Object.keys(en).filter((key) => key !== "$schema");

describe("locale message parity", () => {
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
          placeholders(en[key as keyof typeof en]),
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
