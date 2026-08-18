import { fetchFeatureCollection, mergeFeatureCollections } from "@karta/core";
import type { FeatureCollection } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDomain } from "../context/DomainContext";

/** Maps a layer id to its fetched `FeatureCollection`, once loaded. */
export type LayerDataMap = Partial<Record<string, FeatureCollection>>;

/** Result of `useLayerData`: fetched data, plus ids of layers whose fetch failed. */
export interface LayerDataResult {
  data: LayerDataMap;
  /** A layer's `companionSource` collection (e.g. area-boundary labels for a choropleth), keyed by layer id. Only present for a layer that declares one. */
  companionData: LayerDataMap;
  failedLayerIds: string[];
  /**
   * Re-requests every currently-failed layer, cache-busting its URL(s) the
   * same way toggling a layer off and back on already does (see
   * `requestKey` below) — a failed request's `requestKey` is removed from
   * `requested` at failure time, so bumping the internal retry counter that
   * drives this is enough to let the next effect pass see it as
   * unrequested and fetch it again, without the caller needing to remove
   * and re-add the layer id itself.
   */
  retryFailedLayers: () => void;
}

/**
 * Fetches and merges GeoJSON data for the given layer ids, resolved against
 * the domain registry provided by the nearest `DomainProvider`.
 * @param layerIds - Ids of layers to fetch data for. Unavailable layers are skipped.
 * @returns The merged `FeatureCollection` per layer id, that layer's
 *   `companionSource` collection (if it declares one), ids of layers whose
 *   fetch failed (logged via `console.error`), and a `retryFailedLayers`
 *   function. A failed layer is retried if its id is removed from
 *   `layerIds` and passed again, or via `retryFailedLayers`; removing it
 *   without passing it again (e.g. toggling the layer off) drops it from
 *   `failedLayerIds` too, so a caller's "failed to load" UI doesn't keep
 *   pointing at a layer that's no longer requested.
 * @remarks Must be called from within a `DomainProvider`.
 */
export function useLayerData(layerIds: string[]): LayerDataResult {
  const { getLayer } = useDomain();
  const [data, setData] = useState<LayerDataMap>({});
  const [companionData, setCompanionData] = useState<LayerDataMap>({});
  const [failedLayerIds, setFailedLayerIds] = useState<string[]>([]);
  const requested = useRef(new Set<string>());
  const [retryToken, setRetryToken] = useState(0);
  const key = layerIds.join(",");

  const retryFailedLayers = useCallback(() => {
    setRetryToken((token) => token + 1);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: getLayer is stable per DomainProvider instance
  useEffect(() => {
    let cancelled = false;
    const controllers = new Map<string, AbortController>();

    const ids = key.length > 0 ? key.split(",") : [];
    const cacheBust = retryToken > 0 ? `?retry=${retryToken}` : "";

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

      const dataPromise = Promise.all(
        definition.dataSource.map((source) =>
          fetchFeatureCollection(
            `${source}${cacheBust}`,
            undefined,
            controller.signal,
          ),
        ),
      ).then(mergeFeatureCollections);
      const companionPromise = definition.companionSource
        ? fetchFeatureCollection(
            `${definition.companionSource}${cacheBust}`,
            undefined,
            controller.signal,
          )
        : undefined;

      Promise.all([dataPromise, companionPromise])
        .then(([collection, companion]) => {
          if (!cancelled) {
            setData((current) => ({ ...current, [id]: collection }));
            if (companion) {
              setCompanionData((current) => ({ ...current, [id]: companion }));
            }
            setFailedLayerIds((current) =>
              current.includes(id) ? current.filter((f) => f !== id) : current,
            );
          }
          controllers.delete(requestKey);
        })
        .catch((error) => {
          requested.current.delete(requestKey);
          controllers.delete(requestKey);
          if (!cancelled) {
            console.error(`Failed to load layer data for "${id}"`, error);
            setFailedLayerIds((current) =>
              current.includes(id) ? current : [...current, id],
            );
          }
        });
    }

    return () => {
      cancelled = true;
      for (const controller of controllers.values()) {
        controller.abort();
      }
    };
  }, [key, retryToken]);

  return { data, companionData, failedLayerIds, retryFailedLayers };
}
