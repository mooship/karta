import type { Layer } from "@karta/core";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const registryMocks = vi.hoisted(() => ({
  getLayerGroupStructure: vi.fn(() => []),
  getLayerStructure: vi.fn(() => []),
}));

vi.mock("../layers/registry", () => ({
  getLayerGroupStructure: registryMocks.getLayerGroupStructure,
  getLayerStructure: registryMocks.getLayerStructure,
}));

const mapMocks = vi.hoisted(() => ({
  fetchLocationSearchResults: vi.fn(),
}));

const themeMocks = vi.hoisted(() => ({
  setThemePreference: vi.fn(),
}));

vi.mock("@karta/map", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/map")>();
  return {
    ...actual,
    fetchLocationSearchResults: mapMocks.fetchLocationSearchResults,
    getRegisteredBasemapIds: () => ["street", "satellite"],
  };
});

vi.mock("@karta/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/react")>();
  return {
    ...actual,
    setThemePreference: themeMocks.setThemePreference,
  };
});

import { m } from "../paraglide/messages.js";
import { overwriteGetLocale } from "../paraglide/runtime.js";
import { useMapUiStore } from "../stores/useMapUiStore";
import { useMapModelContextTools } from "./useMapModelContextTools";

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

function toolNamed(registerTool: ReturnType<typeof vi.fn>, name: string) {
  const call = registerTool.mock.calls.find(([tool]) => tool.name === name);
  if (!call) {
    throw new Error(`Tool "${name}" was not registered`);
  }
  return call[0] as {
    execute: (input: unknown) => Promise<{
      content: Array<{ type: "text"; text: string }>;
    }>;
  };
}

async function textOf(
  result: Promise<{ content: Array<{ type: "text"; text: string }> }>,
) {
  return (await result).content[0]?.text;
}

/** Builds a minimal but fully-valid `Layer`, filling in fields this test suite never reads. */
function makeLayer(
  overrides: Pick<Layer, "id" | "label" | "available"> & Partial<Layer>,
): Layer {
  return {
    dataSource: [`/data/${overrides.id}.geojson`],
    geometryKind: "line",
    defaultVisible: false,
    style: { kind: "line", color: "#000", weight: 2 },
    ...overrides,
  };
}

const LAYERS: Layer[] = [
  makeLayer({
    id: "townships",
    label: "Modelled car time",
    description: "Drive time to job centres.",
    available: true,
  }),
  makeLayer({ id: "roads", label: "Roads", available: true }),
  makeLayer({
    id: "unavailable-layer",
    label: "Coming soon",
    available: false,
  }),
];

