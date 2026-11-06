# `@karta/map`

Map rendering and UI components (React and Leaflet) for Karta, built on `@karta/core`, `@karta/react` and `@karta/theme`. It has no dependency on `@karta/app` or `@karta/web`. Components get their `DomainConfig` and `Layer` values from context or props, never from a hardcoded domain.

## What belongs here

| Export | Purpose |
|---|---|
| `DomainProvider({ domain, children })`, `useDomain()` | React context around `createRegistry` from `@karta/core` (`context/DomainContext.tsx`). `useDomain()` throws outside a `DomainProvider`. |
| `MapView` | The Leaflet map: basemap, choropleth and transit overlays from the active domain, area outline labels, feature selection with keyboard support, and fly-to for location search. Exported from the `@karta/map/MapView` subpath (see below). |
| `Legend`, `DesktopLegend`, `MobileLegend` | Legend entries for choropleth and transit layers, read from `useDomain()`. |
| `LocationSearchControl` | Debounced place search with keyboard navigation. Takes a `placeholder` and an optional `GeocoderProvider`, defaulting to OpenStreetMap Nominatim. |
| `FeatureBrowser` | Filterable list of every selectable feature, grouped by the domain's layers. The caller wires `onSelect` to its own selected-feature state. |
| `MeasurementControl`, `MeasurementLayer` | The distance and area tool inside `MapView`: the floating panel and the preview line or polygon. Driven by `MapView`'s `measurementTool`, `measurementPanelOpen` and `onMeasurementPanelClose` props. |
| UI primitives | `IconButton`, `SegmentedControl`, `ControlButton`, `ThemeToggle`, `BasemapToggle`, `SettingsMenu`. |
| Basemap registry | `constants/basemaps.ts`: `registerBasemap`, `getBasemapDefinition`, `getRegisteredBasemapIds`, `getBasemapTileSources`, `Basemap`, `BasemapDefinition`. |
| Other Leaflet utilities | `constants/mapStyles.ts` (`AREA_OUTLINE`) and `data/locationSearch.ts` (`fetchLocationSearchResults`, `fetchReverseGeocodeResult`, `nominatimGeocoderProvider`, `GeocoderProvider`, `LocationSearchResult`). |

`MapView` props worth knowing about:

- `bounds`, `ariaLabel` and `renderFeaturePopup` are required, so the map carries no region, accessible name or popup of its own.
- `locationContextMenu` (default `false`) opens a small menu on right-click or long-press that offers to reverse-geocode the point. It listens for Leaflet's `contextmenu` event, so double-tap-to-zoom doesn't trigger it, and it still opens over a selectable feature.

The registry ships five free, key-less basemaps. `positron`, `liberty` and `dark` are OpenFreeMap vector styles, drawn with MapLibre GL through `VectorBasemapLayer` and loaded only when selected. `satellite` and `topo` are Esri raster tiles. None of them switches style with the UI theme. Any consumer can register another raster or vector basemap.

## What doesn't belong here

- Domain-specific components such as a township popup or browser. They read properties (`nearestJobCenter`, `commuteMinutes` and so on) that a generic `Layer` doesn't have. Pass a `renderFeaturePopup` callback into `MapView` instead.
- Domain-specific accessible copy. `MapView` takes `ariaLabel` because what the map shows depends on the domain.
- The reference domain's data (`SPATIAL_APARTHEID_LEGACY_DOMAIN`, metros, townships). See `@karta/app`.

## Setup

Component styles are written in [vanilla-extract](https://vanilla-extract.style/) (`*.css.ts` files next to each component) and read the design tokens through `@karta/theme`'s typed contract. See "Styling implementation" in `docs/design-system.md` for the token model.

This package ships source with no build step, so `@vanilla-extract/css` is a runtime dependency. A host app must:

1. Register `vanillaExtractPlugin()` from `@vanilla-extract/vite-plugin` in its Vite config, or `.css.ts` imports won't resolve.

   ```ts
   // vite.config.ts
   import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

   export default defineConfig({
     plugins: [vanillaExtractPlugin() /* , ...your other plugins */],
   });
   ```

2. Define every `--md-sys-color-*`, `-shape-*`, `-elevation-*`, `--state-*` and `--motion-*` custom property that `@karta/theme`'s `vars` contract declares. The contract emits no CSS and has no fallbacks. `packages/web/src/index.css` is a complete example, including light and dark switching.

Apps built against the older CSS Modules version of this package need both steps.

## `MapView` and code-splitting

`MapView` is not re-exported from the main `@karta/map` entry point. It pulls in `leaflet` and `react-leaflet`, and an app that lazy-loads it needs a separate module boundary to keep them out of the main bundle. Import it from the `@karta/map/MapView` subpath:

```tsx
const MapView = lazy(async () => {
  const { MapView } = await import("@karta/map/MapView");
  return { default: MapView };
});
```

If `MapView`, or even its type, is imported from the main barrel, the bundler can reach it statically and folds it into the main chunk, which undoes the dynamic `import()`.

## Usage

```tsx
import { DomainProvider, Legend } from "@karta/map";
import { SPATIAL_APARTHEID_LEGACY_DOMAIN } from "@karta/app";

const MapView = lazy(async () => {
  const { MapView } = await import("@karta/map/MapView");
  return { default: MapView };
});

<DomainProvider domain={SPATIAL_APARTHEID_LEGACY_DOMAIN}>
  <MapView
    bounds={[[-27.15, 27.1], [-25.3, 28.75]]}
    ariaLabel="Map of South African township access to job centres"
    areas={townships}
    visibleLayerIds={["townships"]}
    renderFeaturePopup={(props) => <MyPopup properties={props} />}
  />
  <Legend mode="active" visibleLayerIds={["townships"]} />
</DomainProvider>;
```