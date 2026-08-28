# `@karta/core`

Domain-agnostic layer model and geodata utilities for Karta. Has no dependency on `@karta/app`, `@karta/map`, `@karta/react`, `@karta/web`, or React — the first package extracted towards a reusable SDK for geospatial layer platforms beyond Karta's own reference domain.

## What belongs here

- **Layer/domain types** (`types/layer.ts`) — `Layer`, `LayerGroup`, `DomainConfig`, `DomainStory`, and every style config type (`ChoroplethLayerStyle`, `LineLayerStyle`, `PointLayerStyle`, `ColorBucket`, `LayerInteraction`, `LayerGroupSelectionMode`). `LineLayerStyle`/`PointLayerStyle` also accept an optional `Classification<T>` (`GraduatedClassification` for numeric ranges, `CategorizedClassification` for exact string match) on `colorClassification`/`weightClassification`/`radiusClassification`, for data-driven styling of any geometry kind — not just choropleth fill color. The flat `color`/`weight`/`radius` fields remain required as the fallback/no-classification value. `DomainConfig`'s `story` field (`DomainStory`, `{ title, body }`) is optional — a domain with nothing to say there simply omits it.
- **`resolveClassification(classification, properties)`** (`layers/classification.ts`) — resolves a feature's properties through a `Classification<T>` to its style output value; used internally by `createLayerConfig` and exported for direct use (e.g. custom legend rendering).
- **`createLayerConfig(layer, options?)`** (`layers/createLayerConfig.ts`) — converts a `Layer` descriptor into a Leaflet `pathOptions`/`styleFn` configuration. `options` is `{ noDataColor?, dark? }`: `noDataColor` is the CSS color for a choropleth feature with no value, and `dark` prefers each choropleth bucket's `darkColor` over `color` (see `ColorBucket`). Returns a `styleFn` for choropleth layers (resolving fill color through the same `resolveClassification` machinery, via an internal `buckets`-to-`GraduatedClassification` adapter) and for `line`/`point` layers that declare a classification; otherwise static `pathOptions`. `resolveThemedColor(color, darkColor, dark)` is the small shared "prefer darkColor when dark" rule this uses internally, also exported for direct use (e.g. `@karta/map`'s `Legend`, so a legend swatch always agrees with the fill it labels).
- **`createRegistry(domain)`** (`layers/createRegistry.ts`) — a read-only `getLayers`/`getLayer`/`getLayerGroups`/`getStory` accessor over a `DomainConfig`; `getStory()` returns `undefined` for a domain without one.
- **Geodata utils** (`data/`) — `fetchFeatureCollection` (caches successful results in-memory by URL, evicting the least-recently-used entry once the cache exceeds 50 entries; `clearFeatureCollectionCache()` resets it, mainly for tests), `mergeFeatureCollections`, and the Zod schemas in `geoJsonSchemas.ts` (`featureCollectionSchema` — including `GeometryCollection` — `polygonGeometrySchema`, `multiPolygonGeometrySchema`, `createFeatureCollectionParser`).

Every export is JSDoc-documented (TSDoc-compatible).

## What doesn't belong here

- React or Leaflet runtime rendering code (see `@karta/map`).
- Anything specific to the reference domain — job centres, township names, transit operator names, colour choices for a particular map (see `@karta/app`).
- Browser-only hooks like dark-mode/theme detection (see `@karta/react`).

## Usage

```ts
import { createRegistry, createLayerConfig } from "@karta/core";
import { SPATIAL_APARTHEID_LEGACY_DOMAIN } from "@karta/app";

const registry = createRegistry(SPATIAL_APARTHEID_LEGACY_DOMAIN);
const layer = registry.getLayer("townships");
const { styleFn } = createLayerConfig(layer);
```
