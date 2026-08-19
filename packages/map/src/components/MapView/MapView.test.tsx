import type { DomainConfig } from "@karta/core";
import { clearFeatureCollectionCache } from "@karta/core";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { forwardRef, type ReactNode, useEffect, useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mapMocks = vi.hoisted(() => ({
  fitBounds: vi.fn(),
  invalidateSize: vi.fn(),
  tileErrorHandler: null as null | (() => void),
  tileEventHandlers: [] as unknown[],
  mapContextMenuHandler: null as null | ((event: unknown) => void),
  mapClickHandler: null as null | ((event: unknown) => void),
  featureLayers: [] as Array<{
    feature: { properties?: { id?: string } | null };
    bindPopup: ReturnType<typeof vi.fn>;
    getPopup: ReturnType<typeof vi.fn>;
    openPopup: ReturnType<typeof vi.fn>;
    getBounds: ReturnType<typeof vi.fn>;
    on: (eventName: string, handler: (...args: unknown[]) => void) => void;
    __handlers: Record<string, (...args: unknown[]) => void>;
  }>,
  geoJsonProps: {} as Record<
    string,
    {
      // biome-ignore lint/suspicious/noExplicitAny: test harness capturing whatever style/pointToLayer callback each layer is given
      style?: (feature?: any) => Record<string, unknown>;
      // biome-ignore lint/suspicious/noExplicitAny: see above
      pointToLayer?: (feature: any, latlng: any) => unknown;
      smoothFactor?: number;
    }
  >,
  zoom: 9,
  vectorBasemapOnError: null as ((error: unknown) => void) | null,
}));

const geocodeMocks = vi.hoisted(() => ({
  fetchReverseGeocodeResult: vi.fn(),
}));

const popupMocks = vi.hoisted(() => ({
  renderToStaticMarkup: vi.fn().mockReturnValue("<div>Popup</div>"),
}));

vi.mock("react-dom/server", () => ({
  renderToStaticMarkup: popupMocks.renderToStaticMarkup,
}));

const mapInstance = {
  fitBounds: mapMocks.fitBounds,
  invalidateSize: mapMocks.invalidateSize,
  getContainer: () => document.createElement("div"),
  getZoom: () => mapMocks.zoom,
  whenReady: (callback: () => void) => {
    callback();
  },
  on: vi.fn(),
  off: vi.fn(),
};

function createMockLayer(feature: { properties?: { id?: string } | null }) {
  const handlers: Record<string, (...args: unknown[]) => void> = {};
  let popupContent: string | null = null;
  const layer = {
    feature,
    bindPopup: vi.fn((content: string) => {
      popupContent = content;
      return layer;
    }),
    getPopup: vi.fn(() => popupContent),
    openPopup: vi.fn(),
    bindTooltip: vi.fn(),
    getBounds: vi.fn(() => ({ north: -25, south: -26, east: 28, west: 27 })),
    on: (eventName: string, handler: (...args: unknown[]) => void) => {
      handlers[eventName] = handler;
    },
    __handlers: handlers,
  };
  return layer;
}

vi.mock("react-leaflet", () => ({
  MapContainer: ({
    bounds,
    preferCanvas,
    children,
  }: {
    bounds: unknown;
    preferCanvas?: boolean;
    children: ReactNode;
  }) => (
    <div
      data-testid="map-container"
      data-has-bounds={String(Boolean(bounds))}
      data-prefer-canvas={String(Boolean(preferCanvas))}
    >
      {children}
    </div>
  ),
  TileLayer: ({
    url,
    detectRetina,
    eventHandlers,
    className,
  }: {
    url: string;
    detectRetina?: boolean;
    eventHandlers?: { tileerror?: () => void };
    className?: string;
  }) => {
    mapMocks.tileErrorHandler = eventHandlers?.tileerror ?? null;
    mapMocks.tileEventHandlers.push(eventHandlers);
    return (
      <div
        data-testid="tile-layer"
        data-retina={String(detectRetina)}
        data-classname={className ?? ""}
      >
        {url}
      </div>
    );
  },
  GeoJSON: forwardRef<
    { eachLayer: (cb: (layer: unknown) => void) => void } | null,
    {
      data: { features: Array<{ properties?: { id?: string } | null }> };
      pathOptions?: { pane?: string };
      onEachFeature?: (
        feature: { properties?: { id?: string } | null },
        layer: ReturnType<typeof createMockLayer>,
      ) => void;
      // biome-ignore lint/suspicious/noExplicitAny: test harness capturing whatever style/pointToLayer callback each layer is given
      style?: (feature?: any) => Record<string, unknown>;
      // biome-ignore lint/suspicious/noExplicitAny: see above
      pointToLayer?: (feature: any, latlng: any) => unknown;
      smoothFactor?: number;
    }
  >(
    (
      { data, pathOptions, onEachFeature, style, pointToLayer, smoothFactor },
      ref,
    ) => {
      if (pathOptions?.pane) {
        mapMocks.geoJsonProps[pathOptions.pane] = {
          style,
          pointToLayer,
          smoothFactor,
        };
      }

      // Real react-leaflet passes `onEachFeature` to Leaflet's `GeoJSON`
      // constructor once, at layer creation, and its update path only reacts
      // to a changed `data` prop (`clearLayers()` + `addData()`). A later
      // `onEachFeature` identity therefore never rebinds existing layers, so
      // this mock must read it through a ref rather than depend on it.
      const onEachFeatureRef = useRef(onEachFeature);
      onEachFeatureRef.current = onEachFeature;

      useEffect(() => {
        const layers = data.features.map((feature) => createMockLayer(feature));
        mapMocks.featureLayers = layers;
        for (const [index, feature] of data.features.entries()) {
          const layer = layers[index];
          if (layer) {
            onEachFeatureRef.current?.(feature, layer);
          }
        }
        if (ref && typeof ref === "object") {
          ref.current = {
            eachLayer: (cb: (layer: unknown) => void) => {
              for (const layer of layers) {
                cb(layer);
              }
            },
          };
        }
        return () => {
          if (ref && typeof ref === "object") {
            ref.current = null;
          }
        };
      }, [data.features, ref]);

      return (
        <div data-testid="geojson-layer" data-pane={pathOptions?.pane}>
          {data.features.length} features
        </div>
      );
    },
  ),
  // Real `useMap()` reads a single Leaflet `Map` instance out of React
  // context, so its identity is stable for the life of the `MapContainer`.
  // A fresh object per call would re-fire every `map`-dependent effect on
  // every render and hide exactly the kind of bug those deps guard against.
  useMap: () => mapInstance,
  useMapEvents: (handlers: {
    contextmenu?: (event: unknown) => void;
    click?: (event: unknown) => void;
  }) => {
    if (handlers.contextmenu) {
      mapMocks.mapContextMenuHandler = handlers.contextmenu;
    }
    if (handlers.click) {
      mapMocks.mapClickHandler = handlers.click;
    }
    return {};
  },
  Popup: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-context-menu">{children}</div>
  ),
  Pane: () => null,
  ZoomControl: () => <div data-testid="zoom-control" />,
  ScaleControl: () => <div data-testid="scale-control" />,
  Polyline: ({ positions }: { positions: unknown[] }) => (
    <div data-testid="measurement-polyline">{positions.length}</div>
  ),
  Polygon: ({ positions }: { positions: unknown[] }) => (
    <div data-testid="measurement-polygon">{positions.length}</div>
  ),
  CircleMarker: () => <div data-testid="measurement-vertex" />,
}));

