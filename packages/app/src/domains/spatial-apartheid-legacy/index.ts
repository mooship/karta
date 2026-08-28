import { SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS } from "./layerGroups";
import { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";

/**
 * Karta's reference domain: South Africa's apartheid-era spatial planning
 * legacy, currently covering Gauteng's metros and City of Cape Town. A
 * `DomainConfig` (`layers`/`layerGroups`/`story`) plus an `id` — the only
 * field beyond what `DomainConfig` itself requires.
 */
export const SPATIAL_APARTHEID_LEGACY_DOMAIN = {
  id: "spatial-apartheid-legacy",
  layers: SPATIAL_APARTHEID_LEGACY_LAYERS,
  layerGroups: SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS,
  story: {
    title: "Why this map exists",
    body: "South Africa's Group Areas Act (1950) didn't just segregate where people could live — it engineered distance as policy. Black, Coloured and Indian communities were forcibly removed from land near city centres and resettled on the urban periphery, often behind deliberate buffer strips of highway, industrial zoning, or vacant land, placing them furthest from the jobs and services those centres offered. That geography did not end with apartheid's laws in 1994: townships built as peripheries are still peripheries today. This map measures three parts of that legacy — modelled car time to major job centres, straight-line distance to the nearest formal transit route, and a combined score showing where both burdens compound — to make a policy decision's lasting shape visible, not just remembered.",
  },
};

export { SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS } from "./layerGroups";
export { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";
