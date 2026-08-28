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

const SPATIAL_BURDEN_LAYER: Layer = {
  id: "spatial-burden",
  label: "Combined spatial burden",
  description: "English description",
  dataSource: ["/data/gauteng/townships.geojson"],
  geometryKind: "choropleth",
  defaultVisible: false,
  available: true,
  style: {
    kind: "choropleth",
    propertyKey: "spatialBurdenScore",
    buckets: [
      { max: 0.25, color: "#000", label: "Low" },
      { max: 0.5, color: "#000", label: "Moderate" },
      { max: 0.75, color: "#000", label: "High" },
      { max: Number.POSITIVE_INFINITY, color: "#000", label: "Severe" },
    ],
    baseOpacity: 0.18,
  },
};

const UNKNOWN_CHOROPLETH_LAYER: Layer = {
  id: "some-future-choropleth",
  label: "Some Future Choropleth",
  description: "Not yet in the translation table",
  dataSource: ["/data/gauteng/future.geojson"],
  geometryKind: "choropleth",
  defaultVisible: true,
  available: true,
  style: {
    kind: "choropleth",
    propertyKey: "value",
    buckets: [{ max: 10, color: "#000", label: "Original bucket label" }],
    baseOpacity: 0.18,
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
    getLocale.mockReturnValue("af");

    const localized = localizeLayer(CHOROPLETH_LAYER);

    expect(localized.label).toBe("Gemodelleerde motortyd");
    expect(localized.description).not.toBe(CHOROPLETH_LAYER.description);
  });

  it("translates choropleth bucket labels in order", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeLayer(CHOROPLETH_LAYER);

    expect(localized.style.kind).toBe("choropleth");
    if (localized.style.kind === "choropleth") {
      expect(localized.style.buckets.map((b) => b.label)).toEqual([
        "Kort (≤ 20 min)",
        "Matig (21–40 min)",
        "Lank (41–60 min)",
        "Baie lank (> 60 min)",
      ]);
    }
  });

  it("falls back to a bucket's own English label when the translation table has fewer bucketLabels than the layer has buckets", () => {
    getLocale.mockReturnValue("af");
    const extraBucketLayer: Layer = {
      ...CHOROPLETH_LAYER,
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
          { max: Number.POSITIVE_INFINITY, color: "#000", label: "Extreme" },
        ],
        baseOpacity: 0.18,
      },
    };

    const localized = localizeLayer(extraBucketLayer);

    expect(localized.style.kind).toBe("choropleth");
    if (localized.style.kind === "choropleth") {
      expect(localized.style.buckets.at(-1)?.label).toBe("Extreme");
    }
  });

  it("translates the spatial-burden choropleth's label and bucket labels", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeLayer(SPATIAL_BURDEN_LAYER);

    expect(localized.label).toBe("Gekombineerde ruimtelike las");
    expect(localized.style.kind).toBe("choropleth");
    if (localized.style.kind === "choropleth") {
      expect(localized.style.buckets.map((b) => b.label)).toEqual([
        "Laag",
        "Matig",
        "Hoog",
        "Ernstig",
      ]);
    }
  });

  it("mirrors the translated label into a line layer's legendLabel", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeLayer(LINE_LAYER);

    expect(localized.label).toBe("Snelspoor");
    expect(localized.style.kind).toBe("line");
    if (localized.style.kind === "line") {
      expect(localized.style.legendLabel).toBe("Snelspoor");
    }
  });

  it("leaves colorClassification stop labels (operator names) untranslated", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeLayer(BRT_LAYER);

    expect(localized.style.kind).toBe("line");
    if (localized.style.kind === "line") {
      expect(localized.style.colorClassification?.stops[0]?.label).toBe(
        "Rea Vaya",
      );
    }
  });

  it("falls back to the original English fields for an id with no translation entry", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeLayer(UNKNOWN_LAYER);

    expect(localized.label).toBe("Some Future Layer");
    expect(localized.description).toBe("Not yet in the translation table");
  });

  it("leaves a choropleth layer's buckets untouched for an id with no translation entry", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeLayer(UNKNOWN_CHOROPLETH_LAYER);

    expect(localized.label).toBe("Some Future Choropleth");
    expect(localized.style.kind).toBe("choropleth");
    if (localized.style.kind === "choropleth") {
      expect(localized.style.buckets.map((b) => b.label)).toEqual([
        "Original bucket label",
      ]);
    }
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
    getLocale.mockReturnValue("af");

    const localized = localizeLayerGroup(KNOWN_GROUP);

    expect(localized.title).toBe("Toeganklikheidslae");
    expect(localized.description).toBe(
      "Slegs een laag kan op 'n slag aktief wees.",
    );
  });

  it("falls back to the original title for an id with no translation entry", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeLayerGroup(UNKNOWN_GROUP);

    expect(localized.title).toBe("Some Future Group");
  });
});

describe("localizeStory", () => {
  it("translates the domain story", () => {
    getLocale.mockReturnValue("af");

    const localized = localizeStory({
      title: "Why this map exists",
      body: "English body",
    });

    expect(localized?.title).toBe("Waarom hierdie kaart bestaan");
  });

  it("returns undefined when the domain has no story", () => {
    expect(localizeStory(undefined)).toBeUndefined();
  });
});
