import { describe, expect, it } from "vitest";
import { GAUTENG_HERITAGE_SITES_LAYERS } from "./layers";

describe("GAUTENG_HERITAGE_SITES_LAYERS", () => {
  it("has exactly the one heritage-sites point layer", () => {
    expect(GAUTENG_HERITAGE_SITES_LAYERS.map((l) => l.id)).toEqual([
      "heritage-sites",
    ]);
  });

  it("matches the heritage-sites point layer's configuration", () => {
    const layer = GAUTENG_HERITAGE_SITES_LAYERS.find(
      (l) => l.id === "heritage-sites",
    );
    if (!layer) {
      throw new Error("expected heritage-sites layer");
    }
    expect(layer.label).toBe("Struggle heritage sites");
    expect(layer.geometryKind).toBe("point");
    expect(layer.defaultVisible).toBe(true);
    expect(layer.available).toBe(true);
    expect(layer.dataSource).toEqual([
      "/data/gauteng-heritage-sites/heritage-sites.geojson",
    ]);
    expect(layer.interaction).toEqual({
      selectable: true,
      labelField: "name",
      popupFields: ["category", "summary"],
    });

    const style = layer.style;
    if (style.kind !== "point") {
      throw new Error("expected point style");
    }
    expect(style.legendLabel).toBe("Struggle heritage sites");
    expect(style.color).toBe("#3673B8");
    expect(style.radius).toBe(7);
    expect(style.colorClassification).toEqual({
      kind: "categorized",
      propertyKey: "category",
      stops: [
        { match: "memorial", value: "#C1502E", label: "Memorial" },
        { match: "museum", value: "#3673B8", label: "Museum" },
        { match: "heritage-site", value: "#7A9B6E", label: "Heritage site" },
      ],
      fallback: "#3673B8",
    });
  });
});
