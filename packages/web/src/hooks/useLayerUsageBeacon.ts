import { useUsageBeacon } from "@karta/react";
import { useCallback } from "react";
import type { LayerUsageEvent } from "../analytics/layerUsage";
import { LAYER_USAGE_ENDPOINT } from "../constants/analyticsConfig";
import { isDoNotTrackEnabled } from "../utils/privacySignals";

/** Options for `useLayerUsageBeacon`. */
export interface UseLayerUsageBeaconOptions {
  visibleLayerIds: string[];
  toggleLayer: (id: string) => void;
}

/**
 * `useUsageBeacon`'s `dedupeKey`, hoisted to module scope rather than an
 * inline arrow function — keeps `send`'s identity (and so the returned
 * toggle handler's) stable across unrelated `AppShell` renders.
 */
function dedupeByLayerId(event: LayerUsageEvent): string {
  return event.layerId;
}

/**
 * Wraps `toggleLayer` so every explicit layer toggle also reports a
 * cookieless `{layerId, visible}` usage event to `LAYER_USAGE_ENDPOINT`, via
 * `@karta/react`'s generic `useUsageBeacon`.
 * @returns A drop-in replacement for `toggleLayer` — `App` passes this to
 *   `LayerToggles`' `onToggle` instead of the raw store action.
 * @remarks Deliberately wraps the `toggleLayer` *action* rather than
 *   reacting to `visibleLayerIds` state changes: that state also changes on
 *   startup defaults and permalink restoration, neither of which is a
 *   visitor actually choosing to toggle a layer, and reporting either would
 *   turn this into page-view tracking by accident. `visible` is computed
 *   from `visibleLayerIds` *before* calling `toggleLayer`, since that's the
 *   state the toggle is about to move away from. Sends nothing (though
 *   still toggles the layer) when `isDoNotTrackEnabled()` — the payload
 *   already carries no personal data, but honouring the signal costs
 *   nothing and respects its intent.
 */
export function useLayerUsageBeacon({
  visibleLayerIds,
  toggleLayer,
}: UseLayerUsageBeaconOptions): (id: string) => void {
  const { send } = useUsageBeacon<LayerUsageEvent>({
    endpoint: LAYER_USAGE_ENDPOINT,
    dedupeKey: dedupeByLayerId,
  });

  return useCallback(
    (id: string) => {
      const visible = !visibleLayerIds.includes(id);
      toggleLayer(id);
      if (!isDoNotTrackEnabled()) {
        send({ layerId: id, visible });
      }
    },
    [visibleLayerIds, toggleLayer, send],
  );
}
