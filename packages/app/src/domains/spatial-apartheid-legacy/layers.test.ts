import { describe, expect, it } from "vitest";
import { REGIONS } from "../../constants/regions";
import type { Layer } from "../../types/genericLayer";
import { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";

describe("SPATIAL_APARTHEID_LEGACY_LAYERS", () => {
  it("derives every data URL's region segment from REGIONS' gauteng entry", () => {
    const gautengRegion = REGIONS.find((region) => region.id === "gauteng");
    expect(gautengRegion).toBeDefined();
    for (const layer of SPATIAL_APARTHEID_LEGACY_LAYERS) {
      for (const url of layer.dataSource) {
        expect(url.startsWith(`/data/${gautengRegion?.id}/`)).toBe(true);
      }
      if (layer.companionSource) {
        expect(
          layer.companionSource.startsWith(`/data/${gautengRegion?.id}/`),
        ).toBe(true);
      }
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
    ]);
    expect(layer?.companionSource).toBe(
      "/data/gauteng/township-areas.display.v1.geojson",
    );
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
      { max: 20, color: "#7A9B6E", label: "Short (≤ 20 min)" },
      { max: 40, color: "#C9A227", label: "Moderate (21–40 min)" },
      { max: 60, color: "#D6703F", label: "Long (41–60 min)" },
      {
        max: Number.POSITIVE_INFINITY,
        color: "#C1502E",
        label: "Very long (> 60 min)",
      },
    ]);
    expect(style.baseOpacity).toBe(0.18);
    expect(style.emphasisOpacity).toBe(0.78);
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
    ]);
    const style = layer?.style;
    if (style?.kind !== "choropleth") {
      throw new Error("expected choropleth style");
    }
    expect(style.propertyKey).toBe("nearestTransitKm");
    expect(style.buckets).toEqual([
      {
        max: 1,
        color: "#CFE3F5",
        darkColor: "#274A66",
        label: "Near (≤ 1 km)",
      },
      {
        max: 3,
        color: "#7FB2E5",
        darkColor: "#3E75A8",
        label: "Moderate (1–3 km)",
      },
      {
        max: 8,
        color: "#3673B8",
        darkColor: "#5FA8DE",
        label: "Far (3–8 km)",
      },
      {
        max: Number.POSITIVE_INFINITY,
        color: "#123F6E",
        darkColor: "#9ED4FF",
        label: "Very far (> 8 km)",
      },
    ]);
    expect(style.baseOpacity).toBe(0.18);
    expect(style.emphasisOpacity).toBe(0.78);
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
    ]);
    expect(layer?.companionSource).toBe(
      "/data/gauteng/township-areas.display.v1.geojson",
    );
    const style = layer?.style;
    if (style?.kind !== "choropleth") {
      throw new Error("expected choropleth style");
    }
    expect(style.propertyKey).toBe("spatialBurdenScore");
    expect(style.buckets).toEqual([
      { max: 0.25, color: "#E6D9F5", darkColor: "#3D2A5C", label: "Low" },
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
    expect(style.baseOpacity).toBe(0.18);
    expect(style.emphasisOpacity).toBe(0.78);
  });

  it("matches today's 4 transit line layers exactly", () => {
    const findLayer = (id: string): Layer => {
      const layer = SPATIAL_APARTHEID_LEGACY_LAYERS.find((l) => l.id === id);
      if (!layer) {
        throw new Error(`expected layer ${id}`);
      }
      return layer;
    };
    expect(findLayer("rapid-rail").label).toBe("Rapid Rail");
    expect(findLayer("rapid-rail").dataSource).toEqual([
      "/data/gauteng/rapid-rail.display.v1.geojson",
    ]);
    expect(findLayer("rapid-rail").style).toEqual({
      kind: "line",
      color: "#E69F00",
      weight: 3,
      legendLabel: "Rapid Rail",
    });
    expect(findLayer("bus-rapid-transit").style).toEqual({
      kind: "line",
      color: "#009E73",
      weight: 3,
      legendLabel: "Bus Rapid Transit",
      colorClassification: {
        kind: "categorized",
        propertyKey: "network",
        stops: [
          { match: "A Re Yeng", value: "#56B4E9", label: "A Re Yeng" },
          { match: "Rea Vaya", value: "#009E73", label: "Rea Vaya" },
          {
            match: "Ekurhuleni IRPTN",
            value: "#0072B2",
            label: "Ekurhuleni IRPTN",
          },
          { match: "MyCiTi", value: "#E69F00", label: "MyCiTi" },
        ],
        fallback: "#009E73",
      },
    });
    expect(findLayer("commuter-rail").style).toEqual({
      kind: "line",
      color: "#D55E00",
      weight: 2,
      legendLabel: "Commuter Rail",
    });
    expect(findLayer("bus").style).toEqual({
      kind: "line",
      color: "#CC79A7",
      weight: 3,
      legendLabel: "Bus",
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
