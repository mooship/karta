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
    contextmenu?: (event: {
      latlng: { lat: number; lng: number };
      originalEvent?: { clientX: number; clientY: number };
    }) => void;
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

function openMenu(
  latlng: { lat: number; lng: number } = { lat: -26.2, lng: 28.0 },
  originalEvent?: { clientX: number; clientY: number },
) {
  act(() => {
    mapEventsMocks.handlers.contextmenu?.({ latlng, originalEvent });
  });
}

function chooseSearchHere() {
  fireEvent.click(
    screen.getByRole("menuitem", { name: /search this location/i }),
  );
}

function dispatchDocumentClick(clientX: number, clientY: number) {
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
  });
  const stopPropagationSpy = vi.spyOn(event, "stopPropagation");
  document.dispatchEvent(event);
  return stopPropagationSpy;
}

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
    openMenu();

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
    openMenu();
    chooseSearchHere();

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
    openMenu({ lat: 0, lng: 0 });
    chooseSearchHere();

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
    openMenu();
    chooseSearchHere();

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
    openMenu();
    chooseSearchHere();
    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "First place",
      );
    });

    openMenu({ lat: -26.3, lng: 28.1 });

    expect(
      screen.getByRole("menuitem", { name: /search this location/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("First place")).not.toBeInTheDocument();
  });

  it("closes when the popup is dismissed (e.g. by a map click, via Leaflet's own closePopupOnClick)", () => {
    render(<LocationContextMenu />);
    openMenu();
    expect(screen.getByTestId("map-context-menu")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("map-context-menu-close"));

    expect(screen.queryByTestId("map-context-menu")).not.toBeInTheDocument();
  });

  it("aborts an in-flight lookup when a new contextmenu event reopens the menu elsewhere", async () => {
    let firstAborted = false;
    geocodeMocks.fetchReverseGeocodeResult
      .mockImplementationOnce(
        (_lat: number, _lng: number, signal?: AbortSignal) =>
          new Promise(() => {
            signal?.addEventListener("abort", () => {
              firstAborted = true;
            });
          }),
      )
      .mockResolvedValueOnce({ label: "Second place" });

    render(<LocationContextMenu />);
    openMenu();
    chooseSearchHere();

    openMenu({ lat: -26.3, lng: 28.1 });
    chooseSearchHere();

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "Second place",
      );
    });
    expect(firstAborted).toBe(true);
  });

  it("aborts an in-flight lookup when the menu is dismissed without picking a new spot", () => {
    let aborted = false;
    geocodeMocks.fetchReverseGeocodeResult.mockImplementationOnce(
      (_lat: number, _lng: number, signal?: AbortSignal) =>
        new Promise(() => {
          signal?.addEventListener("abort", () => {
            aborted = true;
          });
        }),
    );

    render(<LocationContextMenu />);
    openMenu();
    chooseSearchHere();

    fireEvent.click(screen.getByTestId("map-context-menu-close"));

    expect(aborted).toBe(true);
  });

  it("suppresses the synthetic click a mobile long-press's release fires at (near enough) the same point, so it can't close the menu it just opened", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    const stopPropagationSpy = dispatchDocumentClick(108, 195);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("leaves a click well away from the long-press point alone (a deliberate tap, e.g. on the menu's own button)", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    const stopPropagationSpy = dispatchDocumentClick(400, 500);

    expect(stopPropagationSpy).not.toHaveBeenCalled();
  });

  it("only guards the single click immediately after a long-press, not later ones", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    dispatchDocumentClick(108, 195);
    const secondSpy = dispatchDocumentClick(101, 201);

    expect(secondSpy).not.toHaveBeenCalled();
  });

  it("does not arm a click guard when the contextmenu event has no native originalEvent", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 });

    const stopPropagationSpy = dispatchDocumentClick(100, 200);

    expect(stopPropagationSpy).not.toHaveBeenCalled();
  });
});
