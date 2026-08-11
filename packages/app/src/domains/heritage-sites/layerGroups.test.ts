import { describe, expect, it } from "vitest";
import { HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";

describe("HERITAGE_SITES_LAYER_GROUPS", () => {
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
