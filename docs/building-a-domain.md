# Building a new domain

`@karta/core`, `@karta/map` and `@karta/react` know nothing about Gauteng, townships or transit routes. Those live in `@karta/app`, the first domain built on the SDK. This guide builds a second domain from scratch using only what the SDK packages export, so you don't have to work the pattern out from the one existing example.

The example domain is public amenities: how far each neighbourhood is from its nearest clinic, plus the bus routes serving the area.

A second domain is also checked in: `packages/app/src/domains/heritage-sites/` (`HERITAGE_SITES_DOMAIN`), a single national point layer of publicly documented heritage sites. It has no `data-pipeline` source and is not wired into `packages/web`. It is a smaller, working example; its `index.ts` shows how little a domain needs.

## 1. Define a `DomainConfig`

A domain is a `DomainConfig` (`{ layers, layerGroups, story? }`) built from the `Layer`/`LayerGroup`/`LayerStyleConfig`/`DomainStory` types in `@karta/core`. Nothing here is web- or Leaflet-specific.

Mirror the file layout `@karta/app` uses for `spatial-apartheid-legacy`: a `layers.ts`, a `layerGroups.ts`, and an `index.ts` that assembles them into one exported constant.

```ts
// domains/public-amenities/layers.ts
import type { Layer } from "@karta/core";

export const PUBLIC_AMENITIES_LAYERS: Layer[] = [
  {
    id: "clinic-distance",
    label: "Distance to nearest clinic",
    description: "Straight-line distance from each neighbourhood to its nearest public clinic.",
    dataSource: ["/data/public-amenities/neighbourhoods.geojson"],
    companionSource: "/data/public-amenities/neighbourhood-boundaries.geojson",
    geometryKind: "choropleth",
    defaultVisible: true,
    available: true,
    interaction: { selectable: true, labelField: "name" },
    style: {
      kind: "choropleth",
      propertyKey: "clinicDistanceKm",
      buckets: [
        { max: 1, color: "#F3E3C3", label: "Near (≤ 1 km)" },
        { max: 3, color: "#DDB06B", label: "Moderate (1–3 km)" },
        { max: Number.POSITIVE_INFINITY, color: "#B36F2A", label: "Far (> 3 km)" },
      ],
      baseOpacity: 0.4,
    },
  },
  {
    id: "bus-routes",
    label: "Bus routes",
    dataSource: ["/data/public-amenities/bus-routes.geojson"],
    geometryKind: "line",
    defaultVisible: false,
    available: true,
    style: { kind: "line", color: "#3673B8", weight: 3, legendLabel: "Bus routes" },
  },
];
```

```ts
// domains/public-amenities/layerGroups.ts
import type { LayerGroup } from "@karta/core";

export const PUBLIC_AMENITIES_LAYER_GROUPS: LayerGroup[] = [
  {
    id: "transit",
    title: "Transit",
    selectionMode: "independent",
    layerIds: ["bus-routes"],
  },
];
```

```ts
// domains/public-amenities/index.ts
import { PUBLIC_AMENITIES_LAYER_GROUPS } from "./layerGroups";
import { PUBLIC_AMENITIES_LAYERS } from "./layers";

export const PUBLIC_AMENITIES_DOMAIN = {
  layers: PUBLIC_AMENITIES_LAYERS,
  layerGroups: PUBLIC_AMENITIES_LAYER_GROUPS,
};

export { PUBLIC_AMENITIES_LAYER_GROUPS } from "./layerGroups";
export { PUBLIC_AMENITIES_LAYERS } from "./layers";
```

`DomainConfig` only requires `layers` and `layerGroups`. `story` (`{ title, body }`) is optional "why this map exists" copy. Leave it out if you have nothing to say, and `getStory()` (on both `createRegistry(domain)` and `useDomain()`) returns `undefined`. `@karta/web` shows a Story tab next to the layer toggles only when a story is present. You can add fields beyond what `DomainConfig` requires (`SPATIAL_APARTHEID_LEGACY_DOMAIN` also has an `id`); `createRegistry` and `useDomain()` ignore anything other than `layers`, `layerGroups` and `story`.

