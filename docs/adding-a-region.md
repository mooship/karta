# Adding a new region

`REGIONS` (`packages/app/src/constants/regions.ts`) is the registry that the
data pipeline and `packages/web` both loop over. It currently holds two
entries, `gauteng` and `western-cape`. This guide covers what registering
another region touches. It also lists the parts that are still specific to
South Africa: Census 2011 sub-places, OSRM car routing and South African
transit operators.

`western-cape` (`packages/app/src/constants/regions.ts`,
`data-pipeline/src/regions/westernCapePipelineConfig.ts`) is a published
second region and a good template for a small one. It has one metro (City of
Cape Town) and two transit sources (MyCiTi and PRASA rail), and reuses the
existing PRASA adapter unchanged.

If you want a new dataset rather than a new geography, such as a different
kind of layer or a domain with no `data-pipeline` source, see
[`docs/building-a-domain.md`](building-a-domain.md) instead.
`packages/app/src/domains/heritage-sites/` is an example of that. This guide
is for taking the pipeline-backed `spatial-apartheid-legacy` setup
(municipalities, township areas, job-centre drive times, transit overlays)
somewhere else.

## What a `RegionDefinition` is

```ts
export interface RegionDefinition {
  id: string;
  label: string;
  kind: "province" | "national" | "custom";
}
```

`id` sets the region's output directory
(`packages/web/public/data/<id>/`) and the URLs `@karta/web` fetches
township and area data from. `kind` matters to the data pipeline:
`runAllProvinceRegions()` (`data-pipeline/src/run.ts`) builds only
`"province"` regions. A `"national"` or `"custom"` region needs its own
`--region <id>` build, or a change to that filter.

## 1. Register the region

Add an entry to `REGIONS` in `packages/app/src/constants/regions.ts`.
`RegionId` is derived from `REGIONS` (`(typeof REGIONS)[number]["id"]`), so
`METROS`' `regionId` field and anything else typed as `RegionId` gets the new
id automatically.

## 2. Give it metros, if it's a province region

`MetroId` (`packages/app/src/constants/metros.ts`) is a closed string union
of the ten current metro ids (the nine Gauteng municipalities plus
`cape-town`). It isn't derived from `REGIONS`. A new province region with
its own municipalities needs new ids in that union and entries in `METROS`
tagged with the new `regionId`.

Each new metro then needs the setup described under "Adding a new metro" in
`data-pipeline/README.md`: a bounding box in `METRO_BBOX`
(`data-pipeline/src/constants/metroBbox.ts`), job centres in `JOB_CENTERS`
(`data-pipeline/src/constants/jobCenters.ts`), and township area definitions
in `packages/app/src/constants/townships.ts`. See that section and
[`docs/data/tshwane-area-classification.md`](data/tshwane-area-classification.md)
for the classification method.

This part is specific to Gauteng and South Africa; config alone won't change
it. The boundary source (`SP_SA_2011`, Stats SA's Census 2011 sub-place
shapefile) and its adapter (`data-pipeline/src/adapters/boundaries.ts`)
assume that dataset's schema. A region outside South Africa needs its own
boundary adapter that produces the same normalised shape, which means
pipeline work, not just config.

## 3. Write a `RegionPipelineConfig`

Use `data-pipeline/src/regions/gautengPipelineConfig.ts` (many metros,
several transit sources merged per layer) or the smaller
`westernCapePipelineConfig.ts` as a template. The Western Cape config has
one metro and two transit sources, and reuses `adapters/prasa.ts` for PRASA
rail because its Overpass query matches on operator and network in any
region. Each file exports a `RegionPipelineConfig`:

```ts
export interface RegionPipelineConfig {
  regionId: string;
  metros: MetroDefinition[];
  sources: PipelineSource[]; // one per transit layer this region produces
  requiredNetworks: readonly string[]; // network names every publish must include
}
```

`sources` can be empty if the region has no transit overlays yet. `runRegion`
still builds and publishes the township and area choropleth data. Register
the new config in `REGION_PIPELINE_CONFIGS`
(`data-pipeline/src/regionPipelineConfigs.ts`);
`getRegionPipelineConfig(id)` and `--region <id>` both read from that list.

## 4. What `packages/web` picks up by itself

- Township and area choropleth data merges across regions. `App.tsx` calls
  `buildRegionDataUrls()`, which loops over every entry in `REGIONS`, to
  fetch and merge `townships.display.v1.geojson` and
  `township-areas.display.v1.geojson` into one `FeatureCollection`. A new
  region needs no code change here.
- Transit layers don't merge by themselves, but regions can share a layer.
  The transit layers (`rapid-rail`, `bus-rapid-transit`, `commuter-rail` and
  `bus`, in `packages/app/src/domains/spatial-apartheid-legacy/layers.ts`)
  each declare a fixed `dataSource` array. `MapView`'s `useLayerData` fetches
  every URL in `Layer.dataSource` and merges the results, so a new region's
  transit files appear only once `layers.ts` lists them. The local helper
  `multiRegionDataUrls()` does this for `bus-rapid-transit` and
  `commuter-rail`, which both regions produce. (It can't use
  `buildRegionDataUrls()` because `packages/app` can't depend on
  `packages/web`.) `rapid-rail` and `bus` are Gauteng only, because the
  Western Cape config has no Gautrain or Tshwane bus equivalent. Add a
  region's URL to a layer's `dataSource` only once its pipeline config
  produces that file, or add a new layer if the network needs its own legend
  entry.
- The map's viewport and search coverage share one constant. `App.tsx`'s
  `SEARCH_COVERAGE_BOUNDS` (the "outside South Africa" search guard) is also
  passed as `MapView`'s `bounds`. It is a fixed rectangle around mainland
  South Africa, not derived from `REGIONS`, so the map always opens on the
  whole country. It only matters for a region outside South Africa; there's
  no per-region viewport logic.
- Copy covers the whole domain, not one region. The domain `story`
  (`domain_story_title` and `domain_story_body` in `messages/{locale}.json`)
  and the page title and meta description describe the domain as a whole.
  Keep region-specific detail out of them unless it changes what the story
  claims. A region whose framing doesn't fit the story is probably a second
  domain; see [`docs/building-a-domain.md`](building-a-domain.md).

## 5. Rebuild and validate

```bash
cd data-pipeline
npm run run -- --region <id>
npm run validate
```

Builds are fail-closed. `runRegion` checks required output files, required
transit networks and checksums before it promotes the staged output to
`packages/web/public/data/<id>/`.