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

async function chooseSearchHere() {
  fireEvent.click(
    screen.getByRole("menuitem", { name: /search this location/i }),
  );
  // The component defers its own state update to a macrotask (see
  // LocationContextMenu's handleSearchHere), so this flushes it.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function closeMenu() {
  fireEvent.click(screen.getByTestId("map-context-menu-close"));
}

function dispatchDocumentClick(
  target: EventTarget,
  coordinates: { clientX: number; clientY: number } = {
    clientX: 0,
    clientY: 0,
  },
) {
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    ...coordinates,
  });
  const stopPropagationSpy = vi.spyOn(event, "stopPropagation");
  target.dispatchEvent(event);
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

  it("shows a loading message while the lookup is in flight, then the reverse-geocoded address", async () => {
    let resolveResult: (value: { label: string }) => void = () => {};
    geocodeMocks.fetchReverseGeocodeResult.mockReturnValue(
      new Promise((resolve) => {
        resolveResult = resolve;
      }),
    );

    render(<LocationContextMenu />);
    openMenu();
    await chooseSearchHere();

    expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
      /looking up/i,
    );

    await act(async () => {
      resolveResult({ label: "Braamfontein, Johannesburg" });
    });

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

  it.each(["resolves with no result", "rejects"] as const)(
    "shows a fallback message when the lookup %s",
    async (mode) => {
      if (mode === "resolves with no result") {
        geocodeMocks.fetchReverseGeocodeResult.mockResolvedValue(null);
      } else {
        geocodeMocks.fetchReverseGeocodeResult.mockRejectedValue(
          new Error("network"),
        );
      }

      render(<LocationContextMenu />);
      openMenu();
      await chooseSearchHere();

      await waitFor(() => {
        expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
          /no address found/i,
        );
      });
    },
  );

  it("re-opens fresh (with the action, not a stale result) on a new contextmenu event", async () => {
    geocodeMocks.fetchReverseGeocodeResult.mockResolvedValue({
      label: "First place",
    });

    render(<LocationContextMenu />);
    openMenu();
    await chooseSearchHere();
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

    closeMenu();

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
    await chooseSearchHere();

    openMenu({ lat: -26.3, lng: 28.1 });
    await chooseSearchHere();

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "Second place",
      );
    });
    expect(firstAborted).toBe(true);
  });

  it("aborts an in-flight lookup when the menu is dismissed without picking a new spot", async () => {
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
    await chooseSearchHere();

    closeMenu();

    expect(aborted).toBe(true);
  });

  it("suppresses a click that's both near the long-press point and outside the menu (the ghost click a mobile long-press's release fires on the map background), so it can't close the menu it just opened", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    const stopPropagationSpy = dispatchDocumentClick(document.body, {
      clientX: 105,
      clientY: 195,
    });

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("leaves a click on the menu's own content alone (a deliberate tap on its button), even if it happens to land near the long-press point", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    const stopPropagationSpy = dispatchDocumentClick(
      screen.getByRole("menuitem", { name: /search this location/i }),
      { clientX: 105, clientY: 195 },
    );

    expect(stopPropagationSpy).not.toHaveBeenCalled();
  });

  it("leaves a click well away from the long-press point alone, even though it's outside the menu (e.g. a deliberate tap elsewhere on the map to dismiss the menu)", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    const stopPropagationSpy = dispatchDocumentClick(document.body, {
      clientX: 400,
      clientY: 500,
    });

    expect(stopPropagationSpy).not.toHaveBeenCalled();
  });

  it("only guards the single click immediately after a long-press/right-click, not later ones", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    dispatchDocumentClick(document.body, { clientX: 105, clientY: 195 });
    const secondSpy = dispatchDocumentClick(document.body, {
      clientX: 101,
      clientY: 201,
    });

    expect(secondSpy).not.toHaveBeenCalled();
  });

  it("does not arm a click guard when the contextmenu event has no native originalEvent", () => {
    render(<LocationContextMenu />);
    openMenu();

    const stopPropagationSpy = dispatchDocumentClick(document.body, {
      clientX: 0,
      clientY: 0,
    });

    expect(stopPropagationSpy).not.toHaveBeenCalled();
  });
});
