import { render, waitFor } from "@testing-library/react";
import { forwardRef, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dataMocks = vi.hoisted(() => ({
  getTownships: vi.fn(),
  fetchAreas: vi.fn(),
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  TileLayer: () => null,
  GeoJSON: forwardRef<never, { data: { features: unknown[] } }>(
    ({ data }, _ref) => (
      <div data-testid="geojson-layer">{data.features.length} features</div>
    ),
  ),
  Pane: () => null,
  ZoomControl: () => null,
  ScaleControl: () => null,
  useMap: () => ({
    fitBounds: vi.fn(),
    invalidateSize: vi.fn(),
    getContainer: () => document.createElement("div"),
    getZoom: () => 9,
    whenReady: (callback: () => void) => {
      callback();
    },
    on: vi.fn(),
    off: vi.fn(),
    attributionControl: {
      addAttribution: vi.fn(),
      removeAttribution: vi.fn(),
      getContainer: () => document.createElement("div"),
    },
  }),
  useMapEvents: () => ({}),
  Popup: () => null,
}));

vi.mock("@karta/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/core")>();
  return {
    ...actual,
    fetchFeatureCollection: dataMocks.fetchAreas,
  };
});

vi.mock("./data/fetchTownships", () => ({
  fetchTownships: dataMocks.getTownships,
}));

import { registerBasemap } from "@karta/map";
import { App } from "./App";
import { useMapUiStore } from "./stores/useMapUiStore";

// The real "positron" basemap is now an OpenFreeMap vector basemap
// (MapLibre GL, dynamically imported real "leaflet"/"maplibre-gl-leaflet"
// packages) — exercising that real async/WebGL path isn't meaningful in
// these jsdom unit tests and races awkwardly with tests that unmount before
// other async work settles, so it's overridden here with a plain raster
// stub matching react-leaflet's mocked `TileLayer`.
registerBasemap("positron", {
  kind: "raster",
  label: "Positron",
  description: "Test-only raster stand-in for the real OpenFreeMap basemap.",
  url: "https://example.com/{z}/{x}/{y}.png",
  attribution: "Example",
});

interface RegisteredTool {
  name: string;
  execute: (
    input: unknown,
  ) => Promise<{ content: Array<{ type: "text"; text: string }> }>;
}

function stubModelContext() {
  const registerTool = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(document, "modelContext", {
    configurable: true,
    value: { registerTool },
  });
  return registerTool;
}

function clearModelContext() {
  Object.defineProperty(document, "modelContext", {
    configurable: true,
    value: undefined,
  });
}

describe("App WebMCP tool wiring", () => {
  beforeEach(() => {
    useMapUiStore.getState().reset();
    dataMocks.getTownships.mockReset().mockResolvedValue([]);
    dataMocks.fetchAreas.mockReset().mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
  });

  it("registers this app's WebMCP tools once the map data starts loading", async () => {
    const registerTool = stubModelContext();
    render(<App />);

    await waitFor(() => {
      const names = registerTool.mock.calls.map(
        ([tool]: [RegisteredTool]) => tool.name,
      );
      expect(names).toEqual(
        expect.arrayContaining([
          "list-map-layers",
          "toggle-map-layer",
          "search-map-location",
          "set-map-basemap",
          "set-app-theme",
          "read-map-story",
        ]),
      );
    });

    clearModelContext();
  });

  it("switches the panel to the story view and opens it when the read-map-story tool runs", async () => {
    const registerTool = stubModelContext();
    render(<App />);

    let storyTool: RegisteredTool | undefined;
    await waitFor(() => {
      storyTool = registerTool.mock.calls
        .map(([tool]: [RegisteredTool]) => tool)
        .find((tool: RegisteredTool) => tool.name === "read-map-story");
      expect(storyTool).toBeDefined();
    });

    await storyTool?.execute({});

    expect(useMapUiStore.getState().panelView).toBe("story");
    expect(useMapUiStore.getState().panelOpen).toBe(true);

    clearModelContext();
  });
});
