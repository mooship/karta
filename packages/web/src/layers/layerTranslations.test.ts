import type { Layer, LayerGroup } from "@karta/core";
import { describe, expect, it, vi } from "vitest";

const { getLocale } = vi.hoisted(() => ({
  getLocale: vi.fn(() => "en"),
}));

vi.mock("../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../paraglide/runtime.js")>();
  return { ...actual, getLocale };
});

import {
  localizeLayer,
  localizeLayerGroup,
  localizeStory,
} from "./layerTranslations";

const CHOROPLETH_LAYER: Layer = {
  id: "townships",
  label: "Modelled car time",
  description: "English description",
  dataSource: ["/data/gauteng/townships.geojson"],
  geometryKind: "choropleth",
  defaultVisible: true,
  available: true,
  style: {
    kind: "choropleth",
    propertyKey: "commuteMinutes",
    buckets: [
      { max: 20, color: "#000", label: "Short (≤ 20 min)" },
      { max: 40, color: "#000", label: "Moderate (21–40 min)" },
      { max: 60, color: "#000", label: "Long (41–60 min)" },
      {
        max: Number.POSITIVE_INFINITY,
        color: "#000",
        label: "Very long (> 60 min)",
      },
    ],
    baseOpacity: 0.18,
  },
};

const LINE_LAYER: Layer = {
  id: "rapid-rail",
  label: "Rapid Rail",
  dataSource: ["/data/gauteng/rapid-rail.geojson"],
  geometryKind: "line",
  defaultVisible: false,
  available: true,
  style: { kind: "line", color: "#000", weight: 3, legendLabel: "Rapid Rail" },
};

const BRT_LAYER: Layer = {
  id: "bus-rapid-transit",
  label: "Bus Rapid Transit",
  dataSource: ["/data/gauteng/bus-rapid-transit.geojson"],
  geometryKind: "line",
  defaultVisible: false,
  available: true,
  style: {
    kind: "line",
    color: "#000",
    weight: 3,
    legendLabel: "Bus Rapid Transit",
    colorClassification: {
      kind: "categorized",
      propertyKey: "network",
      stops: [{ match: "Rea Vaya", value: "#000", label: "Rea Vaya" }],
      fallback: "#000",
    },
  },
};

const UNKNOWN_LAYER: Layer = {
  id: "some-future-layer",
  label: "Some Future Layer",
  description: "Not yet in the translation table",
  dataSource: ["/data/gauteng/future.geojson"],
  geometryKind: "line",
  defaultVisible: false,
  available: true,
  style: { kind: "line", color: "#000", weight: 3, legendLabel: "Future" },
};

describe("localizeLayer", () => {
  it("translates label and description for a known layer id", () => {
    getLocale.mockReturnValue("st");

    const localized = localizeLayer(CHOROPLETH_LAYER);

    expect(localized.label).toBe("Nako ya koloi e akantsweng");
    expect(localized.description).not.toBe(CHOROPLETH_LAYER.description);
  });

  it("translates choropleth bucket labels in order", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer(CHOROPLETH_LAYER);

    expect(localized.style.kind).toBe("choropleth");
    if (localized.style.kind === "choropleth") {
      expect(localized.style.buckets.map((b) => b.label)).toEqual([
        "Isikhathi esifushane (≤ 20 min)",
        "Isikhathi esimaphakathi (21–40 min)",
        "Isikhathi eside (41–60 min)",
        "Isikhathi eside kakhulu (> 60 min)",
      ]);
    }
  });

  it("mirrors the translated label into a line layer's legendLabel", () => {
    getLocale.mockReturnValue("st");

    const localized = localizeLayer(LINE_LAYER);

    expect(localized.label).toBe("Terene e Potlakileng");
    expect(localized.style.kind).toBe("line");
    if (localized.style.kind === "line") {
      expect(localized.style.legendLabel).toBe("Terene e Potlakileng");
    }
  });

  it("leaves colorClassification stop labels (operator names) untranslated", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer(BRT_LAYER);

    expect(localized.style.kind).toBe("line");
    if (localized.style.kind === "line") {
      expect(localized.style.colorClassification?.stops[0]?.label).toBe(
        "Rea Vaya",
      );
    }
  });

  it("falls back to the original English fields for an id with no translation entry", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer(UNKNOWN_LAYER);

    expect(localized.label).toBe("Some Future Layer");
    expect(localized.description).toBe("Not yet in the translation table");
  });

  it("returns the original English fields when the locale is en", () => {
    getLocale.mockReturnValue("en");

    const localized = localizeLayer(CHOROPLETH_LAYER);

    expect(localized.label).toBe("Modelled car time");
  });
});

const KNOWN_GROUP: LayerGroup = {
  id: "access-to-opportunity",
  title: "Accessibility overlays",
  description: "Only one overlay can be active at a time.",
  selectionMode: "exclusive",
  layerIds: ["townships", "nearest-transit"],
};

const UNKNOWN_GROUP: LayerGroup = {
  id: "some-future-group",
  title: "Some Future Group",
  selectionMode: "independent",
  layerIds: [],
};

describe("localizeLayerGroup", () => {
  it("translates title and description for a known group id", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayerGroup(KNOWN_GROUP);

    expect(localized.title).toBe("Izingqimba zokufinyelela");
    expect(localized.description).toBe(
      "Yingqimba eyodwa kuphela engasebenza ngesikhathi esisodwa.",
    );
  });

  it("falls back to the original title for an id with no translation entry", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayerGroup(UNKNOWN_GROUP);

    expect(localized.title).toBe("Some Future Group");
  });
});

describe("localizeStory", () => {
  it("translates the domain story", () => {
    getLocale.mockReturnValue("st");

    const localized = localizeStory({
      title: "Why this map exists",
      body: "English body",
    });

    expect(localized?.title).toBe("Hobaneng 'mapa ona o le teng");
  });

  it("returns undefined when the domain has no story", () => {
    expect(localizeStory(undefined)).toBeUndefined();
  });
});
