import { DEFAULT_DOMAIN_ID, METROS } from "@karta/app";
import type {
  DomainConfig,
  DomainStory as DomainStoryContent,
  Layer,
} from "@karta/core";
import {
  buildFeatureBrowserEntries,
  ControlButton,
  createNominatimGeocoderProvider,
  DesktopLegend,
  DomainProvider,
  FeatureBrowser,
  type FeatureBrowserEntry,
  FeaturePopup,
  LocationSearchControl,
  type LocationSearchResult,
  MobileLegend,
  type SelectableFeatureSearchEntry,
  SettingsMenu,
  useDismissableOverlay,
  useLayerData,
} from "@karta/map";
import {
  MOBILE_BREAKPOINT_PX,
  setThemePreference,
  useIsDesktopViewport,
  useThemePreference,
} from "@karta/react";
import clsx from "clsx";
import { Layers, X } from "lucide-react";
import {
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  lazy,
  type PointerEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./App.module.css";
import { DomainStory } from "./components/DomainStory/DomainStory";
import { DomainSwitcher } from "./components/DomainSwitcher/DomainSwitcher";
import { LanguageToggle } from "./components/LanguageToggle/LanguageToggle";
import { LayerToggles } from "./components/LayerToggles/LayerToggles";
import { PrivacyLink } from "./components/PrivacyLink/PrivacyLink";
import { useMapModelContextTools } from "./hooks/useMapModelContextTools";
import { useMapPermalink } from "./hooks/useMapPermalink";
import { getLocalizedDomain } from "./layers/registry";
import { m } from "./paraglide/messages.js";
import { type PanelView, useMapUiStore } from "./stores/useMapUiStore";
import { resolvePopupFields } from "./utils/featurePopupFields";

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

interface PanelViewContentProps {
  panelView: PanelView;
  visibleLayerIds: string[];
  onToggle: (id: string) => void;
  failedLayerIds: string[];
  story: DomainStoryContent | undefined;
  browsableLayer: Layer | undefined;
  browseEntries: FeatureBrowserEntry[];
  selectedFeatureId: string | null;
  onSelectFeature: (id: string) => void;
}

/** Renders the info panel's active view: layer toggles, a browsable layer's feature list, or the domain's story copy. */
function PanelViewContent({
  panelView,
  visibleLayerIds,
  onToggle,
  failedLayerIds,
  story,
  browsableLayer,
  browseEntries,
  selectedFeatureId,
  onSelectFeature,
}: PanelViewContentProps) {
  if (panelView === "story" && story) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{story.title}</h2>
        <DomainStory story={story} />
      </section>
    );
  }
  if (panelView === "browse" && browsableLayer?.browsable) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{browsableLayer.label}</h2>
        <FeatureBrowser
          ariaLabel={m.browse_list_aria_label({ layer: browsableLayer.label })}
          entries={browseEntries}
          selectedId={selectedFeatureId}
          onSelect={onSelectFeature}
          searchable={browsableLayer.browsable.searchable}
          searchPlaceholder={m.browse_search_placeholder()}
          emptyMessage={m.browse_empty_message()}
        />
      </section>
    );
  }
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{m.panel_tab_layers()}</h2>
      <LayerToggles
        visibleLayerIds={visibleLayerIds}
        onToggle={onToggle}
        failedLayerIds={failedLayerIds}
      />
    </section>
  );
}

/** Props for `App`. */
export interface AppProps {
  /** The domain to render, as a registered `@karta/app` `DOMAINS` id. Defaults to `DEFAULT_DOMAIN_ID`, matching every route before `/d/:domainId` routing existed. */
  domainId?: string;
}

/** Props for `AppShell`. */
interface AppShellProps {
  /** The routed domain id, unchanged from `AppProps.domainId`. */
  domainId: string;
  /** The active domain's resolved, locale-localized config, computed once by `App` and threaded through as a prop rather than read via `useDomain()` here — `AppShell` runs inside the very `DomainProvider` this value seeds, so it can't consume that context itself. */
  domain: DomainConfig;
}

/**
 * Thin outer component: resolves the active domain once per locale/domainId
 * pair and seeds `DomainProvider` with it, then renders `AppShell` for
 * everything else. Split out specifically so hooks that legitimately depend
 * on `useDomain()` (like `@karta/map`'s `useLayerData`) can be called from
 * `AppShell`'s own body — a component can't consume a context provider it
 * instantiates itself in the same render, since hooks run before that
 * provider's JSX commits.
 * @param domainId See `AppProps`.
 */
