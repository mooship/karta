import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dataMocks = vi.hoisted(() => ({
  getTownships: vi.fn(),
  fetchAreas: vi.fn(),
}));

const mapViewMocks = vi.hoisted(() => ({
  latestProps: undefined as
    | undefined
    | {
        onBasemapError?: (basemap: string, error: unknown) => void;
        renderFeaturePopup?: (properties: unknown) => ReactNode;
        focusLocationTarget?: unknown;
        selectedFeatureId?: string | null;
        measurementTool?: boolean;
        measurementPanelOpen?: boolean;
        measurementRequest?: {
          token: number;
          mode: string;
          points: { lat: number; lng: number }[];
        } | null;
      },
}));

const geocodeMocks = vi.hoisted(() => ({
  fetchLocationSearchResults: vi.fn(),
}));

vi.mock("@karta/map/MapView", () => ({
  MapView: (props: NonNullable<typeof mapViewMocks.latestProps>) => {
    mapViewMocks.latestProps = props;
    return <div data-testid="mock-map-view" />;
  },
}));

vi.mock("@karta/map", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/map")>();
  return {
    ...actual,
    fetchLocationSearchResults: geocodeMocks.fetchLocationSearchResults,
    LocationSearchControl: ({
      onLocationSelect,
    }: {
      onLocationSelect: (location: {
        id: string;
        label: string;
        latitude: number;
        longitude: number;
      }) => void;
    }) => (
      <>
        <button
          type="button"
          data-testid="fake-location-result"
          onClick={() =>
            onLocationSelect({
              id: "mamelodi",
              label: "Mamelodi, Tshwane",
              latitude: -25.7,
              longitude: 28.35,
            })
          }
        >
          Select Mamelodi
        </button>
        <button
          type="button"
          data-testid="fake-out-of-coverage-result"
          onClick={() =>
            onLocationSelect({
              id: "london",
              label: "London",
              latitude: 51.5074,
              longitude: -0.1278,
            })
          }
        >
          Select London
        </button>
        <button
          type="button"
          data-testid="fake-outside-gauteng-in-south-africa-result"
          onClick={() =>
            onLocationSelect({
              id: "cape-town",
              label: "Cape Town",
              latitude: -33.9249,
              longitude: 18.4241,
            })
          }
        >
          Select Cape Town
        </button>
      </>
    ),
  };
});

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

import { App } from "./App";
import { useMapUiStore } from "./stores/useMapUiStore";

