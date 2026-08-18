import type { DomainId } from "@karta/app";
import type { DomainStory, Layer, LayerGroup } from "@karta/core";
import { m } from "../paraglide/messages.js";

interface LayerText {
  label: () => string;
  description?: () => string;
  /** One translator per choropleth bucket, in the same order as `style.buckets`. */
  bucketLabels?: Array<() => string>;
}

/**
 * Per-domain, per-layer-id translation lookup, keyed first by `DomainId`
 * (`@karta/app`) and then to that domain's own layer ids — layer ids are
 * only unique *within* a domain, so a flat `Record<string, LayerText>`
 * would let two domains' same-named layers collide. `@karta/app` stays the
 * single source of truth for layer *structure* (ids, data sources,
 * styling, availability) in English; this table overlays *display text*
 * per locale, read from `packages/web/messages/`. An id with no entry here
 * (e.g. a layer added to `@karta/app` before its translation lands) simply
 * falls back to the English original in `localizeLayer` rather than
 * breaking.
 */
const LAYER_TEXT: Partial<Record<DomainId, Record<string, LayerText>>> = {
  "gauteng-spatial-legacy": {
    townships: {
      label: m.layer_townships_label,
      description: m.layer_townships_description,
      bucketLabels: [
        m.bucket_car_time_short,
        m.bucket_car_time_moderate,
        m.bucket_car_time_long,
        m.bucket_car_time_very_long,
      ],
    },
    "nearest-transit": {
      label: m.layer_nearest_transit_label,
      description: m.layer_nearest_transit_description,
      bucketLabels: [
        m.bucket_transit_distance_near,
        m.bucket_transit_distance_moderate,
        m.bucket_transit_distance_far,
        m.bucket_transit_distance_very_far,
      ],
    },
    "rapid-rail": { label: m.layer_rapid_rail_label },
    "bus-rapid-transit": { label: m.layer_bus_rapid_transit_label },
    "commuter-rail": { label: m.layer_commuter_rail_label },
    bus: { label: m.layer_bus_label },
  },
  "heritage-sites": {
    "heritage-sites": {
      label: m.layer_heritage_sites_label,
      description: m.layer_heritage_sites_description,
    },
  },
};

interface LayerGroupText {
  title: () => string;
  description?: () => string;
}

/** Per-domain, per-layer-group-id translation lookup, same shape and fallback behaviour as `LAYER_TEXT`. */
const LAYER_GROUP_TEXT: Partial<
  Record<DomainId, Record<string, LayerGroupText>>
> = {
  "gauteng-spatial-legacy": {
    "access-to-opportunity": {
      title: m.layer_group_access_to_opportunity_title,
      description: m.layer_group_access_to_opportunity_description,
    },
    "transit-networks": {
      title: m.layer_group_transit_networks_title,
    },
  },
  "heritage-sites": {
    heritage: { title: m.layer_group_heritage_title },
  },
};

/** Per-domain story translation lookup, same shape/fallback behaviour as `LAYER_TEXT`. */
const DOMAIN_STORY_TEXT: Partial<Record<DomainId, () => DomainStory>> = {
  "gauteng-spatial-legacy": () => ({
    title: m.domain_gauteng_spatial_legacy_story_title(),
    body: m.domain_gauteng_spatial_legacy_story_body(),
  }),
  "heritage-sites": () => ({
    title: m.domain_heritage_sites_story_title(),
    body: m.domain_heritage_sites_story_body(),
  }),
};

/** Per-domain switcher-label translation lookup, same shape/fallback behaviour as `LAYER_TEXT`. */
const DOMAIN_LABEL_TEXT: Partial<Record<DomainId, () => string>> = {
  "gauteng-spatial-legacy": m.domain_label_gauteng_spatial_legacy,
  "heritage-sites": m.domain_label_heritage_sites,
};

/**
 * Returns `layer` with its `label`/`description` translated to the current
 * locale, and — for a choropleth layer — each `style.buckets[].label`, or —
 * for a line/point layer — `style.legendLabel` mirroring the translated
 * `label` (the two are always identical in `@karta/app`'s English source).
 * `colorClassification`/`radiusClassification` stop labels are left
 * untouched: those are transit operators' actual brand names (e.g. "Rea
 * Vaya"), not descriptive copy, so they read the same in every locale.
 * @param domainId The layer's owning domain, used to resolve its
 *   translation entry — see `LAYER_TEXT`'s remarks for why this can't be a
 *   flat id-only lookup.
 * @remarks Must be called fresh per request/render, never cached at module
 *   scope — see `localizeStory`'s remarks for why.
 */
export function localizeLayer(domainId: string, layer: Layer): Layer {
  const text = LAYER_TEXT[domainId as DomainId]?.[layer.id];
  const label = text?.label() ?? layer.label;
  const description = text?.description?.() ?? layer.description;
  const base: Layer = { ...layer, label, description };

  if (base.style.kind === "choropleth" && text?.bucketLabels) {
    return {
      ...base,
      style: {
        ...base.style,
        buckets: base.style.buckets.map((bucket, index) => ({
          ...bucket,
          label: text.bucketLabels?.[index]?.() ?? bucket.label,
        })),
      },
    };
  }

  if (base.style.kind === "line" || base.style.kind === "point") {
    return { ...base, style: { ...base.style, legendLabel: label } };
  }

  return base;
}

/**
 * Returns `group` with its `title`/`description` translated to the current
 * locale, falling back to the English original for a domain/id pair with no
 * entry in `LAYER_GROUP_TEXT`.
 * @param domainId The layer group's owning domain — see `localizeLayer`'s `@param`.
 */
export function localizeLayerGroup(
  domainId: string,
  group: LayerGroup,
): LayerGroup {
  const text = LAYER_GROUP_TEXT[domainId as DomainId]?.[group.id];
  if (!text) {
    return group;
  }
  return {
    ...group,
    title: text.title(),
    description: text.description?.() ?? group.description,
  };
}

/**
 * Returns the domain's story copy translated to the current locale, or
 * `undefined` if the domain has none, or if `domainId` has no entry in
 * `DOMAIN_STORY_TEXT` (in which case `story` itself is returned untranslated,
 * matching `localizeLayer`/`localizeLayerGroup`'s fallback behaviour).
 * @param domainId The story's owning domain — see `localizeLayer`'s `@param`.
 * @remarks Must be called fresh per request/render: Cloudflare Workers reuse
 *   isolates across requests, so a value computed once at module scope
 *   would freeze in whichever locale first touched that isolate rather than
 *   reflecting each request's own.
 */
export function localizeStory(
  domainId: string,
  story: DomainStory | undefined,
): DomainStory | undefined {
  if (!story) {
    return undefined;
  }
  const text = DOMAIN_STORY_TEXT[domainId as DomainId];
  return text ? text() : story;
}

/**
 * Returns `domainId`'s display label translated to the current locale,
 * falling back to `fallback` (normally `DOMAINS`'s own English `label`,
 * from `@karta/app`) for a domain with no entry in `DOMAIN_LABEL_TEXT`.
 * Used by the domain switcher, which reads `DOMAINS` metadata directly
 * rather than a `RegisteredDomain`'s full layer catalogue.
 */
export function localizeDomainLabel(
  domainId: string,
  fallback: string,
): string {
  const text = DOMAIN_LABEL_TEXT[domainId as DomainId];
  return text ? text() : fallback;
}
