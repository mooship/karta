import { afterEach, describe, expect, it } from "vitest";
import {
  getBasemapDefinition,
  getBasemapTileSources,
  getRegisteredBasemapIds,
  type RasterBasemapDefinition,
  registerBasemap,
  resetBasemapRegistry,
  resolveTileScaleToken,
  type VectorBasemapDefinition,
} from "./basemaps";

const CUSTOM_RASTER_BASEMAP: RasterBasemapDefinition = {
  kind: "raster",
  label: "Custom",
  description: "A custom basemap.",
  url: "https://example.com/{z}/{x}/{y}.png",
  attribution: "Example",
};

const CUSTOM_VECTOR_BASEMAP: VectorBasemapDefinition = {
  kind: "vector",
  label: "Custom Vector",
  description: "A custom vector basemap.",
  styleUrl: "https://example.com/style.json",
};

describe("basemap registry", () => {
  afterEach(() => {
    resetBasemapRegistry();
  });

  it("includes the built-in street, satellite, and topo basemaps by default", () => {
    expect(getRegisteredBasemapIds()).toEqual(["street", "satellite", "topo"]);
  });

  it("throws when looking up an unregistered basemap", () => {
    expect(() => getBasemapDefinition("unknown")).toThrow(/unknown/i);
  });

  it.each([
    ["topo", true],
    ["satellite", undefined],
  ])(
    "sets dimInDarkMode to %s for the built-in raster %s basemap",
    (basemapId, expected) => {
      const definition = getBasemapDefinition(basemapId);
      expect(definition.kind).toBe("raster");
      expect((definition as RasterBasemapDefinition).dimInDarkMode).toBe(
        expected,
      );
    },
  );

  it("registers the built-in street basemap as a vector (OpenFreeMap) basemap with light/dark styles and attribution", () => {
    const definition = getBasemapDefinition("street");
    expect(definition.kind).toBe("vector");
    const vectorDefinition = definition as VectorBasemapDefinition;
    expect(vectorDefinition.styleUrl).toMatch(
      /^https:\/\/tiles\.openfreemap\.org\/styles\//,
    );
    expect(vectorDefinition.darkStyleUrl).toMatch(
      /^https:\/\/tiles\.openfreemap\.org\/styles\//,
    );
    expect(vectorDefinition.attribution).toMatch(/OpenStreetMap/);
  });

  it("registers a new basemap that becomes retrievable and listed", () => {
    registerBasemap("custom", CUSTOM_RASTER_BASEMAP);

    expect(getRegisteredBasemapIds()).toContain("custom");
    expect(getBasemapDefinition("custom")).toMatchObject({ label: "Custom" });
  });

  it("overwrites an existing basemap when registered again under the same id", () => {
    registerBasemap("street", {
      kind: "raster",
      label: "Replaced",
      description: "Replaced street basemap.",
      url: "https://example.com/{z}/{x}/{y}.png",
      attribution: "Example",
    });

    expect(getBasemapDefinition("street").label).toBe("Replaced");
  });

  it("resetBasemapRegistry restores the built-in defaults", () => {
    registerBasemap("custom", CUSTOM_RASTER_BASEMAP);

    resetBasemapRegistry();

    expect(getRegisteredBasemapIds()).toEqual(["street", "satellite", "topo"]);
  });
});

describe("getBasemapTileSources", () => {
  afterEach(() => {
    resetBasemapRegistry();
  });

  it.each([
    ["satellite", /arcgisonline/],
    ["topo", /World_Topo_Map/],
  ])(
    "returns a single %s source regardless of dark mode",
    (basemap, urlPattern) => {
      expect(getBasemapTileSources(basemap, false)).toHaveLength(1);
      expect(getBasemapTileSources(basemap, true)).toHaveLength(1);
      expect(getBasemapTileSources(basemap, true)[0]?.url).toMatch(urlPattern);
    },
  );

  it("throws for the built-in street basemap, now a vector basemap", () => {
    expect(() => getBasemapTileSources("street", false)).toThrow(/raster/i);
  });

  it("returns a single source for a raster basemap with no dark or fallback URLs", () => {
    registerBasemap("custom", CUSTOM_RASTER_BASEMAP);

    expect(getBasemapTileSources("custom", false)).toEqual([
      { url: "https://example.com/{z}/{x}/{y}.png", attribution: "Example" },
    ]);
  });

  it("throws for a vector basemap", () => {
    registerBasemap("custom-vector", CUSTOM_VECTOR_BASEMAP);

    expect(() => getBasemapTileSources("custom-vector", false)).toThrow(
      /raster/i,
    );
  });

  it("falls back to the light attribution when a custom basemap has a darkUrl but no darkAttribution", () => {
    registerBasemap("custom-dark", {
      kind: "raster",
      label: "Custom Dark",
      description: "A custom basemap with a dark variant but no dark credit.",
      url: "https://example.com/{z}/{x}/{y}.png",
      attribution: "Example",
      darkUrl: "https://example.com/dark/{z}/{x}/{y}.png",
    });

    const [source] = getBasemapTileSources("custom-dark", true);

    expect(source).toEqual({
      url: "https://example.com/dark/{z}/{x}/{y}.png",
      attribution: "Example",
    });
  });
});

describe("resolveTileScaleToken", () => {
  it("substitutes every {r} placeholder with @2x when retina tiles are wanted", () => {
    expect(
      resolveTileScaleToken(
        "https://{s}.example.com/{z}/{x}/{y}{r}.png?fallback={r}",
        true,
      ),
    ).toBe("https://{s}.example.com/{z}/{x}/{y}@2x.png?fallback=@2x");
  });

  it("strips every {r} placeholder when retina tiles are not wanted", () => {
    expect(
      resolveTileScaleToken(
        "https://{s}.example.com/{z}/{x}/{y}{r}.png",
        false,
      ),
    ).toBe("https://{s}.example.com/{z}/{x}/{y}.png");
  });

  it("leaves a URL without the placeholder untouched", () => {
    const url =
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

    expect(resolveTileScaleToken(url, true)).toBe(url);
    expect(resolveTileScaleToken(url, false)).toBe(url);
  });
});
