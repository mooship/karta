# `@karta/core`

The layer model and geodata utilities for Karta. It has no dependency on `@karta/app`, `@karta/map`, `@karta/react`, `@karta/web` or React. It was the first package split out of the app on the way to a reusable SDK.

## What belongs here

| Export | Where | Purpose |
|---|---|---|
| Layer and domain types | `types/layer.ts` | `Layer`, `LayerGroup`, `DomainConfig`, `DomainStory` and the style config types (`ChoroplethLayerStyle`, `LineLayerStyle`, `PointLayerStyle`, `ColorBucket`, `LayerInteraction`, `LayerGroupSelectionMode`). |
| `resolveClassification(classification, properties)` | `layers/classification.ts` | Resolves a feature's properties through a `Classification<T>` to a style value. |
| `createLayerConfig(layer, options?)` | `layers/createLayerConfig.ts` | Turns a `Layer` into Leaflet `pathOptions` or a `styleFn`. |
| `resolveThemedColor(color, darkColor, dark)` | `layers/createLayerConfig.ts` | Picks `darkColor` in dark mode, so legend swatches match the fills they label. |
| `createRegistry(domain)` | `layers/createRegistry.ts` | Read-only `getLayers`, `getLayer`, `getLayerGroups` and `getStory` over a `DomainConfig`. |
| Geodata utilities | `data/` | `fetchFeatureCollection` (with a 50-entry LRU cache), `mergeFeatureCollections`, `featureCollectionToCsv` and the Zod schemas in `geoJsonSchemas.ts`. |
| Spatial primitives | `spatial/` | Turf and proj4 helpers: nearest-feature distance, point in polygon, bounding boxes, line and area measurement, and reprojection to WGS84. |
| `partitionSettled(results)` | `async/partitionSettled.ts` | Splits `Promise.allSettled` results into values and errors, so a caller can render whichever sources loaded. |

A few details worth knowing:

- `LineLayerStyle` and `PointLayerStyle` accept an optional `Classification<T>` on `colorClassification`, `weightClassification` and `radiusClassification`, so any geometry kind can be styled from its data. The flat `color`, `weight` and `radius` fields are still required as the fallback.
- `LineLayerStyle` also takes an optional `dashArray` and `casing`, so line layers can be told apart by pattern as well as colour.
- `story` is optional on `DomainConfig`.
- `featureCollectionToCsv` writes one row per feature and one column per property, plus `centroid_lon` and `centroid_lat` columns.

## What doesn't belong here

- React or Leaflet rendering code (see `@karta/map`).
- Anything specific to the reference domain, such as job centres, township names, transit operators or a particular map's colours (see `@karta/app`).
- Browser-only hooks like dark-mode and theme detection (see `@karta/react`).

## Usage

```ts
import { createRegistry, createLayerConfig } from "@karta/core";
import { SPATIAL_APARTHEID_LEGACY_DOMAIN } from "@karta/app";

const registry = createRegistry(SPATIAL_APARTHEID_LEGACY_DOMAIN);
const layer = registry.getLayer("townships");
const { styleFn } = createLayerConfig(layer);
```