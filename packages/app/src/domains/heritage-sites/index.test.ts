import { createRegistry } from "@karta/core";
import { describe, expect, it } from "vitest";
import { HERITAGE_SITES_DOMAIN } from "./index";

describe("HERITAGE_SITES_DOMAIN", () => {
  it("bundles id, layers, layerGroups, and story copy", () => {
    expect(HERITAGE_SITES_DOMAIN.id).toBe("heritage-sites");
    expect(HERITAGE_SITES_DOMAIN.layers).toHaveLength(1);
    expect(HERITAGE_SITES_DOMAIN.layerGroups).toHaveLength(1);
    expect(HERITAGE_SITES_DOMAIN.story.title).toBe("Why these sites matter");
    expect(HERITAGE_SITES_DOMAIN.story.body.length).toBeGreaterThan(0);
  });

  it("is a real DomainConfig, usable by @karta/core's createRegistry with no special-casing", () => {
    const registry = createRegistry(HERITAGE_SITES_DOMAIN);

    expect(registry.getLayer("heritage-sites")?.label).toBe(
      "Struggle heritage sites",
    );
    expect(registry.getLayerGroups()).toHaveLength(1);
    expect(registry.getStory()?.title).toBe("Why these sites matter");
  });
});
