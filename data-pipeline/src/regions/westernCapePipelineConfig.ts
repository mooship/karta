import { METROS, type TransitLayerFeatureCollection } from "@karta/app";
import { fetchMyCitiRoutes, normalizeMyCitiOverpass } from "../adapters/myciti";
import { fetchPrasaRail, normalizePrasaOverpass } from "../adapters/prasa";
import { getMetroBbox } from "../constants/metroBbox";
import { createFetchWithPublishedFallback } from "../fetchWithPublishedFallback";
import type { PipelineSource, RegionPipelineConfig } from "../pipelineSource";

const REGION_ID = "western-cape";

const westernCapeMetros = METROS.filter(
  (metro) => metro.regionId === REGION_ID,
);

const fetchWithPublishedFallback = createFetchWithPublishedFallback(REGION_ID);

async function fetchBusRapidTransit(): Promise<TransitLayerFeatureCollection> {
  const bbox = getMetroBbox("cape-town");
  return fetchWithPublishedFallback({
    sourceName: "MyCiTi",
    fallbackLayerName: "bus-rapid-transit",
    fetch: async () => normalizeMyCitiOverpass(await fetchMyCitiRoutes(bbox)),
  });
}

async function fetchCommuterRail(): Promise<TransitLayerFeatureCollection> {
  // PRASA's Overpass query already matches on operator/network regardless of
  // region (see prasa.ts), so this reuses it as-is rather than a new
  // adapter — just scoped to Cape Town's bbox instead of Gauteng's.
  const bbox = getMetroBbox("cape-town");
  return fetchWithPublishedFallback({
    sourceName: "PRASA rail",
    fallbackLayerName: "commuter-rail",
    fetch: async () => normalizePrasaOverpass(await fetchPrasaRail(bbox)),
  });
}

/** Transit networks every published `western-cape` build must have at least one feature for. */
const REQUIRED_TRANSIT_NETWORKS = ["MyCiTi", "PRASA"] as const;

const sources: PipelineSource[] = [
  {
    layerId: "bus-rapid-transit",
    fetch: fetchBusRapidTransit,
    outputFileName: "bus-rapid-transit.display.v1.geojson",
  },
  {
    layerId: "commuter-rail",
    fetch: fetchCommuterRail,
    outputFileName: "commuter-rail.display.v1.geojson",
  },
];

/**
 * The `western-cape` region's pipeline config: its one metro (City of Cape
 * Town) and one `PipelineSource` per transit network (MyCiTi BRT, PRASA's
 * Metrorail Western Cape commuter rail). Registered in
 * `REGION_PIPELINE_CONFIGS` (`../regionPipelineConfigs.ts`).
 */
export const WESTERN_CAPE_PIPELINE_CONFIG: RegionPipelineConfig = {
  regionId: REGION_ID,
  metros: westernCapeMetros,
  sources,
  requiredNetworks: REQUIRED_TRANSIT_NETWORKS,
};
