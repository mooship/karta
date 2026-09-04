# Data Pipeline

Offline scripts that produce the static GeoJSON files served by the web app. Not an npm workspace — run manually.

## Run

```bash
cd data-pipeline
npm install
npm run run
```

Runs a build for every `province`-kind region in `@karta/app`'s `REGIONS` registry (currently `gauteng` and `western-cape`) via `runAllProvinceRegions()`. To build a single region instead, pass `--region <id>`:

```bash
npm run run -- --region gauteng
```

Each region build (`runRegion(regionId)`) loops over the `METROS` tagged with that `regionId` (currently the nine Gauteng municipalities — Tshwane, Johannesburg, Ekurhuleni, Emfuleni, Midvaal, Lesedi, Mogale City, Rand West City, and Merafong City — for `gauteng`, and City of Cape Town for `western-cape`) to fetch and process each metro's boundaries and job-center routing, then writes a combined output to `packages/web/public/data/<regionId>/`.

Every region publishes display-optimized GeoJSON files only, always
including `townships.display.v1.geojson` and `township-areas.display.v1.geojson`,
plus one file per transit layer its `RegionPipelineConfig.sources` declares.
`gauteng` produces all four transit layers — `rapid-rail.display.v1.geojson`,
`bus-rapid-transit.display.v1.geojson`, `commuter-rail.display.v1.geojson`,
and `bus.display.v1.geojson`. `western-cape` produces only
`bus-rapid-transit.display.v1.geojson` (MyCiTi) and
`commuter-rail.display.v1.geojson` (PRASA rail) — it has no equivalent
source configured for `rapid-rail`/`bus`.

Builds are fail-closed: the pipeline validates all required output files,
required transit networks, and checksums before publishing. Artifacts are
written to a staging directory first and only atomically promoted to
`packages/web/public/data/<regionId>/` when validation passes.

Validate every region directory that's currently published (`runAllRegionsOutputValidation()`, skipping any region in `REGIONS` that hasn't been built yet):

```bash
npm run validate
```

Cache management:

```bash
npm run cache:prune               # remove stale cache files older than 7 days
npm run cache:clean               # remove the whole cache directory
tsx src/cleanCache.ts --max-age-days 2
```

All published files are display-optimized `.display.v1.geojson` artifacts used
by the browser.

## Adding a new metro

Add an entry to `METROS` in `packages/app/src/constants/metros.ts` (id,
name, `municipalityCodes` from the Stats SA Census 2011 sub-place shapefile,
map centre/zoom), add a bounding box to `METRO_BBOX` in
`src/constants/metroBbox.ts`, add that metro's job centres to `JOB_CENTERS` in
`src/constants/jobCenters.ts`, and add its township area definitions to
`packages/app/src/constants/townships.ts` (see
`docs/data/tshwane-area-classification.md` and
`docs/data/johannesburg-area-classification.md` for the selection
methodology). `run.ts` loops over the region's `METROS` automatically and
merges them into that region's output.

This is for adding a metro to an existing region (e.g. another Gauteng
municipality). For a wholly new region — a different province or country —
see [`docs/adding-a-region.md`](../docs/adding-a-region.md).

## Adding a new transit operator

Follow `src/adapters/gautrain.ts`, `src/adapters/aReYeng.ts`,
`src/adapters/reaVaya.ts`, `src/adapters/ekurhuleniIrptn.ts`, or
`src/adapters/myciti.ts` (mirroring `reaVaya.ts`'s Overpass route-relation
pattern) as a template: one adapter file with a `fetchX(bbox)` +
`normalizeX()` pair, normalizing into the shared
`TransitLayerFeatureCollection` shape. Wire the adapter into that region's
`RegionPipelineConfig` (e.g. `src/regions/gautengPipelineConfig.ts` or
`src/regions/westernCapePipelineConfig.ts`) as a new or merged
`PipelineSource` — `{ layerId, fetch, outputFileName }` — and add its
network name to `requiredNetworks` if every publish must include it.
`run.ts` fetches every `PipelineSource` in `config.sources` automatically;
it doesn't need editing. Then re-run the pipeline.

Gautrain rail, Gautrain Bus, and PRASA/Metrorail are treated as shared
networks (PRASA's adapter is reused as-is for `western-cape`, since its
Overpass query already matches on operator/network regardless of region). A
Re Yeng (Tshwane), Rea Vaya (Johannesburg), and Ekurhuleni IRPTN (fetched
from the City of Ekurhuleni's own ArcGIS GIS service rather than Overpass)
are city-specific sources that merge into the Gauteng region's
`bus-rapid-transit` layer; MyCiTi merges into the Western Cape region's
`bus-rapid-transit` layer the same way. Tshwane Bus Services is a
city-specific source that contributes to the Gauteng region's `bus` layer
alongside Gautrain Bus.

Emfuleni, Midvaal, Lesedi, Mogale City, Rand West City, and Merafong City
currently contribute boundaries and job-centre routing only: OpenStreetMap
has no sufficiently complete city-operator route geometry for their local
bus systems, so no city-specific adapter exists yet. Their townships are
still covered by the Gauteng-wide Gautrain, Gautrain Bus and PRASA/Metrorail
layers.

## Rate limits

Drive-time computation uses the public `router.project-osrm.org` demo server, batched at 50 origins per request (against all job centers in the same table request) with a 1s delay between batches and retry-with-backoff on HTTP 429. Overpass queries retry with backoff and rotate across a small list of public mirrors (`overpass.private.coffee` first, then `overpass-api.de`, then `maps.mail.ru` — see `src/constants/serviceUrls.ts`) before giving up, since a single public instance can be temporarily rate-limited (429) or overloaded (504) under sustained pipeline use. Both OSRM and Overpass responses are cached locally under `data-pipeline/.cache` to speed up repeat runs and improve resilience to transient upstream failures.

## Running locally without rate limits

For heavy iteration (e.g. re-running the whole pipeline repeatedly while developing), self-host both services instead of relying on the public ones:

1. Download a South Africa OSM extract (small enough to process locally, unlike the full planet): [`south-africa-latest.osm.pbf`](https://download.geofabrik.de/africa/south-africa-latest.osm.pbf) from Geofabrik, into `data-pipeline/osm-data/`.
2. Pre-process it for OSRM (one-off, only needs re-running if the extract changes) using the car profile bundled with the OSRM Docker image:
   ```bash
   cd data-pipeline
   mkdir -p osrm-data && cp osm-data/south-africa-latest.osm.pbf osrm-data/
   docker run -t -v "${PWD}/osrm-data:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/south-africa-latest.osm.pbf
   docker run -t -v "${PWD}/osrm-data:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/south-africa-latest.osrm
   docker run -t -v "${PWD}/osrm-data:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/south-africa-latest.osrm
   ```
3. Start both services: `docker compose up` (see `docker-compose.yml`; the Overpass container needs a few minutes on first start to import the extract).
4. Point the pipeline at them and run as usual:
   ```bash
   OSRM_BASE_URL=http://localhost:5000 OVERPASS_URL=http://localhost:12345/api/interpreter npm run run
   ```

Only `src/constants/serviceUrls.ts` reads these environment variables — no other pipeline code needs to change to use local infrastructure instead of the public defaults. You can also set `OVERPASS_URLS` (comma-separated) to control mirror priority explicitly.
