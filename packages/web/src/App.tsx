import type { TownshipFeature, TownshipProperties } from "@karta/app";
import {
  type DomainConfig,
  type DomainStory as DomainStoryContent,
  fetchFeatureCollection,
  mergeFeatureCollections,
} from "@karta/core";
import {
  ControlButton,
  createNominatimGeocoderProvider,
  DesktopLegend,
  DomainProvider,
  FeatureBrowser,
  LocationSearchControl,
  type LocationSearchResult,
  type MeasurementMode,
  MobileLegend,
  type SelectableFeatureSearchEntry,
  SettingsMenu,
  useDismissableOverlay,
  useRafScheduledValue,
} from "@karta/map";
import {
  MOBILE_BREAKPOINT_PX,
  setThemePreference,
  useDeferredReadyAttribute,
  useIsDesktopViewport,
  useThemePreference,
} from "@karta/react";
import clsx from "clsx";
import type { Feature } from "geojson";
import { Layers, X } from "lucide-react";
import {
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  lazy,
  memo,
  type PointerEvent,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./App.module.css";
import { DomainStory } from "./components/DomainStory/DomainStory";
import { LanguageToggle } from "./components/LanguageToggle/LanguageToggle";
import { LayerToggles } from "./components/LayerToggles/LayerToggles";
import { PrivacyLink } from "./components/PrivacyLink/PrivacyLink";
import { TownshipPopup } from "./components/TownshipPopup/TownshipPopup";
import { fetchTownships } from "./data/fetchTownships";
import { buildRegionDataUrls } from "./data/regionDataUrls";
import { useMapModelContextTools } from "./hooks/useMapModelContextTools";
import { useMapPermalink } from "./hooks/useMapPermalink";
import { getLayerGroups, getLayers, getStory } from "./layers/registry";
import { m } from "./paraglide/messages.js";
import { type PanelView, useMapUiStore } from "./stores/useMapUiStore";

const MapView = lazy(async () => {
  const { MapView } = await import("@karta/map/MapView");
  return { default: MapView };
});

/** A Leaflet-style `[[south, west], [north, east]]` bounding rectangle. */
type LatLngBoundsTuple = [[number, number], [number, number]];

const GAUTENG_BOUNDS: LatLngBoundsTuple = [
  [-27.15, 27.1],
  [-25.3, 28.75],
];

/**
 * Mainland South Africa's approximate extent, used only to sanity-check
 * location search results (see `isWithinSearchCoverage`) — not the map's
 * initial viewport, which stays framed on Gauteng via `GAUTENG_BOUNDS` since
 * that's the only region with actual layer data today.
 */
const SEARCH_COVERAGE_BOUNDS: LatLngBoundsTuple = [
  [-34.84, 16.45],
  [-22.13, 32.95],
];

/**
 * This app's own `LocationSearchControl` provider: Nominatim biased toward
 * South Africa, matching `SEARCH_COVERAGE_BOUNDS` above. `@karta/map`'s
 * default `nominatimGeocoderProvider` has no such bias, since a domain-
 * agnostic SDK component can't assume any host's coverage area — a search
 * for a common place name would otherwise rank same-named places elsewhere
 * in the world ahead of the South African one this app actually cares about.
 */
const locationSearchProvider = createNominatimGeocoderProvider({
  countryCodes: "za",
});

/**
 * Whether `location` falls within `SEARCH_COVERAGE_BOUNDS`.
 * @remarks Nominatim searches the whole world, so a query can resolve to a
 *   place far outside South Africa entirely; flying the map there would just
 *   show an empty basemap with no explanation. The mapped data itself is
 *   Gauteng-only, but the basemap and search cover the whole country.
 */
function isWithinSearchCoverage(location: LocationSearchResult): boolean {
  const [[south, west], [north, east]] = SEARCH_COVERAGE_BOUNDS;
  return (
    location.latitude >= south &&
    location.latitude <= north &&
    location.longitude >= west &&
    location.longitude <= east
  );
}

const PANEL_VIEWPORT_PROPS = {
  className: styles.panelViewport,
  "data-testid": "panel-viewport",
  "data-e2e": "panel-viewport",
} as const;

const SHEET_DRAG_THRESHOLD_PX = 36;
const SHEET_DRAG_PREVIEW_LIMIT_PX = 96;
const SHEET_PROJECTION_DECELERATION = 0.992;
const SHEET_VELOCITY_SAMPLE_WINDOW_MS = 140;

interface FocusLocationTarget {
  token: number;
  location: LocationSearchResult;
}

/** A WebMCP-driven request to plot a measurement, mirroring `MapView`'s own `measurementRequest` prop. */
interface MeasurementRequest {
  token: number;
  mode: MeasurementMode;
  points: { lat: number; lng: number }[];
}

interface PointerSample {
  timestamp: number;
  y: number;
}

function pruneStalePointerSamples(samples: PointerSample[], now: number) {
  while (samples.length > 1) {
    const oldest = samples[0];
    /* v8 ignore next 3 -- unreachable: the length check above guarantees samples[0] exists */
    if (!oldest) {
      break;
    }
    if (now - oldest.timestamp <= SHEET_VELOCITY_SAMPLE_WINDOW_MS) {
      break;
    }
    samples.shift();
  }
}

/**
 * A completed sheet drag's net vertical delta, extended by a short-horizon
 * velocity projection so a fast-but-short swipe crosses the drag threshold
 * the same way a slower, longer one already does.
 */
function projectSheetDragDelta(
  delta: number,
  firstSample: PointerSample,
  lastSample: PointerSample,
): number {
  const elapsedMs = Math.max(1, lastSample.timestamp - firstSample.timestamp);
  const velocityPxPerSecond =
    ((lastSample.y - firstSample.y) / elapsedMs) * 1000;
  return (
    delta +
    (velocityPxPerSecond / 1000) *
      (SHEET_PROJECTION_DECELERATION / (1 - SHEET_PROJECTION_DECELERATION))
  );
}

/** Whether a completed sheet drag's motion (actual or velocity-projected) cleared the minimum threshold to count as an intentional swipe rather than a stray tap or jitter. */
function isDeliberateSheetDrag(delta: number, projectedDelta: number): boolean {
  return (
    Math.abs(delta) >= SHEET_DRAG_THRESHOLD_PX ||
    Math.abs(projectedDelta) >= SHEET_DRAG_THRESHOLD_PX
  );
}

type SheetDragOutcome = "expand" | "collapse" | "close";

/** Which action a deliberate sheet drag should trigger: expand upward, collapse back to medium height downward from expanded, otherwise close the panel entirely. */
function resolveSheetDragOutcome(
  projectedDelta: number,
  mobilePanelExpanded: boolean,
): SheetDragOutcome {
  if (projectedDelta < 0) {
    return "expand";
  }
  return mobilePanelExpanded ? "collapse" : "close";
}

/** Carries out a resolved sheet drag outcome by calling the one setter/callback it needs. */
function applySheetDragOutcome(
  outcome: SheetDragOutcome,
  setMobilePanelExpanded: (value: boolean) => void,
  closePanel: () => void,
): void {
  switch (outcome) {
    case "expand": {
      setMobilePanelExpanded(true);
      return;
    }
    case "collapse": {
      setMobilePanelExpanded(false);
      return;
    }
    case "close": {
      closePanel();
    }
  }
}

/** Converts a boolean into the `"true"`/`"false"` string Karta's `data-*` boolean attributes (and their CSS/e2e selectors) expect. */
function toBoolAttr(value: boolean): "true" | "false" {
  return value ? "true" : "false";
}

/** The mobile info panel's `data-panel-size` value for its current expanded/medium height. */
function resolvePanelSizeAttr(expanded: boolean): "full" | "medium" {
  return expanded ? "full" : "medium";
}

interface PanelViewContentProps {
  panelView: PanelView;
  visibleLayerIds: string[];
  onToggle: (id: string) => void;
  failedLayerIds: string[];
  story: DomainStoryContent | undefined;
  selectableFeatures: SelectableFeatureSearchEntry[];
  selectedFeatureId: string | null;
  onSelectFeature: (featureId: string) => void;
}

/**
 * Renders the info panel's active view: layer toggles, the domain's story
 * copy, or the selectable-feature browser.
 * @remarks Memoized like `LayerToggles`, its own child here -- `App`
 *   re-renders on every unrelated state change (e.g. the mobile bottom-sheet
 *   drag gesture's per-frame offset), and none of that should force this
 *   panel back through reconciliation.
 */
const PanelViewContent = memo(function PanelViewContent({
  panelView,
  visibleLayerIds,
  onToggle,
  failedLayerIds,
  story,
  selectableFeatures,
  selectedFeatureId,
  onSelectFeature,
}: PanelViewContentProps) {
  let title: string;
  let body: ReactNode;
  if (panelView === "story" && story) {
    title = story.title;
    body = <DomainStory story={story} />;
  } else if (panelView === "browser") {
    title = m.panel_tab_browse();
    body = (
      <FeatureBrowser
        features={selectableFeatures}
        selectedFeatureId={selectedFeatureId}
        onSelect={onSelectFeature}
        filterLabel={m.feature_browser_filter_label()}
        filterPlaceholder={m.feature_browser_filter_placeholder()}
        emptyMessage={m.search_no_results()}
      />
    );
  } else {
    title = m.panel_tab_layers();
    body = (
      <LayerToggles
        visibleLayerIds={visibleLayerIds}
        onToggle={onToggle}
        failedLayerIds={failedLayerIds}
      />
    );
  }
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {body}
    </section>
  );
});

