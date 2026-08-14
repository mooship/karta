/** A geocoded place returned from a location search. */
export interface LocationSearchResult {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  /** The place's bounding box, as `[[south, west], [north, east]]`, if the geocoder provided one. */
  bounds?: [[number, number], [number, number]];
}

interface NominatimLocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string];
}

interface NominatimReverseError {
  error: string;
}

function parseBounds(
  boundingbox: NominatimLocationResult["boundingbox"],
): LocationSearchResult["bounds"] {
  if (boundingbox?.length !== 4) {
    return undefined;
  }

  const south = Number.parseFloat(boundingbox[0]);
  const north = Number.parseFloat(boundingbox[1]);
  const west = Number.parseFloat(boundingbox[2]);
  const east = Number.parseFloat(boundingbox[3]);

  if (
    Number.isNaN(south) ||
    Number.isNaN(north) ||
    Number.isNaN(west) ||
    Number.isNaN(east)
  ) {
    return undefined;
  }

  return [
    [south, west],
    [north, east],
  ];
}

function toLocationSearchResult(
  item: NominatimLocationResult,
): LocationSearchResult | null {
  const latitude = Number.parseFloat(item.lat);
  const longitude = Number.parseFloat(item.lon);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  const bounds = parseBounds(item.boundingbox);
  const result: LocationSearchResult = {
    id: String(item.place_id),
    label: item.display_name,
    latitude,
    longitude,
  };

  if (bounds) {
    result.bounds = bounds;
  }

  return result;
}

/**
 * Biases a Nominatim search toward a subset of the world, since it otherwise
 * searches every country equally and a host app with a fixed geographic
 * scope (a single country, say) would rather not see irrelevant results
 * from elsewhere, especially for a place name that's common internationally.
 */
export interface NominatimSearchOptions {
  /**
   * One or more comma-separated ISO 3166-1 alpha-2 country codes (Nominatim's
   * own `countrycodes` parameter), e.g. `"za"`. Biases ranking toward those
   * countries without excluding results elsewhere.
   */
  countryCodes?: string;
}

/**
 * Searches OpenStreetMap Nominatim for places matching `query`.
 * @param query - Free-text place search query. An empty/whitespace-only
 *   query resolves to an empty array without making a request.
 * @param signal - Optional `AbortSignal` to cancel the request.
 * @param options - See {@link NominatimSearchOptions}.
 * @returns Up to 6 matching places, each with parsed coordinates and, where
 *   available, a bounding box.
 * @throws If the Nominatim request returns a non-2xx response.
 */
export async function fetchLocationSearchResults(
  query: string,
  signal?: AbortSignal,
  options: NominatimSearchOptions = {},
): Promise<LocationSearchResult[]> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return [];
  }

  const searchParams = new URLSearchParams({
    q: trimmedQuery,
    format: "jsonv2",
    limit: "6",
    addressdetails: "0",
  });
  if (options.countryCodes) {
    searchParams.set("countrycodes", options.countryCodes);
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${searchParams.toString()}`,
    {
      signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Location search failed: ${response.status}`);
  }

  const payload = (await response.json()) as NominatimLocationResult[];

  return payload
    .map(toLocationSearchResult)
    .filter((item): item is LocationSearchResult => item !== null);
}

/**
 * Resolves the place at `latitude`/`longitude` via OpenStreetMap Nominatim's
 * reverse-geocoding endpoint.
 * @param signal - Optional `AbortSignal` to cancel the request.
 * @returns The matching place, or `null` if Nominatim can't geocode the
 *   coordinates (a `200` response with an `error` field, not a failure).
 * @throws If the Nominatim request returns a non-2xx response.
 */
export async function fetchReverseGeocodeResult(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<LocationSearchResult | null> {
  const searchParams = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${searchParams.toString()}`,
    {
      signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Reverse geocode failed: ${response.status}`);
  }

  const payload = (await response.json()) as
    | NominatimLocationResult
    | NominatimReverseError;

  if ("error" in payload) {
    return null;
  }

  return toLocationSearchResult(payload);
}

/**
 * A pluggable place-search / reverse-geocoding backend.
 * @remarks Whichever provider a host app wires up issues `fetch` requests
 *   from the browser, so its origin must be allowlisted in that app's own
 *   Content-Security-Policy `connect-src` directive — the SDK has no
 *   runtime hook into a host's CSP, so this is a deploy-config step the
 *   host is responsible for. `nominatimGeocoderProvider` requires
 *   `https://nominatim.openstreetmap.org`.
 */
export interface GeocoderProvider {
  search(query: string, signal?: AbortSignal): Promise<LocationSearchResult[]>;
  reverse(
    latitude: number,
    longitude: number,
    signal?: AbortSignal,
  ): Promise<LocationSearchResult | null>;
}

/**
 * Builds a `GeocoderProvider` backed by OpenStreetMap Nominatim.
 * @param searchOptions - Applied to every `search` call (not `reverse`,
 *   which is already coordinate-scoped and has no use for a country bias).
 * @remarks Requires `https://nominatim.openstreetmap.org` in the host app's
 *   CSP `connect-src` — see `GeocoderProvider`. Use this instead of the
 *   `nominatimGeocoderProvider` default when a host app's own coverage is
 *   narrower than "the whole world," e.g. `createNominatimGeocoderProvider({
 *   countryCodes: "za" })` for a South Africa-only app.
 */
export function createNominatimGeocoderProvider(
  searchOptions: NominatimSearchOptions = {},
): GeocoderProvider {
  return {
    search: (query, signal) =>
      fetchLocationSearchResults(query, signal, searchOptions),
    reverse: fetchReverseGeocodeResult,
  };
}

/**
 * The default `GeocoderProvider`, backed by OpenStreetMap Nominatim with no
 * geographic bias. Use `createNominatimGeocoderProvider` instead to bias
 * search results toward a host app's own coverage area.
 * @remarks Requires `https://nominatim.openstreetmap.org` in the host app's
 *   CSP `connect-src` — see `GeocoderProvider`.
 */
export const nominatimGeocoderProvider: GeocoderProvider =
  createNominatimGeocoderProvider();
