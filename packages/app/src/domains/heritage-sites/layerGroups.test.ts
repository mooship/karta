import { describe, expect, it } from "vitest";
import { expectLayerGroupsReferenceKnownLayers } from "../testUtils";
import { HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";
import { HERITAGE_SITES_LAYERS } from "./layers";

describe("HERITAGE_SITES_LAYER_GROUPS", () => {
  it("only references layer ids that actually exist in HERITAGE_SITES_LAYERS", () => {
    expectLayerGroupsReferenceKnownLayers(
      HERITAGE_SITES_LAYERS,
      HERITAGE_SITES_LAYER_GROUPS,
    );
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
