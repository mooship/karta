import type { Basemap } from "@karta/map";
import { create } from "zustand";
import { getLayerGroupStructure, getLayerStructure } from "../layers/registry";

function findGroupContaining(domainId: string | null, id: string) {
  if (!domainId) {
    return undefined;
  }
  return getLayerGroupStructure(domainId).find((group) =>
    group.layerIds.includes(id),
  );
}

function isExclusiveGroupMember(domainId: string | null, id: string): boolean {
  return findGroupContaining(domainId, id)?.selectionMode === "exclusive";
}

function groupSiblings(domainId: string | null, id: string): string[] {
  const group = findGroupContaining(domainId, id);
  /* v8 ignore next 3 -- unreachable: groupSiblings is only called after isExclusiveGroupMember(domainId, id) already confirmed selectionMode === "exclusive", which itself requires a group to exist */
  if (group?.selectionMode !== "exclusive") {
    return [];
  }
  return group.layerIds.filter((sibling) => sibling !== id);
}

/** Which view the info panel shows: layer toggles, the domain's story copy, or a browsable layer's feature list. */
export type PanelView = "layers" | "story" | "browse";

/** The app's UI state: active domain, layer visibility, basemap, panel state, and feature selection. */
interface MapUiState {
  /** The active domain's id, or `null` before `initializeForDomain` has run. */
  domainId: string | null;
  visibleLayerIds: string[];
  basemap: Basemap;
  panelOpen: boolean;
  panelView: PanelView;
  selectedFeatureId: string | null;
  toggleLayer: (id: string) => void;
  setBasemap: (basemap: Basemap) => void;
  setPanelOpen: (open: boolean) => void;
  setPanelView: (view: PanelView) => void;
  setSelectedFeatureId: (id: string | null) => void;
  /** Sets the active domain and resets every other field to that domain's defaults. */
  initializeForDomain: (domainId: string) => void;
  reset: () => void;
}

/**
 * The default state for `domainId` (or the pre-initialization defaults, for
 * `null`): every `defaultVisible` layer shown, the street basemap, and no
 * selection. Also the reference point `useMapPermalink` diffs against to
 * decide which fields a shareable URL needs to carry.
 */
function getDefaultMapUiState(domainId: string | null) {
  return {
    domainId,
    visibleLayerIds: domainId
      ? getLayerStructure(domainId)
          .filter((layer) => layer.defaultVisible)
          .map((layer) => layer.id)
      : [],
    basemap: "street" as const,
    panelOpen: false,
    panelView: "layers" as const,
    selectedFeatureId: null,
  };
}

/**
 * The app's Zustand UI-state store.
 * @remarks Starts with `domainId: null` and `visibleLayerIds: []` at module
 *   scope — deliberately not resolved from a domain's actual defaults there.
 *   `App` calls `initializeForDomain` in its post-hydration mount effect,
 *   which is what populates the real defaults; until then, both the
 *   server-rendered HTML and the client's pre-hydration render show the
 *   same empty state, so there's nothing to mismatch. This is safe *only*
 *   because switching domains is a full-document navigation (see
 *   `DomainSwitcher`'s remarks) — a given document only ever calls
 *   `initializeForDomain` once, for one domain, so this module-scope store
 *   never needs to become a per-request instance the way `layers/registry.ts`'s
 *   locale-aware getters do. `toggleLayer` enforces each layer group's
 *   `selectionMode`: toggling on a member of an `"exclusive"` group turns
 *   off its sibling layers in the same group; `"independent"` groups don't
 *   affect each other's layers.
 */
export const useMapUiStore = create<MapUiState>()((set) => ({
  ...getDefaultMapUiState(null),
  toggleLayer: (id) =>
    set((state) => {
      if (state.visibleLayerIds.includes(id)) {
        return {
          visibleLayerIds: state.visibleLayerIds.filter(
            (existing) => existing !== id,
          ),
        };
      }

      if (isExclusiveGroupMember(state.domainId, id)) {
        const siblings = groupSiblings(state.domainId, id);
        return {
          visibleLayerIds: [
            ...state.visibleLayerIds.filter(
              (existing) => !siblings.includes(existing),
            ),
            id,
          ],
        };
      }

      return { visibleLayerIds: [...state.visibleLayerIds, id] };
    }),
  setBasemap: (basemap) => set({ basemap }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  setPanelView: (panelView) => set({ panelView }),
  setSelectedFeatureId: (selectedFeatureId) => set({ selectedFeatureId }),
  initializeForDomain: (domainId) => set(getDefaultMapUiState(domainId)),
  reset: () => set((state) => getDefaultMapUiState(state.domainId)),
}));
