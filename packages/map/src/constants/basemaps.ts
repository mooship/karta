/** Style configuration for a raster XYZ basemap. */
export interface RasterBasemapDefinition {
  kind: "raster";
  label: string;
  description: string;
  url: string;
  attribution: string;
  darkUrl?: string;
  darkAttribution?: string;
  /**
   * Additional tile sources tried in order, after `url`, if the current
   * source's tiles fail to load. See `getBasemapTileSources`.
   */
  fallbackUrls?: string[];
  /** Same as `fallbackUrls`, but tried after `darkUrl` when dark tiles are preferred. */
  darkFallbackUrls?: string[];
  /**
   * When `true` and this basemap has no `darkUrl`, `MapView` applies a CSS
   * filter that inverts and re-tints its tiles while dark theme is active,
   * so a cartographic (non-imagery) basemap without an official dark tile
   * set doesn't sit jarringly bright under an otherwise dark UI. Leave unset
   * for imagery basemaps (e.g. satellite), where inverting tiles would
   * distort real-world colour rather than restyle a map.
   */
  dimInDarkMode?: boolean;
}

/** Style configuration for a vector-tile basemap, rendered via MapLibre GL. */
export interface VectorBasemapDefinition {
  kind: "vector";
  label: string;
  description: string;
  /** URL of a MapLibre GL style JSON document. */
  styleUrl: string;
  /** Style JSON to use instead of `styleUrl` when dark mode is preferred. */
  darkStyleUrl?: string;
  /**
   * Attribution HTML added to Leaflet's attribution control while this
   * basemap is active.
   * @remarks Unlike a raster basemap's `attribution`, this isn't wired up by
   *   Leaflet itself — a MapLibre GL style JSON's own `sources` typically
   *   carry no `attribution` field (OpenFreeMap's don't), so
   *   `VectorBasemapLayer` adds/removes this text from
   *   `map.attributionControl` by hand instead.
   */
  attribution?: string;
  /** Attribution to use instead of `attribution` when `darkStyleUrl` is active. Falls back to `attribution` if unset. */
  darkAttribution?: string;
}

/** A registered basemap's rendering configuration, raster or vector. */
export type BasemapDefinition =
  | RasterBasemapDefinition
  | VectorBasemapDefinition;

/**
 * Identifier of a registered basemap, e.g. `"positron"`.
 * @remarks Any string can be registered via `registerBasemap`.
 */
export type Basemap = string;

const OPEN_STREET_MAP_ATTRIBUTION =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
const OPEN_FREE_MAP_ATTRIBUTION =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &middot; tiles by <a href='https://openfreemap.org'>OpenFreeMap</a>";
const OPEN_FREE_MAP_STYLE_BASE = "https://tiles.openfreemap.org/styles";

// CARTO's anonymous basemap tile endpoints (basemaps.cartocdn.com) now
// return HTTP 200 with a baked-in "API KEY REQUIRED" watermark image rather
// than an error, for every style (light_all, dark_all, rastertiles/voyager)
// — so a paid CARTO account is required even for a 200 response, and
// Leaflet's error-based tile fallback never triggers since the request
// technically "succeeds". `positron`/`liberty`/`dark` below use OpenFreeMap's
// free, key-less, rate-limit-free vector styles instead (MapLibre GL,
// lazy-loaded — see `VectorBasemapLayer`) as three independently selectable
// basemaps, rather than one basemap that auto-swaps style with the UI theme
// the way CARTO's light/dark pair used to — a basemap's own style and the
// app's light/dark chrome preference are unrelated choices, and `dark` not
// having a light counterpart (or `topo`/`satellite` not having a dark one)
// is fine as-is, rather than approximating one with a CSS invert filter.
function defaultBasemaps(): Record<string, BasemapDefinition> {
  return {
    positron: {
      kind: "vector",
      label: "Positron",
      description: "Muted, minimal basemap for place names and orientation.",
      styleUrl: `${OPEN_FREE_MAP_STYLE_BASE}/positron`,
      attribution: OPEN_FREE_MAP_ATTRIBUTION,
    },
    liberty: {
      kind: "vector",
      label: "Liberty",
      description: "Colourful basemap with bold roads and clear place labels.",
      styleUrl: `${OPEN_FREE_MAP_STYLE_BASE}/liberty`,
      attribution: OPEN_FREE_MAP_ATTRIBUTION,
    },
    dark: {
      kind: "vector",
      label: "Dark",
      description: "Low-glare basemap purpose-built for dark surroundings.",
      styleUrl: `${OPEN_FREE_MAP_STYLE_BASE}/dark`,
      attribution: OPEN_FREE_MAP_ATTRIBUTION,
    },
    satellite: {
      kind: "raster",
      label: "Satellite",
      description: "Imagery context for land use and built form checks.",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics",
    },
    topo: {
      kind: "raster",
      label: "Topographic",
      description: "Terrain shading and roads for geographic context.",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, and the GIS User Community",
    },
  };
}

