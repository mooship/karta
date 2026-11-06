import { SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS } from "./layerGroups";
import { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";

/**
 * Karta's reference domain: South Africa's apartheid-era spatial planning
 * legacy, currently covering Gauteng's metros and City of Cape Town. A
 * `DomainConfig` (`layers`/`layerGroups`/`story`) plus an `id`, the only
 * field beyond what `DomainConfig` itself requires.
 */
export const SPATIAL_APARTHEID_LEGACY_DOMAIN = {
  id: "spatial-apartheid-legacy",
  layers: SPATIAL_APARTHEID_LEGACY_LAYERS,
  layerGroups: SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS,
  story: {
    title: "Why this map exists",
    body: "South Africa's Group Areas Act (1950) segregated where people could live and used distance as policy. Black, Coloured and Indian communities were forcibly removed from land near city centres and resettled on the urban periphery, often behind buffer strips of highway, industrial zoning or vacant land, far from the jobs and services in those centres. Apartheid's laws ended in 1994, but the townships built on the periphery are still there. This map shows modelled car time to major job centres, straight-line distance to the nearest formal transit route, and a combined score for areas where both are high.",
  },
};

export { SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS } from "./layerGroups";
export { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";
