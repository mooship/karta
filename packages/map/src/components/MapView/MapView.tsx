import {
  createLayerConfig,
  type Layer as DomainLayer,
  type LeafletLayerConfig,
  resolveThemedColor,
} from "@karta/core";
import {
  getViewportWidth,
  MOBILE_BREAKPOINT_PX,
  useLatestRef,
  useResolvedDarkTheme,
} from "@karta/react";
import type { Feature, FeatureCollection } from "geojson";
import {
  circleMarker,
  LatLng,
  type LatLngBounds,
  type Layer,
  type LeafletMouseEvent,
} from "leaflet";
import {
  type ComponentType,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type GeoJSONProps,
  GeoJSON as LeafletGeoJSON,
  MapContainer,
  Pane,
  ScaleControl,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import {
  type Basemap,
  type BasemapTileSource,
  getBasemapDefinition,
  getBasemapTileSources,
  resolveTileScaleToken,
} from "../../constants/basemaps";
import { AREA_OUTLINE } from "../../constants/mapStyles";
import { useDomain } from "../../context/DomainContext";
import type {
  GeocoderProvider,
  LocationSearchResult,
} from "../../data/locationSearch";
import { type LayerDataMap, useLayerData } from "../../hooks/useLayerData";
import type { SelectableFeatureSearchEntry } from "../LocationSearchControl/LocationSearchControl";
import { formatMeasurementResult } from "../MeasurementControl/formatMeasurementResult";
import {
  MeasurementControl,
  type MeasurementControlLabels,
  type MeasurementMode,
} from "../MeasurementControl/MeasurementControl";
import {
  LocationContextMenu,
  type LocationContextMenuLabels,
} from "./LocationContextMenu";
import * as styles from "./MapView.css";
import { MeasurementLayer } from "./MeasurementLayer";
import { VectorBasemapLayer } from "./VectorBasemapLayer";

/**
 * `@types/leaflet`'s `GeoJSONOptions` omits `smoothFactor`, even though
 * react-leaflet forwards it straight through to Leaflet's `GeoJSON`
 * constructor for every Polyline/Polygon layer it creates (`{ data,
 * ...options }` in `createPathComponent`'s `createGeoJSON`, unlike
 * `pathOptions`, which is only applied post-construction via `setStyle`).
 * Widen the prop type locally rather than dropping the (real,
 * behaviour-affecting) `smoothFactor={0}` usage below.
 */
const GeoJSON = LeafletGeoJSON as ComponentType<
  GeoJSONProps & { smoothFactor?: number }
>;

/**
 * Props accepted by {@link MapView}.
 * @typeParam TProperties - The shape of a selectable feature's GeoJSON
 *   `properties`, so `renderFeaturePopup` receives the caller's own domain
 *   type rather than an untyped record.
 * @remarks Exported so a consumer importing `@karta/map/MapView` (the only
 *   entry point for this component, since the package barrel deliberately
 *   omits it to preserve the Leaflet bundle split) can name this type when
 *   wrapping or re-typing the component.
 */
export interface MapViewProps<
  TProperties extends Record<string, unknown> = Record<string, unknown>,
> {
  bounds: [[number, number], [number, number]];
  /** The accessible name for the map region, e.g. "Map of flood risk near Cape Town". */
  ariaLabel: string;
  areas: Feature[];
  areaBoundaries?: Feature[];
  visibleLayerIds: string[];
  basemap?: Basemap;
  selectedFeatureId?: string | null;
  focusLocationTarget?: {
    token: number;
    location: LocationSearchResult;
  } | null;
  onFeatureSelect?: (featureId: string) => void;
  /**
   * Called with the current set of selectable features (id + accessible
   * label) whenever it changes, e.g. because `visibleLayerIds` or the
   * underlying feature data changed. Lets a caller feed these into its own
   * `LocationSearchControl` as `selectableFeatures`, so a visitor can search
   * for a map feature by name from the same box used for place search --
   * `MapView` itself renders no feature-search UI of its own.
   */
  onSelectableFeaturesChange?: (
    entries: SelectableFeatureSearchEntry[],
  ) => void;
  renderFeaturePopup?: (properties: TProperties) => ReactNode;
  /** Called with the ids of overlay layers whose data failed to load, whenever that set changes. */
  onLayerDataError?: (failedLayerIds: string[]) => void;
  /**
   * Called if the current vector basemap's style fails to load, so a caller
   * can fall back to another basemap instead of leaving the map blank.
   */
  onBasemapError?: (basemap: Basemap, error: unknown) => void;
  /**
   * When `true`, right-clicking (desktop) or long-pressing (mobile) the map
   * opens a small context menu offering to reverse-geocode that point.
   * Defaults to `false`.
   */
  locationContextMenu?: boolean;
  /**
   * Geocoder backend used for that context menu's reverse lookup. Defaults
   * to OpenStreetMap Nominatim. Pass the same `GeocoderProvider` given to
   * `LocationSearchControl` if a caller wants both to agree on a non-default
   * backend.
   */
  locationContextMenuProvider?: GeocoderProvider;
  /** Overridable copy for that context menu, forwarded straight through to `LocationContextMenu`. Every field defaults to English. */
  locationContextMenuLabels?: LocationContextMenuLabels;
  /**
   * When `true`, shows a toggleable control for measuring straight-line
   * distance or enclosed area by clicking points on the map. Defaults to
   * `false`.
   */
  measurementTool?: boolean;
  /** Overridable copy for that control, forwarded straight through to `MeasurementControl`. Every field defaults to English. */
  measurementLabels?: MeasurementControlLabels;
  /**
   * Whether the caller's own overlapping panel (if it has one — e.g. an
   * info/layers panel rendered alongside `MapView`) is currently open.
   * Passed straight through to the measurement tool's control (see
   * `MeasurementControl`'s `panelOpen` prop) so it collapses to its idle
   * toggle, and to gating map click handling (see `measurementInteractive`
   * below), while that panel's own mobile layout is claiming most of the
   * screen. Defaults to `false`; harmless to omit for a caller with no such
   * panel.
   */
  measurementPanelOpen?: boolean;
  /**
   * Called when the measurement toggle is tapped while `measurementPanelOpen`
   * is `true` (see `MeasurementControl`'s `onRequestPanelClose`). The caller
   * is expected to close its own overlapping panel in response, since that's
   * the only reason the toggle stopped opening the measurement tool directly.
   * Omit for a caller with no such panel, or no way to close it.
   */
  onMeasurementPanelClose?: () => void;
  /**
   * Externally requests the measurement tool show a specific line/polygon,
   * replacing any points already drawn and opening the tool if it's
   * currently closed. Has no effect while `measurementTool` is `false`,
   * since there's no control to show the result in -- but isn't discarded
   * either, so a request received just before `measurementTool` turns `true`
   * still applies once it does. `token` must change (e.g. via `Date.now()`)
   * each time a new request should apply -- mirroring `focusLocationTarget`
   * -- since two requests with identical `mode`/`points` would otherwise be
   * indistinguishable from a no-op re-render.
   * @remarks Exists so a caller can drive the same on-screen tool a human's
   *   clicks would (e.g. from a WebMCP tool geocoding named locations),
   *   rather than reporting a measurement result invisibly.
   */
  measurementRequest?: {
    token: number;
    mode: MeasurementMode;
    points: { lat: number; lng: number }[];
  } | null;
  /**
   * Called once, after Leaflet has initialised the map and the browser has
   * painted it.
   * @remarks Exists so a caller can hold its own bulk feature data back
   *   until the map itself is on screen. Fetching, parsing and handing
   *   Leaflet a large `areas` collection is seconds of main-thread work on a
   *   mid-range phone; started at mount it lands in the same frame as the
   *   map's own first paint and pushes Largest Contentful Paint out by all
   *   of it, for content the map cannot draw until the basemap exists
   *   anyway.
   */
  onReady?: () => void;
  /**
   * Builds the `aria-live` announcement read out when a feature becomes
   * selected (by click/tap, or a caller driving `selectedFeatureId`
   * externally), from that feature's own accessible label. Defaults to
   * `` (label) => `${label} selected` ``.
   */
  formatSelectionAnnouncement?: (label: string) => string;
}

const DEFAULT_FORMAT_SELECTION_ANNOUNCEMENT = (label: string) =>
  `${label} selected`;

const AREA_PANE = "areas";
const AREA_OUTLINE_PANE = "area-outlines";
const TRANSIT_PANE = "transit";
/** Constant, so react-leaflet doesn't re-apply it to every outline layer on each render. */
const AREA_OUTLINE_PATH_OPTIONS = {
  pane: AREA_OUTLINE_PANE,
  fillOpacity: 0,
  interactive: false,
} as const;
const AREA_CLICK_DELAY_MS = 220;
const PRIMARY_LABEL_REVEAL_ZOOM = 10;
const SECONDARY_LABEL_REVEAL_ZOOM = 12;
const MAJOR_PRIMARY_LABEL_MIN_SUBPLACES = 12;
const OVERVIEW_ZOOM_THRESHOLD = 9;
const DETAIL_ZOOM_THRESHOLD = 11;

/** `pathOptions.opacity` for an area-outline feature, tiered by theme and label priority. */
function getAreaBoundaryOpacity(dark: boolean, isSecondary: boolean): number {
  if (dark) {
    return isSecondary ? 0.42 : 0.62;
  }
  return isSecondary ? 0.72 : 1;
}

/** `pathOptions.weight` for an area-outline feature, tiered by theme, label priority, and zoom. */
function getAreaBoundaryWeight(
  dark: boolean,
  isSecondary: boolean,
  isOverviewZoom: boolean,
): number {
  if (dark) {
    return isSecondary ? 1 : isOverviewZoom ? 1 : 2;
  }
  if (isSecondary) {
    return isOverviewZoom ? 1 : 2;
  }
  return isOverviewZoom ? 2 : 4;
}

/** Resolves a tile-source cycling state's index, falling back to 0 once `state.mode` is stale (a basemap/theme change reset the cycle). */
function resolveTileSourceIndex(
  state: { mode: string; index: number },
  mode: string,
): number {
  return state.mode === mode ? state.index : 0;
}

type SelectableFeatureLayer = Layer & {
  feature?: Feature;
  bindPopup?: (content: string) => SelectableFeatureLayer;
  getPopup?: () => unknown;
  openPopup?: () => void;
  getBounds?: () => LatLngBounds;
};

function getDevicePixelRatio(): number {
  /* v8 ignore start -- SSR guard, see getViewportWidth above */
  if (typeof window === "undefined") {
    return 1;
  }
  /* v8 ignore stop */

  return window.devicePixelRatio;
}

function getBoundsOptions(desktop: boolean) {
  return desktop
    ? {
        paddingTopLeft: [32, 96] as [number, number],
        paddingBottomRight: [540, 48] as [number, number],
      }
    : { padding: [24, 24] as [number, number] };
}

/**
 * Binds `renderFeaturePopup`'s markup to `featureLayer`, unless it already
 * has a popup bound.
 * @returns A promise that settles once the popup is bound (or immediately,
 *   when there is nothing to bind), so callers can open the popup after it
 *   exists.
 * @remarks Imports `react-dom/server` dynamically, purely for payload:
 *   React's server renderer is ~70KB compressed and, statically imported, it
 *   lands in the same eagerly-fetched vendor chunk as `react`/`react-dom` —
 *   bytes every visitor pays for on the critical path to the map's first
 *   paint, to render markup that only exists once somebody clicks a
 *   feature. As its own chunk it is fetched on that first click instead; the
 *   module loader's own cache (not a hand-rolled one here) makes every
 *   subsequent call resolve without re-fetching it.
 */
async function bindSelectedFeaturePopup<
  TProperties extends Record<string, unknown>,
>(
  featureLayer: SelectableFeatureLayer,
  properties: TProperties,
  renderFeaturePopup?: (properties: TProperties) => ReactNode,
): Promise<void> {
  if (featureLayer.getPopup?.()) {
    return;
  }
  if (!renderFeaturePopup) {
    return;
  }
  const { renderToStaticMarkup } = await import("react-dom/server");
  featureLayer.bindPopup?.(
    renderToStaticMarkup(renderFeaturePopup(properties)),
  );
}

/**
 * Resolves a feature's accessible/searchable label from `labelField`
 * (defaulting to `properties.name` when the field is missing or non-string).
 */
function resolveFeatureLabel(
  properties: Record<string, unknown>,
  labelField: string,
): string {
  const labelValue = properties[labelField];
  return typeof labelValue === "string"
    ? labelValue
    : String(properties.name ?? "");
}

/** A visible layer's own selectable-feature data, or `undefined` if it isn't selectable or hasn't loaded yet. */
function resolveSelectableLayerData(
  layer: DomainLayer,
  areaData: FeatureCollection,
  overlayData: LayerDataMap,
): FeatureCollection | undefined {
  if (!layer.interaction?.selectable) {
    return undefined;
  }
  return layer.geometryKind === "choropleth" ? areaData : overlayData[layer.id];
}

/** Converts a selectable layer's raw features into search entries, skipping any feature with no string `id`. */
function buildFeatureSearchEntries(
  data: FeatureCollection,
  layerId: string,
  labelField: string,
): SelectableFeatureSearchEntry[] {
  const layerEntries: SelectableFeatureSearchEntry[] = [];
  for (const feature of data.features) {
    const properties = feature.properties as Record<string, unknown> | null;
    const featureId = properties?.id;
    if (!properties || typeof featureId !== "string") {
      continue;
    }
    layerEntries.push({
      id: featureId,
      label: resolveFeatureLabel(properties, labelField),
      layerId,
    });
  }
  return layerEntries;
}

type SelectableEntriesCache = Map<
  string,
  { data: FeatureCollection; entries: SelectableFeatureSearchEntry[] }
>;

/** Returns a layer's cached search entries if `data`'s identity is unchanged, otherwise rebuilds and re-caches them. */
function collectSelectableEntriesForLayer(
  layer: DomainLayer,
  data: FeatureCollection,
  cache: SelectableEntriesCache,
): SelectableFeatureSearchEntry[] {
  const cached = cache.get(layer.id);
  if (cached?.data === data) {
    return cached.entries;
  }
  const labelField = layer.interaction?.labelField ?? "name";
  const layerEntries = buildFeatureSearchEntries(data, layer.id, labelField);
  cache.set(layer.id, { data, entries: layerEntries });
  return layerEntries;
}

/** Drops any cache entry for a layer that wasn't visited this pass (no longer visible/selectable). */
function evictStaleSelectableEntries(
  cache: SelectableEntriesCache,
  seenLayerIds: Set<string>,
): void {
  for (const layerId of cache.keys()) {
    if (!seenLayerIds.has(layerId)) {
      cache.delete(layerId);
    }
  }
}

/**
 * Binds a selectable feature's click/dblclick/remove listeners once, at
 * layer creation.
 * @remarks react-leaflet hands `onEachFeature` to Leaflet's `GeoJSON`
 *   constructor once, at layer creation, and only re-runs it when the `data`
 *   prop's identity changes. Listeners bound here would otherwise close over
 *   whichever `onSelect`/`renderFeaturePopup` happened to be current at
 *   creation time and keep calling those forever, so they're passed as refs
 *   (see {@link useLatestRef}) and dereferenced when the event actually
 *   fires instead. `suppressFeatureClickRef` is read for the same reason and
 *   guards the same click: some other tool (currently just the measurement
 *   tool) can claim exclusive ownership of map clicks — while it does, a
 *   click is meant to feed that tool, not also open this feature's popup and
 *   re-fit the map to it via `SelectedFeatureHighlight`, both of which would
 *   otherwise fire from Leaflet's default click bubbling and yank the view
 *   out from under whatever the other tool is doing.
 */
function bindSelectableFeatureInteractions<
  TProperties extends Record<string, unknown>,
>(
  feature: Feature,
  domainLayer: DomainLayer,
  leafletLayer: Layer,
  layerById: Map<string, SelectableFeatureLayer>,
  onSelectRef: React.RefObject<((featureId: string) => void) | undefined>,
  renderFeaturePopupRef: React.RefObject<
    ((properties: TProperties) => ReactNode) | undefined
  >,
  suppressFeatureClickRef: React.RefObject<boolean>,
) {
  /* v8 ignore start -- unreachable: this function's only call site already gates on `isSelectable` before passing it as `onEachFeature`, but the runtime check (and the type narrowing it gives `domainLayer.interaction` below) stays as this function's own contract in case a second call site is ever added without that gate */
  if (!domainLayer.interaction?.selectable) {
    return;
  }
  /* v8 ignore stop */
  const properties = feature.properties as TProperties | null;
  if (!properties) {
    return;
  }
  const featureId = properties.id;

  if (typeof featureId === "string") {
    layerById.set(featureId, leafletLayer as SelectableFeatureLayer);
  }
  let pendingClickTimeout: ReturnType<typeof setTimeout> | null = null;

  leafletLayer.on("click", (event: LeafletMouseEvent) => {
    if (pendingClickTimeout !== null) {
      clearTimeout(pendingClickTimeout);
      pendingClickTimeout = null;
    }

    const clickCount = event.originalEvent?.detail ?? 1;
    if (clickCount > 1) {
      return;
    }

    pendingClickTimeout = setTimeout(() => {
      pendingClickTimeout = null;
      if (suppressFeatureClickRef.current) {
        return;
      }
      const featureLayer = leafletLayer as SelectableFeatureLayer;
      void bindSelectedFeaturePopup(
        featureLayer,
        properties,
        renderFeaturePopupRef.current,
      ).then(() => featureLayer.openPopup?.());
      if (typeof featureId === "string") {
        onSelectRef.current?.(featureId);
      }
    }, AREA_CLICK_DELAY_MS);
  });

  leafletLayer.on("dblclick", () => {
    if (pendingClickTimeout !== null) {
      clearTimeout(pendingClickTimeout);
      pendingClickTimeout = null;
    }
  });

  leafletLayer.on("remove", () => {
    if (pendingClickTimeout !== null) {
      clearTimeout(pendingClickTimeout);
      pendingClickTimeout = null;
    }
    if (typeof featureId === "string") {
      layerById.delete(featureId);
    }
  });
}

interface SelectedFeatureHighlightProps<
  TProperties extends Record<string, unknown>,
> {
  selectedFeatureId: string | null;
  layerById: React.RefObject<Map<string, SelectableFeatureLayer>>;
  renderFeaturePopupRef: React.RefObject<
    ((properties: TProperties) => ReactNode) | undefined
  >;
}

/**
 * Re-fits the map to, and reopens the popup for, the currently selected
 * feature whenever `selectedFeatureId` changes.
 * @remarks Takes `renderFeaturePopupRef` rather than the popup renderer
 *   itself, via {@link useLatestRef}: an effect keyed only on
 *   `selectedFeatureId` reading the renderer directly would need it in its
 *   dependency array, re-firing (and snapping the map back to the selected
 *   feature) on every render where a caller passes an unmemoised renderer —
 *   reading through the ref sidesteps that without asking every caller to
 *   memoise.
 */
function SelectedFeatureHighlight<TProperties extends Record<string, unknown>>({
  selectedFeatureId,
  layerById,
  renderFeaturePopupRef,
}: SelectedFeatureHighlightProps<TProperties>) {
  const map = useMap();

  useEffect(() => {
    if (!selectedFeatureId) {
      return;
    }
    const featureLayer = layerById.current.get(selectedFeatureId);
    if (!featureLayer) {
      return;
    }
    const properties = featureLayer.feature?.properties as
      | TProperties
      | null
      | undefined;
    const bounds = featureLayer.getBounds?.();
    if (bounds) {
      map.fitBounds(bounds, {
        animate: false,
        maxZoom: 12,
        padding: [40, 40],
      });
    }
    let cancelled = false;
    /* v8 ignore start -- unreachable: layerById only ever gets an entry for a feature whose properties were already truthy at bind time (see bindSelectableFeatureInteractions' own `!properties` guard above), so a featureLayer found here always has truthy feature.properties too */
    const binding = properties
      ? bindSelectedFeaturePopup(
          featureLayer,
          properties,
          renderFeaturePopupRef.current,
        )
      : Promise.resolve();
    /* v8 ignore stop */
    void binding.then(() => {
      if (!cancelled) {
        featureLayer.openPopup?.();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [map, selectedFeatureId, layerById, renderFeaturePopupRef]);

  return null;
}

/**
 * Fires `onReady` once, after Leaflet has initialised the map and the
 * browser has had a frame to paint it.
 * @remarks The `requestAnimationFrame` is the load-bearing part: Leaflet's
 *   `whenReady` resolves as soon as the map has a view, which is still
 *   before the frame containing it reaches the screen. Deferring by a frame
 *   means whatever the caller starts in response cannot contend with that
 *   first paint.
 */
function MapReadyNotifier({ onReady }: { onReady?: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onReady) {
      return;
    }
    let cancelled = false;
    let frame: number | null = null;
    map.whenReady(() => {
      // `whenReady`'s callback has no cancellation of its own — if the map
      // isn't loaded yet, Leaflet just holds onto it via a `load` listener
      // until that event fires, however long after this effect's own
      // cleanup that turns out to be. `cancelled` is what stops a late
      // firing from scheduling a frame (or calling `onReady`) for a
      // component that already unmounted.
      if (cancelled) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = null;
        if (!cancelled) {
          onReady();
        }
      });
    });
    return () => {
      cancelled = true;
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, [map, onReady]);

  return null;
}

function AreaLabelVisibility() {
  const map = useMap();
  const primaryLabelsClass = styles.showPrimaryLabels;
  const secondaryLabelsClass = styles.showSecondaryLabels;

  useEffect(() => {
    /* v8 ignore next 3 -- unreachable: vanilla-extract's style() always resolves these class names to real hashed strings in a real build */
    if (!primaryLabelsClass || !secondaryLabelsClass) {
      return;
    }
    const updateVisibility = () => {
      const zoom = map.getZoom();
      map
        .getContainer()
        .classList.toggle(
          primaryLabelsClass,
          zoom >= PRIMARY_LABEL_REVEAL_ZOOM,
        );
      map
        .getContainer()
        .classList.toggle(
          secondaryLabelsClass,
          zoom >= SECONDARY_LABEL_REVEAL_ZOOM,
        );
    };
    map.on("zoomend", updateVisibility);
    updateVisibility();
    return () => {
      map.off("zoomend", updateVisibility);
    };
  }, [map]);

  return null;
}

function ResponsiveMapBounds({
  bounds,
}: {
  bounds: [[number, number], [number, number]];
}) {
  const map = useMap();
  const desktopRef = useRef(getViewportWidth() > MOBILE_BREAKPOINT_PX);
  const resizeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (resizeFrameRef.current !== null) {
        return;
      }
      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        map.invalidateSize({ animate: false });
        const desktop = getViewportWidth() > MOBILE_BREAKPOINT_PX;
        if (desktop === desktopRef.current) {
          return;
        }
        desktopRef.current = desktop;
        map.fitBounds(bounds, getBoundsOptions(desktop));
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, [map, bounds]);

  return null;
}

function ZoomStateWatcher({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const updateZoom = () => {
      onZoomChange(map.getZoom());
    };

    map.on("zoomend", updateZoom);
    updateZoom();

    return () => {
      map.off("zoomend", updateZoom);
    };
  }, [map, onZoomChange]);

  return null;
}

function FocusLocationTarget({
  focusLocationTarget,
}: {
  focusLocationTarget: { token: number; location: LocationSearchResult } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusLocationTarget) {
      return;
    }

    const bounds = focusLocationTarget.location.bounds;
    if (bounds) {
      map.fitBounds(bounds, {
        animate: false,
        maxZoom: 14,
        padding: [44, 44],
      });
      return;
    }

    const lat = focusLocationTarget.location.latitude;
    const lon = focusLocationTarget.location.longitude;

    map.fitBounds(
      [
        [lat - 0.025, lon - 0.025],
        [lat + 0.025, lon + 0.025],
      ],
      {
        animate: false,
        maxZoom: 13,
        padding: [44, 44],
      },
    );
  }, [focusLocationTarget, map]);

  return null;
}

