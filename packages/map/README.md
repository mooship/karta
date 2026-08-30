# `@karta/map`

Generic map rendering and UI components (React + Leaflet) for Karta, built on `@karta/core`, `@karta/react`, and `@karta/theme`. Has no dependency on `@karta/app` or `@karta/web` — components take a `DomainConfig`/`Layer` values via context or props instead of a hardcoded domain.

## What belongs here

- **`DomainProvider({ domain, children })` / `useDomain(): DomainRegistry`** (`context/DomainContext.tsx`) — a React context wrapping `createRegistry` from `@karta/core`. Any component that calls `useDomain()`, directly or transitively, must be rendered inside a `DomainProvider`; `useDomain()` throws otherwise.
- **`MapView`** — the Leaflet map itself: tile basemap, choropleth and transit overlays resolved from the active `DomainProvider`, area-boundary-style outline labels, feature selection/keyboard interaction, and location-search fly-to behaviour. Takes a `bounds` prop (no baked-in region bounds), a required `ariaLabel` prop (no hardcoded accessible name), and a `renderFeaturePopup` callback (no hardcoded popup component), so it stays domain-agnostic. An optional `locationContextMenu` prop (default `false`) opens a small context menu — offering to reverse-geocode that point — on right-click (desktop) or long-press (mobile), via the `LocationContextMenu` sub-component; it listens for Leaflet's `contextmenu` event rather than `click`, so it doesn't fire as a side effect of double-tap-to-zoom, and still opens over a selectable feature rather than losing to that feature's own tap-to-select popup. Exported from a dedicated `@karta/map/MapView` subpath — see below.
- **`Legend`, `DesktopLegend`, `MobileLegend`** — choropleth and transit layer legend entries, resolved from `useDomain()`.
- **`LocationSearchControl`** — a debounced, keyboard-navigable place search box, with a configurable `placeholder` and an optional `provider` (a `GeocoderProvider`), defaulting to `nominatimGeocoderProvider` (OpenStreetMap Nominatim).
- **`FeatureBrowser`** — a filterable list of every selectable map feature (from `MapView`'s `onSelectableFeaturesChange`), grouped and ordered by the active domain's layers via `useDomain()`. Domain-agnostic, like `Legend`/`MapView`; a caller wires its `onSelect` to its own selected-feature state, which `MapView`'s `SelectedFeatureHighlight` turns into a fly-to-and-open-popup.
- **`MeasurementControl` / `MeasurementLayer`** — a distance/area measuring tool built into `MapView` itself (not a standalone export consumed on its own): `MeasurementControl` is the floating panel UI, `MeasurementLayer` draws the click-to-add-point preview line/polygon, both driven by `MapView`'s `measurementTool`/`measurementPanelOpen`/`onMeasurementPanelClose` props and backed by `@karta/core`'s `measureLineDistance` and area functions.
- **UI primitives** — `IconButton`, `SegmentedControl`, `ControlButton`, `ThemeToggle`, `BasemapToggle`, `SettingsMenu`.
- **Leaflet-specific utilities** — `constants/basemaps.ts` (an extensible basemap registry: `registerBasemap`, `getBasemapDefinition`, `getRegisteredBasemapIds`, `getBasemapTileSources`, `Basemap`, `BasemapDefinition`; ships `positron`/`liberty`/`dark` (OpenFreeMap, `"vector"`-kind basemaps rendered via `VectorBasemapLayer` — MapLibre GL, lazy-loaded on selection)/`satellite`/`topo` (both Esri World Imagery/Topographic raster basemaps) by default — all five are free, key-less tile services, and none auto-swaps style with the UI's light/dark theme; any consumer can `registerBasemap` a further raster or vector one), `constants/mapStyles.ts` (`AREA_OUTLINE`), `data/locationSearch.ts` (`fetchLocationSearchResults`, `fetchReverseGeocodeResult`, `nominatimGeocoderProvider`, `GeocoderProvider`, `LocationSearchResult`).

## What doesn't belong here

- Domain-specific components like a township popup or township browser — those read domain-specific properties (`nearestJobCenter`, `commuteMinutes`, …) that don't exist on a generic `Layer`. Pass a `renderFeaturePopup` callback into `MapView` instead.
- Domain-specific accessible copy — `MapView` takes a required `ariaLabel` prop rather than a baked-in accessible name, since what the map depicts is domain-specific.
- The reference domain's data (`SPATIAL_APARTHEID_LEGACY_DOMAIN`, metros, townships) — see `@karta/app`.

## Styling

Every component's styles are written in [vanilla-extract](https://vanilla-extract.style/)
(`*.css.ts`, colocated beside each component) and reach the M3 design
tokens through `@karta/theme`'s typed contract — see `docs/design-system.md`'s
"Styling implementation" section in the root of this repo for the full
token model. Because this package ships source with no build step,
`@vanilla-extract/css` is a real runtime `dependencies` entry, not an
implementation detail hidden behind a build artifact: **any host
application embedding `@karta/map` components must register
`@vanilla-extract/vite-plugin`'s `vanillaExtractPlugin()` in its own Vite
config**, or `.css.ts` imports will fail to resolve. This is a breaking
integration change for any consumer of an earlier, CSS-Modules-based
version of this package.

```ts
// vite.config.ts
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [vanillaExtractPlugin() /* , ...your other plugins */],
});
```

A consuming app must also define every `--md-sys-color-*`/`-shape-*`/
`-elevation-*`/`--state-*`/`--motion-*` custom property `@karta/theme`'s
`vars` contract declares (see `packages/web/src/index.css` for a complete
reference implementation, including light/dark switching) — the contract
itself emits no CSS and has no fallback values.

## `MapView` and code-splitting

`MapView` is **not** re-exported from the package's main entry point (`@karta/map`) — it pulls in `leaflet` and `react-leaflet`, and apps that lazy-load it to keep that out of their main bundle need a dedicated module boundary. Import it from the `@karta/map/MapView` subpath:

```tsx
const MapView = lazy(async () => {
  const { MapView } = await import("@karta/map/MapView");
  return { default: MapView };
});
```

Importing `MapView` (even just its type) from the main `@karta/map` barrel alongside other components makes it statically reachable from that barrel's whole module graph, which defeats the point of a dynamic `import()` — bundlers will fold it into the main chunk anyway.

## Usage

```tsx
import { DomainProvider, Legend, MapView } from "@karta/map";
import { SPATIAL_APARTHEID_LEGACY_DOMAIN } from "@karta/app";

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
