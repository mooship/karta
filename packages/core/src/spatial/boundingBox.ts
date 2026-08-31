import { bbox } from "@turf/bbox";
import type { BBox, FeatureCollection } from "geojson";

/**
 * Whether `box` already represents an antimeridian-crossing extent, per the
 * usual `[minLng, minLat, maxLng, maxLat]` convention of using `minLng >
 * maxLng` to mean "wraps through ±180°" rather than an invalid box.
 */
function isAntimeridianCrossing(box: BBox): boolean {
  return box[0] > box[2];
}

/** Wraps a longitude computed in "unwrapped" (possibly >180 or <-180) space back into [-180, 180]. */
function normalizeLongitude(longitude: number): number {
  if (longitude > 180) {
    return longitude - 360;
  }
  if (longitude < -180) {
    return longitude + 360;
  }
  return longitude;
}

/** `box`'s own unwrapped max longitude: `maxLng + 360` if it already crosses the antimeridian, otherwise `maxLng` as-is. */
function unwrappedMaxLngOf(box: BBox): number {
  return isAntimeridianCrossing(box) ? box[2] + 360 : box[2];
}

/** The result of widening a running `[min, max]` range by a further `[boxMin, boxMax]` pair, plus the resulting width for comparing candidate widenings. */
function widen(
  curMin: number,
  curMax: number,
  boxMin: number,
  boxMax: number,
): { min: number; max: number; width: number } {
  const min = Math.min(curMin, boxMin);
  const max = Math.max(curMax, boxMax);
  return { min, max, width: max - min };
}

/**
 * Merges multiple bounding boxes into the smallest box containing all of them.
 * @param boxes - Bounding boxes as `[minLng, minLat, maxLng, maxLat]`.
 * @throws If `boxes` is empty.
 * @remarks Antimeridian-aware: an input box already crossing ±180°
 *   (`minLng > maxLng`) is unwrapped into a continuous longitude space
 *   (`maxLng + 360`) before merging, and a non-crossing box is merged in
 *   whichever of its as-is or +360-shifted form yields the narrower running
 *   union — the standard trick for treating longitude as a circle rather
 *   than a line, so two boxes that sit just either side of ±180° (e.g.
 *   `[170, …, 175, …]` and `[-175, …, -170, …]`) union to a sensible
 *   crossing box (`[170, …, -170, …]`) instead of the naive, globe-spanning
 *   `[-175, …, 175, …]` a plain min/max reduction would produce. The final
 *   longitude is normalized back into [-180, 180] (possibly still crossing)
 *   before returning.
 */
export function unionBoundingBoxes(boxes: readonly BBox[]): BBox {
  if (boxes.length === 0) {
    throw new Error("At least one bounding box is required");
  }

  const first = boxes[0] as BBox;
  let minLat = first[1];
  let maxLat = first[3];
  let unwrappedMinLng = first[0];
  let unwrappedMaxLng = unwrappedMaxLngOf(first);

  for (let index = 1; index < boxes.length; index++) {
    const box = boxes[index] as BBox;
    minLat = Math.min(minLat, box[1]);
    maxLat = Math.max(maxLat, box[3]);

    if (isAntimeridianCrossing(box)) {
      unwrappedMinLng = Math.min(unwrappedMinLng, box[0]);
      unwrappedMaxLng = Math.max(unwrappedMaxLng, unwrappedMaxLngOf(box));
      continue;
    }

    const asIs = widen(unwrappedMinLng, unwrappedMaxLng, box[0], box[2]);
    const shifted = widen(
      unwrappedMinLng,
      unwrappedMaxLng,
      box[0] + 360,
      box[2] + 360,
    );

    ({ min: unwrappedMinLng, max: unwrappedMaxLng } =
      shifted.width < asIs.width ? shifted : asIs);
  }

  return [
    normalizeLongitude(unwrappedMinLng),
    minLat,
    normalizeLongitude(unwrappedMaxLng),
    maxLat,
  ];
}

/**
 * Computes the bounding box spanning every feature in `collection`.
 * @param collection - The collection to measure.
 * @returns `[minLng, minLat, maxLng, maxLat]`.
 * @throws If `collection` has no features — otherwise Turf's `bbox` silently
 *   returns `[Infinity, Infinity, -Infinity, -Infinity]`, matching
 *   {@link unionBoundingBoxes}'s own throw for empty input.
 */
export function featureCollectionBounds(collection: FeatureCollection): BBox {
  if (collection.features.length === 0) {
    throw new Error("At least one feature is required");
  }
  return bbox(collection);
}
