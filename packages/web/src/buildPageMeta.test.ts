import { describe, expect, it } from "vitest";
import { buildPageMeta } from "./buildPageMeta";

/**
 * Finds the single Dataset JSON-LD descriptor `buildPageMeta` emits, so
 * tests can assert on its `spatialCoverage`/`keywords` fields without
 * depending on the exact position it appears at in the returned array.
 */
function getJsonLd(
  meta: ReturnType<typeof buildPageMeta>,
): Record<string, unknown> {
  const entry = meta.find(
    (descriptor): descriptor is { "script:ld+json": Record<string, unknown> } =>
      "script:ld+json" in descriptor,
  );
  if (!entry) {
    throw new Error("buildPageMeta did not return a script:ld+json entry");
  }
  return entry["script:ld+json"];
}

describe("buildPageMeta", () => {
  it("describes both published regions in the Dataset JSON-LD's spatialCoverage", () => {
    const jsonLd = getJsonLd(
      buildPageMeta({
        title: "Test title",
        description: "Test description",
        url: "https://example.com",
      }),
    );

    const spatialCoverage = jsonLd.spatialCoverage as { name: string };
    expect(spatialCoverage.name).toContain("Gauteng");
    expect(spatialCoverage.name).toContain("Western Cape");
  });

  it("includes keywords for both published regions", () => {
    const jsonLd = getJsonLd(
      buildPageMeta({
        title: "Test title",
        description: "Test description",
        url: "https://example.com",
      }),
    );

    const keywords = jsonLd.keywords as string[];
    expect(keywords).toContain("Gauteng");
    expect(
      keywords.some(
        (keyword) =>
          keyword.includes("Western Cape") || keyword.includes("Cape Town"),
      ),
    ).toBe(true);
  });
});