describe("App map/location callback wiring", () => {
  beforeEach(() => {
    useMapUiStore.getState().reset();
    mapViewMocks.latestProps = undefined;
    dataMocks.getTownships.mockReset().mockResolvedValue([]);
    dataMocks.fetchAreas.mockReset().mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
    geocodeMocks.fetchLocationSearchResults.mockReset();
  });

  it("falls back to the street basemap when the map reports a basemap load error", async () => {
    useMapUiStore.getState().setBasemap("voyager");
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());

    mapViewMocks.latestProps?.onBasemapError?.(
      "voyager",
      new Error("tiles unreachable"),
    );

    await waitFor(() =>
      expect(useMapUiStore.getState().basemap).toBe("street"),
    );
  });

  it("enables MapView's measurement tool", async () => {
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());

    expect(mapViewMocks.latestProps?.measurementTool).toBe(true);
  });

  it("keeps MapView's measurementPanelOpen in sync with the app's own panel state on mobile", async () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 375,
      writable: true,
    });

    try {
      render(<App />);

      await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());

      act(() => {
        useMapUiStore.getState().setPanelOpen(false);
      });

      await waitFor(() =>
        expect(mapViewMocks.latestProps?.measurementPanelOpen).toBe(false),
      );

      act(() => {
        useMapUiStore.getState().setPanelOpen(true);
      });

      await waitFor(() =>
        expect(mapViewMocks.latestProps?.measurementPanelOpen).toBe(true),
      );
    } finally {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: originalInnerWidth,
        writable: true,
      });
    }
  });

  it("never opens measurementPanelOpen on desktop, since the sidebar is open there by default", async () => {
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());

    act(() => {
      useMapUiStore.getState().setPanelOpen(true);
    });

    await waitFor(() =>
      expect(mapViewMocks.latestProps?.measurementPanelOpen).toBe(false),
    );
  });

  it("plots a WebMCP measure-distance call on MapView's own measurement tool", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: { registerTool },
    });

    try {
      geocodeMocks.fetchLocationSearchResults
        .mockResolvedValueOnce([
          { id: "1", label: "Sandton", latitude: -26.11, longitude: 28.06 },
        ])
        .mockResolvedValueOnce([
          { id: "2", label: "Soweto", latitude: -26.27, longitude: 27.86 },
        ]);

      render(<App />);

      await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());
      expect(mapViewMocks.latestProps?.measurementRequest).toBeFalsy();

      const measureDistanceCall = registerTool.mock.calls.find(
        ([tool]) => tool.name === "measure-distance",
      );
      expect(measureDistanceCall).toBeDefined();
      const tool = measureDistanceCall?.[0] as {
        execute: (input: unknown) => Promise<unknown>;
      };

      await act(async () => {
        await tool.execute({ locations: ["Sandton", "Soweto"] });
      });

      await waitFor(() =>
        expect(mapViewMocks.latestProps?.measurementRequest).toEqual(
          expect.objectContaining({
            mode: "distance",
            points: [
              { lat: -26.11, lng: 28.06 },
              { lat: -26.27, lng: 27.86 },
            ],
          }),
        ),
      );
    } finally {
      Object.defineProperty(document, "modelContext", {
        configurable: true,
        value: undefined,
      });
    }
  });

  it("renders township popup content via renderFeaturePopup", async () => {
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());

    const popup = mapViewMocks.latestProps?.renderFeaturePopup?.({
      name: "Mamelodi",
      commuteMinutes: 20,
      nearestJobCenter: "Pretoria CBD",
      distanceKm: null,
      nearestTransitKm: null,
    });

    render(<div>{popup}</div>);

    expect(screen.getByTestId("township-popup")).toHaveTextContent("Mamelodi");
  });

  it("always provides renderFeaturePopup, regardless of panel open state", async () => {
    useMapUiStore.getState().setPanelOpen(true);

    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());

    expect(mapViewMocks.latestProps?.renderFeaturePopup).toBeInstanceOf(
      Function,
    );
  });

  it("keeps renderFeaturePopup referentially stable across unrelated re-renders", async () => {
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());
    const initialRenderFeaturePopup =
      mapViewMocks.latestProps?.renderFeaturePopup;
    expect(initialRenderFeaturePopup).toBeInstanceOf(Function);

    act(() => {
      useMapUiStore.getState().setPanelOpen(true);
    });
    act(() => {
      useMapUiStore.getState().setPanelView("story");
    });

    expect(mapViewMocks.latestProps?.renderFeaturePopup).toBe(
      initialRenderFeaturePopup,
    );
  });

  it("clears the selected feature and focuses the map when a search result is chosen", async () => {
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());
    useMapUiStore.getState().setSelectedFeatureId("A");

    fireEvent.click(screen.getByTestId("fake-location-result"));

    await waitFor(() =>
      expect(useMapUiStore.getState().selectedFeatureId).toBeNull(),
    );
    await waitFor(() =>
      expect(mapViewMocks.latestProps?.focusLocationTarget).toMatchObject({
        location: { label: "Mamelodi, Tshwane" },
      }),
    );
  });

  it("shows a coverage message instead of moving the map for a result outside South Africa", async () => {
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());
    const focusTargetBeforeSelect =
      mapViewMocks.latestProps?.focusLocationTarget;

    fireEvent.click(screen.getByTestId("fake-out-of-coverage-result"));

    await waitFor(() =>
      expect(screen.getByTestId("location-out-of-coverage")).toHaveTextContent(
        "London",
      ),
    );
    expect(mapViewMocks.latestProps?.focusLocationTarget).toBe(
      focusTargetBeforeSelect,
    );
  });

  it("moves the map for a result outside Gauteng but within South Africa", async () => {
    render(<App />);

    await waitFor(() => expect(mapViewMocks.latestProps).toBeDefined());

    fireEvent.click(
      screen.getByTestId("fake-outside-gauteng-in-south-africa-result"),
    );

    await waitFor(() =>
      expect(mapViewMocks.latestProps?.focusLocationTarget).toMatchObject({
        location: { label: "Cape Town" },
      }),
    );
    expect(
      screen.queryByTestId("location-out-of-coverage"),
    ).not.toBeInTheDocument();
  });
});
