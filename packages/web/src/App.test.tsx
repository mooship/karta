import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

async function renderMobilePanel() {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 375,
    writable: true,
  });
  useMapUiStore.getState().reset();

  const { container } = render(<App />);
  await waitFor(() =>
    expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
  );
  fireEvent.click(screen.getByRole("button", { name: /explore/i }));

  return {
    container,
    panel: screen.getByTestId("panel-container"),
    handle: screen.getByTestId("panel-sheet-handle"),
  };
}

describe("App", () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalInnerWidth,
      writable: true,
    });
    useMapUiStore.getState().reset();
    dataMocks.getTownships.mockReset().mockImplementation((url: string) =>
      Promise.resolve(
        url.includes("/gauteng/")
          ? [
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
            ]
          : [],
      ),
    );
    dataMocks.fetchAreas.mockReset().mockResolvedValue({
      type: "FeatureCollection",
      features: [],
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalInnerWidth,
      writable: true,
    });
  });
  it("provides skip navigation, a page heading, and a main landmark", async () => {
    render(<App />);

    expect(
      screen.getByRole("link", { name: /skip to map information/i }),
    ).toHaveAttribute("href", "#map-information");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(screen.getByRole("banner")).toContainElement(heading);
    expect(screen.getByRole("main")).toHaveAttribute("id", "map-information");
    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );
  });

  it("opens the desktop panel synchronously on hydration, not deferred", () => {
    render(<App />);

    expect(screen.getByTestId("panel-toggle")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("keeps an explicit accessible name on the panel toggle regardless of its visible label's CSS visibility", () => {
    render(<App />);

    const trigger = screen.getByTestId("panel-toggle");
    expect(trigger).toHaveAttribute("aria-label", "Close");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-label", "Explore");
  });

  it("does not render the top-left introduction card", async () => {
    render(<App />);

    expect(
      screen.queryByRole("button", { name: /minimise introduction/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /buffer zones/i, level: 1 }),
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toHaveTextContent(
        "1 features",
      ),
    );
  });

  it("shows map-chrome location search outside settings", async () => {
    render(<App />);

    expect(screen.getByTestId("location-search-input")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("settings-menu-trigger"));
    expect(
      screen.queryByTestId("settings-location-search-input"),
    ).not.toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );
  });

  it("selects a township directly from the unified search box, alongside place search", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByTestId("location-search-input"), {
      target: { value: "Mamelodi" },
    });

    const option = await screen.findByRole("option", { name: "Mamelodi" });
    fireEvent.click(option);

    await waitFor(() => {
      expect(window.location.search).toContain("feature=A");
    });
  });

  it("hides the desktop legend while settings is open so the two panels don't overlap", async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("desktop-legend")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("settings-menu-trigger"));
    expect(screen.queryByTestId("desktop-legend")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("settings-menu-trigger"));
    expect(screen.getByTestId("desktop-legend")).toBeInTheDocument();
  });

  it("shows layer controls immediately in the panel", async () => {
    render(<App />);

    expect(
      await screen.findByRole("checkbox", { name: "Modelled car time" }),
    ).toBeChecked();
    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );
  });

  it("shows a Story tab that renders the domain's story copy", async () => {
    render(<App />);

    const tablist = await screen.findByTestId("panel-tablist");
    const layersTab = screen.getByTestId("panel-tab-layers");
    const storyTab = screen.getByTestId("panel-tab-story");
    expect(tablist).toBeInTheDocument();
    expect(layersTab).toHaveAttribute("aria-selected", "true");
    expect(storyTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(storyTab);

    expect(storyTab).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("heading", { name: "Why this map exists" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Modelled car time" }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("panel-viewport")).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("shows a Browse tab listing every selectable feature, grouped by layer, and selects one on click", async () => {
    render(<App />);

    const browseTab = await screen.findByTestId("panel-tab-browser");
    fireEvent.click(browseTab);

    expect(browseTab).toHaveAttribute("aria-selected", "true");
    expect(
      await screen.findByRole("heading", { name: "Modelled car time" }),
    ).toBeInTheDocument();

    const row = await screen.findByRole("button", { name: "Mamelodi" });
    fireEvent.click(row);

    await waitFor(() => {
      expect(window.location.search).toContain("feature=A");
    });
  });

  it("moves tab focus with arrow keys and activates the focused tab", async () => {
    render(<App />);

    const layersTab = await screen.findByTestId("panel-tab-layers");
    const storyTab = screen.getByTestId("panel-tab-story");
    layersTab.focus();

    fireEvent.keyDown(layersTab, { key: "ArrowRight" });

    expect(storyTab).toHaveFocus();
    expect(storyTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(storyTab, { key: "ArrowLeft" });

    expect(layersTab).toHaveFocus();
    expect(layersTab).toHaveAttribute("aria-selected", "true");
  });

  it.each([
    ["End", "panel-tab-browser"],
    ["Home", "panel-tab-layers"],
    ["a", "panel-tab-layers"],
  ] as const)(
    "pressing %s from the layers tab moves focus to %s",
    async (key, expectedTabTestId) => {
      render(<App />);

      const layersTab = await screen.findByTestId("panel-tab-layers");
      layersTab.focus();

      fireEvent.keyDown(layersTab, { key });

      const expectedTab = screen.getByTestId(expectedTabTestId);
      expect(expectedTab).toHaveFocus();
      expect(expectedTab).toHaveAttribute("aria-selected", "true");
    },
  );

  it("collapses and restores the controls panel", async () => {
    render(<App />);

    const trigger = await screen.findByRole("button", { name: /close/i });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);

    expect(
      screen.queryByRole("checkbox", { name: "Modelled car time" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /explore/i }));

    expect(
      screen.getByRole("checkbox", { name: "Modelled car time" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );
  });

  it("moves focus into the panel's active tab when it's opened via the trigger", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: /close/i }));

    fireEvent.click(screen.getByRole("button", { name: /explore/i }));

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /layers/i })).toHaveFocus();
    });
  });

  it("closes the panel on Escape and restores focus to the trigger", async () => {
    render(<App />);
    const trigger = await screen.findByRole("button", { name: /close/i });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("keeps the desktop panel open on an outside click, since it behaves as a persistent sidebar there", async () => {
    render(<App />);
    const trigger = await screen.findByRole("button", { name: /close/i });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseDown(document.body);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("still opens the full measurement panel on desktop, even though the Explore sidebar is open by default", async () => {
    render(<App />);
    expect(
      await screen.findByRole("button", { name: /close/i }),
    ).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(await screen.findByTestId("measurement-control-toggle"));

    expect(screen.getByTestId("measurement-control-panel")).toBeInTheDocument();
    expect(screen.getByTestId("measurement-control-hint")).toBeInTheDocument();
  });

  it("closes the mobile sheet on an outside click, unlike the desktop sidebar", async () => {
    const { panel } = await renderMobilePanel();

    fireEvent.mouseDown(document.body);

    expect(panel).toHaveAttribute("data-panel-closing", "true");
    fireEvent.animationEnd(panel);
    await waitFor(() => expect(panel).not.toBeVisible());
  });

  it("does not close the mobile sheet on a click inside it", async () => {
    const { panel } = await renderMobilePanel();

    fireEvent.mouseDown(panel);

    expect(panel).not.toHaveAttribute("data-panel-closing", "true");
    expect(panel).toBeVisible();
  });

  it("keeps the measurement toggle visible (not hidden) while the mobile Explore panel is open", async () => {
    await renderMobilePanel();

    expect(
      screen.getByTestId("measurement-control-toggle"),
    ).toBeInTheDocument();
  });

  it("closes the Explore panel, rather than opening the measurement tool, when the measurement toggle is tapped while the panel is open", async () => {
    const { panel } = await renderMobilePanel();

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));

    expect(panel).toHaveAttribute("data-panel-closing", "true");
    fireEvent.animationEnd(panel);
    await waitFor(() => expect(panel).not.toBeVisible());
    expect(
      screen.queryByTestId("measurement-control-panel"),
    ).not.toBeInTheDocument();
  });

  it("returns the panel toggle and legend trigger to their base position as soon as the sheet starts closing, not after its exit animation finishes", async () => {
    const { container, panel } = await renderMobilePanel();

    const appRoot = container.querySelector("[data-panel-open]");
    expect(appRoot).toHaveAttribute("data-panel-open", "true");

    fireEvent.mouseDown(document.body);

    expect(panel).toHaveAttribute("data-panel-closing", "true");
    expect(appRoot).toHaveAttribute("data-panel-open", "false");
  });

  it("keeps the legend visible on desktop while layer controls are open", async () => {
    render(<App />);

    expect(
      await screen.findByRole("checkbox", { name: "Modelled car time" }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("desktop-legend")).toBeVisible();
    expect(
      screen.getByRole("list", { name: /active map layers legend/i }),
    ).toBeInTheDocument();
  });

  it("provides one-tap mobile legend access while the panel is closed", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 375,
      writable: true,
    });
    useMapUiStore.getState().reset();

    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );

    const exploreButton = screen.getByRole("button", { name: /explore/i });
    expect(exploreButton).toHaveAttribute("aria-expanded", "false");

    const openLegend = screen.getByRole("button", { name: /open map legend/i });
    expect(openLegend).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(openLegend);

    expect(openLegend).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("mobile-legend-content")).toBeVisible();
    expect(
      screen.getByRole("list", { name: /active map layers legend/i }),
    ).toBeInTheDocument();

    fireEvent.click(openLegend);
    expect(
      screen.queryByTestId("mobile-legend-content"),
    ).not.toBeInTheDocument();
  });

  it("lets mobile users snap the panel between medium and full height", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 375,
      writable: true,
    });
    useMapUiStore.getState().reset();

    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );

    const openPanel = screen.getByRole("button", { name: /explore/i });
    fireEvent.click(openPanel);

    const panel = screen.getByTestId("panel-container");
    const handle = screen.getByTestId("panel-sheet-handle");

    expect(panel).toHaveAttribute("data-panel-size", "medium");
    expect(handle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(handle);

    expect(panel).toHaveAttribute("data-panel-size", "full");
    expect(handle).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(handle);

    expect(panel).toHaveAttribute("data-panel-size", "medium");
    expect(handle).toHaveAttribute("aria-pressed", "false");
  });

  it("supports drag gestures on the mobile sheet handle", async () => {
    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 7,
      clientY: 220,
      button: 0,
    });
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 7,
      clientY: 150,
    });

    await waitFor(() =>
      expect(panel).toHaveAttribute("data-panel-dragging", "true"),
    );
    expect(handle).toHaveAttribute("data-dragging", "true");

    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 7,
      clientY: 130,
    });

    expect(panel).toHaveAttribute("data-panel-size", "full");
    await waitFor(() =>
      expect(panel).toHaveAttribute("data-panel-dragging", "false"),
    );
    await waitFor(() =>
      expect(panel).toHaveAttribute("data-panel-drag-direction", "none"),
    );

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 8,
      clientY: 140,
      button: 0,
    });
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 8,
      clientY: 210,
    });

    await waitFor(() =>
      expect(panel).toHaveAttribute("data-panel-drag-direction", "down"),
    );

    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 8,
      clientY: 230,
    });

    expect(panel).toHaveAttribute("data-panel-size", "medium");
  });

  it("closes the panel when swiping down from medium height", async () => {
    const { panel, handle } = await renderMobilePanel();

    expect(panel).toHaveAttribute("data-panel-size", "medium");

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 11,
      clientY: 140,
      button: 0,
    });
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 11,
      clientY: 210,
    });

    await waitFor(() =>
      expect(panel).toHaveAttribute("data-panel-drag-direction", "down"),
    );

    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 11,
      clientY: 230,
    });

    expect(panel).toHaveAttribute("data-panel-closing", "true");
    expect(screen.getByRole("button", { name: /close/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    fireEvent.animationEnd(panel);

    await waitFor(() => expect(panel).not.toBeVisible());
    expect(screen.getByRole("button", { name: /explore/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("ignores an animationend bubbling up from inside the panel while closing", async () => {
    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 13,
      clientY: 140,
      button: 0,
    });
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 13,
      clientY: 210,
    });
    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 13,
      clientY: 230,
    });

    expect(panel).toHaveAttribute("data-panel-closing", "true");

    fireEvent.animationEnd(screen.getByTestId("panel-viewport"));

    expect(panel).toBeVisible();
    expect(panel).toHaveAttribute("data-panel-closing", "true");

    fireEvent.animationEnd(panel);
    await waitFor(() => expect(panel).not.toBeVisible());
  });

  it("closes the panel immediately under prefers-reduced-motion, skipping the exit animation", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );

    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 12,
      clientY: 140,
      button: 0,
    });
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 12,
      clientY: 210,
    });
    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 12,
      clientY: 230,
    });

    expect(panel).not.toBeVisible();
    expect(screen.getByRole("button", { name: /explore/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    vi.unstubAllGlobals();
  });

  it("suppresses the synthetic click that follows a drag past the threshold", async () => {
    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 9,
      clientY: 200,
      button: 0,
    });
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 9,
      clientY: 100,
    });
    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 9,
      clientY: 100,
    });

    expect(panel).toHaveAttribute("data-panel-size", "full");

    fireEvent.click(handle);
    expect(panel).toHaveAttribute("data-panel-size", "full");

    fireEvent.click(handle);
    expect(panel).toHaveAttribute("data-panel-size", "medium");
  });

  it("ignores sheet handle interactions on desktop viewports", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toBeInTheDocument(),
    );

    const panel = screen.getByTestId("panel-container");
    const handle = screen.getByTestId("panel-sheet-handle");

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 1,
      clientY: 100,
      button: 0,
    });
    fireEvent.click(handle);

    expect(panel).toHaveAttribute("data-panel-dragging", "false");
    expect(panel).toHaveAttribute("data-panel-size", "medium");
  });

  it("ignores a non-primary mouse button on the sheet handle", async () => {
    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "mouse",
      pointerId: 2,
      clientY: 150,
      button: 2,
    });

    expect(panel).toHaveAttribute("data-panel-dragging", "false");
  });

  it("ignores pointer move and up events from a different pointer while dragging", async () => {
    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 1,
      clientY: 200,
      button: 0,
    });

    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 99,
      clientY: 60,
    });
    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 99,
      clientY: 60,
    });

    expect(panel).toHaveAttribute("data-panel-dragging", "true");

    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 1,
      clientY: 200,
    });

    expect(panel).toHaveAttribute("data-panel-dragging", "false");
  });

  it("prunes velocity samples older than the tracking window during a drag", async () => {
    let now = 0;
    const performanceNow = vi
      .spyOn(performance, "now")
      .mockImplementation(() => now);

    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 4,
      clientY: 200,
      button: 0,
    });
    now = 50;
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 4,
      clientY: 190,
    });
    now = 300;
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 4,
      clientY: 100,
    });
    now = 310;
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 4,
      clientY: 95,
    });
    now = 460;
    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 4,
      clientY: 90,
    });

    expect(panel).toHaveAttribute("data-panel-size", "full");

    performanceNow.mockRestore();
  });

  it("treats a small drag as a tap and skips releasing already-released pointer capture", async () => {
    const { panel, handle } = await renderMobilePanel();

    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      pointerId: 5,
      clientY: 200,
      button: 0,
    });
    fireEvent.pointerMove(window, {
      pointerType: "touch",
      pointerId: 5,
      clientY: 205,
    });
    handle.releasePointerCapture(5);
    fireEvent.pointerUp(window, {
      pointerType: "touch",
      pointerId: 5,
      clientY: 205,
    });

    expect(panel).toHaveAttribute("data-panel-size", "medium");
    expect(panel).toHaveAttribute("data-panel-dragging", "false");
  });

  it.each(["resolve", "reject"] as const)(
    "does not update state if the component unmounts before the township fetch settles (%s)",
    async (mode) => {
      let resolveTownships: ((value: unknown[]) => void) | undefined;
      let rejectTownships: ((reason: unknown) => void) | undefined;
      dataMocks.getTownships.mockReset().mockReturnValue(
        new Promise((resolve, reject) => {
          resolveTownships = resolve;
          rejectTownships = reject;
        }),
      );
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { unmount } = render(<App />);
      // The fetch only starts once the map reports itself ready, so wait for
      // it to be in flight before unmounting — otherwise this asserts
      // nothing about a settling request.
      await waitFor(() => expect(dataMocks.getTownships).toHaveBeenCalled());
      unmount();
      if (mode === "resolve") {
        resolveTownships?.([]);
      } else {
        rejectTownships?.(new Error("data load failed"));
      }

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    },
  );

  it("shows a data error and retries the validated requests", async () => {
    dataMocks.getTownships
      .mockRejectedValueOnce(new Error("invalid data"))
      .mockRejectedValueOnce(new Error("invalid data"));
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Map data could not be loaded",
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() =>
      expect(dataMocks.getTownships).toHaveBeenCalledTimes(4),
    );
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
    );
  });

  it("does not show a data error when only one region's township data fails to load", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    dataMocks.getTownships.mockReset().mockImplementation((url: string) =>
      url.includes("/gauteng/")
        ? Promise.resolve([
            {
              type: "Feature",
              properties: {
                id: "A",
                name: "Mamelodi",
                commuteMinutes: 20,
                nearestJobCenter: "Pretoria CBD",
                distanceKm: null,
                nearestTransitKm: null,
              },
              geometry: null,
            },
          ])
        : Promise.reject(new Error("not published yet")),
    );

    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("geojson-layer")).toHaveTextContent(
        "1 features",
      ),
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load region map data",
      expect.any(Error),
    );

    consoleError.mockRestore();
  });
});
