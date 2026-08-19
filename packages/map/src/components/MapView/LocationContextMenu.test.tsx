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
  nominatimGeocoderProvider: {
    search: vi.fn(),
    reverse: geocodeMocks.fetchReverseGeocodeResult,
  },
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
    // biome-ignore lint/a11y/noStaticElementInteractions: test-only stand-in for react-leaflet's real Popup, which closes on Escape (via Leaflet's own closeOnEscapeKey) independently of any click -- this mirrors that non-click dismissal path
    <div
      data-testid="map-context-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          eventHandlers?.remove?.();
        }
      }}
    >
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

  it("shows a no-match message, with no retry, when the lookup resolves with no result", async () => {
    geocodeMocks.fetchReverseGeocodeResult.mockResolvedValue(null);

    render(<LocationContextMenu />);
    openMenu();
    await chooseSearchHere();

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        /no address found/i,
      );
    });
    expect(
      screen.queryByRole("button", { name: /retry/i }),
    ).not.toBeInTheDocument();
  });

  it("shows a failure message with a retry button when the lookup rejects, and retrying re-issues the lookup", async () => {
    geocodeMocks.fetchReverseGeocodeResult
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({ label: "Braamfontein, Johannesburg" });

    render(<LocationContextMenu />);
    openMenu();
    await chooseSearchHere();

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        /couldn't look up this address/i,
      );
    });
    const retryButton = screen.getByRole("button", { name: /retry/i });

    fireEvent.click(retryButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "Braamfontein, Johannesburg",
      );
    });
    expect(geocodeMocks.fetchReverseGeocodeResult).toHaveBeenCalledTimes(2);
  });

  it("uses a custom provider instead of the default Nominatim one when given", async () => {
    const customProvider = {
      search: vi.fn(),
      reverse: vi.fn().mockResolvedValue({ label: "Custom place" }),
    };

    render(<LocationContextMenu provider={customProvider} />);
    openMenu();
    await chooseSearchHere();

    await waitFor(() => {
      expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
        "Custom place",
      );
    });
    expect(customProvider.reverse).toHaveBeenCalledWith(
      -26.2,
      28.0,
      expect.any(AbortSignal),
    );
    expect(geocodeMocks.fetchReverseGeocodeResult).not.toHaveBeenCalled();
  });

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

  it("ignores a stale reverse-geocode success that resolves after the lookup was aborted by reopening elsewhere", async () => {
    let resolveStale: (value: { label: string } | null) => void = () => {};
    geocodeMocks.fetchReverseGeocodeResult
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveStale = resolve;
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

    await act(async () => {
      resolveStale({ label: "Stale place" });
    });

    expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
      "Second place",
    );
    expect(screen.queryByText("Stale place")).not.toBeInTheDocument();
  });

  it("ignores a stale reverse-geocode failure that rejects after the lookup was aborted by reopening elsewhere", async () => {
    let rejectStale: (reason: unknown) => void = () => {};
    geocodeMocks.fetchReverseGeocodeResult
      .mockImplementationOnce(
        () =>
          new Promise((_resolve, reject) => {
            rejectStale = reject;
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

    await act(async () => {
      rejectStale(new Error("network"));
    });

    expect(screen.getByTestId("map-context-menu")).toHaveTextContent(
      "Second place",
    );
    expect(
      screen.queryByText(/couldn't look up this address/i),
    ).not.toBeInTheDocument();
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

  it("still guards a click against a null menu content ref once the menu has already closed some other way (e.g. Escape) while the guard is still armed", () => {
    render(<LocationContextMenu />);
    openMenu({ lat: -26.2, lng: 28.0 }, { clientX: 100, clientY: 200 });

    // Closes the popup via Escape, not a click -- unlike closeMenu()'s click
    // on the mock's own "Close" button, this doesn't itself run through (and
    // disarm) the document-level click guard, so the guard is still armed
    // for the click dispatched below, and menuContentRef.current is now null
    // (the menu content unmounted) by the time that click is handled.
    fireEvent.keyDown(screen.getByTestId("map-context-menu"), {
      key: "Escape",
    });

    const stopPropagationSpy = dispatchDocumentClick(document.body, {
      clientX: 105,
      clientY: 195,
    });

    expect(stopPropagationSpy).toHaveBeenCalled();
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
