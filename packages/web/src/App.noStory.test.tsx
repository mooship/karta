import { render, screen, waitFor } from "@testing-library/react";
import { forwardRef, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dataMocks = vi.hoisted(() => ({
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

vi.mock("./layers/registry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./layers/registry")>();
  return {
    ...actual,
    getLocalizedDomain: (domainId: string) => ({
      ...actual.getLocalizedDomain(domainId),
      story: undefined,
      layers: actual
        .getLocalizedDomain(domainId)
        .layers.map((layer) => ({ ...layer, browsable: undefined })),
    }),
  };
});

import { App } from "./App";
import { useMapUiStore } from "./stores/useMapUiStore";

describe("App with a domain that has no story or browsable layers", () => {
  beforeEach(() => {
    useMapUiStore.getState().reset();
    dataMocks.fetchAreas.mockReset().mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
  });

  it("renders layer toggles directly, with no tab UI", async () => {
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
