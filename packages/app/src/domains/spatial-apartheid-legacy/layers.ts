import type { Layer } from "@karta/core";
import { REGIONS, type RegionId } from "../../constants/regions";
import { getTownshipGroup } from "../../constants/townships";

/**
 * Region id this domain's Gauteng-only layers pull data from, typed against
 * `RegionId` (derived from `REGIONS`) rather than a bare string literal — if
 * `REGIONS` is ever renamed, this fails typechecking instead of `dataUrl`
 * silently pointing at a directory `data-pipeline` no longer writes.
 */
const GAUTENG_REGION_ID: RegionId = "gauteng";

/**
 * Every province-kind region id configured in `REGIONS`, in registry order.
 * @remarks Drives the `dataSource` of every layer whose data is published
 *   per-province (the township/area choropleths, `bus-rapid-transit`,
 *   `commuter-rail`) — derived from `REGIONS` rather than a hand-typed list,
 *   so a new `kind: "province"` region added there (see
 *   `docs/adding-a-region.md`) flows into those layers automatically instead
 *   of requiring a matching hand-edit here.
 */
const PROVINCE_REGION_IDS: readonly RegionId[] = REGIONS.filter(
  (region) => region.kind === "province",
).map((region) => region.id);

/**
 * Builds a single Gauteng-only `dataSource` URL.
 * @remarks Deliberately hardcoded to `GAUTENG_REGION_ID` — reserved for
 *   layers with no Western Cape source configured (`rapid-rail`, `bus`).
 *   A layer whose data genuinely is published for every region must use
 *   `multiRegionDataUrls()` instead, as the three choropleth layers below
 *   do, or its `dataSource` silently omits every region but Gauteng.
 */
function dataUrl(fileName: string): string {
  return `/data/${GAUTENG_REGION_ID}/${fileName}`;
}

/**
 * Builds one `dataSource` URL per given region for a transit layer whose
 * pipeline source is configured for more than one region (currently
 * `bus-rapid-transit` and `commuter-rail` — see
 * `data-pipeline/src/regions/gautengPipelineConfig.ts` and
 * `westernCapePipelineConfig.ts`). `MapView`'s `useLayerData` fetches every
 * URL in a layer's `dataSource` and merges the results, so listing more than
 * one region here is what makes a second region's transit features actually
 * appear on the map — see `docs/adding-a-region.md`.
 */
function multiRegionDataUrls(
  regionIds: readonly RegionId[],
  fileName: string,
): string[] {
  return regionIds.map((regionId) => `/data/${regionId}/${fileName}`);
}

function resolveTownshipEmphasis(
  properties: Record<string, unknown> | null | undefined,
): boolean {
  const name = properties?.name;
  const id = properties?.id;
  if (typeof name !== "string") {
    return false;
  }
  return (
    getTownshipGroup(name, typeof id === "string" ? id : undefined) !==
    undefined
  );
}

/** Shared choropleth opacity/emphasis config for both township-area layers below. */
const TOWNSHIP_EMPHASIS_STYLE = {
  baseOpacity: 0.18,
  emphasisOpacity: 0.78,
  resolveEmphasis: resolveTownshipEmphasis,
} as const;

/**
 * Shared `dataSource` for the three choropleth layers below, which all key
 * off the same per-region township dataset (`commuteMinutes`/
 * `nearestTransitKm`/`spatialBurdenScore` are just different properties on
 * the same features).
 */
const TOWNSHIP_DISPLAY_DATA_SOURCE = multiRegionDataUrls(
  PROVINCE_REGION_IDS,
  "townships.display.v1.geojson",
);

/**
 * The `spatial-apartheid-legacy` domain's layer catalogue: three choropleth
 * layers (modelled car time, distance to nearest transit, and a combined
 * spatial-burden score weighting the two together — see
 * `data-pipeline/src/spatialBurden.ts`) sharing the same township-area data,
 * and one line layer per transit network. `rapid-rail` and `commuter-rail`
 * set `hasPointGeometry: true` since real station/stop Point geometry only
 * exists for those two networks.
 * @remarks `readonly`/`as const`, matching `METROS`/`REGIONS`: Cloudflare
 *   Workers reuse isolates across requests, so an in-place mutation by any
 *   downstream consumer would otherwise leak across unrelated requests for
 *   the isolate's lifetime.
 */