/**
 * The reference app's root shell: fetches and merges the Gauteng township
 * choropleth data, wraps the render tree in a `DomainProvider` for
 * `gauteng-spatial-legacy`, and renders the map alongside the desktop/mobile
 * info panel and its settings menu.
 * @remarks That township fetch deliberately waits for `MapView`'s `onReady`
 *   (tracked as `mapReady`) rather than starting at mount. Downloading,
 *   validating and handing Leaflet ~2,500 polygons is seconds of
 *   main-thread work on a mid-range phone, and none of it can be drawn
 *   before the map exists — started at mount it simply ran in front of the
 *   map's own first paint and delayed it by all of that. The retry path
 *   (`loadAttempt`) still works unchanged, since the map stays ready.
 *   The info panel shows layer toggles, plus a Story tab reading its
 *   copy from the domain's `story` (via `getStory()`) whenever the active
 *   domain defines one, plus a Browse tab listing every selectable feature
 *   (grouped by layer, via `FeatureBrowser`) whenever the active domain
 *   declares at least one `interaction.selectable` layer — a domain that
 *   omits `story` and defines no selectable layer gets no tab UI at all,
 *   matching today's single-view panel. `domain`/`panelViews`/`panelLabels`
 *   are computed inside the component body, not at module scope: their
 *   content is locale-dependent (`getLayers()`/`getLayerGroups()`/`getStory()`
 *   and the `m.panel_tab_*()` calls all read the current request's locale),
 *   and Cloudflare Workers reuse isolates across requests — a module-scope
 *   value would freeze in whichever locale first touched that isolate
 *   instead of reflecting each request's own. `domain` alone is wrapped in
 *   `useMemo` for referential stability across re-renders (matching
 *   `DomainProvider`'s own internal memoization); `panelViews`/`panelLabels`
 *   are cheap enough to recompute every render.
 *   Also owns the mobile bottom-sheet drag/swipe gesture state (pointer
 *   sampling, velocity-based snap projection) in addition to layout state
 *   from `useMapUiStore`. Swiping down from the sheet's medium height closes
 *   it entirely: `closePanel` plays an exit animation and `finishClose`
 *   (unmounting the panel from the a11y tree) fires from that animation's
 *   `animationend`, so the CSS duration in App.module.css stays the single
 *   source of truth — except under `prefers-reduced-motion`/desktop, where
 *   no animation plays and `closePanel` calls `finishClose` immediately.
 *   `useMapModelContextTools` registers this app's layer/search/basemap/theme/
 *   story/measurement capabilities as WebMCP tools; `handleLocationSelect` is
 *   shared between `LocationSearchControl`'s `onLocationSelect` and that
 *   hook's `search-map-location` tool, so a human picking a result and an
 *   agent calling the tool fly the map the same way.
 *   `handleRequestMeasurement` plays the same role for `measure-distance`/
 *   `measure-area`: it stamps a fresh `token` into `measurementRequest` state
 *   (mirroring `focusLocationTarget`) and passes it straight through to
 *   `MapView`'s own `measurementRequest` prop, so a geocoded measurement
 *   plots on the same on-screen tool a human's clicks would drive.
 *   `useMapPermalink` restores
 *   layer/basemap/panel/feature state from the URL on load and keeps the
 *   URL in sync afterwards, so the address bar is always a shareable link
 *   to the current view; it defers applying a shared `selectedFeatureId`
 *   until `townships` has data, since Leaflet has nothing to select before then.
 *   `!isDesktopViewport && panelOpen` is passed to `MapView` as
 *   `measurementPanelOpen`, and `closePanel` as `onMeasurementPanelClose`,
 *   so the measurement tool collapses to its idle toggle instead of
 *   competing with the mobile Explore sheet for the same sliver of screen
 *   -- tapping that toggle while the sheet is open closes the sheet (via
 *   the same `closePanel` used by Escape/outside-click) rather than
 *   disappearing outright, so there's always a visible way back to a
 *   measurement in progress. Gated to mobile because the desktop sidebar is
 *   open by default (see the hydration effect below) -- without that gate
 *   the measurement tool could never actually open on desktop, since its
 *   host panel is "open" from the moment the page loads.
 *   `MobileLegend`'s own `panelOpen` prop and the `.app` element's
 *   `data-panel-open` attribute are driven by the derived `panelVisuallyOpen`
 *   below, not raw `panelOpen` -- see that constant's own doc comment for why.
 */
