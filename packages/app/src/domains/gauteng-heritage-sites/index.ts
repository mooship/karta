import { GAUTENG_HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";
import { GAUTENG_HERITAGE_SITES_LAYERS } from "./layers";

/**
 * Karta's second Gauteng domain: publicly documented anti-apartheid and
 * democracy heritage sites, plotted as points rather than the choropleth/
 * line layers `gauteng-spatial-legacy` uses.
 * @remarks Deliberately has no `data-pipeline` source — its one small,
 *   hand-curated `FeatureCollection` (`packages/web/public/data/gauteng-heritage-sites/heritage-sites.geojson`)
 *   needs no Overpass/OSRM fetching or routing, unlike `gauteng-spatial-legacy`'s
 *   transit and drive-time layers. It exists to prove the SDK's `DomainConfig`
 *   contract holds for a second, independently authored domain — built using
 *   only `@karta/core`'s exported types, with no id-based special-casing in
 *   `@karta/core`/`map`/`react` — not to be wired into `packages/web`'s
 *   currently single-domain app.
 */
export const GAUTENG_HERITAGE_SITES_DOMAIN = {
  id: "gauteng-heritage-sites",
  layers: GAUTENG_HERITAGE_SITES_LAYERS,
  layerGroups: GAUTENG_HERITAGE_SITES_LAYER_GROUPS,
  story: {
    title: "Why these sites matter",
    body: "Apartheid tried to erase Black political life from the map. The places where people organised, worshipped, were detained, and were killed for resisting it are still here — this layer plots the ones that are publicly documented and open to visit today.",
  },
};

export { GAUTENG_HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";
export { GAUTENG_HERITAGE_SITES_LAYERS } from "./layers";