export function App({ domainId = DEFAULT_DOMAIN_ID }: AppProps = {}) {
  /**
   * Resolved fresh per render via `getLocalizedDomain` (never cached at
   * module scope), matching the per-request-locale discipline
   * `layers/registry.ts` already documents — `domainId` itself is stable
   * for `App`'s whole mounted lifetime (switching domains is a full-document
   * navigation, not a prop change), so this only actually recomputes when
   * the locale does.
   */
  const domain = useMemo(() => getLocalizedDomain(domainId), [domainId]);
  return (
    <DomainProvider domain={domain}>
      <AppShell domainId={domainId} domain={domain} />
    </DomainProvider>
  );
}

/**
 * The reference app's inner shell: fetches every visible layer's data via
 * `@karta/map`'s `useLayerData`, and renders the map alongside the
 * desktop/mobile info panel and its settings menu.
 * @remarks That fetch deliberately waits for `MapView`'s `onReady` (tracked
 *   as `mapReady`) rather than starting at mount — `useLayerData(mapReady ?
 *   visibleLayerIds : [])` passes an empty array until then. Downloading,
 *   validating and handing Leaflet the default choropleth's ~2,500 polygons
 *   is seconds of main-thread work on a mid-range phone, and none of it can
 *   be drawn before the map exists — started at mount it simply ran in
 *   front of the map's own first paint and delayed it by all of that.
 *   `failedLayerIds`/`retryFailedLayers` (from that same `useLayerData`
 *   call) drive the data-load-error banner and its retry button; `MapView`
 *   itself does no fetching of its own and just renders whatever `data`/
 *   `companionData` it's handed. The info panel shows layer toggles, plus a
 *   Story tab reading its copy from the domain's `story` whenever the
 *   active domain defines
 *   one — a domain that omits `story` gets no tab UI at all, matching
 *   today's single-view panel. `domain` is received as a prop from `App`
 *   (see that component's own doc comment), which resolves it from the
 *   routed `domainId` (see `routes/domain.tsx`'s loader), defaulting to
 *   `DEFAULT_DOMAIN_ID` for any caller that doesn't pass one (e.g. this
 *   package's own tests); `panelViews`/`panelLabels` are computed inside
 *   `AppShell`'s own body, not at module scope: their content is
 *   locale-dependent (`getLocalizedDomain()` and the `m.panel_tab_*()` calls
 *   both read the current request's locale), and Cloudflare Workers reuse
 *   isolates across requests — a module-scope value would freeze in
 *   whichever locale first touched that isolate instead of reflecting each
 *   request's own. `panelViews`/`panelLabels` are cheap enough to recompute
 *   every render.
 *   Also owns the mobile bottom-sheet drag/swipe gesture state (pointer
 *   sampling, velocity-based snap projection) in addition to layout state
 *   from `useMapUiStore`. Swiping down from the sheet's medium height closes
 *   it entirely: `closePanel` plays an exit animation and `finishClose`
 *   (unmounting the panel from the a11y tree) fires from that animation's
 *   `animationend`, so the CSS duration in App.module.css stays the single
 *   source of truth — except under `prefers-reduced-motion`/desktop, where
 *   no animation plays and `closePanel` calls `finishClose` immediately.
 *   `useMapModelContextTools` registers this app's layer/search/basemap/theme/
 *   story capabilities as WebMCP tools; `handleLocationSelect` is shared
 *   between `LocationSearchControl`'s `onLocationSelect` and that hook's
 *   `search-map-location` tool, so a human picking a result and an agent
 *   calling the tool fly the map the same way. `useMapPermalink` restores
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
 * @param domainId The routed domain id, unchanged from `AppShellProps`.
 * @param domain The active domain's resolved, locale-localized config, unchanged from `AppShellProps`.
 */