describe("useMapModelContextTools", () => {
  const onLocationSelect = vi.fn().mockReturnValue("Flew to Mamelodi.");
  const onShowStory = vi.fn();

  beforeEach(() => {
    useMapUiStore.getState().reset();
    mapMocks.fetchLocationSearchResults.mockReset();
    themeMocks.setThemePreference.mockReset();
    onLocationSelect.mockClear();
    onShowStory.mockClear();
  });

  it("does nothing when WebMCP is unsupported", () => {
    clearModelContext();
    expect(() =>
      renderHook(() =>
        useMapModelContextTools({
          onLocationSelect,
          story: undefined,
          onShowStory,
          layers: LAYERS,
        }),
      ),
    ).not.toThrow();
  });

  it("does not register a story tool when the domain has no story", () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    expect(
      registerTool.mock.calls.some(([tool]) => tool.name === "read-map-story"),
    ).toBe(false);
  });

  it("registers a story tool that returns the story text and opens the panel", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: { title: "Why this map exists", body: "Some background." },
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "read-map-story");
    const text = await textOf(tool.execute({}));

    expect(text).toBe("Why this map exists\n\nSome background.");
    expect(onShowStory).toHaveBeenCalledTimes(1);
  });

  it("lists available layers with their visibility", async () => {
    const registerTool = stubModelContext();
    useMapUiStore.setState({ visibleLayerIds: ["townships"] });
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "list-map-layers");
    const text = await textOf(tool.execute({}));

    expect(text).toContain(
      "townships: Modelled car time — Drive time to job centres. (visible)",
    );
    expect(text).toContain("roads: Roads (hidden)");
    expect(text).not.toContain("unavailable-layer");
  });

  it("reports when there are no layers at all", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: [],
      }),
    );

    const tool = toolNamed(registerTool, "list-map-layers");
    const text = await textOf(tool.execute({}));

    expect(text).toBe("This map has no layers available.");
  });

  it("toggles an available layer on", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "toggle-map-layer");
    const text = await textOf(tool.execute({ layerId: "townships" }));

    expect(text).toBe('Layer "Modelled car time" is now visible.');
    expect(useMapUiStore.getState().visibleLayerIds).toContain("townships");
  });

  it("toggles a visible layer off", async () => {
    const registerTool = stubModelContext();
    useMapUiStore.setState({ visibleLayerIds: ["townships"] });
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "toggle-map-layer");
    const text = await textOf(tool.execute({ layerId: "townships" }));

    expect(text).toBe('Layer "Modelled car time" is now hidden.');
    expect(useMapUiStore.getState().visibleLayerIds).not.toContain("townships");
  });

  it("rejects toggling an unknown layer id", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "toggle-map-layer");
    const text = await textOf(tool.execute({ layerId: "ghost-layer" }));

    expect(text).toContain('No layer with id "ghost-layer"');
    expect(useMapUiStore.getState().visibleLayerIds).not.toContain(
      "ghost-layer",
    );
  });

  it("refuses to toggle an unavailable layer", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "toggle-map-layer");
    const text = await textOf(tool.execute({ layerId: "unavailable-layer" }));

    expect(text).toBe('Layer "Coming soon" isn\'t available yet.');
  });

  it("searches and hands the best match to onLocationSelect", async () => {
    const registerTool = stubModelContext();
    mapMocks.fetchLocationSearchResults.mockResolvedValue([
      {
        id: "1",
        label: "Mamelodi, Tshwane",
        latitude: -25.7,
        longitude: 28.35,
      },
    ]);
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "search-map-location");
    const text = await textOf(tool.execute({ query: "Mamelodi" }));

    expect(mapMocks.fetchLocationSearchResults).toHaveBeenCalledWith(
      "Mamelodi",
    );
    expect(onLocationSelect).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Mamelodi, Tshwane" }),
    );
    expect(text).toBe("Flew to Mamelodi.");
  });

  it("reports no match when the search returns nothing", async () => {
    const registerTool = stubModelContext();
    mapMocks.fetchLocationSearchResults.mockResolvedValue([]);
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "search-map-location");
    const text = await textOf(tool.execute({ query: "Nowhereville" }));

    expect(text).toBe('No location found matching "Nowhereville".');
    expect(onLocationSelect).not.toHaveBeenCalled();
  });

  it("switches the basemap when given a registered id", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "set-map-basemap");
    const text = await textOf(tool.execute({ basemap: "satellite" }));

    expect(text).toBe('Basemap switched to "satellite".');
    expect(useMapUiStore.getState().basemap).toBe("satellite");
  });

  it("rejects an unregistered basemap id", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "set-map-basemap");
    const text = await textOf(tool.execute({ basemap: "ghost-basemap" }));

    expect(text).toBe('Unknown basemap "ghost-basemap".');
    expect(useMapUiStore.getState().basemap).not.toBe("ghost-basemap");
  });

  it("switches the theme when given a valid preference", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "set-app-theme");
    const text = await textOf(tool.execute({ theme: "dark" }));

    expect(text).toBe('Theme switched to "dark".');
    expect(themeMocks.setThemePreference).toHaveBeenCalledWith("dark");
  });

  it("sources every tool's copy from the message catalogue, not English literals", async () => {
    const registerTool = stubModelContext();
    overwriteGetLocale(() => "af");
    try {
      renderHook(() =>
        useMapModelContextTools({
          onLocationSelect,
          story: { title: "Waarom", body: "Omdat" },
          onShowStory,
          layers: [],
        }),
      );

      expect(toolNamed(registerTool, "list-map-layers").description).toBe(
        m.webmcp_list_layers_description({}, { locale: "af" }),
      );
      expect(toolNamed(registerTool, "toggle-map-layer").description).toBe(
        m.webmcp_toggle_layer_description({}, { locale: "af" }),
      );
      expect(toolNamed(registerTool, "search-map-location").description).toBe(
        m.webmcp_search_location_description({}, { locale: "af" }),
      );
      expect(toolNamed(registerTool, "set-map-basemap").description).toBe(
        m.webmcp_set_basemap_description({}, { locale: "af" }),
      );
      expect(toolNamed(registerTool, "set-app-theme").description).toBe(
        m.webmcp_set_theme_description({}, { locale: "af" }),
      );
      expect(toolNamed(registerTool, "read-map-story").description).toBe(
        m.webmcp_read_story_description({}, { locale: "af" }),
      );

      const listed = await textOf(
        toolNamed(registerTool, "list-map-layers").execute({}),
      );
      expect(listed).toBe(m.webmcp_list_layers_empty({}, { locale: "af" }));
    } finally {
      overwriteGetLocale(() => "en");
    }
  });

  it("rejects an invalid theme value", async () => {
    const registerTool = stubModelContext();
    renderHook(() =>
      useMapModelContextTools({
        onLocationSelect,
        story: undefined,
        onShowStory,
        layers: LAYERS,
      }),
    );

    const tool = toolNamed(registerTool, "set-app-theme");
    const text = await textOf(tool.execute({ theme: "rainbow" }));

    expect(text).toBe('Unknown theme "rainbow".');
    expect(themeMocks.setThemePreference).not.toHaveBeenCalled();
  });
});
