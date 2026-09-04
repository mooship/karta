import { getMetroDefinition, type MetroId } from "@karta/app";
import * as turf from "@turf/turf";
import AdmZip from "adm-zip";
import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from "geojson";
import * as shapefile from "shapefile";
import { hashKey, readJsonCache, writeJsonCache } from "../cache";

// Source: Statistics South Africa Census 2011 sub-place boundaries (SP_SA_2011
// shapefile), mirrored as a zip in the community-maintained "SA-Maps" GitHub
// repository (chosen because statssa.gov.za does not expose a direct,
// scriptable download link; Adrian Frith's public repos were checked and do
// not host a ready-made sub-place boundary GeoJSON/shapefile for Tshwane).
// Verified working (HTTP 200, valid zip containing SP_SA_2011.shp/.dbf/.shx,
// City of Tshwane records present with MN_CODE 799, City of Johannesburg
// records present with MN_CODE 798) on 2026-07-27 (Tshwane) and 2026-07-29
// (Johannesburg).
// https://github.com/j-norwood-young/SA-Maps/raw/master/Subplace.zip
export const BOUNDARY_SOURCE_URL =
  "https://github.com/j-norwood-young/SA-Maps/raw/master/Subplace.zip";

/** How long a cached, parsed national boundary result stays fresh before a run re-fetches it — long, since Census 2011 boundaries are static historical data that never changes between runs. */
const BOUNDARIES_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

const SHP_ENTRY_NAME = "Subplace/SP_SA_2011.shp";
const DBF_ENTRY_NAME = "Subplace/SP_SA_2011.dbf";

/** A Census 2011 sub-place feature's properties, as they appear in the source shapefile. */
export interface RawSubPlaceProperties {
  SP_CODE: string;
  SP_NAME: string;
  TotalPop?: number;
}

/** A geographic point in decimal degrees. */
export interface LatLon {
  lat: number;
  lon: number;
}

/** A sub-place boundary, normalized into the shape the rest of the pipeline works with. */
export interface NormalizedTownship {
  id: string;
  name: string;
  population: number | undefined;
  /** The boundary's centroid, used as the routing origin for job-centre drive-time queries. */
  centroid: LatLon;
  geometry: Polygon | MultiPolygon;
}

/**
 * Normalizes a raw sub-place `FeatureCollection` (as produced by
 * `convertShapefileToGeoJSON`/`filterFeaturesByMunicipality`) into
 * `NormalizedTownship`s, computing each feature's centroid via Turf.
 */
export function normalizeBoundaries(
  raw: FeatureCollection,
): NormalizedTownship[] {
  return raw.features.map((feature) => {
    const props = feature.properties as RawSubPlaceProperties;
    const geometry = feature.geometry as Polygon | MultiPolygon;
    const centroidFeature = turf.centroid(
      feature as Feature<Polygon | MultiPolygon>,
    );
    const [lon, lat] = centroidFeature.geometry.coordinates as [number, number];

    return {
      id: props.SP_CODE,
      name: props.SP_NAME,
      population: props.TotalPop,
      centroid: { lat, lon },
      geometry,
    };
  });
}

/**
 * Pure transform: filters a national sub-place FeatureCollection down to a
 * single metro's records only (matching on the shapefile's MN_CODE
 * municipality field) and remaps each feature's properties to the
 * RawSubPlaceProperties shape. Contains no I/O, so it can be unit tested
 * against a small in-memory fixture without touching the network.
 */
export function filterFeaturesByMunicipality(
  collection: FeatureCollection,
  municipalityCodes: readonly number[],
): FeatureCollection {
  const municipalityCodeSet = new Set(municipalityCodes);
  const features: Feature[] = collection.features
    .filter((feature) =>
      municipalityCodeSet.has(
        Number((feature.properties as Record<string, unknown> | null)?.MN_CODE),
      ),
    )
    .map((feature) => {
      const rawProps = feature.properties as Record<string, unknown> | null;
      const properties: RawSubPlaceProperties = {
        SP_CODE: String(rawProps?.SP_CODE),
        SP_NAME: String(rawProps?.SP_NAME),
        // The Stats SA sub-place shapefile does not carry a population
        // field; population is left undefined for real fetches and is
        // only populated by other, richer sources in tests.
      };
      return { ...feature, properties };
    });

  return { ...collection, features };
}

