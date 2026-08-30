import type { Layer } from "@karta/core";
import { render, screen, waitFor } from "@testing-library/react";
import { forwardRef, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dataMocks = vi.hoisted(() => ({
  getTownships: vi.fn(),
  fetchAreas: vi.fn(),
}));

/**
 * A mutable knob the `./layers/registry` mock below reads on every
 * `getLayers()` call, so a single hoisted `vi.mock` factory (unlike the
 * factory itself, which only runs once) can serve both scenarios this file
 * covers -- toggled per test rather than duplicating the module mocks and
 * fixture data in a second file.
 */
const registryOverrides = vi.hoisted(() => ({ stripInteraction: false }));

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

vi.mock("./layers/registry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./layers/registry")>();
  return {
    ...actual,
    getStory: () => undefined,
    getLayers: (): Layer[] =>
      registryOverrides.stripInteraction
        ? actual
            .getLayers()
            .map((layer) => ({ ...layer, interaction: undefined }))
        : actual.getLayers(),
  };
});

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

describe("App with a domain that has no story", () => {
  beforeEach(() => {
    registryOverrides.stripInteraction = false;
    useMapUiStore.getState().reset();
    dataMocks.getTownships.mockReset().mockResolvedValue([
      {
        type: "Feature",
        properties: {
          id: "A",
          name: "Mamelodi",
          commuteMinutes: 20,
          nearestJobCenter: "Pretoria CBD",
          distanceKm: null,
          nearestTransitKm: null,
          nearestAReYengStopKm: null,
        },
        geometry: null,
      },
    ]);
    dataMocks.fetchAreas.mockReset().mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
  });

  it("shows a Layers/Browse tablist with no Story tab, since the domain still has a selectable layer", async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );

    expect(screen.getByTestId("panel-tablist")).toBeInTheDocument();
    expect(screen.getByTestId("panel-tab-layers")).toBeInTheDocument();
    expect(screen.getByTestId("panel-tab-browser")).toBeInTheDocument();
    expect(screen.queryByTestId("panel-tab-story")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("checkbox", { name: "Modelled car time" }),
    ).toBeInTheDocument();
  });

  it("renders layer toggles directly, with no tab UI, when the domain also has no selectable layer", async () => {
    registryOverrides.stripInteraction = true;
    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );

    expect(screen.queryByTestId("panel-tablist")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("checkbox", { name: "Modelled car time" }),
    ).toBeInTheDocument();
  });
});
