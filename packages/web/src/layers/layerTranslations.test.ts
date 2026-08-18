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
  localizeDomainLabel,
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

const HERITAGE_SITES_LAYER: Layer = {
  id: "heritage-sites",
  label: "Struggle heritage sites",
  description: "English description",
  dataSource: ["/data/heritage-sites/heritage-sites.geojson"],
  geometryKind: "point",
  defaultVisible: true,
  available: true,
  style: {
    kind: "point",
    color: "#000",
    radius: 7,
    legendLabel: "Struggle heritage sites",
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
  it("translates label and description for a known domain/layer id", () => {
    getLocale.mockReturnValue("st");

    const localized = localizeLayer("gauteng-spatial-legacy", CHOROPLETH_LAYER);

    expect(localized.label).toBe("Nako ya koloi e akantsweng");
    expect(localized.description).not.toBe(CHOROPLETH_LAYER.description);
  });

  it("translates choropleth bucket labels in order", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer("gauteng-spatial-legacy", CHOROPLETH_LAYER);

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

    const localized = localizeLayer("gauteng-spatial-legacy", LINE_LAYER);

    expect(localized.label).toBe("Terene e Potlakileng");
    expect(localized.style.kind).toBe("line");
    if (localized.style.kind === "line") {
      expect(localized.style.legendLabel).toBe("Terene e Potlakileng");
    }
  });

  it("leaves colorClassification stop labels (operator names) untranslated", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer("gauteng-spatial-legacy", BRT_LAYER);

    expect(localized.style.kind).toBe("line");
    if (localized.style.kind === "line") {
      expect(localized.style.colorClassification?.stops[0]?.label).toBe(
        "Rea Vaya",
      );
    }
  });

  it("translates a layer belonging to a different domain independently", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer("heritage-sites", HERITAGE_SITES_LAYER);

    expect(localized.label).toBe("Izindawo zefa lomzabalazo");
  });

  it("does not cross-match a layer id that exists in another domain's table", () => {
    getLocale.mockReturnValue("zu");

    // "heritage-sites" is a real layer id, but only under the
    // heritage-sites domain -- looked up under gauteng-spatial-legacy it
    // must fall back to the English original, not another domain's text.
    const localized = localizeLayer(
      "gauteng-spatial-legacy",
      HERITAGE_SITES_LAYER,
    );

    expect(localized.label).toBe("Struggle heritage sites");
  });

  it("falls back to the original English fields for an id with no translation entry", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer("gauteng-spatial-legacy", UNKNOWN_LAYER);

    expect(localized.label).toBe("Some Future Layer");
    expect(localized.description).toBe("Not yet in the translation table");
  });

  it("falls back to the original English fields for an unregistered domain id", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayer("not-a-real-domain", CHOROPLETH_LAYER);

    expect(localized.label).toBe("Modelled car time");
  });

  it("returns the original English fields when the locale is en", () => {
    getLocale.mockReturnValue("en");

    const localized = localizeLayer("gauteng-spatial-legacy", CHOROPLETH_LAYER);

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

const HERITAGE_GROUP: LayerGroup = {
  id: "heritage",
  title: "Heritage",
  selectionMode: "independent",
  layerIds: ["heritage-sites"],
};

const UNKNOWN_GROUP: LayerGroup = {
  id: "some-future-group",
  title: "Some Future Group",
  selectionMode: "independent",
  layerIds: [],
};

describe("localizeLayerGroup", () => {
  it("translates title and description for a known domain/group id", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayerGroup("gauteng-spatial-legacy", KNOWN_GROUP);

    expect(localized.title).toBe("Izingqimba zokufinyelela");
    expect(localized.description).toBe(
      "Yingqimba eyodwa kuphela engasebenza ngesikhathi esisodwa.",
    );
  });

  it("translates a group belonging to a different domain independently", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayerGroup("heritage-sites", HERITAGE_GROUP);

    expect(localized.title).toBe("Ifa");
  });

  it("falls back to the original title for an id with no translation entry", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeLayerGroup(
      "gauteng-spatial-legacy",
      UNKNOWN_GROUP,
    );

    expect(localized.title).toBe("Some Future Group");
  });
});

describe("localizeStory", () => {
  it("translates the gauteng-spatial-legacy domain story", () => {
    getLocale.mockReturnValue("st");

    const localized = localizeStory("gauteng-spatial-legacy", {
      title: "Why this map exists",
      body: "English body",
    });

    expect(localized?.title).toBe("Hobaneng 'mapa ona o le teng");
  });

  it("translates the heritage-sites domain story independently", () => {
    getLocale.mockReturnValue("zu");

    const localized = localizeStory("heritage-sites", {
      title: "Why these sites matter",
      body: "English body",
    });

    expect(localized?.title).toBe("Kungani lezi zindawo zibalulekile");
  });

  it("returns undefined when the domain has no story", () => {
    expect(localizeStory("gauteng-spatial-legacy", undefined)).toBeUndefined();
  });

  it("falls back to the original story for an unregistered domain id", () => {
    const story = { title: "Untranslated title", body: "Untranslated body" };
    expect(localizeStory("not-a-real-domain", story)).toBe(story);
  });
});

describe("localizeDomainLabel", () => {
  it("translates a known domain's switcher label", () => {
    getLocale.mockReturnValue("zu");

    expect(localizeDomainLabel("heritage-sites", "Heritage sites")).toBe(
      "Izindawo zefa",
    );
  });

  it("falls back to the given label for an unregistered domain id", () => {
    getLocale.mockReturnValue("zu");

    expect(localizeDomainLabel("not-a-real-domain", "Fallback label")).toBe(
      "Fallback label",
    );
  });
});