function AppShell({ domainId, domain }: AppShellProps) {
  const [hydrated, setHydrated] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectableFeatures, setSelectableFeatures] = useState<
    SelectableFeatureSearchEntry[]
  >([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobilePanelExpanded, setMobilePanelExpanded] = useState(false);
  const [mobileSheetDragOffset, setMobileSheetDragOffset] = useState(0);
  const [mobileSheetDragging, setMobileSheetDragging] = useState(false);
  const [mobileSheetClosing, setMobileSheetClosing] = useState(false);
  const [focusLocationTarget, setFocusLocationTarget] =
    useState<FocusLocationTarget | null>(null);
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
  const initializeForDomain = useMapUiStore(
    (state) => state.initializeForDomain,
  );
  const themePreference = useThemePreference();
  const story = domain.story;
  /** The active domain's browsable layer, if it has one — drives whether a Browse tab exists at all. Only one is supported today (matching both shipped domains); a future domain with more than one would just get the first. */
  const browsableLayer = useMemo(
    () => domain.layers.find((layer) => layer.browsable),
    [domain.layers],
  );
  /**
   * Memoised (not just `story`/`browsableLayer`-derived inline) so this
   * array keeps one identity across renders unless those change --
   * `useCallback` dependencies below (`resolveInitialPanelFocusTarget`) key
   * off it, and a fresh array literal every render would defeat that
   * memoisation and re-attach `useDismissableOverlay`'s listeners on every
   * unrelated render.
   */
  const panelViews = useMemo<readonly PanelView[]>(() => {
    const views: PanelView[] = ["layers"];
    if (browsableLayer) {
      views.push("browse");
    }
    if (story) {
      views.push("story");
    }
    return views;
  }, [story, browsableLayer]);
  const panelLabels: Record<PanelView, string> = {
    layers: m.panel_tab_layers(),
    browse: m.panel_tab_browse(),
    story: m.panel_tab_story(),
  };
  const isDesktopViewport = useIsDesktopViewport();
  const panelTriggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const singleViewRef = useRef<HTMLDivElement>(null);
  const suppressNextHandleClickRef = useRef(false);
  const activeSheetPointerIdRef = useRef<number | null>(null);
  const pendingSheetDragOffsetRef = useRef(0);
  const sheetDragFrameRef = useRef<number | null>(null);

  /**
   * Also calls `initializeForDomain(domainId)` first, in the same effect —
   * this is what populates `useMapUiStore`'s real `visibleLayerIds`
   * defaults (module scope starts empty, so SSR and the client's
   * pre-hydration render agree with nothing to mismatch over) and enforces
   * each layer group's `selectionMode` for whichever domain is actually
   * active, not just `gauteng-spatial-legacy`'s.
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
    initializeForDomain(domainId);
    setHydrated(true);
    if (window.innerWidth > MOBILE_BREAKPOINT_PX) {
      setPanelOpen(true);
    }
  }, [domainId, initializeForDomain, setPanelOpen]);

  /**
   * Deliberately `mapReady ? visibleLayerIds : []` rather than
   * `visibleLayerIds` alone -- see the mount effect above for why nothing
   * can start fetching layer data before the map itself has painted.
   */
  const { data, companionData, failedLayerIds, retryFailedLayers } =
    useLayerData(mapReady ? visibleLayerIds : []);

  /**
   * `resolveGroupLabel` is Gauteng-specific domain knowledge (mapping a
   * `metroId` grouping value to its municipality's display name) — it stays
   * here, not in `@karta/map`'s `buildFeatureBrowserEntries`, matching every
   * other domain-specific concern (popup content, search coverage bounds)
   * already kept local to this app rather than the SDK. A grouping value
   * with no matching metro (or a future domain grouping by something else
   * entirely) falls back to the raw id itself, via
   * `buildFeatureBrowserEntries`'s own default.
   */
  const browseEntries = useMemo(() => {
    if (!browsableLayer?.browsable) {
      return [];
    }
    return buildFeatureBrowserEntries(
      browsableLayer.browsable,
      data[browsableLayer.id],
      (groupId) => METROS.find((metro) => metro.id === groupId)?.shortName,
    );
  }, [browsableLayer, data]);

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
      if (sheetDragFrameRef.current !== null) {
        cancelAnimationFrame(sheetDragFrameRef.current);
      }
    };
  }, []);

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

  function scheduleSheetDragOffset(nextOffset: number) {
    pendingSheetDragOffsetRef.current = nextOffset;
    if (sheetDragFrameRef.current !== null) {
      return;
    }
    sheetDragFrameRef.current = requestAnimationFrame(() => {
      setMobileSheetDragOffset(pendingSheetDragOffsetRef.current);
      sheetDragFrameRef.current = null;
    });
  }

  const handleMapReady = useCallback(() => setMapReady(true), []);

  /**
   * Renders a selected feature's popup markup for `MapView`, via
   * `resolvePopupFields` matching `properties` back to whichever of
   * `domain`'s layers it came from (see that function's own remarks).
   * @remarks Depends on `domain`/`data`, unlike most memoised callbacks in
   *   this file, so it can't stay referentially stable across renders that
   *   change either — `MapView` doesn't depend on that stability for
   *   correctness (it reads the latest value through its own ref
   *   internally), so this is a real, unavoidable tradeoff rather than a
   *   regression: `resolvePopupFields` needs both to identify the clicked
   *   feature's source layer.
   */
  const renderFeaturePopup = useCallback(
    (properties: Record<string, unknown>) => (
      <FeaturePopup
        title={typeof properties.name === "string" ? properties.name : ""}
        properties={properties}
        fields={resolvePopupFields(properties, domain, data)}
      />
    ),
    [domain, data],
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

  useMapModelContextTools({
    onLocationSelect: handleLocationSelect,
    story,
    onShowStory: () => {
      setPanelView("story");
      setPanelOpen(true);
    },
    layers: domain.layers,
  });

  useMapPermalink({
    dataReady: Object.keys(data).length > 0,
    layers: domain.layers,
  });

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
   */
  function handlePanelToggle() {
    if (panelOpen) {
      closePanel();
      return;
    }
    setMobilePanelExpanded(false);
    setPanelOpen(true);
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
      const elapsedMs = Math.max(
        1,
        lastSample.timestamp - firstSample.timestamp,
      );
      const velocityPxPerSecond =
        ((lastSample.y - firstSample.y) / elapsedMs) * 1000;
      const projectedDelta =
        delta +
        (velocityPxPerSecond / 1000) *
          (SHEET_PROJECTION_DECELERATION / (1 - SHEET_PROJECTION_DECELERATION));

      if (
        Math.abs(delta) < SHEET_DRAG_THRESHOLD_PX &&
        Math.abs(projectedDelta) < SHEET_DRAG_THRESHOLD_PX
      ) {
        cleanup();
        return;
      }
      suppressNextHandleClickRef.current = true;
      if (projectedDelta < 0) {
        setMobilePanelExpanded(true);
      } else if (mobilePanelExpanded) {
        setMobilePanelExpanded(false);
      } else {
        closePanel();
      }
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
      browsableLayer={browsableLayer}
      browseEntries={browseEntries}
      selectedFeatureId={selectedFeatureId}
      onSelectFeature={setSelectedFeatureId}
    />
  );

  const panelToggleLabel = panelOpen
    ? m.panel_toggle_close()
    : m.panel_toggle_explore();

  return (
    <div
      className={styles.app}
      data-panel-open={panelVisuallyOpen ? "true" : "false"}
      data-panel-size={mobilePanelExpanded ? "full" : "medium"}
      data-panel-dragging={mobileSheetDragging ? "true" : "false"}
      data-panel-drag-direction={mobileSheetDragDirection}
      data-entrance-ready={mapReady ? "true" : "false"}
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
              layerData={data}
              companionData={companionData}
              visibleLayerIds={visibleLayerIds}
              basemap={basemap}
              selectedFeatureId={selectedFeatureId}
              focusLocationTarget={focusLocationTarget}
              onFeatureSelect={setSelectedFeatureId}
              onSelectableFeaturesChange={setSelectableFeatures}
              onReady={handleMapReady}
              onBasemapError={() => setBasemap("street")}
              locationContextMenu
              locationContextMenuProvider={locationSearchProvider}
              measurementTool
              measurementPanelOpen={!isDesktopViewport && panelOpen}
              onMeasurementPanelClose={closePanel}
              renderFeaturePopup={renderFeaturePopup}
            />
          </Suspense>
        )}
        {failedLayerIds.length > 0 ? (
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
              onClick={retryFailedLayers}
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
        />
      ) : (
        <MobileLegend
          visibleLayerIds={visibleLayerIds}
          suppressed={false}
          panelOpen={panelVisuallyOpen}
          panelExpanded={mobilePanelExpanded}
        />
      )}

      <aside
        id="map-controls"
        ref={panelRef}
        className={clsx(styles.panel, styles.surface)}
        data-testid="panel-container"
        data-e2e="panel-container"
        data-panel-size={mobilePanelExpanded ? "full" : "medium"}
        data-panel-dragging={mobileSheetDragging ? "true" : "false"}
        data-panel-drag-direction={mobileSheetDragDirection}
        data-panel-closing={mobileSheetClosing ? "true" : "false"}
        style={mobilePanelDragStyle}
        hidden={!panelOpen}
        onAnimationEnd={handleSheetAnimationEnd}
      >
        <button
          type="button"
          className={styles.sheetHandleButton}
          data-testid="panel-sheet-handle"
          data-e2e="panel-sheet-handle"
          data-dragging={mobileSheetDragging ? "true" : "false"}
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
          <DomainSwitcher activeDomainId={domainId} />
          <LanguageToggle />
          <PrivacyLink />
        </SettingsMenu>
      </div>
    </div>
  );
}