function bindAreaBoundaryLabel(feature: Feature, layer: Layer) {
  const name = feature.properties?.name;
  const labelPriority = feature.properties?.labelPriority;
  const subPlaceCount = feature.properties?.subPlaceCount;
  const labelOffset = feature.properties?.labelOffset;
  const offset =
    Array.isArray(labelOffset) &&
    labelOffset.length === 2 &&
    typeof labelOffset[0] === "number" &&
    typeof labelOffset[1] === "number"
      ? [labelOffset[0], labelOffset[1]]
      : undefined;
  if (typeof name !== "string") {
    return;
  }
  const isMajorPrimaryLabel =
    labelPriority !== "secondary" &&
    typeof subPlaceCount === "number" &&
    subPlaceCount >= MAJOR_PRIMARY_LABEL_MIN_SUBPLACES;

  layer.bindTooltip(name, {
    permanent: true,
    direction: "center",
    ...(offset ? { offset: offset as [number, number] } : {}),
    className:
      labelPriority === "secondary"
        ? `${styles.areaLabel} ${styles.areaLabelSecondary}`
        : isMajorPrimaryLabel
          ? `${styles.areaLabel} ${styles.areaLabelMajor}`
          : `${styles.areaLabel} ${styles.areaLabelPrimary}`,
  });
}

