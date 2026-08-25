import type { TransitLayerFeatureCollection } from "@karta/app";
import type { FeatureCollection } from "geojson";
import { sleep } from "../asyncUtils";
import { fetchWithTimeout } from "../httpUtils";
import {
  firstDefinedProperty,
  normalizeLineStringTransitFeatureCollection,
} from "./lineStringTransit";

const EKURHULENI_IRPTN_URL =
  "https://gis.ekurhuleni.gov.za/arcgis/rest/services/Ekurhuleni/Ekurhuleni_Transportation_Map_v1/MapServer/2/query";
const PAGE_SIZE = 1000;
const REQUEST_TIMEOUT_MS = 90_000;
const PAGE_DELAY_MS = 1_500;
const MAX_PAGE_FETCH_ATTEMPTS = 3;
const RETRY_BACKOFF_MS = 1_500;

interface RawIrptnProperties {
  OBJECTID?: number;
  Id?: number;
  Name?: string;
}

interface ArcGisGeoJsonResponse extends FeatureCollection {
  exceededTransferLimit?: boolean;
}

function createQueryUrl(resultOffset: number): string {
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "*",
    orderByFields: "OBJECTID",
    outSR: "4326",
    resultOffset: String(resultOffset),
    resultRecordCount: String(PAGE_SIZE),
    f: "geojson",
  });

  return `${EKURHULENI_IRPTN_URL}?${params.toString()}`;
}

function isFeatureCollection(value: unknown): value is ArcGisGeoJsonResponse {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const candidate = value as { type?: unknown; features?: unknown };
  return (
    candidate.type === "FeatureCollection" && Array.isArray(candidate.features)
  );
}

function resolveId(props: RawIrptnProperties): string {
  return firstDefinedProperty(
    props as Record<string, unknown>,
    ["OBJECTID", "Id"],
    "unknown",
  );
}

function resolveName(props: RawIrptnProperties): string {
  return firstDefinedProperty(
    props as Record<string, unknown>,
    ["Name"],
    "Unnamed",
  );
}

/** Normalizes Ekurhuleni's ArcGIS IRPTN GeoJSON export into `LineString` features. */
export function normalizeEkurhuleniIrptn(
  raw: FeatureCollection,
): TransitLayerFeatureCollection {
  return normalizeLineStringTransitFeatureCollection(
    raw,
    (props: RawIrptnProperties) => ({
      id: resolveId(props),
      name: resolveName(props),
    }),
    "Ekurhuleni IRPTN",
  );
}

/**
 * Requests a single Ekurhuleni IRPTN page, retrying with backoff (up to
 * `MAX_PAGE_FETCH_ATTEMPTS` attempts total) if the request itself fails
 * (e.g. a transient network error), rather than failing the whole paginated
 * fetch on one bad attempt. A non-`ok` HTTP response is not retried here —
 * it's surfaced to the caller as-is, since it isn't necessarily transient.
 */
async function fetchIrptnPage(
  resultOffset: number,
  attempt = 1,
): Promise<Response> {
  try {
    return await fetchWithTimeout(
      createQueryUrl(resultOffset),
      {},
      REQUEST_TIMEOUT_MS,
    );
  } catch (error) {
    if (attempt >= MAX_PAGE_FETCH_ATTEMPTS) {
      throw error;
    }
    await sleep(RETRY_BACKOFF_MS * attempt);
    return fetchIrptnPage(resultOffset, attempt + 1);
  }
}

/**
 * Fetches all Ekurhuleni IRPTN route features from the metro's ArcGIS
 * MapServer, paging through results (`resultOffset`/`resultRecordCount`)
 * until the server stops reporting `exceededTransferLimit`.
 */
export async function fetchEkurhuleniIrptnRoutes(): Promise<FeatureCollection> {
  const features = [];
  let resultOffset = 0;
  let exceededTransferLimit = false;

  do {
    if (resultOffset > 0) {
      await sleep(PAGE_DELAY_MS);
    }

    const response = await fetchIrptnPage(resultOffset);

    if (!response.ok) {
      throw new Error(
        `Ekurhuleni IRPTN request failed with status ${response.status}`,
      );
    }

    const collection: unknown = await response.json();
    if (!isFeatureCollection(collection)) {
      throw new Error("Ekurhuleni IRPTN returned an unexpected shape");
    }

    features.push(...collection.features);
    exceededTransferLimit = collection.exceededTransferLimit === true;
    resultOffset += PAGE_SIZE;
  } while (exceededTransferLimit);

  return { type: "FeatureCollection", features };
}