A `Layer`'s `style.kind` (`"choropleth"`, `"line"` or `"point"`) sets both its Leaflet rendering (through `createLayerConfig`, below) and its `Legend` entry, so match it to the geometry in your GeoJSON. `line` and `point` styles also accept an optional `colorClassification` for per-feature colour from the data. The `spatial-apartheid-legacy` bus rapid transit layer uses it to give each operator's routes their own colour. `line` styles can set a `dashArray` and a `casing` too, so a line layer can be told apart by pattern and not by colour alone. See [`packages/core/README.md`](../packages/core/README.md) for the full type reference.

## 2. Wire it up

[`packages/core/README.md`](../packages/core/README.md) covers `createRegistry` and `createLayerConfig`. `createRegistry(domain)` gives you `getLayers()`, `getLayer(id)` and `getLayerGroups()`, which work outside React (in the data pipeline, for example). `@karta/map`'s `DomainProvider` and `useDomain()` ([`packages/map/README.md`](../packages/map/README.md)) do the same through context, so components don't need the domain passed down as props. `createLayerConfig(layer)` turns a `Layer` into the Leaflet `pathOptions` or `styleFn` that `MapView` and any custom rendering use.

```ts
import { createLayerConfig, createRegistry } from "@karta/core";
import { PUBLIC_AMENITIES_DOMAIN } from "./domains/public-amenities";

const registry = createRegistry(PUBLIC_AMENITIES_DOMAIN);
const layer = registry.getLayer("clinic-distance");
const { styleFn } = createLayerConfig(layer);
```

## 3. Render it

`MapView` and `Legend` (from `@karta/map`) resolve their layers from the nearest `DomainProvider`, so pass your domain once at the root. `MapView` has no built-in bounds, accessible name or popup component; you supply all three.

```tsx
import { DomainProvider, Legend } from "@karta/map";
import { PUBLIC_AMENITIES_DOMAIN } from "./domains/public-amenities";

const MapView = lazy(async () => {
  const { MapView } = await import("@karta/map/MapView");
  return { default: MapView };
});

function App() {
  return (
    <DomainProvider domain={PUBLIC_AMENITIES_DOMAIN}>
      <MapView
        bounds={[[-34.1, 18.3], [-33.8, 18.7]]}
        ariaLabel="Map of clinic access and bus routes near Cape Town"
        areas={neighbourhoods}
        areaBoundaries={neighbourhoodBoundaries}
        visibleLayerIds={["clinic-distance"]}
        renderFeaturePopup={(props) => <NeighbourhoodPopup properties={props} />}
      />
      <Legend mode="active" visibleLayerIds={["clinic-distance"]} />
    </DomainProvider>
  );
}
```

`areas` and `areaBoundaries` are plain GeoJSON `Feature[]` arrays that you fetch and keep in your own state (see below). `MapView` doesn't fetch the choropleth data itself. It only fetches the `line` and `point` layers listed in `visibleLayerIds`, through its internal `useLayerData`.

## 4. Handle the data

Host GeoJSON files matching each layer's `dataSource` URLs. `@karta/core` provides validation and merging (see [`packages/core/README.md`](../packages/core/README.md)), so a malformed dataset fails loudly instead of rendering nonsense:

- `fetchFeatureCollection(url, schema?, signal?)` fetches and validates against a Zod schema, defaulting to the generic `featureCollectionSchema`. Write your own schema with `createFeatureCollectionParser` if your properties need stricter checks. `@karta/app`'s `townshipFeatureCollectionSchema` is an example of extending the generic schema with domain-specific required fields.
- `mergeFeatureCollections(collections)` concatenates several `FeatureCollection`s' features into one, for a layer backed by more than one source file.

```ts
import { fetchFeatureCollection, mergeFeatureCollections } from "@karta/core";

const collections = await Promise.all(
  PUBLIC_AMENITIES_DOMAIN.layers
    .find((l) => l.id === "clinic-distance")!
    .dataSource.map((url) => fetchFeatureCollection(url)),
);
const neighbourhoods = mergeFeatureCollections(collections).features;
```

## 5. What you don't need to touch

`@karta/map` and `@karta/react` are used as they are, with no fork or subclassing. A new domain needs only:

- A `DomainConfig` (this guide's subject).
- Domain-specific popup or browser UI, passed in through `MapView`'s `renderFeaturePopup` prop. These read properties (like `clinicDistanceKm` above) that a generic `Layer` doesn't have, so they stay in your app. See "What doesn't belong here" in `@karta/map`'s README.

The same `MapView`, `Legend`, `DomainProvider`, theme hooks and basemap registry render any domain built this way.