/**
 * The measurement tool's whole in-progress state, held as one object rather
 * than three separate `useState` calls: toggling `active` and changing
 * `mode` both always discard `points` too, and keeping all three fields
 * together means every handler updates one thing instead of two.
 */
interface MeasurementState {
  active: boolean;
  mode: MeasurementMode;
  points: LatLng[];
}

const INITIAL_MEASUREMENT_STATE: MeasurementState = {
  active: false,
  mode: "distance",
  points: [],
};

/** The raster tile layer's CSS class for the current theme/basemap combination, or `undefined` for an unmodified basemap. */
function resolveTileClassName(
  useDarkTiles: boolean,
  useDimFilter: boolean,
): string | undefined {
  if (useDarkTiles) {
    return styles.darkTile;
  }
  if (useDimFilter) {
    return styles.dimmedTile;
  }
  return undefined;
}

/** Transit stop marker radius, coarser when zoomed out and finer once zoomed in enough to tell stops apart. */
function resolveTransitStopRadius(
  isOverviewZoom: boolean,
  isDetailZoom: boolean,
): number {
  if (isOverviewZoom) {
    return 2;
  }
  return isDetailZoom ? 4 : 3;
}

/** The current vector basemap's MapLibre style URL (theme-appropriate, falling back to the light one), or `null` while a raster basemap is active. */
function resolveVectorStyleUrl(
  isVectorBasemap: boolean,
  resolvedDark: boolean,
  basemapDefinition: ReturnType<typeof getBasemapDefinition>,
): string | null {
  if (!isVectorBasemap || basemapDefinition.kind !== "vector") {
    return null;
  }
  return resolveThemedColor(
    basemapDefinition.styleUrl,
    basemapDefinition.darkStyleUrl,
    resolvedDark,
  );
}

