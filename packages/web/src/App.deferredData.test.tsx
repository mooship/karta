import { render, screen, waitFor } from "@testing-library/react";
import { forwardRef, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dataMocks = vi.hoisted(() => ({
  fetchFeatureCollection: vi.fn(),
}));

const mapReadyMocks = vi.hoisted(() => ({
  pendingReadyCallbacks: [] as Array<() => void>,
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
      mapReadyMocks.pendingReadyCallbacks.push(callback);
    },
    on: vi.fn(),
    off: vi.fn(),
  }),
  useMapEvents: () => ({}),
  Popup: () => null,
}));

vi.mock("@karta/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/core")>();
  return {
    ...actual,
    fetchFeatureCollection: dataMocks.fetchFeatureCollection,
  };
});

import { App } from "./App";
import { useMapUiStore } from "./stores/useMapUiStore";

describe("App choropleth data loading", () => {
  beforeEach(() => {
    useMapUiStore.getState().reset();
    mapReadyMocks.pendingReadyCallbacks = [];
    dataMocks.fetchFeatureCollection.mockReset().mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
  });

  it("holds the layer data request back until the map reports it is ready", async () => {
    render(<App />);

    await waitFor(() => {
      expect(mapReadyMocks.pendingReadyCallbacks.length).toBeGreaterThan(0);
    });

    expect(dataMocks.fetchFeatureCollection).not.toHaveBeenCalled();

    for (const callback of mapReadyMocks.pendingReadyCallbacks) {
      callback();
    }

    await waitFor(() => {
      expect(dataMocks.fetchFeatureCollection).toHaveBeenCalled();
    });
    await waitFor(() =>
      expect(screen.getAllByTestId("geojson-layer").length).toBeGreaterThan(0),
    );
  });
});
