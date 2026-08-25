import type { LayerGroup } from "@karta/core";

/**
 * The `gauteng-spatial-legacy` domain's layer groups: the two accessibility
 * choropleth layers as a mutually-exclusive group (only one shown at a
 * time), and every transit network layer as an independently-toggleable
 * group.
 * @remarks `readonly`/`as const`, matching `METROS`/`REGIONS`: Cloudflare
 *   Workers reuse isolates across requests, so an in-place mutation by any
 *   downstream consumer would otherwise leak across unrelated requests for
 *   the isolate's lifetime.
 */
export const GAUTENG_SPATIAL_LEGACY_LAYER_GROUPS: readonly LayerGroup[] = [
  {
    id: "access-to-opportunity",
    title: "Accessibility overlays",
    description: "Only one overlay can be active at a time.",
    selectionMode: "exclusive",
    layerIds: ["townships", "nearest-transit"],
  },
  {
    id: "transit-networks",
    title: "Transit networks",
    selectionMode: "independent",
    layerIds: ["rapid-rail", "bus-rapid-transit", "commuter-rail", "bus"],
  },
  {
    id: "transport-costs",
    title: "Transport costs",
    selectionMode: "independent",
    layerIds: ["tollgates"],
  },
] as const satisfies readonly LayerGroup[];
