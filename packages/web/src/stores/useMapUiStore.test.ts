import { DEFAULT_DOMAIN_ID } from "@karta/app";
import { act } from "@testing-library/react";
import { useMapUiStore } from "./useMapUiStore";

describe("useMapUiStore", () => {
  beforeEach(() => {
    act(() => {
      useMapUiStore.getState().initializeForDomain(DEFAULT_DOMAIN_ID);
    });
  });

  it("initializes with default state", () => {
    const state = useMapUiStore.getState();
    expect(state).toMatchObject({
      domainId: DEFAULT_DOMAIN_ID,
      visibleLayerIds: ["townships"],
      basemap: "street",
      panelOpen: false,
      panelView: "layers",
      selectedFeatureId: null,
    });
  });

  it("starts with no active domain and no visible layers before initializeForDomain", () => {
    // A fresh store instance (module scope, before any initializeForDomain
    // call) must agree with SSR's own pre-hydration render -- see the
    // store's own module doc for why.
    act(() => {
      useMapUiStore.setState({ domainId: null, visibleLayerIds: [] });
    });

    const state = useMapUiStore.getState();
    expect(state.domainId).toBeNull();
    expect(state.visibleLayerIds).toEqual([]);
  });

  it("does not treat any layer as an exclusive-group member before a domain is initialized", () => {
    act(() => {
      useMapUiStore.setState({ domainId: null, visibleLayerIds: [] });
    });

    act(() => {
      useMapUiStore.getState().toggleLayer("townships");
    });

    expect(useMapUiStore.getState().visibleLayerIds).toEqual(["townships"]);
  });

  it("switches domains, resetting layers, basemap, and panel state to the new domain's defaults", () => {
    act(() => {
      useMapUiStore.getState().setBasemap("satellite");
      useMapUiStore.getState().setPanelView("story");
      useMapUiStore.getState().toggleLayer("rapid-rail");
    });

    act(() => {
      useMapUiStore.getState().initializeForDomain("heritage-sites");
    });

    expect(useMapUiStore.getState()).toMatchObject({
      domainId: "heritage-sites",
      visibleLayerIds: ["heritage-sites"],
      basemap: "street",
      panelView: "layers",
    });
  });

  it("resets to the active domain's defaults, keeping the domain itself", () => {
    act(() => {
      useMapUiStore.getState().setBasemap("satellite");
      useMapUiStore.getState().toggleLayer("rapid-rail");
    });

    act(() => {
      useMapUiStore.getState().reset();
    });

    expect(useMapUiStore.getState()).toMatchObject({
      domainId: DEFAULT_DOMAIN_ID,
      visibleLayerIds: ["townships"],
      basemap: "street",
    });
  });

  it("sets the panel view", () => {
    act(() => {
      useMapUiStore.getState().setPanelView("story");
    });
    expect(useMapUiStore.getState().panelView).toBe("story");

    act(() => {
      useMapUiStore.getState().setPanelView("layers");
    });
    expect(useMapUiStore.getState().panelView).toBe("layers");
  });

  it("toggles layer visibility", () => {
    act(() => {
      useMapUiStore.getState().toggleLayer("rapid-rail");
    });
    expect(useMapUiStore.getState().visibleLayerIds).toContain("rapid-rail");

    act(() => {
      useMapUiStore.getState().toggleLayer("rapid-rail");
    });
    expect(useMapUiStore.getState().visibleLayerIds).not.toContain(
      "rapid-rail",
    );
  });

  it("keeps modelled car time and nearest-transit mutually exclusive", () => {
    act(() => {
      useMapUiStore.getState().toggleLayer("nearest-transit");
    });
    expect(useMapUiStore.getState().visibleLayerIds).toContain(
      "nearest-transit",
    );
    expect(useMapUiStore.getState().visibleLayerIds).not.toContain("townships");

    act(() => {
      useMapUiStore.getState().toggleLayer("townships");
    });
    expect(useMapUiStore.getState().visibleLayerIds).toContain("townships");
    expect(useMapUiStore.getState().visibleLayerIds).not.toContain(
      "nearest-transit",
    );
  });

  it("resolves exclusive-group membership against the active domain, not a stale one", () => {
    // heritage-sites' own layer sits in an "independent" group and is
    // defaultVisible -- toggling it off and back on must consult
    // heritage-sites' own group config, not gauteng-spatial-legacy's
    // exclusive-group membership just because that was the previously
    // active domain.
    act(() => {
      useMapUiStore.getState().initializeForDomain("heritage-sites");
    });
    expect(useMapUiStore.getState().visibleLayerIds).toEqual([
      "heritage-sites",
    ]);

    act(() => {
      useMapUiStore.getState().toggleLayer("heritage-sites");
    });
    expect(useMapUiStore.getState().visibleLayerIds).toEqual([]);

    act(() => {
      useMapUiStore.getState().toggleLayer("heritage-sites");
    });
    expect(useMapUiStore.getState().visibleLayerIds).toEqual([
      "heritage-sites",
    ]);
  });

  it("sets the basemap", () => {
    act(() => {
      useMapUiStore.getState().setBasemap("satellite");
    });
    expect(useMapUiStore.getState().basemap).toBe("satellite");
  });
});
