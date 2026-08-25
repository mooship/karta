import { Locate, MapPin, Search, X } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type GeocoderProvider,
  type LocationSearchResult,
  nominatimGeocoderProvider,
} from "../../data/locationSearch";
import { useAbortController } from "../../hooks/useAbortController";
import { IconButton } from "../IconButton/IconButton";
import { RetryButton } from "../RetryButton/RetryButton";
import * as styles from "./LocationSearchControl.css";

/**
 * One selectable map feature's search-index entry: its id, accessible label,
 * and the id of the layer it came from.
 * @remarks `layerId` is unused by this component (it matches on `label`
 *   alone) but is carried through so another consumer -- e.g. a feature
 *   browser grouping results by layer -- doesn't need a second, parallel
 *   index over the same features just to know which layer each belongs to.
 */
export interface SelectableFeatureSearchEntry {
  id: string;
  label: string;
  layerId: string;
}

/**
 * Case-insensitive substring match of `query` against `feature.label`.
 * @remarks Shared by this component's own feature search and by
 *   `FeatureBrowser`'s filter box -- both need the identical "does this
 *   query match this feature's label" check, just under different
 *   surrounding policy (this component also gates on a minimum query length
 *   and caps the result count; `FeatureBrowser` does neither), so only the
 *   match predicate itself is factored out here.
 */
export function matchesFeatureLabel(
  feature: Pick<SelectableFeatureSearchEntry, "label">,
  query: string,
): boolean {
  return feature.label.toLowerCase().includes(query.toLowerCase());
}

/** A single dropdown entry: either a map feature to select, or a place to fly to. */
type CombinedResult =
  | { kind: "feature"; id: string; label: string }
  | { kind: "place"; result: LocationSearchResult };

interface LocationSearchControlProps {
  onLocationSelect: (location: LocationSearchResult) => void;
  /** Input placeholder text. Defaults to `"Search town, suburb or station"`. */
  placeholder?: string;
  /** Geocoder backend used for place search. Defaults to OpenStreetMap Nominatim. */
  provider?: GeocoderProvider;
  /**
   * Called with the input's new value whenever the query changes, including
   * to `""` on clear. Lets a caller drop query-specific state (e.g. an
   * "outside coverage" message tied to a previous selection) the moment the
   * visitor starts a new search, rather than leaving it displayed against a
   * query it no longer describes.
   */
  onQueryChange?: (query: string) => void;
  /**
   * Selectable map features to search by name alongside place results (e.g.
   * townships already loaded on the map), matched locally and instantly
   * with no network round trip. Omit (or pass an empty array) to search
   * places only.
   */
  selectableFeatures?: SelectableFeatureSearchEntry[];
  /**
   * Called with a feature's id when a feature result (rather than a place)
   * is chosen. Expected whenever `selectableFeatures` is non-empty.
   */
  onFeatureSelect?: (featureId: string) => void;
  /** Visible text of the input's own `<label>`. Defaults to `"Search place"`. */
  label?: string;
  /** `aria-label` on the control's wrapping `<section>`. Defaults to `"Location search"`. */
  ariaLabel?: string;
  /** Accessible label of the clear (×) button, shown once the input has a value. Defaults to `"Clear search"`. */
  clearButtonLabel?: string;
  /** Status text shown while a place search is in flight. Defaults to `"Searching places..."`. */
  searchingLabel?: string;
  /** Status text shown when a search returns no results. Defaults to `"Nothing matched that search."`. */
  noResultsLabel?: string;
  /** Status text shown when a search fails, alongside the retry button. Defaults to `"Search is unavailable right now. Please try again."`. */
  unavailableMessage?: string;
  /** Visible text of the retry button shown alongside `unavailableMessage`. Defaults to `"Retry"`. */
  retryLabel?: string;
}

const MIN_SEARCH_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 260;
const DEFAULT_PLACEHOLDER = "Search town, suburb or station";
const DEFAULT_LABEL = "Search place";
const DEFAULT_ARIA_LABEL = "Location search";
const DEFAULT_CLEAR_BUTTON_LABEL = "Clear search";
const DEFAULT_SEARCHING_LABEL = "Searching places...";
const DEFAULT_NO_RESULTS_LABEL = "Nothing matched that search.";
const DEFAULT_SEARCH_UNAVAILABLE_MESSAGE =
  "Search is unavailable right now. Please try again.";
const MAX_FEATURE_RESULTS = 5;

/** A stable DOM id for a combined result, scoped by kind so a feature id and a place id can never collide. */
function resultOptionId(combined: CombinedResult): string {
  return combined.kind === "feature"
    ? `location-search-option-feature-${combined.id}`
    : `location-search-option-place-${combined.result.id}`;
}

