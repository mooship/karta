import type { DomainStory, Layer, LayerGroup } from "@karta/core";
import { m } from "../paraglide/messages.js";

interface LayerText {
  label: () => string;
  description?: () => string;
  /** One translator per choropleth bucket, in the same order as `style.buckets`. */
  bucketLabels?: Array<() => string>;
}

/**
 * Per-layer-id translation lookup, keyed to `SPATIAL_APARTHEID_LEGACY_LAYERS`'
 * ids in `@karta/app`. `@karta/app` stays the single source of truth for
 * layer *structure* (ids, data sources, styling, availability) in English;
 * this table overlays *display text* per locale, read from
 * `packages/web/messages/`. An id with no entry here (e.g. a layer added to
 * `@karta/app` before its translation lands) simply falls back to the
 * English original in `localizeLayer` rather than breaking.
 */
const LAYER_TEXT: Record<string, LayerText> = {
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
  "spatial-burden": {
    label: m.layer_spatial_burden_label,
    description: m.layer_spatial_burden_description,
    bucketLabels: [
      m.bucket_spatial_burden_low,
      m.bucket_spatial_burden_moderate,
      m.bucket_spatial_burden_high,
      m.bucket_spatial_burden_severe,
    ],
  },
  "rapid-rail": { label: m.layer_rapid_rail_label },
  "bus-rapid-transit": { label: m.layer_bus_rapid_transit_label },
  "commuter-rail": { label: m.layer_commuter_rail_label },
  bus: { label: m.layer_bus_label },
};

interface LayerGroupText {
  title: () => string;
  description?: () => string;
}

/** Per-layer-group-id translation lookup, same fallback behaviour as `LAYER_TEXT`. */
const LAYER_GROUP_TEXT: Record<string, LayerGroupText> = {
  "access-to-opportunity": {
    title: m.layer_group_access_to_opportunity_title,
    description: m.layer_group_access_to_opportunity_description,
  },
  "transit-networks": {
    title: m.layer_group_transit_networks_title,
  },
};

/**
 * Returns `layer` with its `label`/`description` translated to the current
 * locale, and — for a choropleth layer — each `style.buckets[].label`, or —
 * for a line/point layer — `style.legendLabel` mirroring the translated
 * `label` (the two are always identical in `@karta/app`'s English source).
 * `colorClassification`/`radiusClassification` stop labels are left
 * untouched: those are transit operators' actual brand names (e.g. "Rea
 * Vaya"), not descriptive copy, so they read the same in every locale.
 * @remarks Must be called fresh per request/render, never cached at module
 *   scope — see `localizeStory`'s remarks for why.
 */
export function localizeLayer(layer: Layer): Layer {
  const text = LAYER_TEXT[layer.id];
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
 * locale, falling back to the English original for an id with no entry in
 * `LAYER_GROUP_TEXT`.
 */
export function localizeLayerGroup(group: LayerGroup): LayerGroup {
  const text = LAYER_GROUP_TEXT[group.id];
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
 * `undefined` if the domain has none.
 * @remarks Only one domain is published today, so this reads a single
 *   `domain_story_title`/`domain_story_body` message pair rather than a
 *   per-domain-id lookup like `LAYER_TEXT`/`LAYER_GROUP_TEXT` — extend this
 *   to a lookup if a second domain ships. Must be called fresh per
 *   request/render: Cloudflare Workers reuse isolates across requests, so a
 *   value computed once at module scope would freeze in whichever locale
 *   first touched that isolate rather than reflecting each request's own.
 */
export function localizeStory(
  story: DomainStory | undefined,
): DomainStory | undefined {
  if (!story) {
    return undefined;
  }
  return { title: m.domain_story_title(), body: m.domain_story_body() };
}
