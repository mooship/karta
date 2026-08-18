import type { DomainConfig, Layer } from "@karta/core";
import type { LayerDataMap } from "@karta/map";
import { describe, expect, it, vi } from "vitest";

vi.mock("../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../paraglide/runtime.js")>();
  return { ...actual, getLocale: vi.fn(() => "en") };
});

import { resolvePopupFields } from "./featurePopupFields";

const townshipLayer: Layer = {
  id: "townships",
  label: "Modelled car time",
  dataSource: ["/data/townships.geojson"],
  geometryKind: "choropleth",
  defaultVisible: true,
  available: true,
  interaction: { selectable: true, labelField: "name" },
  style: {
    kind: "choropleth",
    propertyKey: "commuteMinutes",
    buckets: [],
    baseOpacity: 0.2,
  },
};

const genericLayer: Layer = {
  id: "custom-points",
  label: "Custom points",
  dataSource: ["/data/custom.geojson"],
  geometryKind: "point",
  defaultVisible: true,
  available: true,
  interaction: {
    selectable: true,
    labelField: "name",
    popupFields: ["category", "openingHours"],
  },
  style: { kind: "point", color: "#000", radius: 5, legendLabel: "Custom" },
};

const townshipProperties = {
  id: "A",
  name: "Mamelodi",
  commuteMinutes: 62,
  nearestJobCenter: "Pretoria CBD",
  distanceKm: null,
  nearestTransitKm: null,
};

const genericProperties = {
  name: "Some Place",
  category: "museum",
  openingHours: "9am - 5pm",
};

function domainWith(...layers: Layer[]): DomainConfig {
  return { layers, layerGroups: [] };
}

describe("resolvePopupFields", () => {
  it("uses the dedicated township field builder for a feature from the townships layer", () => {
    const data: LayerDataMap = {
      townships: {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: null, properties: townshipProperties },
        ],
      },
    };

    const fields = resolvePopupFields(
      townshipProperties,
      domainWith(townshipLayer),
      data,
    );

    expect(fields.map((f) => f.key)).toContain("commuteMinutes");
  });

  it("uses the dedicated heritage-site field builder, formatting category via its display label", () => {
    const heritageLayer: Layer = {
      id: "heritage-sites",
      label: "Struggle heritage sites",
      dataSource: ["/data/heritage-sites.geojson"],
      geometryKind: "point",
      defaultVisible: true,
      available: true,
      interaction: {
        selectable: true,
        labelField: "name",
        popupFields: ["category", "summary"],
      },
      style: {
        kind: "point",
        color: "#000",
        radius: 5,
        legendLabel: "Heritage sites",
      },
    };
    const heritageProperties = {
      name: "Regina Mundi Church",
      category: "heritage-site",
      summary: "A refuge during police crackdowns.",
    };
    const data: LayerDataMap = {
      "heritage-sites": {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: null,
            properties: heritageProperties,
          },
        ],
      },
    };

    const fields = resolvePopupFields(
      heritageProperties,
      domainWith(heritageLayer),
      data,
    );
    const category = fields.find((f) => f.key === "category");

    expect(category?.formatValue?.("heritage-site")).toBe("Heritage site");
    expect(category?.formatValue?.("unknown-category")).toBe(
      "unknown-category",
    );
    expect(category?.formatValue?.(42)).toBe("");
  });

  it("checks each layer in order, skipping one whose data doesn't include the clicked properties", () => {
    const data: LayerDataMap = {
      "custom-points": {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: null,
            properties: { name: "Someone else", category: "other" },
          },
        ],
      },
      townships: {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: null, properties: townshipProperties },
        ],
      },
    };

    const fields = resolvePopupFields(
      townshipProperties,
      domainWith(genericLayer, townshipLayer),
      data,
    );

    expect(fields.map((f) => f.key)).toContain("commuteMinutes");
  });

  it("falls back to a generic field list built from interaction.popupFields for an unrecognised layer", () => {
    const data: LayerDataMap = {
      "custom-points": {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: null, properties: genericProperties },
        ],
      },
    };

    const fields = resolvePopupFields(
      genericProperties,
      domainWith(genericLayer),
      data,
    );

    expect(fields).toEqual([
      { key: "category", label: "Category" },
      { key: "openingHours", label: "Opening Hours" },
    ]);
  });

  it("returns no fields when the properties don't match any fetched layer's data", () => {
    const data: LayerDataMap = {};

    const fields = resolvePopupFields(
      genericProperties,
      domainWith(genericLayer),
      data,
    );

    expect(fields).toEqual([]);
  });

  it("returns an empty field list for a matched layer that declares no popupFields", () => {
    const layerWithNoPopupFields: Layer = {
      ...genericLayer,
      id: "bare",
      interaction: { selectable: true },
    };
    const data: LayerDataMap = {
      bare: {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: null, properties: genericProperties },
        ],
      },
    };

    const fields = resolvePopupFields(
      genericProperties,
      domainWith(layerWithNoPopupFields),
      data,
    );

    expect(fields).toEqual([]);
  });
});