/**
 * A debounced, keyboard-navigable search box combining place search
 * (Nominatim by default) with an optional, instant local search over
 * `selectableFeatures` already loaded on the map.
 * @remarks Calls `onLocationSelect` or `onFeatureSelect` when the user picks
 *   a result via click, Enter, or keyboard arrow navigation followed by
 *   Enter, depending on which kind of result they chose. Feature results
 *   are matched with a plain case-insensitive substring scan re-run on
 *   every keystroke -- cheap even for a few thousand entries, and avoids
 *   indexing data that might never be searched -- and always listed ahead
 *   of place results, since they resolve instantly (no debounce, no
 *   network) and represent the map's own content. This is also this
 *   package's only keyboard/screen-reader route to selecting a map feature
 *   directly, since Leaflet polygons aren't natively focusable: it used to
 *   be a second, separate search box hidden until keyboard-focused, but two
 *   near-identical-looking search boxes was worse for every visitor than
 *   one box that does both jobs, so that control was folded into this one.
 *   Every piece of its own copy (`label`, `ariaLabel`, `clearButtonLabel`,
 *   `searchingLabel`, `noResultsLabel`, `unavailableMessage`, `retryLabel`,
 *   plus the existing `placeholder`) is an overridable prop defaulting to
 *   English,
 *   the same pattern `placeholder` already used -- this package can't
 *   depend on an app-specific message catalogue, but a caller with one
 *   (like the reference app's paraglide messages) can still localise every
 *   string this control renders.
 */
