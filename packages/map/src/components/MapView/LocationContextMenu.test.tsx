import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const geocodeMocks = vi.hoisted(() => ({
  fetchReverseGeocodeResult: vi.fn(),
}));

vi.mock("../../data/locationSearch", () => ({
  fetchReverseGeocodeResult: geocodeMocks.fetchReverseGeocodeResult,
}));

const mapEventsMocks = vi.hoisted(() => ({
  handlers: {} as {
    contextmenu?: (event: { latlng: { lat: number; lng: number } }) => void;
  },
}));

vi.mock("react-leaflet", () => ({
  useMapEvents: (handlers: typeof mapEventsMocks.handlers) => {
    mapEventsMocks.handlers = handlers;
    return {};
  },
  Popup: ({
    children,
    eventHandlers,
  }: {
    children: ReactNode;
    eventHandlers?: { remove?: () => void };
  }) => (
    <div data-testid="map-context-menu">
      {children}
      <button
        type="button"
        data-testid="map-context-menu-close"
        onClick={() => eventHandlers?.remove?.()}
      >
        Close
      </button>
    </div>
  ),
}));

import { LocationContextMenu } from "./LocationContextMenu";

describe("LocationContextMenu", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing until the map fires a contextmenu event", () => {
    render(<LocationContextMenu />);
    expect(screen.queryByTestId("map-context-menu")).not.toBeInTheDocument();
  });

  it("opens a menu with a 'search this location' action on contextmenu, without geocoding yet", () => {
    render(<LocationContextMenu />);

    act(() => {
      mapEventsMocks.handlers.contextmenu?.({
        latlng: { lat: -26.2, lng: 28.0 },
      });
    });

    expect(screen.getByTestId("map-context-menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /search this location/i }),
    ).toBeInTheDocument();
    expect(geocodeMocks.fetchReverseGeocodeResult).not.toHaveBeenCalled();
  });

  it("reverse-geocodes the long-pressed point once 'search this location' is chosen", async () => {
    geocodeMocks.fetchReverseGeocodeResult.mockResolvedValue({
      label: "Braamfontein, Johannesburg",
    });

    render(<LocationContextMenu />);
    act(() => {
      mapEventsMocks.handlers.contextmenu?.({
        latlng: { lat: -26.2, lng: 28.0 },
      });
    });

    fireEvent.click(
      screen.getByRole("menuitem", { name: /search this location/i }),
    );

    expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
      /looking up/i,
    );

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "Braamfontein, Johannesburg",
      );
    });
    expect(geocodeMocks.fetchReverseGeocodeResult).toHaveBeenCalledWith(
      -26.2,
      28.0,
      expect.any(AbortSignal),
    );
  });

  it("shows a fallback message when no address is found", async () => {
    geocodeMocks.fetchReverseGeocodeResult.mockResolvedValue(null);

    render(<LocationContextMenu />);
    act(() => {
      mapEventsMocks.handlers.contextmenu?.({ latlng: { lat: 0, lng: 0 } });
    });
    fireEvent.click(
      screen.getByRole("menuitem", { name: /search this location/i }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        /no address found/i,
      );
    });
  });

  it("shows a fallback message when the lookup fails", async () => {
    geocodeMocks.fetchReverseGeocodeResult.mockRejectedValue(
      new Error("network"),
    );

    render(<LocationContextMenu />);
    act(() => {
      mapEventsMocks.handlers.contextmenu?.({
        latlng: { lat: -26.2, lng: 28.0 },
      });
    });
    fireEvent.click(
      screen.getByRole("menuitem", { name: /search this location/i }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        /no address found/i,
      );
    });
  });

  it("re-opens fresh (with the action, not a stale result) on a new contextmenu event", async () => {
    geocodeMocks.fetchReverseGeocodeResult.mockResolvedValue({
      label: "First place",
    });

    render(<LocationContextMenu />);
    act(() => {
      mapEventsMocks.handlers.contextmenu?.({
        latlng: { lat: -26.2, lng: 28.0 },
      });
    });
    fireEvent.click(
      screen.getByRole("menuitem", { name: /search this location/i }),
    );
    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "First place",
      );
    });

    act(() => {
      mapEventsMocks.handlers.contextmenu?.({
        latlng: { lat: -26.3, lng: 28.1 },
      });
    });

    expect(
      screen.getByRole("menuitem", { name: /search this location/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("First place")).not.toBeInTheDocument();
  });

  it("closes when the popup is dismissed (e.g. by a map click, via Leaflet's own closePopupOnClick)", () => {
    render(<LocationContextMenu />);
    act(() => {
      mapEventsMocks.handlers.contextmenu?.({
        latlng: { lat: -26.2, lng: 28.0 },
      });
    });
    expect(screen.getByTestId("map-context-menu")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("map-context-menu-close"));

    expect(screen.queryByTestId("map-context-menu")).not.toBeInTheDocument();
  });
});
