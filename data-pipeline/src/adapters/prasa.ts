import type { TransitLayerFeatureCollection } from "@karta/app";
import { fetchOverpass, type OverpassResponse } from "./gautrain";
import { normalizeWayNodeTransitOverpass } from "./overpassNormalizers";

// operator/network matching is a case-insensitive substring regex ("PRASA"/"Metrorail"),
// not a fixed region name, so this same query matches PRASA/Metrorail tags in any region
// (e.g. Gauteng's "Metrorail Gauteng" and the Western Cape's "Metrorail Western Cape")
// — this is why fetchPrasaRail below is reused unmodified by both the Gauteng and
// Western Cape pipeline configs rather than needing a per-region query.
function prasaQuery(bbox: string): string {
  return `
[out:json][timeout:60];
(
  relation["route"="train"]["operator"~"PRASA|Metrorail",i](${bbox});
  relation["route"="train"]["network"~"Metrorail",i](${bbox});
)->.routes;
(
  way(r.routes);
  way["railway"="rail"]["operator"~"PRASA|Metrorail",i](${bbox});
  node["railway"="station"]["network"~"Metrorail",i](${bbox});
  node["railway"="station"]["operator"~"PRASA|Metrorail",i](${bbox});
);
out geom;
`;
}

/** Normalizes a PRASA/Metrorail Overpass query's rail ways and station nodes into `LineString`/`Point` features. */
export function normalizePrasaOverpass(
  raw: OverpassResponse,
): TransitLayerFeatureCollection {
  return normalizeWayNodeTransitOverpass(raw, "PRASA");
}

/**
 * Fetches PRASA/Metrorail rail ways and station nodes within `bbox` via Overpass.
 * @remarks Region-agnostic (see `prasaQuery`'s comment) — reused as-is by both the
 *   Gauteng and Western Cape pipeline configs.
 */
export async function fetchPrasaRail(bbox: string): Promise<OverpassResponse> {
  return fetchOverpass(prasaQuery(bbox));
}
