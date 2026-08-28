import type { TransitLayerFeatureCollection } from "@karta/app";
import { fetchOverpass, type OverpassResponse } from "./gautrain";
import { normalizeRelationTransitOverpass } from "./overpassNormalizers";

// MyCiTi tags network on the route RELATION (standard OSM public-transport
// route-relation convention, same as Rea Vaya), so this mirrors reaVaya.ts's
// pattern rather than gautrain.ts's way-tag pattern.
function myCitiQuery(bbox: string): string {
  return `
[out:json][timeout:60];
relation["route"="bus"]["network"~"MyCiTi",i](${bbox});
out geom;
`;
}

/** Normalizes a MyCiTi Overpass query's route relations into `LineString` features. */
export function normalizeMyCitiOverpass(
  raw: OverpassResponse,
): TransitLayerFeatureCollection {
  return normalizeRelationTransitOverpass(raw, "MyCiTi");
}

/** Fetches MyCiTi route relations within `bbox` via Overpass. */
export async function fetchMyCitiRoutes(
  bbox: string,
): Promise<OverpassResponse> {
  return fetchOverpass(myCitiQuery(bbox));
}
