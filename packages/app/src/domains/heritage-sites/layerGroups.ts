import type { LayerGroup } from "@karta/core";

/**
 * The `heritage-sites` domain's layer groups: one independently toggleable
 * group holding the domain's single `heritage-sites` layer.
 */
export const HERITAGE_SITES_LAYER_GROUPS: LayerGroup[] = [
  {
    id: "heritage",
    title: "Heritage",
    selectionMode: "independent",
    layerIds: ["heritage-sites"],
  },
];
