# `@karta/app`

Data and constants for `spatial-apartheid-legacy`, the reference domain for Karta's SDK, built on the layer model in `@karta/core`.

## What belongs here

| Path | Contents |
|---|---|
| `domains/spatial-apartheid-legacy/` | `layers.ts`, `layerGroups.ts` and `index.ts`, which exports `SPATIAL_APARTHEID_LEGACY_DOMAIN`. The layers are the recognised township, nearest-transit and combined spatial-burden choropleths, plus one line layer per transit network. The domain's `story` appears as the Story tab in `@karta/web`. |
| `constants/metros.ts` | `METROS`: the nine Gauteng municipalities and the City of Cape Town, each with a `regionId`. |
| `constants/regions.ts` | `REGIONS`: the per-region output directories and data URLs for `gauteng` and `western-cape`. |
| `constants/townships.ts` | Included township-area groupings per metro. |
| `types/` | GeoJSON and transit contracts for this domain (`TownshipFeature`, `TownshipProperties`, transit layer ids). `types/genericLayer.ts` re-exports `Layer` and `LayerGroup` from `@karta/core`. |
| `domains/heritage-sites/` | A second, national domain (`HERITAGE_SITES_DOMAIN`): one hand-authored point layer of publicly documented anti-apartheid and democracy heritage sites, with no `data-pipeline` source. It shows that `DomainConfig` and `Layer` assume no region or metro. `packages/web` doesn't publish it. |

## What doesn't belong here

- Generic layer and style types, `createLayerConfig`, `createRegistry`, and the geodata fetch and schema utilities. Those are in `@karta/core`.
- Map rendering components and UI primitives (`@karta/map`).
- Generic React hooks (`@karta/react`).

## Usage

```ts
import { SPATIAL_APARTHEID_LEGACY_DOMAIN, METROS, REGIONS } from "@karta/app";
```