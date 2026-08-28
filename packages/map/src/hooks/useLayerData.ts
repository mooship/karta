import { fetchFeatureCollection, mergeFeatureCollections } from "@karta/core";
import type { FeatureCollection } from "geojson";
import { useEffect, useRef, useState } from "react";
import { useDomain } from "../context/DomainContext";

/** Maps a layer id to its fetched `FeatureCollection`, once loaded. */
export type LayerDataMap = Partial<Record<string, FeatureCollection>>;

/** Result of `useLayerData`: fetched data, plus ids of layers whose fetch failed. */
export interface LayerDataResult {
  data: LayerDataMap;
  failedLayerIds: string[];
}

/**
 * Applies one layer's settled `dataSource` fetches to `setData`/
 * `setFailedLayerIds`: merges whichever sources succeeded (if any), and
 * marks the layer failed if any source didn't. Merging whatever sources
 * succeeded, rather than discarding them whenever another configured source
 * for the same layer fails, is what keeps one region's still-missing data
 * (see `docs/adding-a-region.md`) from blanking out every other region's
 * already-published data for the same layer.
 */
function applySettledLayerResults(
  id: string,
  results: PromiseSettledResult<FeatureCollection>[],
  setData: (updater: (current: LayerDataMap) => LayerDataMap) => void,
  setFailedLayerIds: (updater: (current: string[]) => string[]) => void,
): void {
  const fulfilled = results.filter(
    (settled): settled is PromiseFulfilledResult<FeatureCollection> =>
      settled.status === "fulfilled",
  );
  const rejected = results.filter(
    (settled): settled is PromiseRejectedResult =>
      settled.status === "rejected",
  );

  if (fulfilled.length > 0) {
    setData((current) => ({
      ...current,
      [id]: mergeFeatureCollections(fulfilled.map((r) => r.value)),
    }));
  }

  if (rejected.length > 0) {
    console.error(`Failed to load layer data for "${id}"`, rejected[0]?.reason);
    setFailedLayerIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  } else {
    setFailedLayerIds((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : current,
    );
  }
}

/**
 * Fetches and merges GeoJSON data for the given layer ids, resolved against
 * the domain registry provided by the nearest `DomainProvider`.
 * @param layerIds - Ids of layers to fetch data for. Unavailable layers are skipped.
 * @returns The merged `FeatureCollection` per layer id, plus ids of layers whose
 *   fetch failed (logged via `console.error`). A failed layer is retried if its id
 *   is removed from `layerIds` and passed again; removing it without passing it
 *   again (e.g. toggling the layer off) drops it from `failedLayerIds` too, so a
 *   caller's "failed to load" UI doesn't keep pointing at a layer that's no
 *   longer requested.
 * @remarks Must be called from within a `DomainProvider`.
 */
export function useLayerData(layerIds: string[]): LayerDataResult {
  const { getLayer } = useDomain();
  const [data, setData] = useState<LayerDataMap>({});
  const [failedLayerIds, setFailedLayerIds] = useState<string[]>([]);
  const requested = useRef(new Set<string>());
  const key = layerIds.join(",");

  // biome-ignore lint/correctness/useExhaustiveDependencies: getLayer is stable per DomainProvider instance
  useEffect(() => {
    let cancelled = false;
    const controllers = new Map<string, AbortController>();

    const ids = key.length > 0 ? key.split(",") : [];

    setFailedLayerIds((current) => {
      const next = current.filter((id) => ids.includes(id));
      return next.length === current.length ? current : next;
    });

    for (const id of ids) {
      const definition = getLayer(id);
      if (!definition?.available) {
        continue;
      }

      const requestKey = `${id}:${definition.dataSource.join(",")}`;
      if (requested.current.has(requestKey)) {
        continue;
      }

      requested.current.add(requestKey);
      const controller = new AbortController();
      controllers.set(requestKey, controller);

      Promise.allSettled(
        definition.dataSource.map((source) =>
          fetchFeatureCollection(source, undefined, controller.signal),
        ),
      ).then((results) => {
        controllers.delete(requestKey);

        // A source that failed may just not have been published for this
        // region yet (see `docs/adding-a-region.md`) — retrying it once
        // it's requested again (e.g. the layer is toggled off and on) is
        // cheap, and the alternative (never retrying) would leave that
        // region's data permanently missing even after it ships.
        if (results.some((result) => result.status === "rejected")) {
          requested.current.delete(requestKey);
        }

        if (cancelled) {
          return;
        }

        applySettledLayerResults(id, results, setData, setFailedLayerIds);
      });
    }

    return () => {
      cancelled = true;
      for (const controller of controllers.values()) {
        controller.abort();
      }
    };
  }, [key]);

  return { data, failedLayerIds };
}