vi.mock("../../data/locationSearch", () => ({
  nominatimGeocoderProvider: {
    search: vi.fn(),
    reverse: geocodeMocks.fetchReverseGeocodeResult,
  },
}));

vi.mock("./VectorBasemapLayer", () => ({
  VectorBasemapLayer: ({
    styleUrl,
    onError,
  }: {
    styleUrl: string;
    onError?: (error: unknown) => void;
  }) => {
    mapMocks.vectorBasemapOnError = onError ?? null;
    return <div data-testid="vector-basemap-layer">{styleUrl}</div>;
  },
}));

import { setThemePreference } from "@karta/react";
import {
  registerBasemap,
  resetBasemapRegistry,
  type VectorBasemapDefinition,
} from "../../constants/basemaps";
import { DomainProvider } from "../../context/DomainContext";
import { TEST_DOMAIN } from "../../testFixtures/domain";
import { MapView, type MapViewProps } from "./MapView";

const CUSTOM_VECTOR_BASEMAP: VectorBasemapDefinition = {
  kind: "vector",
  label: "Custom Vector",
  description: "A custom vector basemap.",
  styleUrl: "https://example.com/style.json",
};

const bounds: [[number, number], [number, number]] = [
  [-27.15, 27.1],
  [-25.3, 28.75],
];

const DEFAULT_MAP_VIEW_PROPS = {
  bounds,
  ariaLabel: "Test map",
};

function withDomain(ui: ReactNode) {
  return <DomainProvider domain={TEST_DOMAIN}>{ui}</DomainProvider>;
}

const NON_SELECTABLE_DOMAIN: DomainConfig = {
  layers: [
    {
      id: "custom-choropleth",
      label: "Custom",
      dataSource: ["/data/custom.geojson"],
      geometryKind: "choropleth",
      defaultVisible: true,
      available: true,
      style: {
        kind: "choropleth",
        propertyKey: "value",
        buckets: [],
        baseOpacity: 0.5,
      },
    },
  ],
  layerGroups: [],
};

function withNonSelectableDomain(ui: ReactNode) {
  return <DomainProvider domain={NON_SELECTABLE_DOMAIN}>{ui}</DomainProvider>;
}

const SELECTABLE_OVERLAY_DOMAIN: DomainConfig = {
  layers: [
    {
      id: "rail",
      label: "Rail",
      dataSource: ["/data/example/rail.display.v1.geojson"],
      geometryKind: "line",
      defaultVisible: true,
      available: true,
      interaction: { selectable: true, labelField: "name" },
      style: { kind: "line", color: "#000", weight: 2 },
    },
  ],
  layerGroups: [],
};

function withSelectableOverlayDomain(ui: ReactNode) {
  return (
    <DomainProvider domain={SELECTABLE_OVERLAY_DOMAIN}>{ui}</DomainProvider>
  );
}

function testRenderFeaturePopup(properties: Record<string, unknown>) {
  return <div>{String(properties.name)}</div>;
}

