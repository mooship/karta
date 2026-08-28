import { SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS } from "./layerGroups";
import { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";

/**
 * Karta's reference domain: South Africa's apartheid-era spatial planning
 * legacy, currently covering Gauteng's metros. A `DomainConfig`
 * (`layers`/`layerGroups`/`story`) plus an `id` — the only field beyond what
 * `DomainConfig` itself requires.
 */
export const SPATIAL_APARTHEID_LEGACY_DOMAIN = {
  id: "spatial-apartheid-legacy",
  layers: SPATIAL_APARTHEID_LEGACY_LAYERS,
  layerGroups: SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS,
  story: {
    title: "Why this map exists",
    body: "Apartheid law controlled where Black, Coloured and Indian people could live. Black townships were deliberately separated from economic centres, and those distances still shape access to work today. This map measures that gap with modelled car time and distance to transit.",
  },
};

export { SPATIAL_APARTHEID_LEGACY_LAYER_GROUPS } from "./layerGroups";
export { SPATIAL_APARTHEID_LEGACY_LAYERS } from "./layers";