/**
 * Extracts the sub-place shapefile pair (.shp/.dbf) from the zip archive and
 * parses it into an unfiltered, national GeoJSON FeatureCollection. I/O-bound
 * (zip extraction + shapefile parsing); the only caller is
 * `fetchNationalBoundaries`, which additionally fetches the zip over the
 * network — kept as its own function so that fetch and parse stay separately
 * testable.
 */
async function parseSubPlaceZip(zipBuffer: Buffer): Promise<FeatureCollection> {
  const zip = new AdmZip(zipBuffer);
  const shpEntry = zip.getEntry(SHP_ENTRY_NAME);
  const dbfEntry = zip.getEntry(DBF_ENTRY_NAME);

  if (!shpEntry || !dbfEntry) {
    throw new Error(
      `Expected ${SHP_ENTRY_NAME} and ${DBF_ENTRY_NAME} entries in the boundary zip archive`,
    );
  }

  const shpBuffer = shpEntry.getData();
  const dbfBuffer = dbfEntry.getData();

  return shapefile.read(shpBuffer, dbfBuffer);
}

/**
 * Fetches the national sub-place boundary shapefile zip and parses it into
 * an unfiltered, national GeoJSON FeatureCollection, via `parseSubPlaceZip`.
 * @remarks Kept separate from any per-metro filtering so a caller building a
 *   dataset for several metros (as `fetchMetroBoundariesForMetros` does) can
 *   fetch and parse this multi-megabyte, whole-country shapefile exactly
 *   once and reuse the result, rather than re-downloading and re-parsing
 *   byte-identical data once per metro. The parsed result is cached to disk
 *   (see `cache.ts`), since Census 2011 boundaries are static historical
 *   data — a cache hit skips both the network fetch and the
 *   zip-extraction/shapefile-parse work entirely, unlike a prior version of
 *   this function which re-did both on every single call. Falls back to a
 *   stale cache entry if the live fetch or parse fails, mirroring
 *   `fetchOverpass`'s/`fetchTable`'s resilience, since this is otherwise the
 *   pipeline's only external fetch with no retry or mirror rotation of its
 *   own.
 * @throws If the network fetch or parse fails and no cached fallback is
 *   available.
 */
export async function fetchNationalBoundaries(): Promise<FeatureCollection> {
  const cacheKey = hashKey(["boundaries", BOUNDARY_SOURCE_URL]);
  const cached = await readJsonCache<FeatureCollection>(
    "boundaries",
    cacheKey,
    { maxAgeMs: BOUNDARIES_CACHE_MAX_AGE_MS },
  );
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(BOUNDARY_SOURCE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch metro boundaries: ${response.status}`);
    }
    const zipBuffer = Buffer.from(await response.arrayBuffer());
    const parsed = await parseSubPlaceZip(zipBuffer);
    await writeJsonCache("boundaries", cacheKey, parsed);
    return parsed;
  } catch (error) {
    const stale = await readJsonCache<FeatureCollection>(
      "boundaries",
      cacheKey,
      { allowStale: true },
    );
    if (stale) {
      return stale;
    }
    throw error;
  }
}

/**
 * Fetches the national sub-place boundary shapefile zip exactly once, then
 * filters it down to each of `metroIds`' sub-place features.
 * @remarks Fetching and parsing the whole-country zip once and filtering
 *   the result per metro (rather than re-fetching and re-parsing it once per
 *   metro) is why this takes every metro at once instead of one at a time —
 *   `runRegion` in `src/run.ts` calls this once for a region's every metro.
 * @throws If the network fetch fails.
 */
export async function fetchMetroBoundariesForMetros(
  metroIds: readonly MetroId[],
): Promise<Record<MetroId, FeatureCollection>> {
  const national = await fetchNationalBoundaries();
  const result = {} as Record<MetroId, FeatureCollection>;
  for (const metroId of metroIds) {
    result[metroId] = filterFeaturesByMunicipality(
      national,
      getMetroDefinition(metroId).municipalityCodes,
    );
  }
  return result;
}
