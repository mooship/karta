# Spatial apartheid legacy

This is the reference domain for the Karta SDK and the one the published app uses. See the root [`README.md`](../../README.md) for the SDK.

## What it maps

This domain maps apartheid-era spatial planning legacy in South African cities. It shows recognised township areas, formal transit routes and modelled car time to selected job centres in one combined view. The car layer is a baseline spatial proxy, not an observed commute or a measure of public-transport access.

The current scope is two regions, each in one combined regional layer. Gauteng covers City of Tshwane, City of Johannesburg, City of Ekurhuleni, Emfuleni, Midvaal, Lesedi, Mogale City, Rand West City and Merafong City. Western Cape covers City of Cape Town. It uses Stats SA Census 2011 boundaries, modelled OSRM car routing to each municipality's selected job centres, and transit overlays from Gautrain rail, Gautrain Bus, PRASA rail, A Re Yeng, Rea Vaya and MyCiTi. Route geometry shows where formal transit runs. It does not show service frequency, reliability, waiting, transfers or jobs reachable. Other South African metros, such as Durban, are not included yet.

## Why

Under apartheid, townships were deliberately separated from economic centres by distance and buffer strips of highways, industrial zoning or vacant land. That geography did not disappear in 1994. The app maps that structure and states what its current data can't show. The intended main accessibility measure is the number of jobs reachable within 45, 60 and 90 minutes by public transport, including walking, waiting and transfers.

A shorter version of this framing is the domain's `story` (`SPATIAL_APARTHEID_LEGACY_DOMAIN.story` in `packages/app`), shown in the app's Story tab next to the layer toggles.

## Area classification by metro

How included township and settlement areas are selected and displayed, one doc per metro:

- [`docs/data/tshwane-area-classification.md`](../data/tshwane-area-classification.md)
- [`docs/data/johannesburg-area-classification.md`](../data/johannesburg-area-classification.md)
- [`docs/data/ekurhuleni-area-classification.md`](../data/ekurhuleni-area-classification.md)
- [`docs/data/emfuleni-area-classification.md`](../data/emfuleni-area-classification.md)
- [`docs/data/midvaal-area-classification.md`](../data/midvaal-area-classification.md)
- [`docs/data/lesedi-area-classification.md`](../data/lesedi-area-classification.md)
- [`docs/data/mogale-city-area-classification.md`](../data/mogale-city-area-classification.md)
- [`docs/data/rand-west-city-area-classification.md`](../data/rand-west-city-area-classification.md)
- [`docs/data/merafong-city-area-classification.md`](../data/merafong-city-area-classification.md)
- [`docs/data/cape-town-area-classification.md`](../data/cape-town-area-classification.md)

## Related

- [`packages/app/README.md`](../../packages/app/README.md): `@karta/app`, the data and constants for this domain
- [`data-pipeline/README.md`](../../data-pipeline/README.md): running the pipeline that produces this domain's GeoJSON
- [`docs/design-system.md`](../design-system.md): the app's colours, type, map styling and shared UI primitives