interface RenderVisibleLayerParams {
  layer: DomainLayer;
  areaData: FeatureCollection;
  overlayData: LayerDataMap;
  layerConfigById: Map<string, LeafletLayerConfig>;
  layerPathOptionsById: Map<string, GeoJSONProps["pathOptions"]>;
  onEachSelectableFeatureByLayerId: Map<string, GeoJSONProps["onEachFeature"]>;
  transitPointToLayerById: Map<string, GeoJSONProps["pointToLayer"]>;
}

/**
 * Renders one visible layer's `GeoJSON`, or `null` while it has no data yet
 * (or, for the choropleth layer, while `areas` itself hasn't loaded).
 */
function renderVisibleLayer({
  layer,
  areaData,
  overlayData,
  layerConfigById,
  layerPathOptionsById,
  onEachSelectableFeatureByLayerId,
  transitPointToLayerById,
}: RenderVisibleLayerParams): ReactNode {
  const config = layerConfigById.get(layer.id);
  /* v8 ignore next 3 -- unreachable: layerConfigById is built from this same visibleLayers list, so every layer.id here always has an entry */
  if (!config) {
    return null;
  }
  const isChoropleth = layer.geometryKind === "choropleth";
  const isSelectable = Boolean(layer.interaction?.selectable);
  const data = isChoropleth ? areaData : overlayData[layer.id];

  if (!data || (isChoropleth && areaData.features.length === 0)) {
    return null;
  }

  return (
    <GeoJSON
      key={layer.id}
      data={data}
      smoothFactor={isChoropleth ? 0 : 1}
      style={config.styleFn}
      pathOptions={layerPathOptionsById.get(layer.id)}
      onEachFeature={
        isSelectable
          ? onEachSelectableFeatureByLayerId.get(layer.id)
          : undefined
      }
      pointToLayer={
        isChoropleth ? undefined : transitPointToLayerById.get(layer.id)
      }
    />
  );
}

