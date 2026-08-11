import { GAUTENG_SPATIAL_LEGACY_DOMAIN } from "@karta/app";
import type { DomainStory, Layer, LayerGroup } from "@karta/core";
import { createRegistry } from "@karta/core";
import {
  localizeLayer,
  localizeLayerGroup,
  localizeStory,
} from "./layerTranslations";

/**
 * Wraps `@karta/app`'s English `GAUTENG_SPATIAL_LEGACY_DOMAIN` — safe to
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
const registry = createRegistry(GAUTENG_SPATIAL_LEGACY_DOMAIN);

/** Returns every layer in the `gauteng-spatial-legacy` domain, localized to the current locale. */
export function getLayers(): readonly Layer[] {
  return registry.getLayers().map(localizeLayer);
}

/** Returns the layer with the given id, localized to the current locale, or `undefined` if not found. */
export function getLayer(id: string): Layer | undefined {
  const layer = registry.getLayer(id);
  return layer ? localizeLayer(layer) : undefined;
}

/** Returns every layer group in the `gauteng-spatial-legacy` domain, localized to the current locale. */
export function getLayerGroups(): readonly LayerGroup[] {
  return registry.getLayerGroups().map(localizeLayerGroup);
}

/** Returns the `gauteng-spatial-legacy` domain's story copy localized to the current locale, or `undefined` if it has none. */
export function getStory(): DomainStory | undefined {
  return localizeStory(registry.getStory());
}
