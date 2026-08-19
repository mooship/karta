import type { SelectableFeatureSearchEntry } from "@karta/map";
import { useMemo, useState } from "react";
import { getLayer, getLayers } from "../../layers/registry";
import { m } from "../../paraglide/messages.js";
import styles from "./FeatureBrowser.module.css";

interface FeatureBrowserProps {
  /** Every selectable feature currently reported by `MapView` (via `onSelectableFeaturesChange`), across all its selectable layers. */
  features: SelectableFeatureSearchEntry[];
  selectedFeatureId: string | null;
  /** Called with a feature's id when its row is chosen. */
  onSelect: (featureId: string) => void;
}

interface FeatureGroup {
  layerId: string;
  label: string;
  entries: SelectableFeatureSearchEntry[];
}

/**
 * Renders every selectable map feature as a filterable list grouped by the
 * layer it belongs to, so a visitor can find a named feature (a township, a
 * rail station, anything a domain marks `interaction.selectable`) without
 * already knowing where it sits on the map.
 * @remarks Domain-agnostic: it reads only `id`/`label`/`layerId` off each
 *   entry and resolves a group's heading from the current domain's own layer
 *   registry, so any `Layer` a domain marks selectable shows up here with no
 *   component-level change -- there is nothing here that assumes townships,
 *   or any other concrete domain. Clicking a row calls `onSelect` with that
 *   feature's id; the caller is expected to wire this to
 *   `useMapUiStore`'s `setSelectedFeatureId`, which `MapView`'s own
 *   `SelectedFeatureHighlight` already turns into a fly-to-and-open-popup, so
 *   this component owns no map interaction of its own. A group whose layer id
 *   isn't found in the registry (stale data outliving a domain's current
 *   layer catalogue) falls back to showing the raw id as its heading and
 *   sorts after every recognised group, rather than being dropped, matching
 *   `layers/registry.ts`'s own fall-back-rather-than-break translation
 *   convention. The filter box matches case-insensitively against each
 *   entry's `label` with a plain substring scan re-run on every keystroke,
 *   the same approach `LocationSearchControl` uses for its own feature
 *   search -- cheap even for a few thousand entries, and no debounce is
 *   needed since there's no network round trip.
 */
export function FeatureBrowser({
  features,
  selectedFeatureId,
  onSelect,
}: FeatureBrowserProps) {
  const [query, setQuery] = useState("");
  /**
   * @remarks Memoized with no dependencies, matching `LayerToggles`'s own
   *   `getLayerGroups()` memoization -- `getLayers()` re-runs the
   *   translation overlay on every call, but the active locale can't change
   *   without a full document reload, so re-deriving this on every unrelated
   *   re-render would just redo the same translation work for the same
   *   result.
   */
  const layerOrder = useMemo(() => getLayers().map((layer) => layer.id), []);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredFeatures = useMemo(() => {
    if (!trimmedQuery) {
      return features;
    }
    return features.filter((feature) =>
      feature.label.toLowerCase().includes(trimmedQuery),
    );
  }, [features, trimmedQuery]);

  const groups = useMemo<FeatureGroup[]>(() => {
    const byLayer = new Map<string, SelectableFeatureSearchEntry[]>();
    for (const feature of filteredFeatures) {
      const existing = byLayer.get(feature.layerId);
      if (existing) {
        existing.push(feature);
      } else {
        byLayer.set(feature.layerId, [feature]);
      }
    }
    const orderedLayerIds = [
      ...layerOrder.filter((layerId) => byLayer.has(layerId)),
      ...[...byLayer.keys()].filter((layerId) => !layerOrder.includes(layerId)),
    ];
    return orderedLayerIds.map((layerId) => {
      const entries = byLayer.get(layerId);
      /* v8 ignore next 3 -- unreachable: orderedLayerIds is built only from byLayer's own keys */
      if (!entries) {
        return { layerId, label: layerId, entries: [] };
      }
      return {
        layerId,
        label: getLayer(layerId)?.label ?? layerId,
        entries,
      };
    });
  }, [filteredFeatures, layerOrder]);

  return (
    <div className={styles.browser}>
      <label className={styles.filterLabel} htmlFor="feature-browser-filter">
        {m.feature_browser_filter_label()}
      </label>
      <input
        id="feature-browser-filter"
        type="search"
        className={styles.filterInput}
        placeholder={m.feature_browser_filter_placeholder()}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        data-testid="feature-browser-filter"
        data-e2e="feature-browser-filter"
      />
      {groups.length === 0 ? (
        <p className={styles.empty}>{m.feature_browser_empty()}</p>
      ) : (
        <div className={styles.groups}>
          {groups.map((group) => (
            <section key={group.layerId} aria-label={group.label}>
              <h3 className={styles.groupTitle}>{group.label}</h3>
              <ul className={styles.list}>
                {group.entries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className={styles.row}
                      aria-current={entry.id === selectedFeatureId}
                      data-testid={`feature-browser-item-${entry.id}`}
                      data-e2e={`feature-browser-item-${entry.id}`}
                      onClick={() => onSelect(entry.id)}
                    >
                      {entry.label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
