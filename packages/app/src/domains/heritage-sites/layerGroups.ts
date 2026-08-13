import type { LayerGroup } from "@karta/core";

/**
 * The `heritage-sites` domain's layer groups: one independently toggleable
 * group holding the domain's single `heritage-sites` layer.
 * @remarks `readonly`/`as const`, matching `METROS`/`REGIONS`: Cloudflare
 *   Workers reuse isolates across requests, so an in-place mutation by any
 *   downstream consumer would otherwise leak across unrelated requests for
 *   the isolate's lifetime.
 */
export const HERITAGE_SITES_LAYER_GROUPS: readonly LayerGroup[] = [
  {
    id: "heritage",
    title: "Heritage",
    selectionMode: "independent",
    layerIds: ["heritage-sites"],
  },
] as const satisfies readonly LayerGroup[];
