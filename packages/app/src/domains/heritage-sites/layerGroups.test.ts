import { describe, expect, it } from "vitest";
import { HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";
import { HERITAGE_SITES_LAYERS } from "./layers";

describe("HERITAGE_SITES_LAYER_GROUPS", () => {
  it("only references layer ids that actually exist in HERITAGE_SITES_LAYERS", () => {
    const layerIds = HERITAGE_SITES_LAYERS.map((layer) => layer.id);
    for (const group of HERITAGE_SITES_LAYER_GROUPS) {
      for (const layerId of group.layerIds) {
        expect(layerIds).toContain(layerId);
      }
    }
  });

  it("defines a single independent heritage group", () => {
    expect(HERITAGE_SITES_LAYER_GROUPS).toEqual([
      {
        id: "heritage",
        title: "Heritage",
        selectionMode: "independent",
        layerIds: ["heritage-sites"],
      },
    ]);
  });
});
