import { afterEach, describe, expect, it, vi } from "vitest";

const { getLocale } = vi.hoisted(() => ({
  getLocale: vi.fn(() => "en"),
}));

vi.mock("../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../paraglide/runtime.js")>();
  return { ...actual, getLocale };
});

import {
  getLayer,
  getLayerGroups,
  getLayerStructure,
  getLayers,
  getLocalizedDomain,
  getStory,
} from "./registry";

describe("registry", () => {
  afterEach(() => {
    getLocale.mockReturnValue("en");
  });

  it("returns the 6 gauteng-spatial-legacy layers", () => {
    const layers = getLayers("gauteng-spatial-legacy");
    expect(layers.map((l) => l.id)).toEqual(
      expect.arrayContaining([
        "townships",
        "nearest-transit",
        "rapid-rail",
        "bus-rapid-transit",
        "commuter-rail",
        "bus",
      ]),
    );
  });

  it("every layer dataSource points at a per-region geojson URL", () => {
    for (const layer of getLayers("gauteng-spatial-legacy")) {
      for (const url of layer.dataSource) {
        expect(url).toMatch(/^\/data\/[\w-]+\/[\w.-]+\.geojson$/);
      }
    }
  });

  it("looks up a single layer by id", () => {
    expect(getLayer("gauteng-spatial-legacy", "rapid-rail")?.label).toBe(
      "Rapid Rail",
    );
    expect(
      getLayer("gauteng-spatial-legacy", "does-not-exist"),
    ).toBeUndefined();
  });

  it("returns the 2 layer groups", () => {
    const groups = getLayerGroups("gauteng-spatial-legacy");
    expect(groups.map((g) => g.id)).toEqual([
      "access-to-opportunity",
      "transit-networks",
    ]);
  });

  it("returns the domain's story copy", () => {
    expect(getStory("gauteng-spatial-legacy")).toEqual({
      title: "Why this map exists",
      body: expect.any(String),
    });
  });

  it("translates layers, groups, and the story to the current locale", () => {
    getLocale.mockReturnValue("zu");

    expect(getLayer("gauteng-spatial-legacy", "bus")?.label).toBe("Ibhasi");
    expect(getLayerGroups("gauteng-spatial-legacy")[0]?.title).toBe(
      "Izingqimba zokufinyelela",
    );
    expect(getStory("gauteng-spatial-legacy")?.title).toBe(
      "Kungani leli balazwe likhona",
    );
  });

  it("returns layer structure (ids, defaultVisible) without translating labels", () => {
    getLocale.mockReturnValue("zu");

    const structure = getLayerStructure("gauteng-spatial-legacy");
    expect(structure.map((l) => l.id)).toEqual(
      getLayers("gauteng-spatial-legacy").map((l) => l.id),
    );
    expect(structure.find((l) => l.id === "bus")?.label).toBe("Bus");
  });

  it("returns a different catalogue for a different registered domain", () => {
    const layers = getLayers("heritage-sites");
    expect(layers.map((l) => l.id)).toEqual(["heritage-sites"]);
  });

  it("throws for an unregistered domain id", () => {
    expect(() => getLayers("not-a-real-domain")).toThrow(/not-a-real-domain/);
  });

  it("composes layers, groups, and story into one localized DomainConfig via getLocalizedDomain", () => {
    getLocale.mockReturnValue("zu");

    const domain = getLocalizedDomain("gauteng-spatial-legacy");

    expect(domain.layers).toEqual(getLayers("gauteng-spatial-legacy"));
    expect(domain.layerGroups).toEqual(
      getLayerGroups("gauteng-spatial-legacy"),
    );
    expect(domain.story).toEqual(getStory("gauteng-spatial-legacy"));
  });
});
