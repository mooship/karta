import type { Layer } from "@karta/core";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const registryMocks = vi.hoisted(() => ({
  getLayers: vi.fn(() => []),
  getLayerGroups: vi.fn(() => []),
  getLayerGroupStructure: vi.fn(() => []),
  getLayerStructure: vi.fn(() => []),
}));

vi.mock("../layers/registry", () => ({
  getLayers: registryMocks.getLayers,
  getLayerGroups: registryMocks.getLayerGroups,
  getLayerGroupStructure: registryMocks.getLayerGroupStructure,
  getLayerStructure: registryMocks.getLayerStructure,
}));

vi.mock("@karta/map", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/map")>();
  return {
    ...actual,
    getRegisteredBasemapIds: () => ["street", "satellite"],
  };
});

import { useMapUiStore } from "../stores/useMapUiStore";
import {
  buildMapPermalinkSearch,
  parseMapPermalink,
  useMapPermalink,
} from "./useMapPermalink";

function layer(id: string, defaultVisible: boolean): Layer {
  return {
    id,
    label: id,
    dataSource: [`/data/${id}.geojson`],
    geometryKind: "line",
    defaultVisible,
    available: true,
    style: { kind: "line", color: "#000", weight: 2 },
  };
}

const LAYERS: Layer[] = [
  layer("townships", true),
  layer("rapid-rail", false),
  layer("bus", false),
];

function setUrl(search: string) {
  window.history.replaceState(null, "", `/${search}`);
}

describe("parseMapPermalink", () => {
  it("returns known layer ids, basemap, panel view, and feature id", () => {
    const parsed = parseMapPermalink(
      "?layers=rapid-rail,bus&basemap=satellite&panel=story&feature=abc",
      ["townships", "rapid-rail", "bus"],
    );
    expect(parsed).toEqual({
      visibleLayerIds: ["rapid-rail", "bus"],
      basemap: "satellite",
      panelView: "story",
      selectedFeatureId: "abc",
    });
  });

  it("ignores unknown layer ids, basemaps, and panel views", () => {
    const parsed = parseMapPermalink(
      "?layers=bogus,rapid-rail&basemap=bogus&panel=bogus",
      ["townships", "rapid-rail", "bus"],
    );
    expect(parsed).toEqual({ visibleLayerIds: ["rapid-rail"] });
  });

  it("returns an empty object for an empty query string", () => {
    expect(parseMapPermalink("", ["townships"])).toEqual({});
  });

  it("omits visibleLayerIds entirely when every id in the layers param is unknown", () => {
    const parsed = parseMapPermalink("?layers=bogus,also-bogus", [
      "townships",
      "rapid-rail",
      "bus",
    ]);
    expect(parsed).toEqual({});
  });
});

describe("buildMapPermalinkSearch", () => {
  const defaults = {
    visibleLayerIds: ["townships"],
    basemap: "street",
    panelView: "layers" as const,
  };
  const layerOrder = ["townships", "rapid-rail", "bus"];

  it("omits every field that matches the defaults", () => {
    const search = buildMapPermalinkSearch(
      {
        visibleLayerIds: ["townships"],
        basemap: "street",
        panelView: "layers",
        selectedFeatureId: null,
      },
      defaults,
      layerOrder,
    );
    expect(search).toBe("");
  });

  it("includes layers in registry order when they differ from the default set", () => {
    const search = buildMapPermalinkSearch(
      {
        visibleLayerIds: ["bus", "rapid-rail"],
        basemap: "street",
        panelView: "layers",
        selectedFeatureId: null,
      },
      defaults,
      layerOrder,
    );
    expect(new URLSearchParams(search).get("layers")).toBe("rapid-rail,bus");
  });

  it("includes basemap, panel view, and feature when they differ from defaults", () => {
    const search = buildMapPermalinkSearch(
      {
        visibleLayerIds: ["townships"],
        basemap: "satellite",
        panelView: "story",
        selectedFeatureId: "abc",
      },
      defaults,
      layerOrder,
    );
    const params = new URLSearchParams(search);
    expect(params.get("basemap")).toBe("satellite");
    expect(params.get("panel")).toBe("story");
    expect(params.get("feature")).toBe("abc");
    expect(params.has("layers")).toBe(false);
  });
});

describe("useMapPermalink", () => {
  beforeEach(() => {
    registryMocks.getLayers.mockReturnValue(LAYERS);
    registryMocks.getLayerStructure.mockReturnValue(LAYERS);
    act(() => {
      useMapUiStore.getState().reset();
    });
    setUrl("");
  });

  it("applies visible layers, basemap, and panel view from the URL on mount", () => {
    setUrl("?layers=rapid-rail&basemap=satellite&panel=story");

    renderHook(() => useMapPermalink({ dataReady: true }));

    const state = useMapUiStore.getState();
    expect(state.visibleLayerIds).toEqual(["rapid-rail"]);
    expect(state.basemap).toBe("satellite");
    expect(state.panelView).toBe("story");
  });

  it("defers applying the selected feature until data is ready", () => {
    setUrl("?feature=abc123");

    const { rerender } = renderHook(
      ({ dataReady }) => useMapPermalink({ dataReady }),
      { initialProps: { dataReady: false } },
    );

    expect(useMapUiStore.getState().selectedFeatureId).toBeNull();

    rerender({ dataReady: true });

    expect(useMapUiStore.getState().selectedFeatureId).toBe("abc123");
  });

  it("writes non-default state back to the URL without pushing a new history entry", () => {
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    renderHook(() => useMapPermalink({ dataReady: true }));

    expect(window.location.search).toBe("");

    act(() => {
      useMapUiStore.getState().toggleLayer("rapid-rail");
    });

    expect(new URLSearchParams(window.location.search).get("layers")).toBe(
      "townships,rapid-rail",
    );
    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it("reflects the selected feature in the URL once applied", () => {
    renderHook(() => useMapPermalink({ dataReady: true }));

    act(() => {
      useMapUiStore.getState().setSelectedFeatureId("xyz");
    });

    expect(new URLSearchParams(window.location.search).get("feature")).toBe(
      "xyz",
    );
  });
});
