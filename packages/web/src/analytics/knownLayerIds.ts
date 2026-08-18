import { DOMAINS, getDomain } from "@karta/app";

/**
 * Every layer id published by any registered domain, deduplicated.
 * @remarks The set `/api/layer-usage` validates an incoming event's
 *   `layerId` against — layer ids are only unique *within* a domain, so
 *   this is deliberately the union across all of them rather than one
 *   domain's alone, since a usage-tracking request carries no domain
 *   context of its own to narrow it further.
 */
export function getAllKnownLayerIds(): string[] {
  const ids = new Set<string>();
  for (const definition of DOMAINS) {
    const domain = getDomain(definition.id);
    /* v8 ignore next 3 -- unreachable: every DOMAINS entry has a matching getDomain result, guarded by domains.test.ts's own parity check */
    if (!domain) {
      continue;
    }
    for (const layer of domain.layers) {
      ids.add(layer.id);
    }
  }
  return [...ids];
}

/**
 * `getAllKnownLayerIds()`'s result, computed once at module load rather
 * than per request. Safe to cache at module scope — unlike `layers/registry.ts`'s
 * per-request-locale getters, `DOMAINS`/`getDomain` read only hardcoded,
 * locale-independent structure, so this can't go stale across requests on a
 * reused Cloudflare Workers isolate.
 */
export const ALL_KNOWN_LAYER_IDS: readonly string[] = getAllKnownLayerIds();
