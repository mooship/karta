import type { LayerGroup } from "@karta/core";

/**
 * The `spatial-apartheid-legacy` domain's layer groups: the two accessibility
 * choropleth layers as a mutually-exclusive group (only one shown at a
 * time), and every transit network layer as an independently-toggleable
 * group.
 * @remarks `readonly`/`as const`, matching `METROS`/`REGIONS`: Cloudflare
 *   Workers reuse isolates across requests, so an in-place mutation by any
 *   downstream consumer would otherwise leak across unrelated requests for
 *   the isolate's lifetime.
 */
export const SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS: readonly LayerGroup[] = [
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
] as const satisfies readonly LayerGroup[];
