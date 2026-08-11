import { describe, expect, it } from "vitest";
import { GAUTENG_HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";

describe("GAUTENG_HERITAGE_SITES_LAYER_GROUPS", () => {
  it("defines a single independent heritage group", () => {
    expect(GAUTENG_HERITAGE_SITES_LAYER_GROUPS).toEqual([
      {
        id: "heritage",
        title: "Heritage",
        selectionMode: "independent",
        layerIds: ["heritage-sites"],
      },
    ]);
  });
});