/** Renders the active raster basemap's tile layer, or nothing while a vector basemap is active (or no tile source resolved). */
function RasterTileLayer({
  isRasterBasemap,
  tileSource,
  tileSourceMode,
  tileClassName,
  useRetinaTiles,
  tileEventHandlers,
}: {
  isRasterBasemap: boolean;
  tileSource: BasemapTileSource | undefined;
  tileSourceMode: string;
  tileClassName: string | undefined;
  useRetinaTiles: boolean;
  tileEventHandlers: { tileerror: () => void };
}) {
  if (!isRasterBasemap || !tileSource) {
    return null;
  }
  return (
    <TileLayer
      key={`${tileSourceMode}-${tileSource.url}`}
      url={resolveTileScaleToken(tileSource.url, useRetinaTiles)}
      attribution={tileSource.attribution}
      className={tileClassName}
      detectRetina={useRetinaTiles}
      updateWhenZooming
      eventHandlers={tileEventHandlers}
    />
  );
}

/** Renders area-boundary outline labels, or nothing while no visible layer wants them (or there's no boundary data yet). */
function AreaBoundaryLabels({
  showAreaLabels,
  areaBoundaryData,
  areaBoundaryStyle,
}: {
  showAreaLabels: boolean;
  areaBoundaryData: FeatureCollection;
  areaBoundaryStyle: (feature?: Feature) => {
    color: string;
    opacity: number;
    weight: number;
  };
}) {
  if (!showAreaLabels || areaBoundaryData.features.length === 0) {
    return null;
  }
  return (
    <GeoJSON
      data={areaBoundaryData}
      smoothFactor={0}
      pathOptions={AREA_OUTLINE_PATH_OPTIONS}
      style={areaBoundaryStyle}
      onEachFeature={bindAreaBoundaryLabel}
    />
  );
}

