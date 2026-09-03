import type { FeatureCollection } from "geojson";
import {
  createFeatureCollectionParser,
  type FeatureCollectionSchema,
  featureCollectionSchema,
} from "./geoJsonSchemas";

/**
 * Maximum number of `FeatureCollection`s to keep cached at once. `Map`
 * iteration order is insertion order, so the first key is always the least
 * recently used once every read re-inserts its entry (see `fetchFeatureCollection`).
 */
const CACHE_MAX_ENTRIES = 50;

const cache = new Map<string, FeatureCollection>();

/**
 * Requests currently in flight, keyed by URL. Lets a second concurrent
 * `fetchFeatureCollection` call for a URL not yet in `cache` await the same
 * `fetch`/parse work already underway instead of firing a duplicate request
 * — e.g. two components mounting in the same tick and both requesting a
 * layer that isn't cached yet.
 */
const inFlight = new Map<string, Promise<FeatureCollection>>();

/**
 * Clears the in-memory cache and in-flight request tracking used by
 * `fetchFeatureCollection`.
 * @remarks Data sources are static, versioned GeoJSON files with no runtime
 *   invalidation, so this exists for tests rather than app-level use — each
 *   test typically installs its own `fetch` mock and expects a clean slate,
 *   so `inFlight` is cleared too: a request left permanently unsettled by
 *   one test (e.g. simulating an unmounted caller) would otherwise poison
 *   every later call for the same URL, which would await that abandoned
 *   promise forever instead of hitting the next test's own mock. Clearing
 *   `inFlight` only stops *future* calls from deduplicating onto it — a
 *   caller already awaiting that promise is unaffected and still resolves
 *   normally once (if ever) it settles.
 */
export function clearFeatureCollectionCache(): void {
  cache.clear();
  inFlight.clear();
}

/**
 * Fetches a GeoJSON FeatureCollection from `url` and validates it against `schema`.
 * @param url - The URL to fetch from.
 * @param schema - Zod-compatible schema. Defaults to the generic `featureCollectionSchema`.
 * @param signal - Optional `AbortSignal` to cancel the request.
 * @returns A validated `FeatureCollection`.
 * @remarks Throws `Error` on a non-2xx HTTP response (with status code) or on
 *   schema parse failure (with URL and up to 3 issue paths). A successful
 *   result is cached in-memory by `url`, so a layer toggled off and back on
 *   isn't re-fetched over the network. The cache holds at most
 *   `CACHE_MAX_ENTRIES` entries, evicting the least recently used one once
 *   full, bounding memory in a long-lived session with many layers/domains.
 *   Failed requests are not cached, so a later call can retry. A second call
 *   for a `url` already in flight (not yet resolved into `cache`) awaits the
 *   same underlying request rather than firing a duplicate `fetch` — e.g.
 *   `MapView` and `FeatureBrowser` both requesting an uncached layer's data
 *   in the same render pass.
 */
export async function fetchFeatureCollection(
  url: string,
  schema: FeatureCollectionSchema = featureCollectionSchema,
  signal?: AbortSignal,
): Promise<FeatureCollection> {
  const cached = cache.get(url);
  if (cached) {
    // Re-insert to mark as most recently used (Map iteration order is insertion order).
    cache.delete(url);
    cache.set(url, cached);
    return cached;
  }

  const pending = inFlight.get(url);
  if (pending) {
    return pending;
  }

  const request = (async () => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
    }
    const data = createFeatureCollectionParser(
      schema,
      url,
    )(await response.json());

    cache.set(url, data);
    if (cache.size > CACHE_MAX_ENTRIES) {
      // cache.size > CACHE_MAX_ENTRIES (>= 1) guarantees a first key exists.
      cache.delete(cache.keys().next().value as string);
    }

    return data;
  })();
  inFlight.set(url, request);

  try {
    return await request;
  } finally {
    inFlight.delete(url);
  }
}