const areas = [
  {
    type: "Feature",
    properties: { id: "A", name: "Mamelodi", commuteMinutes: 10 },
    geometry: null,
  },
] as never;

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("MapView", () => {
  afterEach(() => {
    mapMocks.fitBounds.mockReset();
    mapMocks.invalidateSize.mockReset();
    mapMocks.tileErrorHandler = null;
    mapMocks.tileEventHandlers = [];
    mapMocks.mapContextMenuHandler = null;
    mapMocks.mapClickHandler = null;
    mapMocks.featureLayers = [];
    mapMocks.geoJsonProps = {};
    mapMocks.zoom = 9;
    mapMocks.vectorBasemapOnError = null;
    popupMocks.renderToStaticMarkup.mockClear();
    geocodeMocks.fetchReverseGeocodeResult.mockReset();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    setThemePreference("system");
    resetBasemapRegistry();
    clearFeatureCollectionCache();
  });

  it("exports MapViewProps so a consumer can type its own wrapper component", () => {
    function TypedMapView(props: MapViewProps<{ id: string; name: string }>) {
      return <MapView {...props} />;
    }

    render(
      withDomain(
        <TypedMapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
        />,
      ),
    );

    expect(screen.getByTestId("map-view")).toBeInTheDocument();
  });

  it("passes bounds to MapContainer", () => {
    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );
    expect(screen.getByTestId("map-container")).toHaveAttribute(
      "data-has-bounds",
      "true",
    );
  });

  it("reports the visible selectable layer's features via onSelectableFeaturesChange", () => {
    const onSelectableFeaturesChange = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onSelectableFeaturesChange={onSelectableFeaturesChange}
        />,
      ),
    );

    expect(onSelectableFeaturesChange).toHaveBeenLastCalledWith([
      { id: "A", label: "Mamelodi", layerId: "areas" },
    ]);
  });

  it("reports an empty selectable-features list when no visible layer is selectable", () => {
    const onSelectableFeaturesChange = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          onSelectableFeaturesChange={onSelectableFeaturesChange}
        />,
      ),
    );

    expect(onSelectableFeaturesChange).toHaveBeenLastCalledWith([]);
  });

  it("evicts a hidden selectable layer's cached entries so they don't leak into a later report", () => {
    const onSelectableFeaturesChange = vi.fn();

    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onSelectableFeaturesChange={onSelectableFeaturesChange}
        />,
      ),
    );

    expect(onSelectableFeaturesChange).toHaveBeenLastCalledWith([
      { id: "A", label: "Mamelodi", layerId: "areas" },
    ]);

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={[]}
          onSelectableFeaturesChange={onSelectableFeaturesChange}
        />,
      ),
    );

    expect(onSelectableFeaturesChange).toHaveBeenLastCalledWith([]);
  });

  it("reports no entries yet for a selectable overlay layer whose data hasn't loaded", () => {
    const onSelectableFeaturesChange = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );

    render(
      withSelectableOverlayDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={["rail"]}
          onSelectableFeaturesChange={onSelectableFeaturesChange}
        />,
      ),
    );

    expect(onSelectableFeaturesChange).toHaveBeenLastCalledWith([]);
  });

  it("announces a feature selection via a live region regardless of how it happened", () => {
    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId={null}
        />,
      ),
    );

    expect(screen.getByRole("status")).toHaveTextContent("");

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="A"
        />,
      ),
    );

    expect(screen.getByRole("status")).toHaveTextContent("Mamelodi selected");
  });

  it("does not open a stale selection's popup once its markup resolves after that selection was superseded", async () => {
    const renderFeaturePopup = vi.fn().mockReturnValue(<div>Custom popup</div>);

    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="A"
          renderFeaturePopup={renderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer?.openPopup).not.toHaveBeenCalled();

    // Deselects before bindSelectedFeaturePopup's own `await import("react-dom/server")`
    // has resolved, so the effect's cleanup marks this selection cancelled first.
    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId={null}
          renderFeaturePopup={renderFeaturePopup}
        />,
      ),
    );

    // Two hops: one for the mocked `await import("react-dom/server")` itself,
    // one for its `.then()` continuation that calls `featureLayer.openPopup?.()`.
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(firstLayer?.openPopup).not.toHaveBeenCalled();
  });

  it("calls renderFeaturePopup with feature properties when a feature is clicked", async () => {
    vi.useFakeTimers();
    const renderFeaturePopup = vi.fn().mockReturnValue(<div>Custom popup</div>);
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={renderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();
    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    await vi.advanceTimersByTimeAsync(220);

    expect(renderFeaturePopup).toHaveBeenCalledWith(
      expect.objectContaining({ id: "A", name: "Mamelodi" }),
    );
  });

  it("does not select a feature or open its popup when clicked while the measurement tool is active", async () => {
    vi.useFakeTimers();
    const renderFeaturePopup = vi.fn().mockReturnValue(<div>Custom popup</div>);
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={renderFeaturePopup}
          measurementTool
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();
    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    await vi.advanceTimersByTimeAsync(220);

    expect(renderFeaturePopup).not.toHaveBeenCalled();
    expect(onFeatureSelect).not.toHaveBeenCalled();
  });

  it("notifies onReady once the map is ready and a frame has been painted", async () => {
    const onReady = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          onReady={onReady}
        />,
      ),
    );

    expect(onReady).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
    });
  });

  it("does not call onReady if the animation frame still fires after unmount races past cancelAnimationFrame", () => {
    const onReady = vi.fn();
    let scheduledCallback: FrameRequestCallback | null = null;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      scheduledCallback = callback;
      return 1;
    });
    // A no-op, unlike the real cancelAnimationFrame -- simulates the frame
    // still firing despite the cleanup below having already asked to cancel
    // it, so `cancelled` is what has to stop onReady from firing, not the
    // cancellation call itself.
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    const { unmount } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          onReady={onReady}
        />,
      ),
    );

    unmount();
    scheduledCallback?.(0);

    expect(onReady).not.toHaveBeenCalled();
  });

  it("renders without an onReady callback", () => {
    expect(() =>
      render(
        withDomain(
          <MapView
            {...DEFAULT_MAP_VIEW_PROPS}
            areas={[]}
            visibleLayerIds={[]}
          />,
        ),
      ),
    ).not.toThrow();
  });

  it("renders a tile layer and one GeoJSON layer per visible registry entry", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByTestId("map-container")).toHaveAttribute(
      "data-has-bounds",
      "true",
    );
    expect(screen.getByTestId("map-container")).toHaveAttribute(
      "data-prefer-canvas",
      "true",
    );
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toHaveAttribute(
      "data-retina",
      "false",
    );
    expect(screen.getAllByTestId("geojson-layer")).toHaveLength(1);
  });

  it("enables retina tile loading on high-DPI desktop screens", () => {
    vi.stubGlobal("innerWidth", 1440);
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 2,
    });

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(screen.getByTestId("tile-layer")).toHaveAttribute(
      "data-retina",
      "true",
    );
    expect(screen.getByTestId("tile-layer")).toHaveTextContent("@2x");
  });

  it("enables retina tile loading on a high-DPI mobile screen too", () => {
    vi.stubGlobal("innerWidth", 390);
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 3,
    });

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    const tileLayer = screen.getByTestId("tile-layer");
    expect(tileLayer).toHaveAttribute("data-retina", "true");
    expect(tileLayer).toHaveTextContent("@2x");
  });

  it("binds feature popup markup lazily on first click", async () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    expect(popupMocks.renderToStaticMarkup).not.toHaveBeenCalled();

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();
    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    await vi.advanceTimersByTimeAsync(220);

    expect(popupMocks.renderToStaticMarkup).toHaveBeenCalledTimes(1);
    expect(firstLayer?.openPopup).toHaveBeenCalledTimes(1);
    expect(onFeatureSelect).toHaveBeenCalledWith("A");

    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    await vi.advanceTimersByTimeAsync(220);
    expect(popupMocks.renderToStaticMarkup).toHaveBeenCalledTimes(1);
    expect(firstLayer?.openPopup).toHaveBeenCalledTimes(2);
    expect(onFeatureSelect).toHaveBeenCalledTimes(2);
  });

  it("removes area-layer reference when a feature layer is removed", () => {
    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();

    firstLayer?.__handlers.remove?.();

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="A"
        />,
      ),
    );

    expect(firstLayer?.openPopup).not.toHaveBeenCalled();
  });

  it("does not open popup or select a feature on double-click", () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();

    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    firstLayer?.__handlers.dblclick?.();
    vi.advanceTimersByTime(220);

    expect(popupMocks.renderToStaticMarkup).not.toHaveBeenCalled();
    expect(onFeatureSelect).not.toHaveBeenCalled();
    expect(firstLayer?.openPopup).not.toHaveBeenCalled();
  });

  it("opens the selected feature popup without scanning every layer", async () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="A"
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    await waitFor(() => {
      expect(popupMocks.renderToStaticMarkup).toHaveBeenCalledTimes(1);
    });
    expect(mapMocks.fitBounds).toHaveBeenCalledTimes(1);
    expect(mapMocks.featureLayers[0]?.openPopup).toHaveBeenCalledTimes(1);
  });

  it("does not refit bounds or reopen the popup when only renderFeaturePopup's identity changes", async () => {
    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="A"
          renderFeaturePopup={(properties) => (
            <div>{String(properties.name)}</div>
          )}
        />,
      ),
    );

    await waitFor(() => {
      expect(mapMocks.featureLayers[0]?.openPopup).toHaveBeenCalledTimes(1);
    });
    expect(mapMocks.fitBounds).toHaveBeenCalledTimes(1);

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="A"
          renderFeaturePopup={(properties) => (
            <div>{String(properties.name)}</div>
          )}
        />,
      ),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(mapMocks.fitBounds).toHaveBeenCalledTimes(1);
    expect(mapMocks.featureLayers[0]?.openPopup).toHaveBeenCalledTimes(1);
  });

  it("calls the latest onFeatureSelect when a feature is clicked after an unrelated re-render", async () => {
    vi.useFakeTimers();
    const staleOnFeatureSelect = vi.fn();
    const freshOnFeatureSelect = vi.fn();

    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={staleOnFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={freshOnFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    expect(mapMocks.featureLayers[0]).toBe(firstLayer);

    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    await vi.advanceTimersByTimeAsync(220);

    expect(freshOnFeatureSelect).toHaveBeenCalledWith("A");
    expect(staleOnFeatureSelect).not.toHaveBeenCalled();
  });

  it("renders the latest renderFeaturePopup's markup on a click after an unrelated re-render", async () => {
    vi.useFakeTimers();
    const stalePopup = vi.fn().mockReturnValue(<div>Stale</div>);
    const freshPopup = vi.fn().mockReturnValue(<div>Fresh</div>);

    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          renderFeaturePopup={stalePopup}
        />,
      ),
    );

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          renderFeaturePopup={freshPopup}
        />,
      ),
    );

    mapMocks.featureLayers[0]?.__handlers.click?.({
      originalEvent: { detail: 1 },
    });
    await vi.advanceTimersByTimeAsync(220);

    expect(freshPopup).toHaveBeenCalledWith(
      expect.objectContaining({ id: "A" }),
    );
    expect(stalePopup).not.toHaveBeenCalled();
  });

  it("keeps the tile layer's eventHandlers object referentially stable across re-renders", () => {
    const { rerender } = render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          ariaLabel="Test map, renamed"
        />,
      ),
    );

    expect(mapMocks.tileEventHandlers.length).toBeGreaterThan(1);
    const [first] = mapMocks.tileEventHandlers;
    for (const handlers of mapMocks.tileEventHandlers) {
      expect(handlers).toBe(first);
    }
  });

  it("does nothing when selectedFeatureId doesn't match any registered feature layer", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="does-not-exist"
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    expect(popupMocks.renderToStaticMarkup).not.toHaveBeenCalled();
    expect(mapMocks.fitBounds).not.toHaveBeenCalled();
    expect(mapMocks.featureLayers[0]?.openPopup).not.toHaveBeenCalled();
  });

  it("fits bounds and opens the selected feature's popup, and announces the selection for assistive technology, moving it when selection changes", async () => {
    const twoAreas = [
      {
        type: "Feature",
        properties: { id: "A", name: "Mamelodi", commuteMinutes: 10 },
        geometry: null,
      },
      {
        type: "Feature",
        properties: { id: "B", name: "Soweto", commuteMinutes: 20 },
        geometry: null,
      },
    ] as never;

    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={twoAreas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="A"
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    await waitFor(() => {
      expect(mapMocks.featureLayers[0]?.openPopup).toHaveBeenCalledTimes(1);
    });
    expect(mapMocks.fitBounds).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/mamelodi selected/i)).toBeInTheDocument();

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={twoAreas}
          visibleLayerIds={["areas"]}
          selectedFeatureId="B"
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    await waitFor(() => {
      expect(mapMocks.featureLayers[1]?.openPopup).toHaveBeenCalledTimes(1);
    });
    expect(mapMocks.fitBounds).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/soweto selected/i)).toBeInTheDocument();
    expect(screen.queryByText(/mamelodi selected/i)).not.toBeInTheDocument();
  });

  it("renders no GeoJSON layers when visibleLayerIds is empty", () => {
    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    expect(screen.queryByTestId("geojson-layer")).not.toBeInTheDocument();
  });

  it("waits for area data before mounting the choropleth", () => {
    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(screen.queryByTestId("geojson-layer")).not.toBeInTheDocument();

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(screen.getByTestId("geojson-layer")).toHaveTextContent("1 features");
  });

  it("resolves a choropleth bucket's darkColor over color when dark theme is active", () => {
    stubMatchMedia(true);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    const feature = {
      type: "Feature",
      properties: { value: 15 },
      geometry: null,
    };
    expect(mapMocks.geoJsonProps.areas?.style?.(feature)).toMatchObject({
      fillColor: "#274A66",
    });
  });

  it("uses a choropleth bucket's color in light theme, ignoring darkColor", () => {
    stubMatchMedia(false);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    const feature = {
      type: "Feature",
      properties: { value: 15 },
      geometry: null,
    };
    expect(mapMocks.geoJsonProps.areas?.style?.(feature)).toMatchObject({
      fillColor: "#7A9B6E",
    });
  });

  it("renders choropleth GeoJSON with exact geometry and transit overlays with smoothing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [{ type: "Feature", properties: {}, geometry: null }],
        }),
      }),
    );

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(mapMocks.geoJsonProps.areas?.smoothFactor).toBe(0);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={["rail"]}
        />,
      ),
    );

    expect(await screen.findByText("1 features")).toBeInTheDocument();
    expect(mapMocks.geoJsonProps.transit?.smoothFactor).toBe(1);
  });

  it("does not render a layer that has no data available yet", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["unavailable-layer"]}
        />,
      ),
    );

    expect(screen.queryByTestId("geojson-layer")).not.toBeInTheDocument();
  });

  it("fetches and renders overlay data for a visible transit layer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [{ type: "Feature", properties: {}, geometry: null }],
        }),
      }),
    );

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={["rail"]}
        />,
      ),
    );

    expect(await screen.findByText("1 features")).toHaveAttribute(
      "data-pane",
      "transit",
    );
    expect(fetch).toHaveBeenCalledWith(
      "/data/example/rail.display.v1.geojson",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("keeps area polygons in the pane below transit overlays", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(screen.getByTestId("geojson-layer")).toHaveAttribute(
      "data-pane",
      "areas",
    );
  });

  it("renders dissolved area borders in a separate outline pane", () => {
    const areaBoundaries = [
      {
        type: "Feature",
        properties: { name: "Mamelodi" },
        geometry: null,
      },
    ] as never;

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          areaBoundaries={areaBoundaries}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(
      screen
        .getAllByTestId("geojson-layer")
        .some((layer) => layer.dataset.pane === "area-outlines"),
    ).toBe(true);
  });

  it("renders dissolved area borders when a second choropleth layer is active", () => {
    const areaBoundaries = [
      {
        type: "Feature",
        properties: { name: "Mamelodi" },
        geometry: null,
      },
    ] as never;

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          areaBoundaries={areaBoundaries}
          visibleLayerIds={["coverage"]}
        />,
      ),
    );

    expect(
      screen
        .getAllByTestId("geojson-layer")
        .some((layer) => layer.dataset.pane === "area-outlines"),
    ).toBe(true);
  });

  it("fits to searched locations passed from the settings search", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          focusLocationTarget={{
            token: 1,
            location: {
              id: "loc-1",
              label: "Soweto",
              latitude: -26.267,
              longitude: 27.854,
            },
          }}
        />,
      ),
    );

    expect(mapMocks.fitBounds).toHaveBeenCalled();
  });

  it.each([
    ["satellite", /arcgisonline/i],
    ["topo", /World_Topo_Map/i],
  ])(
    "switches tile source when the %s basemap is selected",
    (basemap, urlPattern) => {
      render(
        withDomain(
          <MapView
            {...DEFAULT_MAP_VIEW_PROPS}
            areas={[]}
            visibleLayerIds={[]}
            basemap={basemap}
          />,
        ),
      );

      expect(screen.getByTestId("tile-layer")).toHaveTextContent(urlPattern);
    },
  );

  it("uses the dark street tile source when the OS prefers dark mode", () => {
    stubMatchMedia(true);

    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    expect(screen.getByTestId("tile-layer")).toHaveTextContent(/dark_all/i);
  });

  it("uses the light street tile source when the OS prefers light mode", () => {
    stubMatchMedia(false);

    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    expect(screen.getByTestId("tile-layer")).toHaveTextContent(/light_all/i);
  });

  it("falls back to OpenStreetMap when the light street tiles error", () => {
    stubMatchMedia(false);

    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    expect(screen.getByTestId("tile-layer")).toHaveTextContent(/light_all/i);
    act(() => {
      mapMocks.tileErrorHandler?.();
    });
    expect(screen.getByTestId("tile-layer")).toHaveTextContent(
      /tile\.openstreetmap\.org/i,
    );
  });

  it("falls back from dark street tiles before using OpenStreetMap", () => {
    stubMatchMedia(true);

    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    expect(screen.getByTestId("tile-layer")).toHaveTextContent(/dark_all/i);
    act(() => {
      mapMocks.tileErrorHandler?.();
    });
    expect(screen.getByTestId("tile-layer")).toHaveTextContent(/light_all/i);
    act(() => {
      mapMocks.tileErrorHandler?.();
    });
    expect(screen.getByTestId("tile-layer")).toHaveTextContent(
      /tile\.openstreetmap\.org/i,
    );
  });

  it("does not swap to a dark variant for satellite in dark mode", () => {
    stubMatchMedia(true);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          basemap="satellite"
        />,
      ),
    );

    expect(screen.getByTestId("tile-layer")).toHaveTextContent(/arcgisonline/i);
  });

  it.each([
    ["voyager", true, true],
    ["topo", true, true],
    ["satellite", true, false],
    ["voyager", false, false],
  ])("%s basemap: dark=%s -> dimmed=%s", (basemap, dark, expectDimmed) => {
    stubMatchMedia(dark);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          basemap={basemap}
        />,
      ),
    );

    const classname = screen.getByTestId("tile-layer").dataset.classname;
    if (expectDimmed) {
      expect(classname).toContain("dimmedTile");
    } else {
      expect(classname).toBe("");
    }
  });

  it("refits the full area bounds when crossing the mobile breakpoint", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    vi.stubGlobal("innerWidth", 1024);
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    vi.stubGlobal("innerWidth", 390);
    fireEvent(window, new Event("resize"));

    expect(mapMocks.invalidateSize).toHaveBeenCalledWith({ animate: false });
    expect(mapMocks.fitBounds).toHaveBeenCalledWith(
      [
        [-27.15, 27.1],
        [-25.3, 28.75],
      ],
      { padding: [24, 24] },
    );
  });

  it("does not open a location context menu when locationContextMenu is not set", () => {
    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    expect(screen.queryByTestId("map-context-menu")).not.toBeInTheDocument();
    expect(mapMocks.mapContextMenuHandler).toBeNull();
  });

  it("opens a location context menu on a map long-press/right-click and reverse-geocodes the point once chosen, when locationContextMenu is set", async () => {
    geocodeMocks.fetchReverseGeocodeResult.mockResolvedValue({
      id: "1",
      label: "Braamfontein, Johannesburg",
      latitude: -26.19,
      longitude: 28.03,
    });

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          locationContextMenu
        />,
      ),
    );

    act(() => {
      mapMocks.mapContextMenuHandler?.({
        latlng: { lat: -26.19, lng: 28.03 },
      });
    });

    fireEvent.click(
      screen.getByRole("menuitem", { name: /search this location/i }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "Braamfontein, Johannesburg",
      );
    });
    expect(geocodeMocks.fetchReverseGeocodeResult).toHaveBeenCalledWith(
      -26.19,
      28.03,
      expect.any(AbortSignal),
    );
  });

  it("does not show the measurement control when measurementTool is not set", () => {
    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    expect(
      screen.queryByTestId("measurement-control-toggle"),
    ).not.toBeInTheDocument();
  });

  it("shows the measurement toggle when measurementTool is set, and opens the panel on click", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          measurementTool
        />,
      ),
    );

    expect(
      screen.getByTestId("measurement-control-toggle"),
    ).toBeInTheDocument();
    expect(mapMocks.mapClickHandler).toBeNull();

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));

    expect(screen.getByTestId("measurement-control-panel")).toBeInTheDocument();
    expect(mapMocks.mapClickHandler).not.toBeNull();
  });

  it("passes measurementPanelOpen through to the measurement control's own panel-state attribute", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          measurementTool
          measurementPanelOpen
        />,
      ),
    );

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-open",
      "true",
    );
  });

  it("calls onMeasurementPanelClose, not the measurement toggle, when the collapsed toggle is tapped while measurementPanelOpen is true", () => {
    const onMeasurementPanelClose = vi.fn();
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          measurementTool
          measurementPanelOpen
          onMeasurementPanelClose={onMeasurementPanelClose}
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));

    expect(onMeasurementPanelClose).toHaveBeenCalled();
    expect(
      screen.queryByTestId("measurement-control-panel"),
    ).not.toBeInTheDocument();
  });

  it("stops listening for measurement clicks (and re-enables feature clicks) while the host panel is open, then resumes with the same points once it closes", async () => {
    vi.useFakeTimers();
    const renderFeaturePopup = vi.fn().mockReturnValue(<div>Custom popup</div>);
    const onFeatureSelect = vi.fn();

    const { rerender } = render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={renderFeaturePopup}
          measurementTool
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));
    act(() => {
      mapMocks.mapClickHandler?.({ latlng: { lat: -26.0, lng: 28.0 } });
    });
    act(() => {
      mapMocks.mapClickHandler?.({ latlng: { lat: -25.99, lng: 28.0 } });
    });
    expect(screen.getByTestId("measurement-polyline")).toHaveTextContent("2");

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={renderFeaturePopup}
          measurementTool
          measurementPanelOpen
        />,
      ),
    );

    expect(
      screen.queryByTestId("measurement-polyline"),
    ).not.toBeInTheDocument();

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();
    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    await vi.advanceTimersByTimeAsync(220);

    expect(renderFeaturePopup).toHaveBeenCalledWith(
      expect.objectContaining({ id: "A", name: "Mamelodi" }),
    );
    expect(onFeatureSelect).toHaveBeenCalled();

    rerender(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={renderFeaturePopup}
          measurementTool
        />,
      ),
    );

    expect(screen.getByTestId("measurement-polyline")).toHaveTextContent("2");
  });

  it("draws a preview line and shows a distance readout as the map is clicked in distance mode", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          measurementTool
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));
    act(() => {
      mapMocks.mapClickHandler?.({ latlng: { lat: -26.0, lng: 28.0 } });
    });
    act(() => {
      mapMocks.mapClickHandler?.({ latlng: { lat: -25.99, lng: 28.0 } });
    });

    expect(screen.getByTestId("measurement-polyline")).toHaveTextContent("2");
    expect(screen.getByTestId("measurement-control-result")).toHaveTextContent(
      /km|m/,
    );
  });

  it("switches to area mode and clears any in-progress points", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          measurementTool
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));
    act(() => {
      mapMocks.mapClickHandler?.({ latlng: { lat: -26.0, lng: 28.0 } });
    });

    fireEvent.click(screen.getByTestId("measurement-control-mode-option-area"));

    expect(screen.getByTestId("measurement-control-hint")).toBeInTheDocument();
  });

  it("clears the drawn points without closing the panel when Clear is clicked", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          measurementTool
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));
    act(() => {
      mapMocks.mapClickHandler?.({ latlng: { lat: -26.0, lng: 28.0 } });
    });
    act(() => {
      mapMocks.mapClickHandler?.({ latlng: { lat: -25.99, lng: 28.0 } });
    });

    fireEvent.click(screen.getByTestId("measurement-control-clear"));

    expect(screen.getByTestId("measurement-control-panel")).toBeInTheDocument();
    expect(screen.getByTestId("measurement-control-hint")).toBeInTheDocument();
  });

  it("closes the panel and stops listening for clicks when the toggle is clicked again", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          measurementTool
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));
    fireEvent.click(screen.getByTestId("measurement-control-close"));

    expect(
      screen.queryByTestId("measurement-control-panel"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("measurement-control-toggle"),
    ).toBeInTheDocument();
  });

  it("does not open a popup or select a feature on a non-selectable layer", () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withNonSelectableDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={
            [
              {
                type: "Feature",
                properties: { id: "X", value: 1 },
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["custom-choropleth"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();
    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    vi.advanceTimersByTime(220);

    expect(popupMocks.renderToStaticMarkup).not.toHaveBeenCalled();
    expect(onFeatureSelect).not.toHaveBeenCalled();
    expect(firstLayer?.openPopup).not.toHaveBeenCalled();
  });

  it("does not throw and skips interaction wiring for a feature with no properties", () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={
            [{ type: "Feature", properties: null, geometry: null }] as never
          }
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();
    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    vi.advanceTimersByTime(220);

    expect(popupMocks.renderToStaticMarkup).not.toHaveBeenCalled();
    expect(onFeatureSelect).not.toHaveBeenCalled();
  });

  it("resets the pending click timeout and ignores a rapid second click", () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();

    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    firstLayer?.__handlers.click?.({ originalEvent: { detail: 2 } });
    vi.advanceTimersByTime(220);

    expect(popupMocks.renderToStaticMarkup).not.toHaveBeenCalled();
    expect(onFeatureSelect).not.toHaveBeenCalled();
  });

  it("clears the pending click timeout when the feature layer is removed before it resolves", () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(firstLayer).toBeDefined();

    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    firstLayer?.__handlers.remove?.();
    vi.advanceTimersByTime(220);

    expect(popupMocks.renderToStaticMarkup).not.toHaveBeenCalled();
    expect(onFeatureSelect).not.toHaveBeenCalled();
  });

  it("ignores an overlapping resize while the previous resize's animation frame is still pending", () => {
    const rafSpy = vi.fn().mockReturnValue(1);
    vi.stubGlobal("requestAnimationFrame", rafSpy);
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("innerWidth", 1024);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    fireEvent(window, new Event("resize"));
    fireEvent(window, new Event("resize"));

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("does not refit bounds when a resize does not cross the mobile breakpoint", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("innerWidth", 1024);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    vi.stubGlobal("innerWidth", 1100);
    fireEvent(window, new Event("resize"));

    expect(mapMocks.invalidateSize).toHaveBeenCalledWith({ animate: false });
    expect(mapMocks.fitBounds).not.toHaveBeenCalled();
  });

  it("fits to the searched location's own bounds when provided, instead of computing padding around lat/lon", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          focusLocationTarget={{
            token: 1,
            location: {
              id: "loc-1",
              label: "Soweto",
              latitude: -26.267,
              longitude: 27.854,
              bounds: [
                [-26.3, 27.8],
                [-26.2, 27.9],
              ],
            },
          }}
        />,
      ),
    );

    expect(mapMocks.fitBounds).toHaveBeenCalledTimes(1);
    expect(mapMocks.fitBounds).toHaveBeenCalledWith(
      [
        [-26.3, 27.8],
        [-26.2, 27.9],
      ],
      { animate: false, maxZoom: 14, padding: [44, 44] },
    );
  });

  it("skips tooltip binding for a area-boundary feature with no name", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          areaBoundaries={
            [
              {
                type: "Feature",
                properties: {},
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(mapMocks.featureLayers[0]?.bindTooltip).not.toHaveBeenCalled();
  });

  it("positions the area-boundary tooltip using a valid labelOffset", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          areaBoundaries={
            [
              {
                type: "Feature",
                properties: { name: "Mamelodi", labelOffset: [5, -10] },
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(mapMocks.featureLayers[0]?.bindTooltip).toHaveBeenCalledWith(
      "Mamelodi",
      expect.objectContaining({ offset: [5, -10] }),
    );
  });

  it("uses the secondary label class for a secondary-priority area boundary", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          areaBoundaries={
            [
              {
                type: "Feature",
                properties: {
                  name: "Rest of Mamelodi",
                  labelPriority: "secondary",
                },
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(mapMocks.featureLayers[0]?.bindTooltip).toHaveBeenCalledWith(
      "Rest of Mamelodi",
      expect.objectContaining({
        className: expect.stringContaining("areaLabelSecondary"),
      }),
    );
  });

  it("uses the major-primary label class for a large primary area boundary", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          areaBoundaries={
            [
              {
                type: "Feature",
                properties: { name: "Soweto", subPlaceCount: 15 },
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    expect(mapMocks.featureLayers[0]?.bindTooltip).toHaveBeenCalledWith(
      "Soweto",
      expect.objectContaining({
        className: expect.stringContaining("areaLabelMajor"),
      }),
    );
  });

  it("stays on the final tile fallback source when it errors again", () => {
    stubMatchMedia(false);

    render(
      withDomain(
        <MapView {...DEFAULT_MAP_VIEW_PROPS} areas={[]} visibleLayerIds={[]} />,
      ),
    );

    act(() => {
      mapMocks.tileErrorHandler?.();
    });
    act(() => {
      mapMocks.tileErrorHandler?.();
    });
    expect(screen.getByTestId("tile-layer")).toHaveTextContent(
      /tile\.openstreetmap\.org/i,
    );

    act(() => {
      mapMocks.tileErrorHandler?.();
    });

    expect(screen.getByTestId("tile-layer")).toHaveTextContent(
      /tile\.openstreetmap\.org/i,
    );
  });

  it("builds a circle marker for a transit point feature using the layer's resolved style", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [{ type: "Feature", properties: {}, geometry: null }],
        }),
      }),
    );

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={["rail"]}
        />,
      ),
    );

    await screen.findByText("1 features");

    const pointToLayer = mapMocks.geoJsonProps.transit?.pointToLayer;
    expect(pointToLayer).toBeDefined();

    const marker = pointToLayer?.(
      { type: "Feature", properties: {}, geometry: null },
      { lat: -26.2, lng: 28.0 },
    ) as { options: Record<string, unknown> };

    expect(marker.options).toMatchObject({
      fillOpacity: 1,
      weight: 1,
    });
  });

  it("resolves the area-boundary outline style across dark/light and secondary/primary and overview/detail combinations", () => {
    const secondaryFeature = {
      type: "Feature",
      properties: { labelPriority: "secondary" },
      geometry: null,
    } as never;
    const primaryFeature = {
      type: "Feature",
      properties: {},
      geometry: null,
    } as never;
    const areaBoundaries = [secondaryFeature, primaryFeature] as never;

    function renderOutline() {
      return render(
        withDomain(
          <MapView
            {...DEFAULT_MAP_VIEW_PROPS}
            areas={[]}
            areaBoundaries={areaBoundaries}
            visibleLayerIds={["areas"]}
          />,
        ),
      );
    }

    // light mode, overview zoom (< 9)
    stubMatchMedia(false);
    mapMocks.zoom = 8;
    let view = renderOutline();
    let style = mapMocks.geoJsonProps["area-outlines"]?.style;
    expect(style?.(secondaryFeature)).toMatchObject({
      weight: 1,
      opacity: 0.72,
    });
    expect(style?.(primaryFeature)).toMatchObject({ weight: 2, opacity: 1 });
    view.unmount();

    // light mode, detail zoom (>= 9)
    mapMocks.zoom = 10;
    view = renderOutline();
    style = mapMocks.geoJsonProps["area-outlines"]?.style;
    expect(style?.(secondaryFeature)).toMatchObject({
      weight: 2,
      opacity: 0.72,
    });
    expect(style?.(primaryFeature)).toMatchObject({ weight: 4, opacity: 1 });
    view.unmount();

    // dark mode, overview zoom
    stubMatchMedia(true);
    mapMocks.zoom = 8;
    view = renderOutline();
    style = mapMocks.geoJsonProps["area-outlines"]?.style;
    expect(style?.(secondaryFeature)).toMatchObject({
      weight: 1,
      opacity: 0.42,
    });
    expect(style?.(primaryFeature)).toMatchObject({ weight: 1, opacity: 0.62 });
    view.unmount();

    // dark mode, detail zoom
    mapMocks.zoom = 10;
    view = renderOutline();
    style = mapMocks.geoJsonProps["area-outlines"]?.style;
    expect(style?.(secondaryFeature)).toMatchObject({
      weight: 1,
      opacity: 0.42,
    });
    expect(style?.(primaryFeature)).toMatchObject({ weight: 2, opacity: 0.62 });
    view.unmount();
  });

  it("defaults the label field to 'name' when a selectable layer doesn't configure one", () => {
    const domain: DomainConfig = {
      layers: [
        {
          id: "no-label-field",
          label: "No label field",
          dataSource: ["/data/custom.geojson"],
          geometryKind: "choropleth",
          defaultVisible: true,
          available: true,
          interaction: { selectable: true },
          style: {
            kind: "choropleth",
            propertyKey: "value",
            buckets: [],
            baseOpacity: 0.5,
          },
        },
      ],
      layerGroups: [],
    };

    const onSelectableFeaturesChange = vi.fn();
    render(
      <DomainProvider domain={domain}>
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={
            [
              {
                type: "Feature",
                properties: { id: "X", name: "Fallback Name" },
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["no-label-field"]}
          onSelectableFeaturesChange={onSelectableFeaturesChange}
        />
      </DomainProvider>,
    );

    expect(onSelectableFeaturesChange).toHaveBeenLastCalledWith([
      { id: "X", label: "Fallback Name", layerId: "no-label-field" },
    ]);
  });

  it("falls back to properties.name when the configured labelField isn't a string", () => {
    const domain: DomainConfig = {
      layers: [
        {
          id: "numeric-label-field",
          label: "Numeric label field",
          dataSource: ["/data/custom.geojson"],
          geometryKind: "choropleth",
          defaultVisible: true,
          available: true,
          interaction: { selectable: true, labelField: "commuteMinutes" },
          style: {
            kind: "choropleth",
            propertyKey: "value",
            buckets: [],
            baseOpacity: 0.5,
          },
        },
      ],
      layerGroups: [],
    };

    const onSelectableFeaturesChange = vi.fn();
    render(
      <DomainProvider domain={domain}>
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={
            [
              {
                type: "Feature",
                properties: { id: "A", name: "Mamelodi", commuteMinutes: 15 },
                geometry: null,
              },
              {
                type: "Feature",
                properties: { id: "B", commuteMinutes: 20 },
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["numeric-label-field"]}
          onSelectableFeaturesChange={onSelectableFeaturesChange}
        />
      </DomainProvider>,
    );

    // Feature "B" has neither a string commuteMinutes nor a name, so it
    // resolves to an empty label.
    expect(onSelectableFeaturesChange).toHaveBeenLastCalledWith([
      { id: "A", label: "Mamelodi", layerId: "numeric-label-field" },
      { id: "B", label: "", layerId: "numeric-label-field" },
    ]);
  });

  it("defaults a click's click-count to 1 when the event has no originalEvent detail", () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    firstLayer?.__handlers.click?.({});
    vi.advanceTimersByTime(220);

    expect(onFeatureSelect).toHaveBeenCalledWith("A");
  });

  it("does not track selection for a feature whose id is not a string", () => {
    vi.useFakeTimers();
    const onFeatureSelect = vi.fn();

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={
            [
              {
                type: "Feature",
                properties: { id: 42, name: "Numeric" },
                geometry: null,
              },
            ] as never
          }
          visibleLayerIds={["areas"]}
          onFeatureSelect={onFeatureSelect}
          renderFeaturePopup={testRenderFeaturePopup}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];

    firstLayer?.__handlers.click?.({ originalEvent: { detail: 1 } });
    vi.advanceTimersByTime(220);
    expect(onFeatureSelect).not.toHaveBeenCalled();

    expect(() => firstLayer?.__handlers.remove?.()).not.toThrow();
  });

  it("ignores a dblclick when there is no pending click to cancel", () => {
    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={areas}
          visibleLayerIds={["areas"]}
        />,
      ),
    );

    const firstLayer = mapMocks.featureLayers[0];
    expect(() => firstLayer?.__handlers.dblclick?.()).not.toThrow();
  });

  it("gives transit point markers a larger radius at detail zoom levels", async () => {
    mapMocks.zoom = 12;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [{ type: "Feature", properties: {}, geometry: null }],
        }),
      }),
    );

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={["rail"]}
        />,
      ),
    );

    await screen.findByText("1 features");

    const pointToLayer = mapMocks.geoJsonProps.transit?.pointToLayer;
    const marker = pointToLayer?.(
      { type: "Feature", properties: {}, geometry: null },
      { lat: -26.2, lng: 28.0 },
    ) as { options: Record<string, unknown> };

    expect(marker.options).toMatchObject({ radius: 4 });
  });

  it("renders a VectorBasemapLayer using the basemap's styleUrl for a vector basemap", () => {
    registerBasemap("custom-vector", CUSTOM_VECTOR_BASEMAP);
    stubMatchMedia(false);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          basemap="custom-vector"
        />,
      ),
    );

    expect(screen.queryByTestId("tile-layer")).not.toBeInTheDocument();
    expect(screen.getByTestId("vector-basemap-layer")).toHaveTextContent(
      "https://example.com/style.json",
    );
  });

  it("uses a vector basemap's darkStyleUrl when dark mode is active", () => {
    registerBasemap("custom-vector", {
      ...CUSTOM_VECTOR_BASEMAP,
      description: "A custom vector basemap with a dark style.",
      styleUrl: "https://example.com/light.json",
      darkStyleUrl: "https://example.com/dark.json",
    });
    stubMatchMedia(true);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          basemap="custom-vector"
        />,
      ),
    );

    expect(screen.getByTestId("vector-basemap-layer")).toHaveTextContent(
      "https://example.com/dark.json",
    );
  });

  it("calls onBasemapError when the vector basemap layer fails to load", () => {
    registerBasemap("custom-vector", CUSTOM_VECTOR_BASEMAP);
    const onBasemapError = vi.fn();
    stubMatchMedia(false);

    render(
      withDomain(
        <MapView
          {...DEFAULT_MAP_VIEW_PROPS}
          areas={[]}
          visibleLayerIds={[]}
          basemap="custom-vector"
          onBasemapError={onBasemapError}
        />,
      ),
    );

    const loadError = new Error("network down");
    mapMocks.vectorBasemapOnError?.(loadError);

    expect(onBasemapError).toHaveBeenCalledWith("custom-vector", loadError);
  });
});