/** Renders the measurement tool's click-to-add-point layer, or nothing while the tool is off or not currently interactive. */
function MeasurementClickLayer({
  measurementTool,
  measurementInteractive,
  mode,
  points,
  onAddPoint,
}: {
  measurementTool: boolean;
  measurementInteractive: boolean;
  mode: MeasurementMode;
  points: LatLng[];
  onAddPoint: (point: LatLng) => void;
}) {
  if (!measurementTool || !measurementInteractive) {
    return null;
  }
  return (
    <MeasurementLayer mode={mode} points={points} onAddPoint={onAddPoint} />
  );
}

function MapViewComponent<
  TProperties extends Record<string, unknown> = Record<string, unknown>,
>({
  bounds,
  ariaLabel,
  areas,
  areaBoundaries = [],
  visibleLayerIds,
  basemap = "street",
  selectedFeatureId = null,
  focusLocationTarget = null,
  onFeatureSelect,
  onSelectableFeaturesChange,
  renderFeaturePopup,
  onLayerDataError,
  onBasemapError,
  locationContextMenu = false,
  locationContextMenuProvider,
  locationContextMenuLabels,
  measurementTool = false,
  measurementLabels,
  measurementPanelOpen = false,
  onMeasurementPanelClose,
  measurementRequest = null,
  onReady,
  formatSelectionAnnouncement = DEFAULT_FORMAT_SELECTION_ANNOUNCEMENT,
}: MapViewProps<TProperties>) {
  const { getLayers } = useDomain();
  const [measurement, setMeasurement] = useState<MeasurementState>(
    INITIAL_MEASUREMENT_STATE,
  );

  useEffect(() => {
    if (!measurementTool || !measurementRequest) {
      return;
    }
    setMeasurement({
      active: true,
      mode: measurementRequest.mode,
      points: measurementRequest.points.map(
        (point) => new LatLng(point.lat, point.lng),
      ),
    });
  }, [measurementRequest, measurementTool]);
  const measurementResultLabel = useMemo(
    () => formatMeasurementResult(measurement.mode, measurement.points),
    [measurement.mode, measurement.points],
  );

  function handleMeasurementToggleActive() {
    setMeasurement((state) => ({
      ...state,
      active: !state.active,
      points: [],
    }));
  }

  function handleMeasurementModeChange(mode: MeasurementMode) {
    setMeasurement((state) => ({ ...state, mode, points: [] }));
  }

  function handleMeasurementClear() {
    setMeasurement((state) => ({ ...state, points: [] }));
  }

  function handleMeasurementAddPoint(point: LatLng) {
    setMeasurement((state) => ({ ...state, points: [...state.points, point] }));
  }

  const selectableLayerById = useRef(new Map<string, SelectableFeatureLayer>());
  const onSelectRef = useLatestRef(onFeatureSelect);
  const renderFeaturePopupRef = useLatestRef(renderFeaturePopup);
  /**
   * Whether the map should currently be listening for measurement clicks.
   * @remarks Distinct from `measurement.active` itself: the host's own
   * overlapping panel (`measurementPanelOpen`) hides `MeasurementControl`
   * entirely on mobile (see MeasurementControl.module.css), leaving no UI to
   * show a click's result. `measurement.active`/`mode`/`points` stay
   * untouched while hidden so the tool resumes exactly where it left off
   * once that panel closes, but clicks on the sliver of map still visible
   * in the meantime fall through to normal feature interaction instead of
   * silently accumulating invisible measurement points.
   */
  const measurementInteractive = measurement.active && !measurementPanelOpen;
  const measurementActiveRef = useLatestRef(measurementInteractive);
  const visibleLayers = useMemo(
    () =>
      getLayers().filter(
        (layer) => layer.available && visibleLayerIds.includes(layer.id),
      ),
    [visibleLayerIds, getLayers],
  );
  const nonChoroplethLayerIds = useMemo(
    () =>
      visibleLayers
        .filter((layer) => layer.geometryKind !== "choropleth")
        .map((layer) => layer.id),
    [visibleLayers],
  );
  const { data: overlayData, failedLayerIds } = useLayerData(
    nonChoroplethLayerIds,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: onLayerDataError intentionally omitted -- it's a public prop with no stability guarantee, so including it could re-fire this effect on every render for callers that don't memoize it
  useEffect(() => {
    onLayerDataError?.(failedLayerIds);
  }, [failedLayerIds]);
  const resolvedDark = useResolvedDarkTheme();
  const basemapDefinition = getBasemapDefinition(basemap);
  const isRasterBasemap = basemapDefinition.kind === "raster";
  const isVectorBasemap = basemapDefinition.kind === "vector";
  const useDarkTiles =
    isRasterBasemap && basemapDefinition.darkUrl !== undefined && resolvedDark;
  const useDimFilter =
    isRasterBasemap && resolvedDark && basemapDefinition.dimInDarkMode === true;
  const tileClassName = resolveTileClassName(useDarkTiles, useDimFilter);
  const tileSourceMode = `${basemap}-${useDarkTiles ? "dark" : "light"}`;
  const tileSources = useMemo(
    () => (isRasterBasemap ? getBasemapTileSources(basemap, useDarkTiles) : []),
    [isRasterBasemap, basemap, useDarkTiles],
  );
  const vectorStyleUrl = resolveVectorStyleUrl(
    isVectorBasemap,
    resolvedDark,
    basemapDefinition,
  );
  const [tileSourceState, setTileSourceState] = useState(() => ({
    mode: tileSourceMode,
    index: 0,
  }));
  const [mapZoom, setMapZoom] = useState(9);
  const currentTileSourceIndex = resolveTileSourceIndex(
    tileSourceState,
    tileSourceMode,
  );
  const safeTileSourceIndex = Math.min(
    currentTileSourceIndex,
    tileSources.length - 1,
  );
  const tileSource = tileSources[safeTileSourceIndex] ?? tileSources[0];
  const handleTileError = useCallback(() => {
    setTileSourceState((currentState) => {
      const currentIndex = resolveTileSourceIndex(currentState, tileSourceMode);
      if (currentIndex >= tileSources.length - 1) {
        return {
          mode: tileSourceMode,
          index: currentIndex,
        };
      }
      return {
        mode: tileSourceMode,
        index: currentIndex + 1,
      };
    });
  }, [tileSourceMode, tileSources.length]);
  /**
   * @remarks `@react-leaflet/core`'s event-handler effect keys off this
   *   object's identity, not its contents, so an inline literal here would
   *   unbind and rebind the tile layer's `tileerror` listener on every
   *   render even though `handleTileError` itself never changes.
   */
  const tileEventHandlers = useMemo(
    () => ({ tileerror: handleTileError }),
    [handleTileError],
  );
  const showAreaLabels = useMemo(
    () =>
      getLayers().some(
        (layer) =>
          visibleLayerIds.includes(layer.id) &&
          layer.interaction?.labelField !== undefined,
      ),
    [visibleLayerIds, getLayers],
  );
  const isOverviewZoom = mapZoom < OVERVIEW_ZOOM_THRESHOLD;
  const isDetailZoom = mapZoom >= DETAIL_ZOOM_THRESHOLD;
  const transitStopRadius = resolveTransitStopRadius(
    isOverviewZoom,
    isDetailZoom,
  );
  const areaBoundaryData = useMemo<FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: areaBoundaries,
    }),
    [areaBoundaries],
  );
  const areaData = useMemo<FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: areas,
    }),
    [areas],
  );
  /**
   * @remarks `useLayerData`'s `setData` replaces the whole `overlayData`
   *   object on every individual layer's fetch resolving, so a plain
   *   `useMemo` keyed on `overlayData` would re-walk every selectable
   *   layer's full feature set (choropleth `areaData` included) each time
   *   *any* layer's data arrives. Cached per layer id, keyed by that layer's
   *   own data reference, so only the layer whose data actually changed gets
   *   re-walked.
   */
  const selectableEntriesCacheRef = useRef(
    new Map<
      string,
      { data: FeatureCollection; entries: SelectableFeatureSearchEntry[] }
    >(),
  );
  const selectableSearchEntries = useMemo<
    SelectableFeatureSearchEntry[]
  >(() => {
    const entries: SelectableFeatureSearchEntry[] = [];
    const cache = selectableEntriesCacheRef.current;
    const seenLayerIds = new Set<string>();
    for (const layer of visibleLayers) {
      const data = resolveSelectableLayerData(layer, areaData, overlayData);
      if (!data) {
        continue;
      }
      seenLayerIds.add(layer.id);
      entries.push(...collectSelectableEntriesForLayer(layer, data, cache));
    }
    evictStaleSelectableEntries(cache, seenLayerIds);
    // Only mutually-exclusive selectable layers (see the domain's
    // `selectionMode: "exclusive"` layer group) are expected to be visible
    // at once, so entries shouldn't collide across layers in practice; a
    // future domain violating that assumption would just show duplicate
    // rows for the same id, not break selection.
    return entries;
  }, [visibleLayers, areaData, overlayData]);
  const selectedFeatureLabel = useMemo(
    () =>
      selectedFeatureId
        ? (selectableSearchEntries.find(
            (entry) => entry.id === selectedFeatureId,
          )?.label ?? null)
        : null,
    [selectableSearchEntries, selectedFeatureId],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: onSelectableFeaturesChange intentionally omitted -- it's a public prop with no stability guarantee, so including it could re-fire this effect on every render for callers that don't memoize it
  useEffect(() => {
    onSelectableFeaturesChange?.(selectableSearchEntries);
  }, [selectableSearchEntries]);
  const layerConfigById = useMemo(
    () =>
      new Map(
        visibleLayers.map((layer) => [
          layer.id,
          createLayerConfig(layer, { dark: resolvedDark }),
        ]),
      ),
    [visibleLayers, resolvedDark],
  );
  /**
   * @remarks Passed as the area-outline `GeoJSON`'s `style` prop, so it needs
   *   the same stable-identity treatment as `layerPathOptionsById` below: an
   *   inline function here would restyle every area-outline polygon on every
   *   render (each zoom tick included), even though its output only actually
   *   depends on `resolvedDark`/`isOverviewZoom`.
   */
  const areaBoundaryStyle = useCallback(
    (feature?: Feature) => {
      const isSecondary = feature?.properties?.labelPriority === "secondary";
      return {
        color: resolveThemedColor(
          AREA_OUTLINE.color,
          AREA_OUTLINE.darkColor,
          resolvedDark,
        ),
        opacity: getAreaBoundaryOpacity(resolvedDark, isSecondary),
        weight: getAreaBoundaryWeight(
          resolvedDark,
          isSecondary,
          isOverviewZoom,
        ),
      };
    },
    [resolvedDark, isOverviewZoom],
  );
  /**
   * Each visible layer's `pathOptions`, with its pane folded in, memoised by
   * layer id.
   * @remarks react-leaflet re-applies `pathOptions` with `setStyle` whenever
   *   the object's *identity* changes, and a `setStyle` on a `GeoJSON` layer
   *   walks every feature layer it holds. Built inline in the render below,
   *   a fresh object every render meant every unrelated re-render — a zoom
   *   tick, a theme change, data arriving for a different layer — restyled
   *   all several thousand choropleth polygons.
   */
  const layerPathOptionsById = useMemo(
    () =>
      new Map(
        visibleLayers.map((layer) => {
          const config = layerConfigById.get(layer.id);
          return [
            layer.id,
            {
              ...config?.pathOptions,
              pane:
                layer.geometryKind === "choropleth" ? AREA_PANE : TRANSIT_PANE,
            },
          ] as const;
        }),
      ),
    [layerConfigById, visibleLayers],
  );
  const transitPointToLayerById = useMemo(
    () =>
      new Map(
        visibleLayers
          .filter((layer) => layer.geometryKind !== "choropleth")
          .map((layer) => {
            const config = layerConfigById.get(layer.id);
            return [
              layer.id,
              (_feature: Feature, latlng: LatLng) =>
                circleMarker(latlng, {
                  ...config?.pathOptions,
                  pane: TRANSIT_PANE,
                  radius: transitStopRadius,
                  fillColor: config?.pathOptions?.color,
                  fillOpacity: 1,
                  weight: 1,
                }),
            ] as const;
          }),
      ),
    [layerConfigById, transitStopRadius, visibleLayers],
  );
  /**
   * Each selectable layer's `onEachFeature` binder, memoised by layer id.
   * @remarks Kept referentially stable so react-leaflet's `GeoJSON` isn't
   *   handed a new binder on every render; the binder reads the current
   *   `onFeatureSelect`/`renderFeaturePopup` through `onSelectRef`/
   *   `renderFeaturePopupRef` instead, since Leaflet only ever runs
   *   `onEachFeature` once per feature layer and would otherwise pin those
   *   callbacks to their creation-time values.
   */
  const onEachSelectableFeatureByLayerId = useMemo(
    () =>
      new Map(
        visibleLayers
          .filter((layer) => layer.interaction?.selectable)
          .map(
            (layer) =>
              [
                layer.id,
                (feature: Feature, featureLayer: Layer) =>
                  bindSelectableFeatureInteractions(
                    feature,
                    layer,
                    featureLayer,
                    selectableLayerById.current,
                    onSelectRef,
                    renderFeaturePopupRef,
                    measurementActiveRef,
                  ),
              ] as const,
          ),
      ),
    [visibleLayers, onSelectRef, renderFeaturePopupRef, measurementActiveRef],
  );
  const boundsOptions = getBoundsOptions(
    getViewportWidth() > MOBILE_BREAKPOINT_PX,
  );
  /**
   * Retina tiles are keyed off device pixel ratio alone, not viewport width:
   * a narrower, mobile-width viewport on a high-DPR phone still benefits
   * from a sharp basemap, and serving 1x tiles there was flagged by
   * Lighthouse's `image-size-responsive` best-practices audit as
   * low-resolution imagery. See {@link resolveTileScaleToken} for the byte
   * cost this trades away.
   */
  const useRetinaTiles = getDevicePixelRatio() > 1.25;

  /* v8 ignore next 3 -- unreachable: every registered raster basemap always yields at least one tile source */
  if (!isVectorBasemap && !tileSource) {
    return null;
  }

  return (
    <section
      className={styles.mapWrapper}
      data-testid="map-view"
      data-e2e="map-view"
      aria-label={ariaLabel}
    >
      {measurementTool ? (
        <MeasurementControl
          active={measurement.active}
          mode={measurement.mode}
          pointCount={measurement.points.length}
          resultLabel={measurementResultLabel}
          onToggleActive={handleMeasurementToggleActive}
          onModeChange={handleMeasurementModeChange}
          onClear={handleMeasurementClear}
          panelOpen={measurementPanelOpen}
          onRequestPanelClose={onMeasurementPanelClose}
          {...measurementLabels}
        />
      ) : null}
      {/*
        Announces a feature selection to assistive technology regardless of
        how it happened -- a direct click/tap on the map, or a caller's own
        `LocationSearchControl` (fed via `onSelectableFeaturesChange`) --
        since neither path otherwise gives a screen-reader user any signal
        that a selection changed.
      */}
      <output aria-live="polite" className={styles.visuallyHidden}>
        {selectedFeatureLabel
          ? formatSelectionAnnouncement(selectedFeatureLabel)
          : ""}
      </output>
      <MapContainer
        bounds={bounds}
        boundsOptions={boundsOptions}
        className={styles.map}
        scrollWheelZoom
        preferCanvas
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <RasterTileLayer
          isRasterBasemap={isRasterBasemap}
          tileSource={tileSource}
          tileSourceMode={tileSourceMode}
          tileClassName={tileClassName}
          useRetinaTiles={useRetinaTiles}
          tileEventHandlers={tileEventHandlers}
        />
        {vectorStyleUrl ? (
          <VectorBasemapLayer
            key={vectorStyleUrl}
            styleUrl={vectorStyleUrl}
            onError={(error) => onBasemapError?.(basemap, error)}
          />
        ) : null}
        <Pane name={AREA_PANE} style={{ zIndex: 400 }} />
        <Pane name={AREA_OUTLINE_PANE} style={{ zIndex: 425 }} />
        <Pane name={TRANSIT_PANE} style={{ zIndex: 450 }} />
        <AreaBoundaryLabels
          showAreaLabels={showAreaLabels}
          areaBoundaryData={areaBoundaryData}
          areaBoundaryStyle={areaBoundaryStyle}
        />
        {visibleLayers.map((layer) =>
          renderVisibleLayer({
            layer,
            areaData,
            overlayData,
            layerConfigById,
            layerPathOptionsById,
            onEachSelectableFeatureByLayerId,
            transitPointToLayerById,
          }),
        )}
        <SelectedFeatureHighlight
          selectedFeatureId={selectedFeatureId}
          layerById={selectableLayerById}
          renderFeaturePopupRef={renderFeaturePopupRef}
        />
        <FocusLocationTarget focusLocationTarget={focusLocationTarget} />
        <AreaLabelVisibility />
        <MapReadyNotifier onReady={onReady} />
        <ResponsiveMapBounds bounds={bounds} />
        <ZoomStateWatcher onZoomChange={setMapZoom} />
        {locationContextMenu ? (
          <LocationContextMenu
            provider={locationContextMenuProvider}
            {...locationContextMenuLabels}
          />
        ) : null}
        <MeasurementClickLayer
          measurementTool={measurementTool}
          measurementInteractive={measurementInteractive}
          mode={measurement.mode}
          points={measurement.points}
          onAddPoint={handleMeasurementAddPoint}
        />
      </MapContainer>
    </section>
  );
}

/**
 * Renders the interactive Leaflet map for a domain: tile basemap, choropleth
 * and transit overlays resolved from the active `DomainProvider`, area
 * boundary outline labels, feature selection/keyboard interaction, and
 * location-search fly-to behaviour.
 * @remarks Must be rendered inside a `DomainProvider`. `renderFeaturePopup`
 *   is invoked to produce the popup markup for a selectable feature; when
 *   omitted, clicking or selecting a feature will not show a popup.
 * @example
 * <DomainProvider domain={GAUTENG_SPATIAL_LEGACY_DOMAIN}>
 *   <MapView
 *     bounds={[[-27.15, 27.1], [-25.3, 28.75]]}
 *     ariaLabel="Map of South African township access to job centres"
 *     areas={townships}
 *     visibleLayerIds={["townships"]}
 *     renderFeaturePopup={(props) => <TownshipPopup properties={props} />}
 *   />
 * </DomainProvider>
 */
export const MapView = memo(MapViewComponent) as typeof MapViewComponent;