export function LocationSearchControl({
  onLocationSelect,
  placeholder = DEFAULT_PLACEHOLDER,
  provider = nominatimGeocoderProvider,
  onQueryChange,
  selectableFeatures = [],
  onFeatureSelect,
  label = DEFAULT_LABEL,
  ariaLabel = DEFAULT_ARIA_LABEL,
  clearButtonLabel = DEFAULT_CLEAR_BUTTON_LABEL,
  searchingLabel = DEFAULT_SEARCHING_LABEL,
  noResultsLabel = DEFAULT_NO_RESULTS_LABEL,
  unavailableMessage = DEFAULT_SEARCH_UNAVAILABLE_MESSAGE,
  retryLabel,
}: LocationSearchControlProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const { next, abort } = useAbortController();
  const inputRef = useRef<HTMLInputElement>(null);
  const justSelectedRef = useRef(false);

  const trimmedQuery = query.trim();
  const featureResults = useMemo<SelectableFeatureSearchEntry[]>(() => {
    if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
      return [];
    }
    return selectableFeatures
      .filter((feature) => matchesFeatureLabel(feature, trimmedQuery))
      .slice(0, MAX_FEATURE_RESULTS);
  }, [selectableFeatures, trimmedQuery]);

  const combinedResults = useMemo<CombinedResult[]>(
    () => [
      ...featureResults.map(
        (feature): CombinedResult => ({ kind: "feature", ...feature }),
      ),
      ...results.map((result): CombinedResult => ({ kind: "place", result })),
    ],
    [featureResults, results],
  );

  async function runSearch(trimmedQuery: string) {
    const signal = next();
    setSearching(true);
    setSearchFailed(false);
    setActiveResultIndex(-1);

    try {
      const nextResults = await provider.search(trimmedQuery, signal);
      setResults(nextResults);
    } catch {
      if (signal.aborted) {
        return;
      }
      setResults([]);
      setSearchFailed(true);
    } finally {
      if (!signal.aborted) {
        setSearching(false);
      }
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: provider intentionally omitted -- it's a public prop with no stability guarantee, so including it could re-fire this effect on every render for callers that don't memoize it
  useEffect(() => {
    if (justSelectedRef.current) {
      // handleCombinedResultSelect sets query to the picked result's own
      // label, which would otherwise re-trigger this same debounced search
      // and reopen the dropdown with the just-picked result a moment later.
      justSelectedRef.current = false;
      return;
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
      setResults([]);
      setSearchFailed(false);
      setSearching(false);
      setActiveResultIndex(-1);
      abort();
      return;
    }

    const debounceTimer = setTimeout(() => {
      runSearch(trimmedQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer);
      abort();
    };
  }, [query, abort]);

  function handleRetry() {
    // The retry button only renders while `searchFailed` is true, which
    // requires a prior successful `runSearch` call with a long-enough query
    // -- any edit to the input clears the error and unmounts this button --
    // so `query` is always already long enough by the time this runs.
    runSearch(query.trim());
  }

  function moveActiveResult(direction: 1 | -1) {
    if (combinedResults.length === 0) {
      return;
    }
    setActiveResultIndex((index) =>
      direction === 1
        ? Math.min(index + 1, combinedResults.length - 1)
        : Math.max(index - 1, 0),
    );
  }

  /** @returns Whether `activeResultIndex` pointed at a real result, so the caller knows whether to suppress the key's default behaviour. */
  function selectActiveResult(): boolean {
    if (activeResultIndex < 0 || activeResultIndex >= combinedResults.length) {
      return false;
    }
    const selected = combinedResults[activeResultIndex];
    /* v8 ignore next 3 -- unreachable: activeResultIndex is already bounds-checked above */
    if (selected) {
      handleCombinedResultSelect(selected);
    }
    return true;
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveResult(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveResult(-1);
      return;
    }

    if (event.key === "Enter") {
      if (selectActiveResult()) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === "Escape") {
      handleClear();
    }
  }

  /**
   * Sets `query` to the picked result's own label either way, rather than
   * clearing it (as the earlier, separate feature-search box used to) --
   * consistent behaviour across both result kinds matters more here than
   * matching either predecessor's own choice, since a visitor shouldn't
   * have to learn that selecting looks different depending on which kind
   * of result they picked.
   */
  function handleCombinedResultSelect(combined: CombinedResult) {
    const selectedLabel =
      combined.kind === "feature" ? combined.label : combined.result.label;
    // If the picked result's label is textually identical to what's already
    // typed, setQuery below is a no-op as far as React state is concerned,
    // so the debounced-search effect (keyed on `query`) never re-runs to
    // clear this flag -- it would otherwise stay stuck `true` and silently
    // swallow the next real search the user types.
    justSelectedRef.current = query !== selectedLabel;
    if (combined.kind === "feature") {
      onFeatureSelect?.(combined.id);
    } else {
      onLocationSelect(combined.result);
    }
    setQuery(selectedLabel);
    setResults([]);
    setActiveResultIndex(-1);
  }

  function handleClear() {
    setQuery("");
    onQueryChange?.("");
    setResults([]);
    setSearchFailed(false);
    setActiveResultIndex(-1);
    inputRef.current?.focus();
  }

  const activeResult =
    activeResultIndex >= 0 && activeResultIndex < combinedResults.length
      ? combinedResults[activeResultIndex]
      : null;
  const hasResults = combinedResults.length > 0;
  const noMatches =
    !searching &&
    !searchFailed &&
    !hasResults &&
    trimmedQuery.length >= MIN_SEARCH_QUERY_LENGTH;

  return (
    <section
      className={styles.root}
      aria-label={ariaLabel}
      data-testid="location-search"
      data-e2e="location-search"
    >
      <label className={styles.label} htmlFor="map-location-search">
        <Search aria-hidden="true" />
        {label}
      </label>
      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          id="map-location-search"
          data-testid="location-search-input"
          data-e2e="location-search-input"
          className={styles.input}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={hasResults}
          aria-controls="location-search-results"
          aria-activedescendant={
            activeResult ? resultOptionId(activeResult) : undefined
          }
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onQueryChange?.(event.target.value);
            setSearchFailed(false);
            setActiveResultIndex(-1);
          }}
          onKeyDown={handleInputKeyDown}
        />
        {query.length > 0 ? (
          <IconButton
            className={styles.clearButton}
            label={clearButtonLabel}
            data-testid="location-search-clear"
            data-e2e="location-search-clear"
            onClick={handleClear}
          >
            <X aria-hidden="true" />
          </IconButton>
        ) : null}
      </div>
      {searching ? (
        <output className={styles.status}>{searchingLabel}</output>
      ) : null}
      {searchFailed ? (
        <output className={styles.status}>
          {unavailableMessage}
          <RetryButton
            label={retryLabel}
            data-testid="location-search-retry"
            data-e2e="location-search-retry"
            onClick={handleRetry}
          />
        </output>
      ) : null}
      {noMatches ? (
        <output className={styles.status}>{noResultsLabel}</output>
      ) : null}
      {hasResults ? (
        <ul
          id="location-search-results"
          // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: role="listbox" on <ul> is the standard WAI-ARIA combobox pattern
          role="listbox"
          className={styles.results}
          data-testid="location-search-results"
          data-e2e="location-search-results"
        >
          {combinedResults.map((combined, index) => {
            const optionId = resultOptionId(combined);
            const label =
              combined.kind === "feature"
                ? combined.label
                : combined.result.label;
            return (
              <li key={optionId} role="presentation">
                <button
                  id={optionId}
                  type="button"
                  role="option"
                  aria-selected={activeResultIndex === index}
                  className={styles.resultButton}
                  data-active={activeResultIndex === index ? "true" : "false"}
                  onClick={() => handleCombinedResultSelect(combined)}
                >
                  {combined.kind === "feature" ? (
                    <Locate aria-hidden="true" className={styles.resultIcon} />
                  ) : (
                    <MapPin aria-hidden="true" className={styles.resultIcon} />
                  )}
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