export const SPATIAL_APARTHEID_LEGACY_LAYERS: readonly Layer[] = [
  {
    id: "townships",
    label: "Modelled car time",
    description:
      "Modelled car drive-time from each recognised township area to its nearest selected job centre.",
    dataSource: TOWNSHIP_DISPLAY_DATA_SOURCE,
    geometryKind: "choropleth",
    defaultVisible: true,
    available: true,
    interaction: { selectable: true, labelField: "name" },
    style: {
      kind: "choropleth",
      propertyKey: "commuteMinutes",
      buckets: [
        { max: 20, color: "#7A9B6E", label: "Short (≤ 20 min)" },
        { max: 40, color: "#C9A227", label: "Moderate (21–40 min)" },
        { max: 60, color: "#D6703F", label: "Long (41–60 min)" },
        {
          max: Number.POSITIVE_INFINITY,
          color: "#C1502E",
          label: "Very long (> 60 min)",
        },
      ],
      ...TOWNSHIP_EMPHASIS_STYLE,
    },
  },
  {
    id: "nearest-transit",
    label: "Distance to nearest transit",
    description:
      "Straight-line distance from each recognised township area to the nearest formal transit route.",
    dataSource: TOWNSHIP_DISPLAY_DATA_SOURCE,
    geometryKind: "choropleth",
    defaultVisible: false,
    available: true,
    interaction: { selectable: true, labelField: "name" },
    style: {
      kind: "choropleth",
      propertyKey: "nearestTransitKm",
      buckets: [
        {
          max: 1,
          color: "#CFE3F5",
          darkColor: "#274A66",
          label: "Near (≤ 1 km)",
        },
        {
          max: 3,
          color: "#7FB2E5",
          darkColor: "#3E75A8",
          label: "Moderate (1–3 km)",
        },
        {
          max: 8,
          color: "#3673B8",
          darkColor: "#5FA8DE",
          label: "Far (3–8 km)",
        },
        {
          max: Number.POSITIVE_INFINITY,
          color: "#123F6E",
          darkColor: "#9ED4FF",
          label: "Very far (> 8 km)",
        },
      ],
      ...TOWNSHIP_EMPHASIS_STYLE,
    },
  },
  {
    id: "spatial-burden",
    label: "Combined spatial burden",
    description:
      "A combined score weighting modelled car time and distance to transit together, to show where both burdens compound.",
    dataSource: TOWNSHIP_DISPLAY_DATA_SOURCE,
    geometryKind: "choropleth",
    defaultVisible: false,
    available: true,
    interaction: { selectable: true, labelField: "name" },
    style: {
      kind: "choropleth",
      propertyKey: "spatialBurdenScore",
      buckets: [
        {
          max: 0.25,
          color: "#E6D9F5",
          darkColor: "#3D2A5C",
          label: "Low",
        },
        {
          max: 0.5,
          color: "#B99FE0",
          darkColor: "#6B4A94",
          label: "Moderate",
        },
        {
          max: 0.75,
          color: "#8659C7",
          darkColor: "#9B72D6",
          label: "High",
        },
        {
          max: Number.POSITIVE_INFINITY,
          color: "#4B1F94",
          darkColor: "#C9AAFF",
          label: "Severe",
        },
      ],
      ...TOWNSHIP_EMPHASIS_STYLE,
    },
  },
  {
    id: "rapid-rail",
    label: "Rapid Rail",
    dataSource: [dataUrl("rapid-rail.display.v1.geojson")],
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    hasPointGeometry: true,
    style: {
      kind: "line",
      color: "#E69F00",
      weight: 3,
      legendLabel: "Rapid Rail",
    },
  },
  {
    id: "bus-rapid-transit",
    label: "Bus Rapid Transit",
    dataSource: multiRegionDataUrls(
      PROVINCE_REGION_IDS,
      "bus-rapid-transit.display.v1.geojson",
    ),
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    style: {
      kind: "line",
      color: "#009E73",
      weight: 3,
      legendLabel: "Bus Rapid Transit",
      colorClassification: {
        kind: "categorized",
        propertyKey: "network",
        stops: [
          { match: "A Re Yeng", value: "#56B4E9", label: "A Re Yeng" },
          { match: "Rea Vaya", value: "#009E73", label: "Rea Vaya" },
          {
            match: "Ekurhuleni IRPTN",
            value: "#0072B2",
            label: "Ekurhuleni IRPTN",
          },
          { match: "MyCiTi", value: "#E69F00", label: "MyCiTi" },
        ],
        fallback: "#009E73",
      },
    },
  },
  {
    id: "commuter-rail",
    label: "Commuter Rail",
    dataSource: multiRegionDataUrls(
      PROVINCE_REGION_IDS,
      "commuter-rail.display.v1.geojson",
    ),
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    hasPointGeometry: true,
    style: {
      kind: "line",
      color: "#D55E00",
      weight: 2,
      legendLabel: "Commuter Rail",
    },
  },
  {
    id: "bus",
    label: "Bus",
    dataSource: [dataUrl("bus.display.v1.geojson")],
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    style: { kind: "line", color: "#CC79A7", weight: 3, legendLabel: "Bus" },
  },
] as const satisfies readonly Layer[];
