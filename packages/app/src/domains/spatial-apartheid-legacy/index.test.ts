import { describe, expect, it } from "vitest";
import { SPATIAL_APARTHEID_LEGACY_DOMAIN } from "./index";

describe("SPATIAL_APARTHEID_LEGACY_DOMAIN", () => {
  it("bundles id, layers, layerGroups, and story copy", () => {
    expect(SPATIAL_APARTHEID_LEGACY_DOMAIN.id).toBe("spatial-apartheid-legacy");
    expect(SPATIAL_APARTHEID_LEGACY_DOMAIN.layers).toHaveLength(7);
    expect(SPATIAL_APARTHEID_LEGACY_DOMAIN.layerGroups).toHaveLength(2);
    expect(SPATIAL_APARTHEID_LEGACY_DOMAIN.story.title).toBe(
      "Why this map exists",
    );
    expect(SPATIAL_APARTHEID_LEGACY_DOMAIN.story.body.length).toBeGreaterThan(
      0,
    );
  });
});
