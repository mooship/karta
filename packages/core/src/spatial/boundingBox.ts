import * as turf from "@turf/turf";
import type { BBox, FeatureCollection } from "geojson";

/**
 * Merges multiple bounding boxes into the smallest box containing all of them.
 * @param boxes - Bounding boxes as `[minLng, minLat, maxLng, maxLat]`.
 * @throws If `boxes` is empty.
 */
export function unionBoundingBoxes(boxes: readonly BBox[]): BBox {
  if (boxes.length === 0) {
    throw new Error("At least one bounding box is required");
  }

  return boxes.reduce<BBox>(
    (union, box) => [
      Math.min(union[0], box[0]),
      Math.min(union[1], box[1]),
      Math.max(union[2], box[2]),
      Math.max(union[3], box[3]),
    ],
    boxes[0] as BBox,
  );
}

/**
 * Computes the bounding box spanning every feature in `collection`.
 * @param collection - The collection to measure.
 * @returns `[minLng, minLat, maxLng, maxLat]`.
 */
export function featureCollectionBounds(collection: FeatureCollection): BBox {
  return turf.bbox(collection);
}
