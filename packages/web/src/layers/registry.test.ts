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
  getStory,
} from "./registry";

describe("registry", () => {
  afterEach(() => {
    getLocale.mockReturnValue("en");
  });

  it("returns the 6 gauteng-spatial-legacy layers", () => {
    const layers = getLayers();
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
    for (const layer of getLayers()) {
      for (const url of layer.dataSource) {
        expect(url).toMatch(/^\/data\/[\w-]+\/[\w.-]+\.geojson$/);
      }
    }
  });

  it("looks up a single layer by id", () => {
    expect(getLayer("rapid-rail")?.label).toBe("Rapid Rail");
    expect(getLayer("does-not-exist")).toBeUndefined();
  });

  it("returns the 2 layer groups", () => {
    const groups = getLayerGroups();
    expect(groups.map((g) => g.id)).toEqual([
      "access-to-opportunity",
      "transit-networks",
    ]);
  });

  it("returns the domain's story copy", () => {
    expect(getStory()).toEqual({
      title: "Why this map exists",
      body: expect.any(String),
    });
  });

  it("translates layers, groups, and the story to the current locale", () => {
    getLocale.mockReturnValue("zu");

    expect(getLayer("bus")?.label).toBe("Ibhasi");
    expect(getLayerGroups()[0]?.title).toBe("Izingqimba zokufinyelela");
    expect(getStory()?.title).toBe("Kungani leli balazwe likhona");
  });

  it("returns layer structure (ids, defaultVisible) without translating labels", () => {
    getLocale.mockReturnValue("zu");

    const structure = getLayerStructure();
    expect(structure.map((l) => l.id)).toEqual(getLayers().map((l) => l.id));
    expect(structure.find((l) => l.id === "bus")?.label).toBe("Bus");
  });
});
