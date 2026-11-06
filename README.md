# Karta

Karta is an SDK for public-interest map layer platforms. It provides a layer model that isn't tied to any domain, map rendering components and React hooks. `@karta/core`, `@karta/map` and `@karta/react` contain no geography or story of their own. The site has no accounts and no tracking beyond cookieless page views.

`packages/app` and `packages/web` are a reference implementation that uses the SDK end to end with one published domain, **Spatial apartheid legacy**. It maps the legacy of apartheid-era spatial planning in South African cities. Other domains, such as flood risk or public amenities, could use the same SDK. See [`docs/domains/spatial-apartheid-legacy.md`](docs/domains/spatial-apartheid-legacy.md) for what the domain covers and how its per-metro area data is classified.

## Documentation

| Document | Covers |
|---|---|
| [`docs/building-a-domain.md`](docs/building-a-domain.md) | Building a new domain on the SDK from scratch, with a second example |
| [`docs/adding-a-region.md`](docs/adding-a-region.md) | Extending the pipeline-backed `spatial-apartheid-legacy` domain to a new geography |
| [`docs/adding-a-locale.md`](docs/adding-a-locale.md) | Adding a UI language to `packages/web` |
| [`docs/domains/spatial-apartheid-legacy.md`](docs/domains/spatial-apartheid-legacy.md) | The reference domain, its scope and per-metro area classification |
| [`docs/design-system.md`](docs/design-system.md) | Colours, type, shape and map styling |
| [`data-pipeline/README.md`](data-pipeline/README.md) | Running the data pipeline |
| [`packages/core/README.md`](packages/core/README.md) | `@karta/core`: the layer model and geodata utilities |
| [`packages/map/README.md`](packages/map/README.md) | `@karta/map`: map rendering components and UI primitives |
| [`packages/react/README.md`](packages/react/README.md) | `@karta/react`: React hooks for dark mode and theme preference |
| [`packages/theme/README.md`](packages/theme/README.md) | `@karta/theme`: the typed design-token contract |
| [`packages/app/README.md`](packages/app/README.md) | `@karta/app`: the reference domain's data and constants |

## Stack

- A React and TypeScript SSR app: React Router framework mode on Vite, `react-leaflet`, Zustand, Zod and vanilla-extract.
- Six npm workspace packages: `@karta/core`, `@karta/map`, `@karta/react`, `@karta/theme`, `@karta/app` and `@karta/web`.
- An offline Node/TypeScript data pipeline. It uses public OSRM for routing and the Overpass API plus open data portals for transit, and needs no Docker or GDAL.
- Cloudflare Workers for edge rendering and asset delivery.

## Contributing

```bash
npm install
npm run dev -w @karta/web
```

[`CONTRIBUTING.md`](CONTRIBUTING.md) covers setup, project conventions and how to propose data changes. [`SECURITY.md`](SECURITY.md) explains how to report a suspected vulnerability privately. [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) sets expectations for behaviour in project spaces.

## Licence

Licensed under [AGPL-3.0](LICENSE). If you host a modified version, you must publish its source. See [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md) for data and software attributions and [`PRIVACY.md`](PRIVACY.md) for the privacy policy.