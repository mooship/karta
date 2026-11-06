import { describe, expect, it } from "vitest";
import { REGIONS } from "../../constants/regions";
import type { Layer } from "../../types/genericLayer";
import { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";

describe("SPATIAL_APARTHEID_LEGACY_LAYERS", () => {
  it("derives every data URL's region segment from a REGIONS entry", () => {
    const regionIds = new Set(REGIONS.map((region) => region.id));
    for (const layer of SPATIAL_APARTHEID_LEGACY_LAYERS) {
      for (const url of layer.dataSource) {
        const [, , urlRegionId] = url.split("/");
        expect(regionIds.has(urlRegionId ?? "")).toBe(true);
      }
      if (layer.companionSource) {
        const [, , urlRegionId] = layer.companionSource.split("/");
        expect(regionIds.has(urlRegionId ?? "")).toBe(true);
      }
    }
  });

  it("includes every province-kind REGIONS entry in each multi-region layer's dataSource, so a newly added region flows in without touching layers.ts", () => {
    const provinceRegionIds = REGIONS.filter(
      (region) => region.kind === "province",
    ).map((region) => region.id);
    expect(provinceRegionIds.length).toBeGreaterThan(0);

    const findLayer = (id: string): Layer => {
      const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find((l) => l.id === id);
      if (!layer) {
        throw new Error(`expected layer ${id}`);
      }
      return layer;
    };

    for (const id of [
      "townships",
      "nearest-transit",
      "spatial-burden",
      "bus-rapid-transit",
      "commuter-rail",
    ]) {
      const layer = findLayer(id);
      for (const regionId of provinceRegionIds) {
        expect(
          layer.dataSource.some((url) => url.startsWith(`/data/${regionId}/`)),
        ).toBe(true);
      }
      expect(layer.dataSource.length).toBe(provinceRegionIds.length);
    }
  });

  it("fetches bus-rapid-transit and commuter-rail from both configured regions", () => {
    const findLayer = (id: string): Layer => {
      const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find((l) => l.id === id);
      if (!layer) {
        throw new Error(`expected layer ${id}`);
      }
      return layer;
    };
    expect(findLayer("bus-rapid-transit").dataSource).toEqual([
      "/data/gauteng/bus-rapid-transit.display.v1.geojson",
      "/data/western-cape/bus-rapid-transit.display.v1.geojson",
    ]);
    expect(findLayer("commuter-rail").dataSource).toEqual([
      "/data/gauteng/commuter-rail.display.v1.geojson",
      "/data/western-cape/commuter-rail.display.v1.geojson",
    ]);
  });

  it("fetches the townships, nearest-transit, and spatial-burden choropleths from every configured region, not just gauteng", () => {
    const findLayer = (id: string): Layer => {
      const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find((l) => l.id === id);
      if (!layer) {
        throw new Error(`expected layer ${id}`);
      }
      return layer;
    };
    const regionIds = REGIONS.map((region) => region.id);
    for (const id of ["townships", "nearest-transit", "spatial-burden"]) {
      const layer = findLayer(id);
      expect(layer.dataSource).toEqual(
        regionIds.map(
          (regionId) => `/data/${regionId}/townships.display.v1.geojson`,
        ),
      );
    }
  });

  it("no longer sets companionSource, since nothing in @karta/map's fetch path consumes it and packages/web fetches township-areas itself via buildRegionDataUrls()", () => {
    for (const layer of SPATIAL_APARTHEID_LEGACY_LAYERS) {
      expect(layer.companionSource).toBeUndefined();
    }
  });

  it("has exactly the 7 layers the current app ships, in order", () => {
    expect(SPATIAL_APARTHEID_LEGACY_LAYERS.map((l) => l.id)).toEqual([
      "townships",
      "nearest-transit",
      "spatial-burden",
      "rapid-rail",
      "bus-rapid-transit",
      "commuter-rail",
      "bus",
    ]);
  });

  it("matches today's townships (commute time) choropleth exactly", () => {
    const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find(
      (l) => l.id === "townships",
    );
    expect(layer?.label).toBe("Modelled car time");
    expect(layer?.geometryKind).toBe("choropleth");
    expect(layer?.defaultVisible).toBe(true);
    expect(layer?.dataSource).toEqual([
      "/data/gauteng/townships.display.v1.geojson",
      "/data/western-cape/townships.display.v1.geojson",
    ]);
    expect(layer?.companionSource).toBeUndefined();
    expect(layer?.interaction).toEqual({
      selectable: true,
      labelField: "name",
    });
    const style = layer?.style;
    if (style?.kind !== "choropleth") {
      throw new Error("expected choropleth style");
    }
    expect(style.propertyKey).toBe("commuteMinutes");
    expect(style.buckets).toEqual([
      {
        max: 20,
        color: "#F3E3C3",
        darkColor: "#3A2A17",
        label: "Short (≤ 20 min)",
      },
      {
        max: 40,
        color: "#DDB06B",
        darkColor: "#6B4A22",
        label: "Moderate (21–40 min)",
      },
      {
        max: 60,
        color: "#B36F2A",
        darkColor: "#A8722F",
        label: "Long (41–60 min)",
      },
      {
        max: Number.POSITIVE_INFINITY,
        color: "#6B3A12",
        darkColor: "#E7B46B",
        label: "Very long (> 60 min)",
      },
    ]);
    expect(style.baseOpacity).toBe(0.55);
    expect(style.emphasisOpacity).toBe(0.85);
    expect(style.resolveEmphasis?.({ name: "Mamelodi", id: "1" })).toBe(true);
    expect(style.resolveEmphasis?.({ name: "Not A Real Place" })).toBe(false);
    expect(style.resolveEmphasis?.({ id: "1" })).toBe(false);
  });

  it("matches today's nearest-transit choropleth exactly", () => {
    const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find(
      (l) => l.id === "nearest-transit",
    );
    expect(layer?.label).toBe("Distance to nearest transit");
    expect(layer?.defaultVisible).toBe(false);
    expect(layer?.dataSource).toEqual([
      "/data/gauteng/townships.display.v1.geojson",
      "/data/western-cape/townships.display.v1.geojson",
    ]);
    const style = layer?.style;
    if (style?.kind !== "choropleth") {
      throw new Error("expected choropleth style");
    }
    expect(style.propertyKey).toBe("nearestTransitKm");
    expect(style.buckets).toEqual([
      {
        max: 1,
        color: "#BCD3E6",
        darkColor: "#274A66",
        label: "Near (≤ 1 km)",
      },
      {
        max: 3,
        color: "#7FA6C9",
        darkColor: "#3E75A8",
        label: "Moderate (1–3 km)",
      },
      {
        max: 8,
        color: "#3F6E9B",
        darkColor: "#5FA8DE",
        label: "Far (3–8 km)",
      },
      {
        max: Number.POSITIVE_INFINITY,
        color: "#173E63",
        darkColor: "#9ED4FF",
        label: "Very far (> 8 km)",
      },
    ]);
    expect(style.baseOpacity).toBe(0.55);
    expect(style.emphasisOpacity).toBe(0.85);
    expect(style.resolveEmphasis?.({ name: "Mamelodi", id: "1" })).toBe(true);
    expect(style.resolveEmphasis?.({ name: "Not A Real Place" })).toBe(false);
    expect(style.resolveEmphasis?.({ id: "1" })).toBe(false);
  });

  it("matches today's spatial-burden choropleth exactly", () => {
    const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find(
      (l) => l.id === "spatial-burden",
    );
    expect(layer?.label).toBe("Combined spatial burden");
    expect(layer?.defaultVisible).toBe(false);
    expect(layer?.dataSource).toEqual([
      "/data/gauteng/townships.display.v1.geojson",
      "/data/western-cape/townships.display.v1.geojson",
    ]);
    expect(layer?.companionSource).toBeUndefined();
    const style = layer?.style;
    if (style?.kind !== "choropleth") {
      throw new Error("expected choropleth style");
    }
    expect(style.propertyKey).toBe("spatialBurdenScore");
    expect(style.buckets).toEqual([
      { max: 0.25, color: "#D3C2EC", darkColor: "#3D2A5C", label: "Low" },
      {
        max: 0.5,
        color: "#B99FE0",
        darkColor: "#6B4A94",
        label: "Moderate",
      },
      { max: 0.75, color: "#8659C7", darkColor: "#9B72D6", label: "High" },
      {
        max: Number.POSITIVE_INFINITY,
        color: "#4B1F94",
        darkColor: "#C9AAFF",
        label: "Severe",
      },
    ]);
    expect(style.baseOpacity).toBe(0.55);
    expect(style.emphasisOpacity).toBe(0.85);
  });

  it("matches today's 4 transit line layers exactly", () => {
    const findLayer = (id: string): Layer => {
      const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find((l) => l.id === id);
      if (!layer) {
        throw new Error(`expected layer ${id}`);
      }
      return layer;
    };
    expect(findLayer("rapid-rail").label).toBe("Rapid rail");
    expect(findLayer("rapid-rail").dataSource).toEqual([
      "/data/gauteng/rapid-rail.display.v1.geojson",
    ]);
    expect(findLayer("rapid-rail").style).toEqual({
      kind: "line",
      color: "#1F1B16",
      darkColor: "#EDE6DA",
      weight: 3,
      legendLabel: "Rapid rail",
      casing: { color: "#F6F2E9", darkColor: "#16130F", width: 1.5 },
    });
    expect(findLayer("bus-rapid-transit").style).toEqual({
      kind: "line",
      color: "#B5172D",
      weight: 3,
      legendLabel: "Bus rapid transit",
      casing: { color: "#F6F2E9", width: 1.5 },
      colorClassification: {
        kind: "categorized",
        propertyKey: "network",
        stops: [
          { match: "A Re Yeng", value: "#0F6E6E", label: "A Re Yeng" },
          { match: "Rea Vaya", value: "#B5172D", label: "Rea Vaya" },
          {
            match: "Ekurhuleni IRPTN",
            value: "#6B4FA0",
            label: "Ekurhuleni IRPTN",
          },
          { match: "MyCiTi", value: "#1D4E9E", label: "MyCiTi" },
        ],
        fallback: "#B5172D",
      },
    });
    expect(findLayer("commuter-rail").style).toEqual({
      kind: "line",
      color: "#1F1B16",
      darkColor: "#EDE6DA",
      weight: 2,
      legendLabel: "Commuter rail",
      dashArray: "10 4",
      casing: { color: "#F6F2E9", darkColor: "#16130F", width: 1.5 },
    });
    expect(findLayer("bus").style).toEqual({
      kind: "line",
      color: "#4F4A42",
      darkColor: "#BDB4A6",
      weight: 1.5,
      legendLabel: "Bus",
      dashArray: "2 3",
      casing: { color: "#F6F2E9", darkColor: "#16130F", width: 1.5 },
    });
    for (const id of [
      "rapid-rail",
      "bus-rapid-transit",
      "commuter-rail",
      "bus",
    ]) {
      expect(findLayer(id).geometryKind).toBe("line");
      expect(findLayer(id).defaultVisible).toBe(false);
      expect(findLayer(id).available).toBe(true);
    }
  });
});
