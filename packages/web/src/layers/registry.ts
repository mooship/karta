import { getDomain } from "@karta/app";
import type { DomainConfig, DomainStory, Layer, LayerGroup } from "@karta/core";
import { createRegistry } from "@karta/core";
import {
  localizeLayer,
  localizeLayerGroup,
  localizeStory,
} from "./layerTranslations";

type DomainRegistry = ReturnType<typeof createRegistry>;

/**
 * One `createRegistry` instance per registered domain id, built lazily and
 * cached for the process's lifetime. Safe to persist across requests on a
 * reused Cloudflare Workers isolate — unlike the localized getters below,
 * what's cached here is only `@karta/app`'s locale-independent structure
 * (ids, data sources, styling, availability), identical for every request
 * regardless of which locale or domain a given request asks for.
 */
const registries = new Map<string, DomainRegistry>();

function resolveRegistry(domainId: string): DomainRegistry {
  const cached = registries.get(domainId);
  if (cached) {
    return cached;
  }
  const domain = getDomain(domainId);
  if (!domain) {
    throw new Error(`No domain registered with id "${domainId}".`);
  }
  const registry = createRegistry(domain);
  registries.set(domainId, registry);
  return registry;
}

/**
 * Returns every layer in the `domainId` domain, localized to the current
 * locale.
 * @throws If `domainId` isn't a registered domain id (see `@karta/app`'s `DOMAINS`).
 */
export function getLayers(domainId: string): readonly Layer[] {
  return resolveRegistry(domainId)
    .getLayers()
    .map((layer) => localizeLayer(domainId, layer));
}

/**
 * Returns the layer with the given id in the `domainId` domain, localized
 * to the current locale, or `undefined` if not found.
 * @throws If `domainId` isn't a registered domain id.
 */
export function getLayer(domainId: string, id: string): Layer | undefined {
  const layer = resolveRegistry(domainId).getLayer(id);
  return layer ? localizeLayer(domainId, layer) : undefined;
}

/**
 * Returns every layer group in the `domainId` domain, localized to the
 * current locale.
 * @throws If `domainId` isn't a registered domain id.
 */
export function getLayerGroups(domainId: string): readonly LayerGroup[] {
  return resolveRegistry(domainId)
    .getLayerGroups()
    .map((group) => localizeLayerGroup(domainId, group));
}

/**
 * Returns every layer group's structural fields (`id`, `layerIds`,
 * `selectionMode`) without applying the translation overlay. `title`/
 * `description` come back in English regardless of locale — prefer
 * `getLayerGroups()` for anything user-facing; this exists for callers
 * (e.g. group-membership checks) that only need structure, so they don't
 * pay for translation work whose result they'd never read.
 * @throws If `domainId` isn't a registered domain id.
 */
export function getLayerGroupStructure(
  domainId: string,
): readonly LayerGroup[] {
  return resolveRegistry(domainId).getLayerGroups();
}

/**
 * Returns every layer's structural fields (`id`, `defaultVisible`,
 * `dataSource`, etc.) without applying the translation overlay. `label`/
 * `description`/choropleth bucket labels come back in English regardless of
 * locale — prefer `getLayers()` for anything user-facing; this exists for
 * callers (e.g. `defaultVisible` id lookups) that only need structure, so
 * they don't pay for translation work whose result they'd never read.
 * @throws If `domainId` isn't a registered domain id.
 */
export function getLayerStructure(domainId: string): readonly Layer[] {
  return resolveRegistry(domainId).getLayers();
}

/**
 * Returns the `domainId` domain's story copy localized to the current
 * locale, or `undefined` if it has none.
 * @throws If `domainId` isn't a registered domain id.
 */
export function getStory(domainId: string): DomainStory | undefined {
  return localizeStory(domainId, resolveRegistry(domainId).getStory());
}

/**
 * Composes `getLayers`/`getLayerGroups`/`getStory` into the `DomainConfig`
 * shape `DomainProvider` (`@karta/map`) wants, in one call. Callers should
 * prefer this over importing the individual getters directly — `App`
 * resolves it once per request from the active route's `domainId` and
 * everything downstream (`LayerToggles`, `useMapPermalink`,
 * `useMapModelContextTools`) reads it back out via `useDomain()` instead of
 * naming a `domainId` of its own.
 * @throws If `domainId` isn't a registered domain id.
 */
export function getLocalizedDomain(domainId: string): DomainConfig {
  return {
    layers: getLayers(domainId),
    layerGroups: getLayerGroups(domainId),
    story: getStory(domainId),
  };
}
