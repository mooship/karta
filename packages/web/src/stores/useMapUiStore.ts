import type { Basemap } from "@karta/map";
import { create } from "zustand";
import { getLayerGroupStructure, getLayerStructure } from "../layers/registry";

function findGroupContaining(id: string) {
  return getLayerGroupStructure().find((group) => group.layerIds.includes(id));
}

function isExclusiveGroupMember(id: string): boolean {
  return findGroupContaining(id)?.selectionMode === "exclusive";
}

function groupSiblings(id: string): string[] {
  const group = findGroupContaining(id);
  /* v8 ignore next 3 -- unreachable: groupSiblings is only called after isExclusiveGroupMember(id) already confirmed selectionMode === "exclusive" */
  if (group?.selectionMode !== "exclusive") {
    return [];
  }
  return group.layerIds.filter((sibling) => sibling !== id);
}

/**
 * Every valid `PanelView`, the single source of truth `PanelView` derives
 * from -- so a caller needing the runtime value set (e.g. validating a
 * permalink's `?panel=` query param) doesn't hand-maintain a second copy of
 * this list that could drift from the type.
 */
export const PANEL_VIEWS = ["layers", "story", "browser"] as const;

/**
 * Which view the info panel shows: layer toggles, the domain's story copy,
 * or a browsable list of the domain's selectable features.
 */
export type PanelView = (typeof PANEL_VIEWS)[number];

/** The app's UI state: layer visibility, basemap, panel state, and feature selection. */
interface MapUiState {
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
  reset: () => void;
}

/**
 * The store's default state: every `defaultVisible` layer shown, the
 * Positron basemap, and no selection. Also the reference point `useMapPermalink` diffs
 * against to decide which fields a shareable URL needs to carry.
 */
export function getDefaultMapUiState() {
  return {
    visibleLayerIds: getLayerStructure()
      .filter((layer) => layer.defaultVisible)
      .map((layer) => layer.id),
    basemap: "positron" as const,
    panelOpen: false,
    panelView: "layers" as const,
    selectedFeatureId: null,
  };
}

/**
 * The app's Zustand UI-state store.
 * @remarks `toggleLayer` enforces each layer group's `selectionMode`: toggling
 *   on a member of an `"exclusive"` group turns off its sibling layers in the
 *   same group; `"independent"` groups don't affect each other's layers.
 */
export const useMapUiStore = create<MapUiState>()((set) => ({
  ...getDefaultMapUiState(),
  toggleLayer: (id) =>
    set((state) => {
      if (state.visibleLayerIds.includes(id)) {
        return {
          visibleLayerIds: state.visibleLayerIds.filter(
            (existing) => existing !== id,
          ),
        };
      }

      if (isExclusiveGroupMember(id)) {
        const siblings = groupSiblings(id);
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
  reset: () => set(getDefaultMapUiState()),
}));
