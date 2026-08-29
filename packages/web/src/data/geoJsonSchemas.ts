import { multiPolygonGeometrySchema, polygonGeometrySchema } from "@karta/core";
import * as z from "zod/mini";

const townshipGeometrySchema = z.union([
  polygonGeometrySchema,
  multiPolygonGeometrySchema,
]);

const townshipPropertiesSchema = z.looseObject({
  id: z.string(),
  name: z.string(),
  population: z.optional(z.number()),
  commuteMinutes: z.nullable(z.number()),
  nearestJobCenter: z.string(),
  distanceKm: z.nullable(z.number()),
  nearestTransitKm: z.optional(z.nullable(z.number())),
  spatialBurdenScore: z.optional(z.nullable(z.number())),
});

/**
 * Validates a township choropleth `FeatureCollection`: `@karta/core`'s
 * `polygonGeometrySchema`/`multiPolygonGeometrySchema` for geometry, paired
 * with the `TownshipProperties` shape (see `@karta/app`) rather than
 * `@karta/core`'s own open-ended `featureCollectionSchema`, since a
 * township feature's properties are known and worth validating precisely.
 */
export const townshipFeatureCollectionSchema = z.looseObject({
  type: z.literal("FeatureCollection"),
  features: z.array(
    z.looseObject({
      type: z.literal("Feature"),
      properties: townshipPropertiesSchema,
      geometry: townshipGeometrySchema,
    }),
  ),
});
