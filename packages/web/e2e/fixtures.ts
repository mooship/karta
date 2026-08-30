import { test as base, expect } from "@playwright/test";

// A 1x1 transparent PNG, served in place of real raster basemap tile
// requests so the suite doesn't depend on OpenStreetMap/Esri network
// availability or rate limits.
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

const TILE_HOST_PATTERN = /tile\.openstreetmap\.org|server\.arcgisonline\.com/;

/**
 * A minimal, valid MapLibre GL style JSON — no sources, no layers — served
 * in place of the real Positron/Liberty/Dark basemaps' OpenFreeMap style
 * requests (matched generically by path, so it covers all three). This is
 * enough for MapLibre to initialise and paint an (empty) canvas without the
 * suite depending on OpenFreeMap's network availability, and avoids needing
 * to additionally stub vector tile/glyph/sprite requests, since a style
 * with no sources never requests any.
 */
const EMPTY_MAPLIBRE_STYLE = { version: 8, sources: {}, layers: [] };

const OPEN_FREE_MAP_STYLE_PATTERN = /tiles\.openfreemap\.org\/styles\//;

/** Matches a Nominatim place-search request, for tests that override the default geocoder stub below. */
export const GEOCODER_SEARCH_PATTERN = /nominatim\.openstreetmap\.org\/search/;

/** Matches a Nominatim reverse-geocode request, for tests that override the default geocoder stub below. */
export const GEOCODER_REVERSE_PATTERN =
  /nominatim\.openstreetmap\.org\/reverse/;

/**
 * The single place hit that every location search in the suite resolves to,
 * served in place of real Nominatim requests for the same reason the tile
 * stub above exists: OpenStreetMap's geocoder is a third party with a
 * one-request-per-second rate limit.
 * @remarks Inside `SEARCH_COVERAGE_BOUNDS` (see `App.tsx`), so picking it
 *   moves the map rather than reporting an out-of-coverage result.
 */
export const GEOCODER_RESULT = {
  place_id: 26262288,
  display_name: "Soweto, City of Johannesburg, Gauteng, South Africa",
  lat: "-26.2678",
  lon: "27.8586",
  boundingbox: ["-26.35", "-26.20", "27.75", "27.95"],
};

/** The reverse-geocode result served in place of real Nominatim `/reverse` requests, for the same reason `GEOCODER_RESULT` exists. */
export const GEOCODER_REVERSE_RESULT = {
  place_id: 26262500,
  display_name:
    "Diepkloof, Soweto, City of Johannesburg, Gauteng, South Africa",
  lat: "-26.25",
  lon: "27.94",
};

export const test = base.extend({
  baseURL: [
    process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173",
    { option: true },
  ],
  page: async ({ page }, use) => {
    await page.route(TILE_HOST_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "image/png",
        body: TRANSPARENT_PNG,
      }),
    );
    await page.route(OPEN_FREE_MAP_STYLE_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(EMPTY_MAPLIBRE_STYLE),
      }),
    );
    await page.route(GEOCODER_SEARCH_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([GEOCODER_RESULT]),
      }),
    );
    await page.route(GEOCODER_REVERSE_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(GEOCODER_REVERSE_RESULT),
      }),
    );
    await use(page);
  },
});

export { expect };
