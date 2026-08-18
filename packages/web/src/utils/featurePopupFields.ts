import type { DomainConfig, Layer } from "@karta/core";
import type { FeaturePopupField, LayerDataMap } from "@karta/map";
import { m } from "../paraglide/messages.js";
import { getTownshipPopupFields } from "./townshipPopupFields";

/**
 * Display labels for `heritage-sites`' `category` classification values,
 * kept in sync with that layer's own `colorClassification.stops[].label`
 * (`packages/app/src/domains/heritage-sites/layers.ts`) so the popup and
 * the map legend agree on the same wording for the same category.
 */
const HERITAGE_CATEGORY_LABELS: Record<string, string> = {
  memorial: "Memorial",
  museum: "Museum",
  "heritage-site": "Heritage site",
};

/** Field configuration for a selected heritage site's popup content. */
function getHeritageSitePopupFields(): FeaturePopupField[] {
  return [
    {
      key: "category",
      label: m.heritage_popup_category(),
      formatValue: (value) =>
        typeof value === "string"
          ? (HERITAGE_CATEGORY_LABELS[value] ?? value)
          : "",
    },
    {
      key: "summary",
      label: m.heritage_popup_summary(),
    },
  ];
}

/** Per-layer-id popup field builders for a layer with bespoke, richly-formatted popup content. */
const POPUP_FIELD_BUILDERS: Record<string, () => FeaturePopupField[]> = {
  townships: getTownshipPopupFields,
  "heritage-sites": getHeritageSitePopupFields,
};

/** Turns a camelCase or kebab-case property key into a readable English label, e.g. `openingHours` → "Opening Hours". */
function humanizeKey(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, "$1 $2").split(/[-_\s]+/);
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Builds a generic field list for a layer with no dedicated popup field
 * builder, from its own `interaction.popupFields` — each field's label is
 * just its property key, humanized. Not localized: a layer that wants
 * translated labels or per-field formatting supplies its own builder in
 * `POPUP_FIELD_BUILDERS` instead.
 */
function buildGenericPopupFields(layer: Layer): FeaturePopupField[] {
  return (layer.interaction?.popupFields ?? []).map((key) => ({
    key,
    label: humanizeKey(key),
  }));
}

/**
 * Per-`data`-object index from a feature's `properties` reference back to
 * its source `Layer`, cached so repeated popup clicks against the same
 * fetched `data` don't each re-scan every layer's full feature array.
 * @remarks Keyed on `data` (a `WeakMap`, so a stale entry is collected once
 *   `useLayerData` produces a fresh `LayerDataMap`) rather than threaded
 *   through as a `useMemo` in `App.tsx` — this keeps the optimization local
 *   to this module instead of growing `App.tsx`'s already-large body, and is
 *   safe module-scope state here (unlike `layers/registry.ts`'s per-request
 *   getters) since this file only ever runs client-side, in the popup
 *   binding `MapView` sets up on first click, never during SSR.
 */
const layerIndexCache = new WeakMap<
  LayerDataMap,
  WeakMap<Record<string, unknown>, Layer>
>();

/** Builds (or returns the cached) `data`-scoped properties→layer index for `domain`. */
function getLayerIndex(
  domain: DomainConfig,
  data: LayerDataMap,
): WeakMap<Record<string, unknown>, Layer> {
  const cached = layerIndexCache.get(data);
  if (cached) {
    return cached;
  }
  const index = new WeakMap<Record<string, unknown>, Layer>();
  for (const layer of domain.layers) {
    const collection = data[layer.id];
    if (!collection) {
      continue;
    }
    for (const feature of collection.features) {
      if (feature.properties) {
        index.set(feature.properties, layer);
      }
    }
  }
  layerIndexCache.set(data, index);
  return index;
}

/**
 * Resolves the `FeaturePopupField[]` for a clicked feature's `properties`,
 * by finding which of `domain`'s layers' fetched data (`data`) that exact
 * properties object came from.
 * @remarks `MapView` hands `renderFeaturePopup` a feature's `properties`
 *   with no layer context of its own, so this matches it back to a layer via
 *   `getLayerIndex`'s cached reference-equality index over
 *   `data[layer.id].features[].properties` — safe because that data flows
 *   straight from `useLayerData`'s fetch through to `MapView`'s `GeoJSON`
 *   with no cloning in between. A layer with a dedicated builder in
 *   `POPUP_FIELD_BUILDERS` (bespoke formatting, localized labels) uses that;
 *   any other layer falls back to a generic field list built from its own
 *   `interaction.popupFields`, so a new domain gets a working popup purely
 *   from config. Properties matching no fetched layer (e.g. already
 *   unmounted) yield no fields.
 */
export function resolvePopupFields(
  properties: Record<string, unknown>,
  domain: DomainConfig,
  data: LayerDataMap,
): FeaturePopupField[] {
  const layer = getLayerIndex(domain, data).get(properties);
  if (!layer) {
    return [];
  }
  return (
    POPUP_FIELD_BUILDERS[layer.id] ?? (() => buildGenericPopupFields(layer))
  )();
}
