import L from "leaflet";
import maplibreGlWorkerUrl from "maplibre-gl/dist/maplibre-gl-csp-worker.js?url";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface VectorBasemapLayerProps {
  /** URL of a MapLibre GL style JSON document to render as the basemap. */
  styleUrl: string;
  /**
   * Attribution HTML to add to Leaflet's attribution control while this
   * layer is mounted, removed again on unmount/`styleUrl` change.
   * @remarks A MapLibre style JSON's own `sources` don't necessarily carry
   *   an `attribution` field (OpenFreeMap's don't), so `maplibre-gl-leaflet`
   *   has nothing to forward into Leaflet's attribution control on its own
   *   — this must be supplied by the caller instead, the same way a raster
   *   `TileLayer`'s `attribution` prop works.
   */
  attribution?: string;
  /**
   * Called if the style/plugin fails to load, the MapLibre layer fails to
   * initialize, or the style JSON itself fails to load once the layer is
   * attached (e.g. the style host is unreachable), so a caller can fall back
   * to another basemap instead of leaving the map blank. Always logged to
   * `console.error` regardless.
   */
  onError?: (error: unknown) => void;
}

/**
 * Lazily loads `maplibre-gl` and `@maplibre/maplibre-gl-leaflet`, pointing
 * MapLibre at its bundled worker chunk the first time this resolves, then
 * caching the result so every later call (e.g. a basemap switch re-running
 * `VectorBasemapLayer`'s effect) reuses the same settled promise instead of
 * re-importing and re-registering the worker URL from scratch.
 * @remarks MapLibre locates its tile-parsing Web Worker via a runtime
 *   `new Worker(...)` call whose target `maplibre-gl` itself leaves empty by
 *   default, so it must be set explicitly for a bundled build to find it.
 *   `maplibre-gl@6`'s own ESM-only worker (loaded as a `{type: "module"}`
 *   Worker) rendered fine on Chromium and desktop Safari but silently never
 *   requested a single tile on real iOS hardware (no thrown error either —
 *   see maplibre/maplibre-gl-js#8002, a real-device-only regression from the
 *   v6.0 ESM rewrite, closed upstream as "need more info"/unreproduced).
 *   Pinning to `maplibre-gl@5` and pointing `setWorkerUrl` at its
 *   `maplibre-gl-csp-worker.js` build sidesteps that entirely: that file is a
 *   classic (non-module) script MapLibre has shipped specifically for
 *   bundler/CSP-strict consumers since long before the v6 rewrite, so the
 *   worker it creates is a plain classic Worker, never a module Worker. This
 *   is coupled to `maplibre-gl`'s current internal file layout and
 *   `setWorkerUrl`'s existing signature — re-check both, and re-verify on
 *   real iOS hardware, before ever bumping past the v5 line.
 */
let maplibreLoadPromise:
  | Promise<{
      maplibregl: typeof import("maplibre-gl");
      maplibreGlLeaflet: typeof import("@maplibre/maplibre-gl-leaflet");
    }>
  | undefined;
function loadMaplibre() {
  maplibreLoadPromise ??= Promise.all([
    import("maplibre-gl"),
    import("@maplibre/maplibre-gl-leaflet"),
  ]).then(([maplibregl, maplibreGlLeaflet]) => {
    maplibregl.setWorkerUrl(maplibreGlWorkerUrl);
    return { maplibregl, maplibreGlLeaflet };
  });
  return maplibreLoadPromise;
}

/**
 * Renders a MapLibre GL vector-tile basemap as a Leaflet layer.
 * @remarks Must be rendered inside a `MapContainer`. Loads `maplibre-gl` and
 *   `@maplibre/maplibre-gl-leaflet` lazily (see `loadMaplibre`) — `maplibre-gl`
 *   alone is a ~270KB gzipped dependency, and most sessions (on a raster
 *   basemap) never need it. `leaflet` itself is imported statically instead
 *   of dynamically alongside it: it's already a hard, eagerly-bundled
 *   dependency of this whole package (react-leaflet requires it regardless),
 *   so dynamically importing it here bought no bundle-size benefit — worse,
 *   under Vite's code-splitting it resolved to a *separate* module instance
 *   from the one already loaded elsewhere, so `@maplibre/maplibre-gl-leaflet`'s
 *   side-effect patch (`L.maplibreGL = ...`) landed on the wrong object and
 *   `L.maplibreGL` below was `undefined` for every real user. Recreates the
 *   MapLibre GL layer whenever `styleUrl` changes (e.g. switching a
 *   light/dark style).
 */
export function VectorBasemapLayer({
  styleUrl,
  attribution,
  onError,
}: VectorBasemapLayerProps) {
  const map = useMap();

  // biome-ignore lint/correctness/useExhaustiveDependencies: onError intentionally omitted -- it's a public prop with no stability guarantee, so including it could re-fire this effect (tearing down and recreating the MapLibre layer) on every render for callers that don't memoize it
  useEffect(() => {
    let cancelled = false;
    let layer: import("leaflet").MaplibreGL | undefined;

    if (attribution) {
      map.attributionControl.addAttribution(attribution);
    }

    loadMaplibre()
      .then(() => {
        if (cancelled) {
          return;
        }
        layer = L.maplibreGL({ style: styleUrl });
        layer.addTo(map);
        layer.getMaplibreMap().on("error", (event: { error: unknown }) => {
          console.error(
            `Vector basemap style failed to load: ${styleUrl}`,
            event.error,
          );
          if (!cancelled) {
            onError?.(event.error);
          }
        });
      })
      .catch((error) => {
        console.error(`Failed to load vector basemap style ${styleUrl}`, error);
        if (!cancelled) {
          onError?.(error);
        }
      });

    return () => {
      cancelled = true;
      layer?.remove();
      if (attribution) {
        map.attributionControl.removeAttribution(attribution);
      }
    };
  }, [map, styleUrl, attribution]);

  return null;
}