function loadDefaultsInto(target: Map<Basemap, BasemapDefinition>): void {
  target.clear();
  for (const [id, definition] of Object.entries(defaultBasemaps())) {
    target.set(id, definition);
  }
}

const registry = new Map<Basemap, BasemapDefinition>();
loadDefaultsInto(registry);

/**
 * Registers (or overwrites) a basemap definition under `id`, making it
 * available to `BasemapToggle` and `MapView`.
 */
export function registerBasemap(
  id: Basemap,
  definition: BasemapDefinition,
): void {
  registry.set(id, definition);
}

/** Ids of every currently registered basemap, in registration order. */
export function getRegisteredBasemapIds(): Basemap[] {
  return [...registry.keys()];
}

/**
 * Looks up a registered basemap's definition.
 * @throws If `id` isn't registered.
 */
export function getBasemapDefinition(id: Basemap): BasemapDefinition {
  const definition = registry.get(id);
  if (!definition) {
    throw new Error(`Unknown basemap: "${id}"`);
  }
  return definition;
}

/**
 * Resets the registry to its built-in defaults.
 * @remarks For test isolation — the registry is a module-level singleton.
 */
export function resetBasemapRegistry(): void {
  loadDefaultsInto(registry);
}

/** A resolved raster tile source: URL template plus its attribution. */
export interface BasemapTileSource {
  url: string;
  attribution: string;
}

/**
 * Resolves the ordered list of raster tile sources to try for a basemap,
 * primary first followed by fallbacks used when a tile request errors.
 * @param basemap - The selected basemap. Must be a `"raster"` kind.
 * @param prefersDarkStreetTiles - Whether to prefer the dark variant, for
 *   basemaps that define one via `darkUrl`. Ignored for basemaps without one.
 * @returns An ordered array of `{ url, attribution }` tile sources.
 * @throws If `basemap` isn't registered, or isn't a raster basemap.
 */
export function getBasemapTileSources(
  basemap: Basemap,
  prefersDarkStreetTiles: boolean,
): BasemapTileSource[] {
  const definition = getBasemapDefinition(basemap);
  if (definition.kind !== "raster") {
    throw new Error(
      `getBasemapTileSources only supports raster basemaps, got "${basemap}"`,
    );
  }

  const primary =
    prefersDarkStreetTiles && definition.darkUrl
      ? {
          url: definition.darkUrl,
          attribution: definition.darkAttribution ?? definition.attribution,
        }
      : { url: definition.url, attribution: definition.attribution };
  const fallbackUrls =
    (prefersDarkStreetTiles
      ? definition.darkFallbackUrls
      : definition.fallbackUrls) ?? [];

  return [
    primary,
    ...fallbackUrls.map((url) => ({
      url,
      attribution: url.includes("openstreetmap")
        ? OPEN_STREET_MAP_ATTRIBUTION
        : definition.attribution,
    })),
  ];
}

/**
 * Substitutes Leaflet's `{r}` tile-scale placeholder in `url` with `"@2x"`
 * when `retina` is `true`, and with nothing when it isn't.
 * @remarks Leaflet resolves `{r}` itself from `Browser.retina` — the
 *   *device's* pixel ratio — completely independently of the `detectRetina`
 *   option, so a caller that decides against retina tiles still gets `@2x`
 *   URLs on any high-DPI screen. That is roughly two to three times the
 *   bytes per tile, which is exactly the wrong trade on the small, likely
 *   throttled mobile viewports where `detectRetina` is turned off. Resolving
 *   the token up front makes the caller's decision the one that holds.
 */
export function resolveTileScaleToken(url: string, retina: boolean): string {
  return url.replaceAll("{r}", retina ? "@2x" : "");
}
