/**
 * The OSRM routing server base URL.
 * @remarks Overridable via `OSRM_BASE_URL` to point at a self-hosted
 *   instance instead of the public default (see `docker-compose.yml`).
 */
export function getOsrmBaseUrl(): string {
  return process.env.OSRM_BASE_URL ?? "https://router.project-osrm.org";
}

/**
 * Whether the pipeline is pointed at a self-hosted OSRM instance rather than
 * the public demo server.
 * @remarks `run.ts` uses this to decide whether it's safe to process metros
 *   concurrently: the public server's `BATCH_SIZE`/`BATCH_DELAY_MS`
 *   rate-limiting in `osrmClient.ts` assumes one metro's requests are
 *   in flight at a time, so concurrent metros must stay opt-in to a
 *   self-hosted `OSRM_BASE_URL` explicitly set for that purpose.
 */
export function isUsingCustomOsrmEndpoint(): boolean {
  return Boolean(process.env.OSRM_BASE_URL);
}

// overpass-api.de alone rate-limits/times out under sustained use, so it's
// listed last -- the other two mirrors are tried first on failure.
const PUBLIC_OVERPASS_MIRRORS: readonly string[] = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

/**
 * Overpass API endpoints to try in turn (`fetchOverpass` rotates through
 * these on repeated 429/504 responses, since a single public instance can be
 * temporarily rate-limited while others aren't).
 * @remarks Checks `OVERPASS_URLS` first (a comma-separated priority list);
 *   if unset, falls back to `OVERPASS_URL` (a single URL); defaults to
 *   `PUBLIC_OVERPASS_MIRRORS` if neither is set.
 */
export function getOverpassUrls(): readonly string[] {
  const listOverride = process.env.OVERPASS_URLS;
  if (listOverride) {
    const urls = listOverride
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    if (urls.length > 0) {
      return urls;
    }
  }

  const override = process.env.OVERPASS_URL;
  return override ? [override] : PUBLIC_OVERPASS_MIRRORS;
}
