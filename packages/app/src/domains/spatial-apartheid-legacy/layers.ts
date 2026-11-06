import type { Layer } from "@karta/core";
import { getProvinceRegionIds, type RegionId } from "../../constants/regions";
import { getTownshipGroup } from "../../constants/townships";

/**
 * Region id this domain's Gauteng-only layers pull data from, typed against
 * `RegionId` (derived from `REGIONS`) rather than a bare string literal; if
 * `REGIONS` is ever renamed, this fails typechecking instead of `dataUrl`
 * silently pointing at a directory `data-pipeline` no longer writes.
 */
const GAUTENG_REGION_ID: RegionId = "gauteng";

/**
 * Every province-kind region id configured in `REGIONS`, in registry order.
 * @remarks Drives the `dataSource` of every layer whose data is published
 *   per-province (the township/area choropleths, `bus-rapid-transit`,
 *   `commuter-rail`); sourced from `getProvinceRegionIds()`
 *   (`../../constants/regions.ts`) rather than a hand-typed list, so a new
 *   `kind: "province"` region added to `REGIONS` (see
 *   `docs/adding-a-region.md`) flows into those layers automatically instead
 *   of requiring a matching hand-edit here.
 */
const PROVINCE_REGION_IDS: readonly RegionId[] = getProvinceRegionIds();

/**
 * Builds a single Gauteng-only `dataSource` URL.
 * @remarks Deliberately hardcoded to `GAUTENG_REGION_ID`; reserved for
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
 * `bus-rapid-transit` and `commuter-rail`; see
 * `data-pipeline/src/regions/gautengPipelineConfig.ts` and
 * `westernCapePipelineConfig.ts`). `MapView`'s `useLayerData` fetches every
 * URL in a layer's `dataSource` and merges the results, so listing more than
 * one region here is what makes a second region's transit features actually
 * appear on the map; see `docs/adding-a-region.md`.
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
  baseOpacity: 0.55,
  emphasisOpacity: 0.85,
  resolveEmphasis: resolveTownshipEmphasis,
} as const;

/**
 * Transit lines are told apart by pattern as well as colour: solid ink for
 * rapid rail, dashed ink for commuter rail, dotted grey for buses, and one
 * colour per BRT network. The BRT colours are neutral picks, not operator
 * branding. Each line sits on a paper-coloured casing so it reads on any
 * basemap.
 */
const INK_LINE = { color: "#1F1B16", darkColor: "#EDE6DA" } as const;
const INK_LINE_CASING = {
  color: "#F6F2E9",
  darkColor: "#16130F",
  width: 1.5,
} as const;
// BRT colours are mid-dark in both themes, so they keep a light casing.
const PAPER_CASING = { color: "#F6F2E9", width: 1.5 } as const;
const BRT_COLORS = {
  reaVaya: "#B5172D",
  aReYeng: "#0F6E6E",
  myCiTi: "#1D4E9E",
  ekurhuleni: "#6B4FA0",
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
 * spatial-burden score weighting the two together; see
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
        {
          max: 20,
          color: "#F3E3C3",
          darkColor: "#3A2A17",
          label: "Short (≤ 20 min)",
        },
        {
          max: 40,
          color: "#DDB06B",
          darkColor: "#6B4A22",
          label: "Moderate (21–40 min)",
        },
        {
          max: 60,
          color: "#B36F2A",
          darkColor: "#A8722F",
          label: "Long (41–60 min)",
        },
        {
          max: Number.POSITIVE_INFINITY,
          color: "#6B3A12",
          darkColor: "#E7B46B",
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
          color: "#BCD3E6",
          darkColor: "#274A66",
          label: "Near (≤ 1 km)",
        },
        {
          max: 3,
          color: "#7FA6C9",
          darkColor: "#3E75A8",
          label: "Moderate (1–3 km)",
        },
        {
          max: 8,
          color: "#3F6E9B",
          darkColor: "#5FA8DE",
          label: "Far (3–8 km)",
        },
        {
          max: Number.POSITIVE_INFINITY,
          color: "#173E63",
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
          color: "#D3C2EC",
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
    label: "Rapid rail",
    dataSource: [dataUrl("rapid-rail.display.v1.geojson")],
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    hasPointGeometry: true,
    style: {
      kind: "line",
      ...INK_LINE,
      weight: 3,
      legendLabel: "Rapid rail",
      casing: INK_LINE_CASING,
    },
  },
  {
    id: "bus-rapid-transit",
    label: "Bus rapid transit",
    dataSource: multiRegionDataUrls(
      PROVINCE_REGION_IDS,
      "bus-rapid-transit.display.v1.geojson",
    ),
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    style: {
      kind: "line",
      color: BRT_COLORS.reaVaya,
      weight: 3,
      legendLabel: "Bus rapid transit",
      casing: PAPER_CASING,
      colorClassification: {
        kind: "categorized",
        propertyKey: "network",
        stops: [
          {
            match: "A Re Yeng",
            value: BRT_COLORS.aReYeng,
            label: "A Re Yeng",
          },
          { match: "Rea Vaya", value: BRT_COLORS.reaVaya, label: "Rea Vaya" },
          {
            match: "Ekurhuleni IRPTN",
            value: BRT_COLORS.ekurhuleni,
            label: "Ekurhuleni IRPTN",
          },
          { match: "MyCiTi", value: BRT_COLORS.myCiTi, label: "MyCiTi" },
        ],
        fallback: BRT_COLORS.reaVaya,
      },
    },
  },
  {
    id: "commuter-rail",
    label: "Commuter rail",
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
      ...INK_LINE,
      weight: 2,
      legendLabel: "Commuter rail",
      dashArray: "10 4",
      casing: INK_LINE_CASING,
    },
  },
  {
    id: "bus",
    label: "Bus",
    dataSource: [dataUrl("bus.display.v1.geojson")],
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    style: {
      kind: "line",
      color: "#4F4A42",
      darkColor: "#BDB4A6",
      weight: 1.5,
      legendLabel: "Bus",
      dashArray: "2 3",
      casing: INK_LINE_CASING,
    },
  },
] as const satisfies readonly Layer[];
