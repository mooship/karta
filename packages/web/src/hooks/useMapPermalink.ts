import { getRegisteredBasemapIds } from "@karta/map";
import { useEffect, useMemo, useRef } from "react";
import { getLayerStructure } from "../layers/registry";
import {
  getDefaultMapUiState,
  PANEL_VIEWS,
  type PanelView,
  useMapUiStore,
} from "../stores/useMapUiStore";

const LAYERS_PARAM = "layers";
const BASEMAP_PARAM = "basemap";
const PANEL_PARAM = "panel";
const FEATURE_PARAM = "feature";

/** The subset of `useMapUiStore`'s state a permalink can carry. */
export interface MapPermalinkState {
  visibleLayerIds: string[];
  basemap: string;
  panelView: PanelView;
  selectedFeatureId: string | null;
}

/** Fields recovered from a permalink's query string; absent fields weren't present or didn't validate. */
export interface ParsedMapPermalink {
  visibleLayerIds?: string[];
  basemap?: string;
  panelView?: PanelView;
  selectedFeatureId?: string;
}

/**
 * Parses a shared map link's query string into validated permalink fields.
 * @remarks Unknown layer ids, an unregistered basemap, or an unrecognised
 *   panel view are dropped rather than applied — a link can outlive a
 *   domain's current layer catalogue or a since-removed basemap. A
 *   `selectedFeatureId` is returned as-is, unvalidated: unlike the other
 *   fields, there's no synchronously-known registry to check it against
 *   here — see `useMapPermalink`'s `knownFeatureIds` option, which applies
 *   the same "drop anything invalid" contract to it once the map's feature
 *   data has actually loaded.
 */
export function parseMapPermalink(
  search: string,
  knownLayerIds: readonly string[],
): ParsedMapPermalink {
  const params = new URLSearchParams(search);
  const result: ParsedMapPermalink = {};

  const layersParam = params.get(LAYERS_PARAM);
  if (layersParam !== null) {
    const validIds = layersParam
      .split(",")
      .filter((id) => knownLayerIds.includes(id));
    if (validIds.length > 0) {
      result.visibleLayerIds = validIds;
    }
  }

  const basemapParam = params.get(BASEMAP_PARAM);
  if (basemapParam && getRegisteredBasemapIds().includes(basemapParam)) {
    result.basemap = basemapParam;
  }

  const panelParam = params.get(PANEL_PARAM);
  if (panelParam && PANEL_VIEWS.includes(panelParam as PanelView)) {
    result.panelView = panelParam as PanelView;
  }

  const featureParam = params.get(FEATURE_PARAM);
  if (featureParam) {
    result.selectedFeatureId = featureParam;
  }

  return result;
}

/**
 * Serializes shareable map state into a query string, omitting any field
 * that matches `defaults` so a link only carries what it actually needs to
 * restore.
 * @param layerOrder Registry order to serialize `visibleLayerIds` in, so the
 *   same state always produces the same URL regardless of toggle order.
 */
export function buildMapPermalinkSearch(
  state: MapPermalinkState,
  defaults: Pick<
    MapPermalinkState,
    "visibleLayerIds" | "basemap" | "panelView"
  >,
  layerOrder: readonly string[],
): string {
  const params = new URLSearchParams();

  const currentLayers = new Set(state.visibleLayerIds);
  const defaultLayers = new Set(defaults.visibleLayerIds);
  const layersMatchDefault =
    currentLayers.size === defaultLayers.size &&
    [...currentLayers].every((id) => defaultLayers.has(id));
  if (!layersMatchDefault) {
    const ordered = layerOrder.filter((id) => currentLayers.has(id));
    params.set(LAYERS_PARAM, ordered.join(","));
  }

  if (state.basemap !== defaults.basemap) {
    params.set(BASEMAP_PARAM, state.basemap);
  }

  if (state.panelView !== defaults.panelView) {
    params.set(PANEL_PARAM, state.panelView);
  }

  if (state.selectedFeatureId) {
    params.set(FEATURE_PARAM, state.selectedFeatureId);
  }

  return params.toString();
}

/** Options for `useMapPermalink`. */
export interface UseMapPermalinkOptions {
  /**
   * Whether the map's feature data has loaded. `selectedFeatureId` is only
   * applied once this is `true` — the choropleth data driving feature
   * lookups loads asynchronously after the map itself mounts, and Leaflet
   * has nothing to select until then.
   */
  dataReady: boolean;
  /**
   * The feature ids actually present once `dataReady` is `true`, used to
   * validate a restored `selectedFeatureId` before applying it. A shared
   * link can name an id that's since been removed or never existed, and
   * this hook's own contract (see `parseMapPermalink`'s remark) is to drop
   * anything invalid rather than pass it through unchecked.
   */
  knownFeatureIds: ReadonlySet<string>;
}

/**
 * Restores map state (visible layers, basemap, panel view, selected feature)
 * from the page's URL on mount, then keeps the URL in sync with that state
 * afterwards, so the address bar always doubles as a shareable link to the
 * current view.
 * @remarks Uses `history.replaceState`, never `pushState` — every layer
 *   toggle or feature click would otherwise spam the back button with a new
 *   history entry.
 */
export function useMapPermalink({
  dataReady,
  knownFeatureIds,
}: UseMapPermalinkOptions): void {
  /**
   * The registry's layer ids, in order. Memoized rather than recomputed in
   * every effect below — the domain's layer catalogue is stable for the
   * app's whole lifetime. Uses the unlocalized `getLayerStructure()` rather
   * than `getLayers()`, since only `id` is needed here and running the
   * translation overlay just to discard its result would be wasted work.
   */
  const layerIds = useMemo(
    () => getLayerStructure().map((layer) => layer.id),
    [],
  );
  const defaults = useMemo(() => getDefaultMapUiState(), []);
  const pendingFeatureId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const parsed = parseMapPermalink(window.location.search, layerIds);
    const patch: Partial<MapPermalinkState> = {};
    if (parsed.visibleLayerIds) {
      patch.visibleLayerIds = parsed.visibleLayerIds;
    }
    if (parsed.basemap) {
      patch.basemap = parsed.basemap;
    }
    if (parsed.panelView) {
      patch.panelView = parsed.panelView;
    }
    if (Object.keys(patch).length > 0) {
      useMapUiStore.setState(patch);
    }
    pendingFeatureId.current = parsed.selectedFeatureId;
  }, [layerIds]);

  useEffect(() => {
    if (!dataReady || pendingFeatureId.current === undefined) {
      return;
    }
    if (knownFeatureIds.has(pendingFeatureId.current)) {
      useMapUiStore.getState().setSelectedFeatureId(pendingFeatureId.current);
    }
    pendingFeatureId.current = undefined;
  }, [dataReady, knownFeatureIds]);

  const visibleLayerIds = useMapUiStore((state) => state.visibleLayerIds);
  const basemap = useMapUiStore((state) => state.basemap);
  const panelView = useMapUiStore((state) => state.panelView);
  const selectedFeatureId = useMapUiStore((state) => state.selectedFeatureId);

  useEffect(() => {
    const search = buildMapPermalinkSearch(
      { visibleLayerIds, basemap, panelView, selectedFeatureId },
      defaults,
      layerIds,
    );
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [
    visibleLayerIds,
    basemap,
    panelView,
    selectedFeatureId,
    defaults,
    layerIds,
  ]);
}
