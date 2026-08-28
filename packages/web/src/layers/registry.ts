import { SPATIAL_APARTHEID_LEGACY_DOMAIN } from "@karta/app";
import type { DomainStory, Layer, LayerGroup } from "@karta/core";
import { createRegistry } from "@karta/core";
import {
  localizeLayer,
  localizeLayerGroup,
  localizeStory,
} from "./layerTranslations";

/**
 * Wraps `@karta/app`'s English `SPATIAL_APARTHEID_LEGACY_DOMAIN` — safe to
 * build once at module scope since it holds only locale-independent
 * structure (ids, data sources, styling, availability). Every getter below
 * applies `packages/web`'s own translation overlay (`layerTranslations.ts`)
 * to this registry's output *at call time*, so the display text it returns
 * always matches the current request's locale rather than whichever locale
 * happened to be active when this module first loaded — Cloudflare Workers
 * reuse isolates across requests, so baking translated text into a
 * module-scope value would leak one request's locale into every other
 * request handled by that isolate.
 */
const registry = createRegistry(SPATIAL_APARTHEID_LEGACY_DOMAIN);

/** Returns every layer in the `spatial-apartheid-legacy` domain, localized to the current locale. */
export function getLayers(): readonly Layer[] {
  return registry.getLayers().map(localizeLayer);
}

/** Returns the layer with the given id, localized to the current locale, or `undefined` if not found. */
export function getLayer(id: string): Layer | undefined {
  const layer = registry.getLayer(id);
  return layer ? localizeLayer(layer) : undefined;
}

/** Returns every layer group in the `spatial-apartheid-legacy` domain, localized to the current locale. */
export function getLayerGroups(): readonly LayerGroup[] {
  return registry.getLayerGroups().map(localizeLayerGroup);
}

/**
 * Returns every layer group's structural fields (`id`, `layerIds`,
 * `selectionMode`) without applying the translation overlay. `title`/
 * `description` come back in English regardless of locale — prefer
 * `getLayerGroups()` for anything user-facing; this exists for callers
 * (e.g. group-membership checks) that only need structure, so they don't
 * pay for translation work whose result they'd never read.
 */
export function getLayerGroupStructure(): readonly LayerGroup[] {
  return registry.getLayerGroups();
}

/**
 * Returns every layer's structural fields (`id`, `defaultVisible`,
 * `dataSource`, etc.) without applying the translation overlay. `label`/
 * `description`/choropleth bucket labels come back in English regardless of
 * locale — prefer `getLayers()` for anything user-facing; this exists for
 * callers (e.g. `defaultVisible` id lookups) that only need structure, so
 * they don't pay for translation work whose result they'd never read.
 */
export function getLayerStructure(): readonly Layer[] {
  return registry.getLayers();
}

/** Returns the `spatial-apartheid-legacy` domain's story copy localized to the current locale, or `undefined` if it has none. */
export function getStory(): DomainStory | undefined {
  return localizeStory(registry.getStory());
}
