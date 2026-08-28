import { HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";
import { HERITAGE_SITES_LAYERS } from "./layers";

/**
 * Karta's second domain: publicly documented anti-apartheid and democracy
 * heritage sites across South Africa, plotted as points rather than the
 * choropleth/line layers `spatial-apartheid-legacy` uses. Unlike
 * `spatial-apartheid-legacy`, it is national rather than province-scoped —
 * proof that `DomainConfig`/`Layer` carry no notion of region or metro,
 * only whatever geographic scope a domain's own data happens to cover.
 * @remarks Deliberately has no `data-pipeline` source — its one small,
 *   hand-curated `FeatureCollection` (`packages/web/public/data/heritage-sites/heritage-sites.geojson`)
 *   needs no Overpass/OSRM fetching or routing, unlike `spatial-apartheid-legacy`'s
 *   transit and drive-time layers. It exists to prove the SDK's `DomainConfig`
 *   contract holds for a second, independently authored domain — built using
 *   only `@karta/core`'s exported types, with no id-based special-casing in
 *   `@karta/core`/`map`/`react` — not to be wired into `packages/web`'s
 *   currently single-domain app.
 */
export const HERITAGE_SITES_DOMAIN = {
  id: "heritage-sites",
  layers: HERITAGE_SITES_LAYERS,
  layerGroups: HERITAGE_SITES_LAYER_GROUPS,
  story: {
    title: "Why these sites matter",
    body: "Apartheid tried to erase Black political life from the map. The places where people organised, worshipped, were detained, and were killed for resisting it are still here — this layer plots the ones that are publicly documented and open to visit today.",
  },
};

export { HERITAGE_SITES_LAYER_GROUPS } from "./layerGroups";
export { HERITAGE_SITES_LAYERS } from "./layers";
