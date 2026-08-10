import {
  getTownshipAreaDefinition,
  TOWNSHIP_AREA_DEFINITIONS,
  type TownshipAreaLabelPriority,
  type TownshipAreaSelectionBasis,
} from "@karta/app";
import * as turf from "@turf/turf";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type { NormalizedTownship } from "./adapters/boundaries";

/** Per-feature properties for a dissolved township-area outline polygon. */
interface TownshipAreaProperties {
  id: string;
  name: string;
  labelPriority: TownshipAreaLabelPriority;
  labelOffset?: [number, number];
  selectionBasis: TownshipAreaSelectionBasis;
  /** Number of Census sub-place boundaries dissolved into this one area outline. */
  subPlaceCount: number;
}

/**
 * Groups normalized township sub-place boundaries by their
 * `TOWNSHIP_AREA_DEFINITIONS` area (via `getTownshipAreaDefinition`) and
 * dissolves each group's polygons into one combined outline per area, for
 * `MapView`'s area-boundary label layer (`companionSource`).
 */
export function createTownshipAreas(
  townships: NormalizedTownship[],
): FeatureCollection<Polygon | MultiPolygon, TownshipAreaProperties> {
  const features = TOWNSHIP_AREA_DEFINITIONS.flatMap((definition) => {
    const members = townships.filter(
      (township) =>
        getTownshipAreaDefinition(township.name, township.id)?.id ===
        definition.id,
    );
    const polygons = members.map((township) => turf.feature(township.geometry));
    if (polygons.length === 0) {
      return [];
    }

    const dissolved =
      polygons.length === 1
        ? polygons[0]
        : turf.union(turf.featureCollection(polygons));
    /* v8 ignore next 3 -- unreachable with well-formed input; turf.union only returns null for a degenerate (self-cancelling) collection, which valid township polygons never produce */
    if (!dissolved) {
      return [];
    }

    const labelOffset: [number, number] | undefined = definition.labelOffset
      ? [definition.labelOffset[0], definition.labelOffset[1]]
      : undefined;

    return [
      {
        ...dissolved,
        properties: {
          id: definition.id,
          name: definition.name,
          labelPriority: definition.labelPriority,
          labelOffset,
          selectionBasis: definition.selectionBasis,
          subPlaceCount: members.length,
        },
      },
    ];
  });

  return { type: "FeatureCollection", features };
}

/**
 * Checks that every `TOWNSHIP_AREA_DEFINITIONS` entry matched at least one
 * sub-place in `areas` (as produced by `createTownshipAreas`).
 * @throws Listing every area id that matched no sub-place. `createTownshipAreas`
 *   itself just omits a zero-match area rather than failing, so without this
 *   check a `subPlaceNamePrefixes`/`censusMainPlaceCodes` typo — or a Census
 *   2011 sub-place that was renamed, merged, or never existed under the
 *   expected name — would silently drop an area from the published map with
 *   zero features and no error. An area known to have no Census 2011
 *   boundary of its own (see `docs/data/*-area-classification.md`'s
 *   "Limitations" sections) should be removed from `TOWNSHIP_AREA_DEFINITIONS`
 *   rather than left in place to fail this check.
 */
export function assertNoUnmatchedTownshipAreas(
  areas: FeatureCollection<Polygon | MultiPolygon, TownshipAreaProperties>,
): void {
  const matchedIds = new Set(
    areas.features.map((feature) => feature.properties.id),
  );
  const unmatched = TOWNSHIP_AREA_DEFINITIONS.filter(
    (definition) => !matchedIds.has(definition.id),
  );
  if (unmatched.length > 0) {
    throw new Error(
      `Township areas with zero matched sub-places: ${unmatched.map((definition) => definition.id).join(", ")}`,
    );
  }
}
