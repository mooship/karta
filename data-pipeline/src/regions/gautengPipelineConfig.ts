import { METROS, type TransitLayerFeatureCollection } from "@karta/app";
import { mergeFeatureCollections } from "@karta/core";
import {
  fetchAReYengRoutes,
  normalizeAReYeng,
  normalizeAReYengOverpass,
} from "../adapters/aReYeng";
import {
  fetchEkurhuleniIrptnRoutes,
  normalizeEkurhuleniIrptn,
} from "../adapters/ekurhuleniIrptn";
import {
  fetchGautrainBusRoutes,
  fetchGautrainRail,
  normalizeGautrainBusOverpass,
  normalizeGautrainOverpass,
} from "../adapters/gautrain";
import { fetchPrasaRail, normalizePrasaOverpass } from "../adapters/prasa";
import {
  fetchReaVayaRoutes,
  normalizeReaVayaOverpass,
} from "../adapters/reaVaya";
import {
  fetchTshwaneBusRoutes,
  normalizeTshwaneBusOverpass,
} from "../adapters/tshwaneBus";
import { getMetroBbox, getSharedTransitBbox } from "../constants/metroBbox";
import { createFetchWithPublishedFallback } from "../fetchWithPublishedFallback";
import type { PipelineSource, RegionPipelineConfig } from "../pipelineSource";

const REGION_ID = "gauteng";

const gautengMetros = METROS.filter((metro) => metro.regionId === REGION_ID);
const gautengMetroIds = gautengMetros.map((metro) => metro.id);

const fetchWithPublishedFallback = createFetchWithPublishedFallback(REGION_ID);

async function fetchRapidRail(): Promise<TransitLayerFeatureCollection> {
  const bbox = getSharedTransitBbox(gautengMetroIds);
  return fetchWithPublishedFallback({
    sourceName: "Gautrain rail",
    fallbackLayerName: "rapid-rail",
    fetch: async () => normalizeGautrainOverpass(await fetchGautrainRail(bbox)),
  });
}

async function fetchCommuterRail(): Promise<TransitLayerFeatureCollection> {
  const bbox = getSharedTransitBbox(gautengMetroIds);
  return fetchWithPublishedFallback({
    sourceName: "PRASA rail",
    fallbackLayerName: "commuter-rail",
    fetch: async () => normalizePrasaOverpass(await fetchPrasaRail(bbox)),
  });
}

/**
 * Filters a `bus-rapid-transit` fallback file (a merge of A Re Yeng, Rea
 * Vaya, and Ekurhuleni IRPTN features) down to just `network`'s features,
 * for `fetchWithPublishedFallback`'s `recoverFromFallback`.
 */
function recoverNetworkFromBusRapidTransitFallback(
  network: string,
): (fallback: TransitLayerFeatureCollection) => TransitLayerFeatureCollection {
  return (fallback) => ({
    type: "FeatureCollection",
    features: fallback.features.filter(
      (feature) =>
        (feature.properties as { network?: unknown } | null)?.network ===
        network,
    ),
  });
}

/**
 * Fetches one bus-rapid-transit network's features, falling back to that
 * network's slice of the last-published `bus-rapid-transit` file on failure.
 */
function fetchBusRapidTransitNetworkWithFallback(
  sourceName: string,
  fetch: () => Promise<TransitLayerFeatureCollection>,
): Promise<TransitLayerFeatureCollection> {
  return fetchWithPublishedFallback({
    sourceName,
    fallbackLayerName: "bus-rapid-transit",
    fetch,
    recoverFromFallback: recoverNetworkFromBusRapidTransitFallback(sourceName),
  });
}

async function fetchBusRapidTransit(): Promise<TransitLayerFeatureCollection> {
  const reaVayaBbox = getMetroBbox("johannesburg");
  const [aReYeng, reaVaya, ekurhuleniIrptn] = await Promise.all([
    fetchBusRapidTransitNetworkWithFallback("A Re Yeng", async () => {
      const raw = await fetchAReYengRoutes();
      return "elements" in raw
        ? normalizeAReYengOverpass(raw)
        : normalizeAReYeng(raw);
    }),
    fetchBusRapidTransitNetworkWithFallback("Rea Vaya", async () =>
      normalizeReaVayaOverpass(await fetchReaVayaRoutes(reaVayaBbox)),
    ),
    fetchBusRapidTransitNetworkWithFallback("Ekurhuleni IRPTN", async () =>
      normalizeEkurhuleniIrptn(await fetchEkurhuleniIrptnRoutes()),
    ),
  ]);

  return mergeFeatureCollections([aReYeng, reaVaya, ekurhuleniIrptn]);
}

async function fetchGautrainBus(): Promise<TransitLayerFeatureCollection> {
  const bbox = getSharedTransitBbox(gautengMetroIds);
  return fetchWithPublishedFallback({
    sourceName: "Gautrain Bus",
    fallbackLayerName: "bus",
    fetch: async () =>
      normalizeGautrainBusOverpass(await fetchGautrainBusRoutes(bbox)),
    // The "bus" fallback file is a merged Gautrain Bus + Tshwane bus layer,
    // so only the Gautrain Bus features are recoverable from it.
    recoverFromFallback: (fallback) => ({
      type: "FeatureCollection",
      features: fallback.features.filter(
        (feature) =>
          (feature.properties as { network?: unknown } | null)?.network ===
          "Gautrain Bus",
      ),
    }),
  });
}

async function fetchBus(): Promise<TransitLayerFeatureCollection> {
  const [gautrainBus, tshwaneBusRaw] = await Promise.all([
    fetchGautrainBus(),
    fetchTshwaneBusRoutes(getMetroBbox("tshwane")),
  ]);
  const tshwaneBus = normalizeTshwaneBusOverpass(tshwaneBusRaw);
  return mergeFeatureCollections([gautrainBus, tshwaneBus]);
}

/** Transit networks every published `gauteng` build must have at least one feature for. */
const REQUIRED_TRANSIT_NETWORKS = [
  "Gautrain",
  "PRASA",
  "Gautrain Bus",
  "A Re Yeng",
  "Rea Vaya",
  "Tshwane Bus Services",
] as const;

const sources: PipelineSource[] = [
  {
    layerId: "rapid-rail",
    fetch: fetchRapidRail,
    outputFileName: "rapid-rail.display.v1.geojson",
  },
  {
    layerId: "commuter-rail",
    fetch: fetchCommuterRail,
    outputFileName: "commuter-rail.display.v1.geojson",
  },
  {
    layerId: "bus-rapid-transit",
    fetch: fetchBusRapidTransit,
    outputFileName: "bus-rapid-transit.display.v1.geojson",
  },
  {
    layerId: "bus",
    fetch: fetchBus,
    outputFileName: "bus.display.v1.geojson",
  },
];

/**
 * The `gauteng` region's pipeline config: its nine metros, and one
 * `PipelineSource` per output layer — Gautrain rail (`rapid-rail`), PRASA
 * rail (`commuter-rail`), a combined `bus-rapid-transit` layer merging A Re
 * Yeng/Rea Vaya/Ekurhuleni IRPTN, and a combined `bus` layer merging
 * Gautrain Bus/Tshwane bus. Registered in `REGION_PIPELINE_CONFIGS`
 * (`../regionPipelineConfigs.ts`).
 */
export const GAUTENG_PIPELINE_CONFIG: RegionPipelineConfig = {
  regionId: REGION_ID,
  metros: gautengMetros,
  sources,
  requiredNetworks: REQUIRED_TRANSIT_NETWORKS,
};
