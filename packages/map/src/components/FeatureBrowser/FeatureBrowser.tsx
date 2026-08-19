import { memo, useMemo, useState } from "react";
import { useDomain } from "../../context/DomainContext";
import {
  matchesFeatureLabel,
  type SelectableFeatureSearchEntry,
} from "../LocationSearchControl/LocationSearchControl";
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

const FILTER_LABEL = "Filter features";
const FILTER_PLACEHOLDER = "Search by name";
const EMPTY_MESSAGE = "Nothing matched that search.";

function FeatureBrowserComponent({
  features,
  selectedFeatureId,
  onSelect,
}: FeatureBrowserProps) {
  const { getLayer, getLayers } = useDomain();
  const [query, setQuery] = useState("");
  const layerOrder = useMemo(
    () => getLayers().map((layer) => layer.id),
    [getLayers],
  );

  const trimmedQuery = query.trim();
  const filteredFeatures = useMemo(() => {
    if (!trimmedQuery) {
      return features;
    }
    return features.filter((feature) =>
      matchesFeatureLabel(feature, trimmedQuery),
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
    const knownLayerIds = new Set(layerOrder);
    const orderedLayerIds = [
      ...layerOrder.filter((layerId) => byLayer.has(layerId)),
      ...[...byLayer.keys()].filter((layerId) => !knownLayerIds.has(layerId)),
    ];
    return orderedLayerIds.map((layerId) => ({
      layerId,
      label: getLayer(layerId)?.label ?? layerId,
      // orderedLayerIds is built only from byLayer's own keys, so this is always present.
      entries: byLayer.get(layerId) as SelectableFeatureSearchEntry[],
    }));
  }, [filteredFeatures, layerOrder, getLayer]);

  return (
    <div className={styles.browser}>
      <label className={styles.filterLabel} htmlFor="feature-browser-filter">
        {FILTER_LABEL}
      </label>
      <input
        id="feature-browser-filter"
        type="search"
        className={styles.filterInput}
        placeholder={FILTER_PLACEHOLDER}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        data-testid="feature-browser-filter"
        data-e2e="feature-browser-filter"
      />
      {groups.length === 0 ? (
        <p className={styles.empty}>{EMPTY_MESSAGE}</p>
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

/**
 * Renders every selectable map feature as a filterable list grouped by the
 * layer it belongs to, so a visitor can find a named feature (a township, a
 * rail station, anything a domain marks `interaction.selectable`) without
 * already knowing where it sits on the map.
 * @remarks Domain-agnostic: it reads the current `DomainRegistry` via
 *   `useDomain()` (so it must be rendered inside a `DomainProvider`, same
 *   requirement as `Legend`/`MapView`) purely to resolve a `layerId` to that
 *   layer's `label` and to order groups the same way the registry orders its
 *   layers -- nothing here assumes townships, or any other concrete domain.
 *   Clicking a row calls `onSelect` with that feature's id; the caller is
 *   expected to wire this to its own selected-feature state (e.g.
 *   `useMapUiStore`'s `setSelectedFeatureId` in the reference app), which
 *   `MapView`'s own `SelectedFeatureHighlight` already turns into a
 *   fly-to-and-open-popup, so this component owns no map interaction of its
 *   own. A group whose layer id isn't found in the registry (stale data
 *   outliving a domain's current layer catalogue) falls back to showing the
 *   raw id as its heading and sorts after every recognised group, rather
 *   than being dropped. The filter box matches case-insensitively against
 *   each entry's `label` via `matchesFeatureLabel`, the same predicate
 *   `LocationSearchControl` uses for its own feature search -- cheap even
 *   for a few thousand entries, and no debounce is needed since there's no
 *   network round trip. Its own copy (filter label/placeholder, empty-state
 *   message) is hardcoded English, like every other component in this
 *   package: `packages/map` can't depend on an app-specific message
 *   catalogue, so an app rendering this alongside its own translated UI
 *   (see the reference app's "Browse" tab heading, which stays app-level
 *   copy) accepts this one control's chrome staying English, the same
 *   trade-off `LocationSearchControl` already makes. Memoized, matching
 *   `LayerToggles`'s own `memo()` wrapper, since it can render hundreds of
 *   rows and shares a parent that re-renders on unrelated UI state (e.g. a
 *   mobile drag-sheet's per-frame updates in the reference app).
 */
export const FeatureBrowser = memo(FeatureBrowserComponent);
