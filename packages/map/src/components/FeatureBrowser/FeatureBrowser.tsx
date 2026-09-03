import { memo, useMemo, useState } from "react";
import { useDomain } from "../../context/DomainContext";
import {
  matchesFeatureLabel,
  type SelectableFeatureSearchEntry,
} from "../LocationSearchControl/LocationSearchControl";
import * as styles from "./FeatureBrowser.css";

interface FeatureBrowserProps {
  /** Every selectable feature currently reported by `MapView` (via `onSelectableFeaturesChange`), across all its selectable layers. */
  features: SelectableFeatureSearchEntry[];
  selectedFeatureId: string | null;
  /** Called with a feature's id when its row is chosen. */
  onSelect: (featureId: string) => void;
  /** Visible text of the filter input's own `<label>`. Defaults to `"Filter features"`. */
  filterLabel?: string;
  /** Filter input placeholder text. Defaults to `"Search by name"`. */
  filterPlaceholder?: string;
  /** Message shown when nothing matches the filter. Defaults to `"Nothing matched that search."`. */
  emptyMessage?: string;
}

interface FeatureGroup {
  layerId: string;
  label: string;
  entries: SelectableFeatureSearchEntry[];
}

const DEFAULT_FILTER_LABEL = "Filter features";
const DEFAULT_FILTER_PLACEHOLDER = "Search by name";
const DEFAULT_EMPTY_MESSAGE = "Nothing matched that search.";

function FeatureBrowserComponent({
  features,
  selectedFeatureId,
  onSelect,
  filterLabel = DEFAULT_FILTER_LABEL,
  filterPlaceholder = DEFAULT_FILTER_PLACEHOLDER,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
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
        {filterLabel}
      </label>
      <input
        id="feature-browser-filter"
        type="search"
        className={styles.filterInput}
        placeholder={filterPlaceholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        data-testid="feature-browser-filter"
        data-e2e="feature-browser-filter"
      />
      {groups.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <div className={styles.groups}>
          {groups.map((group) => (
            <section key={group.layerId} aria-label={group.label}>
              <h3 className={styles.groupTitle}>{group.label}</h3>
              <ul className={styles.list}>
                {group.entries.map((entry) => (
                  <li key={entry.id} className={styles.listItem}>
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
 *   network round trip. Its own copy (`filterLabel`, `filterPlaceholder`,
 *   `emptyMessage`) is an overridable prop defaulting to English, the same
 *   pattern `LocationSearchControl` uses: this package can't depend on an
 *   app-specific message catalogue, but a caller with one (like the
 *   reference app's paraglide messages, alongside its own app-level
 *   "Browse" tab heading) can still localise every string this control
 *   renders. Memoized, matching
 *   `LayerToggles`'s own `memo()` wrapper, since it can render thousands of
 *   rows (one per selectable feature, e.g. every township in a region) and
 *   shares a parent that re-renders on unrelated UI state (e.g. a mobile
 *   drag-sheet's per-frame updates in the reference app); each row's `<li>`
 *   also carries `styles.listItem`'s `content-visibility: auto` (see
 *   `FeatureBrowser.css.ts`) so the browser skips layout/style/paint for
 *   whichever rows are currently scrolled out of view, rather than every
 *   row costing that work up front.
 */
export const FeatureBrowser = memo(FeatureBrowserComponent);