export function App() {
  const [hydrated, setHydrated] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [townships, setTownships] = useState<TownshipFeature[]>([]);
  const [townshipAreas, setTownshipAreas] = useState<Feature[]>([]);
  const [dataError, setDataError] = useState(false);
  const [failedLayerIds, setFailedLayerIds] = useState<string[]>([]);
  const [selectableFeatures, setSelectableFeatures] = useState<
    SelectableFeatureSearchEntry[]
  >([]);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobilePanelExpanded, setMobilePanelExpanded] = useState(false);
  const [mobileSheetDragOffset, setMobileSheetDragOffset] = useState(0);
  const [mobileSheetDragging, setMobileSheetDragging] = useState(false);
  const [mobileSheetClosing, setMobileSheetClosing] = useState(false);
  const [focusLocationTarget, setFocusLocationTarget] =
    useState<FocusLocationTarget | null>(null);
  const [measurementRequest, setMeasurementRequest] =
    useState<MeasurementRequest | null>(null);
  const [outOfCoverageLocationLabel, setOutOfCoverageLocationLabel] = useState<
    string | null
  >(null);
  const visibleLayerIds = useMapUiStore((state) => state.visibleLayerIds);
  const basemap = useMapUiStore((state) => state.basemap);
  const panelOpen = useMapUiStore((state) => state.panelOpen);
  const panelView = useMapUiStore((state) => state.panelView);
  const selectedFeatureId = useMapUiStore((state) => state.selectedFeatureId);
  const toggleLayer = useMapUiStore((state) => state.toggleLayer);
  const setBasemap = useMapUiStore((state) => state.setBasemap);
  const setPanelOpen = useMapUiStore((state) => state.setPanelOpen);
  const setPanelView = useMapUiStore((state) => state.setPanelView);
  const setSelectedFeatureId = useMapUiStore(
    (state) => state.setSelectedFeatureId,
  );
  const themePreference = useThemePreference();
  const domain = useMemo<DomainConfig>(
    () => ({
      layers: getLayers(),
      layerGroups: getLayerGroups(),
      story: getStory(),
    }),
    [],
  );
  const story = domain.story;
  /**
   * Localized copy forwarded to both `DesktopLegend`/`MobileLegend`'s
   * internal `Legend`, computed fresh per render for the same per-request
   * locale reason as `domain` above.
   */
  const legendLabels = useMemo(
    () => ({
      noDataLabel: m.legend_no_data(),
      transitRoutesLabel: m.legend_transit_routes(),
      transitColorsAriaLabel: m.legend_transit_colors_aria_label(),
      emptyMessage: m.legend_empty(),
      lineAndStationsNote: m.legend_line_and_stations_note(),
      routeOnlyNote: m.legend_route_only_note(),
      formatActiveAriaLabel: (label: string) =>
        m.legend_active_aria_label({ label }),
    }),
    [],
  );
  /** Localized copy forwarded to `MapView`'s internal `LocationContextMenu`, memoized for the same reason as `legendLabels`. */
  const locationContextMenuLabels = useMemo(
    () => ({
      ariaLabel: m.location_context_menu_aria_label(),
      searchHereLabel: m.location_context_menu_search_here(),
      loadingLabel: m.location_context_menu_loading(),
      failedLabel: m.location_context_menu_failed(),
      noAddressLabel: m.location_context_menu_no_address(),
      retryLabel: m.retry(),
    }),
    [],
  );
  /** Localized copy forwarded to `MapView`'s internal `MeasurementControl`, memoized for the same reason as `legendLabels`. */
  const measurementLabels = useMemo(
    () => ({
      toggleLabel: m.measurement_toggle(),
      backToMapLabel: m.measurement_back_to_map(),
      ariaLabel: m.measurement_aria_label(),
      title: m.measurement_title(),
      stopLabel: m.measurement_stop(),
      modeLabel: m.measurement_mode_label(),
      distanceModeLabel: m.measurement_mode_distance(),
      areaModeLabel: m.measurement_mode_area(),
      hint: m.measurement_hint(),
      clearLabel: m.measurement_clear(),
    }),
    [],
  );
  const formatSelectionAnnouncement = useCallback(
    (label: string) => m.map_selection_announcement({ label }),
    [],
  );
  /**
   * Whether the active domain declares any `interaction.selectable` layer at
   * all -- a structural fact about the domain's own layer catalogue, checked
   * the same way `MapView`'s own `selectableSearchEntries` does, not derived
   * from whether any such layer's data has actually loaded yet. Gating the
   * "Browse" tab on this (rather than on `selectableFeatures.length`, which
   * starts empty and only fills in once `MapView` reports data) keeps the
   * tab list itself deterministic from first render, matching how the
   * "Story" tab is gated on `domain.story` rather than on that copy having
   * rendered -- the tab exists as soon as the domain says it should, and the
   * browser's own content (not the tab's presence) is what reflects data
   * still loading.
   */
  const hasSelectableLayers = useMemo(
    () => domain.layers.some((layer) => layer.interaction?.selectable),
    [domain.layers],
  );
  /**
   * Memoised (not just `story`/`hasSelectableLayers`-derived inline) so this
   * array keeps one identity across renders unless those inputs themselves
   * change -- `useCallback` dependencies below (`resolveInitialPanelFocusTarget`)
   * key off it, and a fresh array literal every render would defeat that
   * memoisation and re-attach `useDismissableOverlay`'s listeners on every
   * unrelated render.
   */
  const panelViews = useMemo<readonly PanelView[]>(() => {
    const views: PanelView[] = ["layers"];
    if (story) {
      views.push("story");
    }
    if (hasSelectableLayers) {
      views.push("browser");
    }
    return views;
  }, [story, hasSelectableLayers]);
  const panelLabels: Record<PanelView, string> = {
    layers: m.panel_tab_layers(),
    story: m.panel_tab_story(),
    browser: m.panel_tab_browse(),
  };
  const isDesktopViewport = useIsDesktopViewport();
  const panelTriggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const singleViewRef = useRef<HTMLDivElement>(null);
  const suppressNextHandleClickRef = useRef(false);
  const activeSheetPointerIdRef = useRef<number | null>(null);
  const {
    schedule: scheduleSheetDragOffset,
    cancel: cancelScheduledSheetDragOffset,
  } = useRafScheduledValue(setMobileSheetDragOffset);
  const {
    ref: appRef,
    markNotReady: markSheetEntranceNotReady,
    markReadyAfterPaint: markSheetEntranceReadyAfterPaint,
  } = useDeferredReadyAttribute<HTMLDivElement>("data-sheet-entrance-ready");

  /**
   * Opens the desktop sidebar synchronously, in the same commit as
   * `hydrated` (which also starts `MapView`'s own lazy-load and Leaflet
   * mount) -- deliberately, not deferred. An earlier version deferred this
   * (via `mapReady`, then via a couple of animation frames) specifically to
   * stop the panel's entrance animation from visibly competing with that
   * mount for frames, but *any* deferral of `panelOpen` itself -- even a
   * couple of frames -- turned out to be unsafe: under real load (a
   * throttled CPU, contended CI) the gap between a test/user's `mousedown`
   * and the resulting `click` can outlast the deferral, so the auto-open
   * could fire *in between* -- flipping `panelOpen` to `true` while that
   * click was still in flight, so by the time it landed, `handlePanelToggle`
   * saw an already-open panel and closed it instead. `panelOpen` itself
   * (and everything downstream of it -- ARIA state, `useDismissableOverlay`'s
   * Escape-stack position, what's clickable where on desktop) needs to be
   * deterministic, not racing a side effect. The entrance *animation* is
   * still deferred, just not through `panelOpen` -- see the
   * `data-entrance-ready` attribute below, which starts every
   * `.panel`/`.panelViewport` animation paused at its first frame and only
   * resumes it once `mapReady`, so nothing is actively ticking (and so
   * nothing to visibly stutter) while `MapView`'s mount is still competing
   * for frames.
   */
  useEffect(() => {
    setHydrated(true);
    if (window.innerWidth > MOBILE_BREAKPOINT_PX) {
      setPanelOpen(true);
    }
  }, [setPanelOpen]);

  useEffect(() => {
    if (!mapReady) {
      return;
    }
    let cancelled = false;
    setDataError(false);
    setTownships([]);
    setTownshipAreas([]);
    const cacheBust = loadAttempt > 0 ? `?retry=${loadAttempt}` : "";
    const townshipUrls = buildRegionDataUrls(
      `townships.display.v1.geojson${cacheBust}`,
    );
    const areaUrls = buildRegionDataUrls(
      `township-areas.display.v1.geojson${cacheBust}`,
    );

    Promise.all([
      Promise.all(townshipUrls.map((url) => fetchTownships(url))),
      Promise.all(areaUrls.map((url) => fetchFeatureCollection(url))),
    ])
      .then(([townshipsByRegion, areasByRegion]) => {
        if (!cancelled) {
          setTownships(townshipsByRegion.flat());
          setTownshipAreas(mergeFeatureCollections(areasByRegion).features);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDataError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt, mapReady]);

  useEffect(() => {
    if (!panelOpen) {
      setMobilePanelExpanded(false);
      setMobileSheetDragging(false);
      setMobileSheetDragOffset(0);
      activeSheetPointerIdRef.current = null;
    }
  }, [panelOpen]);

  useEffect(() => {
    return () => {
      cancelScheduledSheetDragOffset();
    };
  }, [cancelScheduledSheetDragOffset]);

  const mobileSheetDragDirection =
    mobileSheetDragOffset < -4
      ? "up"
      : mobileSheetDragOffset > 4
        ? "down"
        : "none";
  /**
   * `panelOpen` itself only flips to `false` once the mobile sheet's exit
   * animation has fully finished (see `finishClose`), so anything reactive
   * to raw `panelOpen` -- the legend trigger's climb, the panel toggle's
   * collapse to a small icon button -- stayed in its "open" position for the
   * whole 280ms the sheet was already sliding away, then snapped back
   * down afterwards instead of moving with it. This flips the moment the
   * close animation *starts* instead, so those controls animate back in
   * step with the sheet's own slide-out rather than a beat behind it.
   */
  const panelVisuallyOpen = panelOpen && !mobileSheetClosing;
  const mobilePanelDragStyle = {
    "--panel-drag-offset": `${mobileSheetDragOffset}px`,
  } as CSSProperties;

  const handleMapReady = useCallback(() => setMapReady(true), []);

  /**
   * Renders a selected township's popup markup for `MapView`.
   * @remarks Memoised with no dependencies because nothing render-scoped is
   *   captured here — `TownshipPopup` resolves its own translated copy when
   *   the element it returns is actually rendered — so there's no reason to
   *   hand `MapView` a fresh closure every render. `MapView` itself no
   *   longer depends on this being stable for correctness (it reads the
   *   latest value through its own ref internally), but keeping it stable
   *   here still avoids the odd re-render doing pointless work for free.
   */
  const renderFeaturePopup = useCallback(
    (properties: Record<string, unknown>) => (
      <TownshipPopup properties={properties as unknown as TownshipProperties} />
    ),
    [],
  );

  function handleLocationSelect(location: LocationSearchResult): string {
    if (!isWithinSearchCoverage(location)) {
      setOutOfCoverageLocationLabel(location.label);
      return m.location_out_of_coverage({ location: location.label });
    }
    setOutOfCoverageLocationLabel(null);
    setSelectedFeatureId(null);
    setFocusLocationTarget({ token: Date.now(), location });
    return m.webmcp_search_location_flew_to({ location: location.label });
  }

  function handleRequestMeasurement(
    mode: MeasurementMode,
    points: { lat: number; lng: number }[],
  ) {
    setMeasurementRequest({ token: Date.now(), mode, points });
  }

  useMapModelContextTools({
    onLocationSelect: handleLocationSelect,
    story,
    onShowStory: () => {
      setPanelView("story");
      setPanelOpen(true);
    },
    onRequestMeasurement: handleRequestMeasurement,
  });

  useMapPermalink({ dataReady: townships.length > 0 });

  /**
   * Memoised (along with `closePanel` below) so `useDismissableOverlay`'s
   * effect -- which lists `onClose` as a dependency -- only re-subscribes
   * its document-level listeners when what actually changed is relevant
   * (`isDesktopViewport`), not on every unrelated render. Left unmemoised,
   * this pair was recreated on every `App` render, including every
   * animation-frame tick of the mobile sheet's own drag gesture.
   */
  const finishClose = useCallback(() => {
    setMobileSheetClosing(false);
    setPanelOpen(false);
    requestAnimationFrame(() => panelTriggerRef.current?.focus());
  }, [setPanelOpen]);

  const closePanel = useCallback(() => {
    const playsExitAnimation =
      !isDesktopViewport &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playsExitAnimation) {
      finishClose();
      return;
    }
    setMobileSheetClosing(true);
  }, [isDesktopViewport, finishClose]);

  /**
   * Closes the panel on Escape (from anywhere, matching `SettingsMenu`/
   * `MobileLegend`'s own behaviour) or on an outside pointerdown -- but only
   * on mobile, where the panel is a transient bottom sheet covering the map.
   * On desktop it's a persistent sidebar the user is expected to keep open
   * alongside ordinary map interaction, so a stray click on the map itself
   * must not dismiss it the way it would a popover.
   */
  useDismissableOverlay({
    open: panelOpen,
    onClose: closePanel,
    containerRef: panelRef,
    triggerRef: panelTriggerRef,
    dismissOnOutsideClick: !isDesktopViewport,
  });

  function handleSheetAnimationEnd(event: AnimationEvent<HTMLElement>) {
    // CSS Modules hashes @keyframes names, so animationName can't be matched
    // against a literal here; requiring the event to originate on the panel
    // itself (not bubble up from a child like .panelViewport's own entrance
    // animation) is enough, since .panel only ever animates while closing.
    if (mobileSheetClosing && event.target === event.currentTarget) {
      finishClose();
    }
  }

  /**
   * Opening moves focus into the panel -- the active tab when tabs are
   * shown, otherwise the single view's own container -- mirroring how
   * `finishClose` already returns focus to the trigger on the way out.
   * `hidden` comes off the `<aside>` in the same commit `setPanelOpen(true)`
   * causes, so by the next animation frame the target is focusable, the
   * same assumption `finishClose`'s own `requestAnimationFrame` call makes.
   *
   * `markSheetEntranceNotReady`/`markSheetEntranceReadyAfterPaint` reset and
   * re-arm `data-sheet-entrance-ready` in that same commit -- see
   * `useDeferredReadyAttribute`'s own doc comment (`@karta/react`) for why
   * the mobile sheet's own entrance fade (its CSS pauses on that attribute)
   * needs this rather than just starting immediately.
   */
  function handlePanelToggle() {
    if (panelOpen) {
      closePanel();
      return;
    }
    setMobilePanelExpanded(false);
    markSheetEntranceNotReady();
    setPanelOpen(true);
    markSheetEntranceReadyAfterPaint();
    requestAnimationFrame(() => {
      const activeTabIndex = panelViews.indexOf(panelView);
      (tabRefs.current[activeTabIndex] ?? singleViewRef.current)?.focus();
    });
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = panelViews.indexOf(panelView);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % panelViews.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + panelViews.length) % panelViews.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = panelViews.length - 1;
    }
    if (nextIndex === null) {
      return;
    }
    event.preventDefault();
    const nextView = panelViews[nextIndex];
    /* v8 ignore next 3 -- unreachable: nextIndex is always derived via modulo of panelViews.length or clamped to its bounds above, so it always indexes an existing entry */
    if (!nextView) {
      return;
    }
    setPanelView(nextView);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleSheetHeightToggle() {
    if (suppressNextHandleClickRef.current) {
      suppressNextHandleClickRef.current = false;
      return;
    }
    if (isDesktopViewport) {
      return;
    }
    setMobilePanelExpanded((value) => !value);
  }

  function handleSheetHandlePointerDown(
    event: PointerEvent<HTMLButtonElement>,
  ) {
    if (isDesktopViewport) {
      return;
    }
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const handleElement = event.currentTarget;
    const startY = event.clientY;
    let latestPointerY = startY;
    const pointerSamples: PointerSample[] = [
      { timestamp: performance.now(), y: startY },
    ];
    activeSheetPointerIdRef.current = event.pointerId;
    setMobileSheetDragging(true);
    scheduleSheetDragOffset(0);
    handleElement.setPointerCapture(event.pointerId);

    function handlePointerMove(pointerEvent: globalThis.PointerEvent) {
      if (pointerEvent.pointerId !== activeSheetPointerIdRef.current) {
        return;
      }
      latestPointerY = pointerEvent.clientY;
      const now = performance.now();
      pointerSamples.push({ timestamp: now, y: pointerEvent.clientY });
      pruneStalePointerSamples(pointerSamples, now);
      const delta = pointerEvent.clientY - startY;
      const clampedDelta = Math.max(
        -SHEET_DRAG_PREVIEW_LIMIT_PX,
        Math.min(SHEET_DRAG_PREVIEW_LIMIT_PX, delta),
      );
      scheduleSheetDragOffset(clampedDelta);
    }

    function cleanup() {
      setMobileSheetDragging(false);
      scheduleSheetDragOffset(0);
      activeSheetPointerIdRef.current = null;
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointercancel", cleanup);
      if (handleElement.hasPointerCapture(event.pointerId)) {
        handleElement.releasePointerCapture(event.pointerId);
      }
    }

    function handlePointerUp(pointerEvent: globalThis.PointerEvent) {
      if (pointerEvent.pointerId !== activeSheetPointerIdRef.current) {
        return;
      }
      const now = performance.now();
      pointerSamples.push({ timestamp: now, y: pointerEvent.clientY });
      pruneStalePointerSamples(pointerSamples, now);

      const delta = latestPointerY - startY;
      const firstSample = pointerSamples[0];
      const lastSample = pointerSamples[pointerSamples.length - 1];
      /* v8 ignore next 4 -- unreachable: pointerSamples is seeded with one entry on pointer down and the prune loop above always stops at length 1, so it's never empty here */
      if (!firstSample || !lastSample) {
        cleanup();
        return;
      }
      const projectedDelta = projectSheetDragDelta(
        delta,
        firstSample,
        lastSample,
      );

      if (!isDeliberateSheetDrag(delta, projectedDelta)) {
        cleanup();
        return;
      }
      suppressNextHandleClickRef.current = true;
      const outcome = resolveSheetDragOutcome(
        projectedDelta,
        mobilePanelExpanded,
      );
      applySheetDragOutcome(outcome, setMobilePanelExpanded, closePanel);
      cleanup();
    }

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointercancel", cleanup);
  }

  const panelViewContent = (
    <PanelViewContent
      panelView={panelView}
      visibleLayerIds={visibleLayerIds}
      onToggle={toggleLayer}
      failedLayerIds={failedLayerIds}
      story={story}
      selectableFeatures={selectableFeatures}
      selectedFeatureId={selectedFeatureId}
      onSelectFeature={setSelectedFeatureId}
    />
  );

  const panelToggleLabel = panelOpen
    ? m.panel_toggle_close()
    : m.panel_toggle_explore();

  return (
    <DomainProvider domain={domain}>
      <div
        ref={appRef}
        className={styles.app}
        data-panel-open={toBoolAttr(panelVisuallyOpen)}
        data-panel-size={resolvePanelSizeAttr(mobilePanelExpanded)}
        data-panel-dragging={toBoolAttr(mobileSheetDragging)}
        data-panel-drag-direction={mobileSheetDragDirection}
        data-entrance-ready={toBoolAttr(mapReady)}
      >
        <a className={styles.skipLink} href="#map-information">
          {m.skip_to_map_information()}
        </a>

        <header className={styles.visuallyHidden}>
          <h1>{m.app_heading()}</h1>
        </header>

        <main id="map-information" tabIndex={-1}>
          {/*
            Rendered unconditionally (server-rendered, then left mounted
            through hydration and MapView's own lazy-load/mount) rather than
            swapped out via a ternary or Suspense fallback: Chrome stops
            counting an element towards Largest Contentful Paint the moment
            it's removed from the DOM, so a placeholder that gets unmounted
            can never end up being the reported LCP element even if it was
            the largest thing on screen for seconds. `MapView`'s own
            full-viewport container paints over this in normal DOM-order
            stacking once it mounts; `aria-hidden` (not removal) keeps
            screen readers from re-announcing "loading" once the real map
            is ready.
          */}
          <output className={styles.mapLoading} aria-hidden={mapReady}>
            {m.loading_map()}
          </output>
          {hydrated && (
            <Suspense fallback={null}>
              <MapView
                bounds={GAUTENG_BOUNDS}
                ariaLabel={m.map_aria_label()}
                areas={townships}
                areaBoundaries={townshipAreas}
                visibleLayerIds={visibleLayerIds}
                basemap={basemap}
                selectedFeatureId={selectedFeatureId}
                focusLocationTarget={focusLocationTarget}
                onFeatureSelect={setSelectedFeatureId}
                onSelectableFeaturesChange={setSelectableFeatures}
                onLayerDataError={setFailedLayerIds}
                onReady={handleMapReady}
                onBasemapError={() => setBasemap("street")}
                formatSelectionAnnouncement={formatSelectionAnnouncement}
                locationContextMenu
                locationContextMenuProvider={locationSearchProvider}
                locationContextMenuLabels={locationContextMenuLabels}
                measurementTool
                measurementLabels={measurementLabels}
                measurementPanelOpen={!isDesktopViewport && panelOpen}
                onMeasurementPanelClose={closePanel}
                measurementRequest={measurementRequest}
                renderFeaturePopup={renderFeaturePopup}
              />
            </Suspense>
          )}
          {dataError ? (
            <div
              className={styles.dataError}
              role="alert"
              data-testid="data-load-error"
              data-e2e="data-load-error"
            >
              <p>{m.data_load_error()}</p>
              <button
                type="button"
                data-testid="retry-data-load"
                data-e2e="retry-data-load"
                onClick={() => setLoadAttempt((value) => value + 1)}
              >
                {m.retry()}
              </button>
            </div>
          ) : null}
        </main>

        <div className={clsx(styles.locationSearchControl, styles.surface)}>
          <p className={styles.appName} data-testid="app-name">
            {m.app_title()}
          </p>
          <LocationSearchControl
            placeholder={m.search_placeholder()}
            label={m.search_label()}
            ariaLabel={m.search_aria_label()}
            clearButtonLabel={m.search_clear()}
            searchingLabel={m.search_searching()}
            noResultsLabel={m.search_no_results()}
            unavailableMessage={m.search_unavailable()}
            provider={locationSearchProvider}
            onLocationSelect={handleLocationSelect}
            onQueryChange={() => setOutOfCoverageLocationLabel(null)}
            selectableFeatures={selectableFeatures}
            onFeatureSelect={setSelectedFeatureId}
          />
          {outOfCoverageLocationLabel ? (
            <output
              className={styles.outOfCoverage}
              data-testid="location-out-of-coverage"
              data-e2e="location-out-of-coverage"
            >
              {m.location_out_of_coverage({
                location: outOfCoverageLocationLabel,
              })}
            </output>
          ) : null}
        </div>

        <ControlButton
          ref={panelTriggerRef}
          className={styles.panelTrigger}
          shape="pill"
          data-testid="panel-toggle"
          data-e2e="panel-toggle"
          aria-expanded={panelOpen}
          aria-controls="map-controls"
          label={panelToggleLabel}
          onClick={handlePanelToggle}
        >
          {panelOpen ? <X aria-hidden="true" /> : <Layers aria-hidden="true" />}
          <span className={styles.panelTriggerLabel} aria-hidden="true">
            {panelToggleLabel}
          </span>
        </ControlButton>

        {isDesktopViewport ? (
          <DesktopLegend
            visibleLayerIds={visibleLayerIds}
            suppressed={settingsOpen}
            title={m.legend_title()}
            legendLabels={legendLabels}
          />
        ) : (
          <MobileLegend
            visibleLayerIds={visibleLayerIds}
            suppressed={false}
            panelOpen={panelVisuallyOpen}
            panelExpanded={mobilePanelExpanded}
            title={m.legend_title()}
            openLabel={m.legend_open()}
            closeLabel={m.legend_close()}
            legendLabels={legendLabels}
          />
        )}

        <aside
          id="map-controls"
          ref={panelRef}
          className={clsx(styles.panel, styles.surface)}
          data-testid="panel-container"
          data-e2e="panel-container"
          data-panel-size={resolvePanelSizeAttr(mobilePanelExpanded)}
          data-panel-dragging={toBoolAttr(mobileSheetDragging)}
          data-panel-drag-direction={mobileSheetDragDirection}
          data-panel-closing={toBoolAttr(mobileSheetClosing)}
          style={mobilePanelDragStyle}
          hidden={!panelOpen}
          onAnimationEnd={handleSheetAnimationEnd}
        >
          <button
            type="button"
            className={styles.sheetHandleButton}
            data-testid="panel-sheet-handle"
            data-e2e="panel-sheet-handle"
            data-dragging={toBoolAttr(mobileSheetDragging)}
            data-drag-direction={mobileSheetDragDirection}
            aria-pressed={mobilePanelExpanded}
            aria-label={
              mobilePanelExpanded
                ? m.panel_reduce_height()
                : m.panel_expand_height()
            }
            onPointerDown={handleSheetHandlePointerDown}
            onClick={handleSheetHeightToggle}
          >
            <span className={styles.sheetHandle} aria-hidden="true" />
          </button>
          {panelViews.length > 1 ? (
            <>
              <div
                className={styles.panelTabs}
                role="tablist"
                aria-label={m.panel_tablist_aria_label()}
                data-testid="panel-tablist"
                data-e2e="panel-tablist"
              >
                {panelViews.map((view, index) => (
                  <button
                    key={view}
                    type="button"
                    data-testid={`panel-tab-${view}`}
                    data-e2e={`panel-tab-${view}`}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    id={`panel-tab-${view}`}
                    role="tab"
                    tabIndex={panelView === view ? 0 : -1}
                    aria-selected={panelView === view}
                    aria-controls={`panel-view-${view}`}
                    className={styles.panelTab}
                    onClick={() => setPanelView(view)}
                    onKeyDown={handleTabKeyDown}
                  >
                    {panelLabels[view]}
                  </button>
                ))}
              </div>
              <div
                {...PANEL_VIEWPORT_PROPS}
                id={`panel-view-${panelView}`}
                role="tabpanel"
                aria-labelledby={`panel-tab-${panelView}`}
                // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA APG recommends tabindex=0 on a tabpanel so keyboard users can reach panels (like Story) whose content has no focusable element of its own
                tabIndex={0}
              >
                {panelViewContent}
              </div>
            </>
          ) : (
            <div {...PANEL_VIEWPORT_PROPS} ref={singleViewRef} tabIndex={-1}>
              {panelViewContent}
            </div>
          )}
        </aside>

        <div className={styles.settingsControl}>
          <SettingsMenu
            basemap={basemap}
            onBasemapChange={setBasemap}
            themePreference={themePreference}
            onThemePreferenceChange={setThemePreference}
            onOpenChange={setSettingsOpen}
          >
            <LanguageToggle />
            <PrivacyLink />
          </SettingsMenu>
        </div>
      </div>
    </DomainProvider>
  );
}
