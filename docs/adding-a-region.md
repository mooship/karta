# Adding a new region

`REGIONS` (`packages/app/src/constants/regions.ts`) is the registry the data
pipeline and `packages/web` are both written to loop over — today it holds
two entries, `gauteng` and `western-cape`. This walks through what
registering a further region actually touches, and is honest about the
places that still assume this domain's South African shape (Census 2011
sub-places, OSRM car routing, South African transit operators) rather than
being generic. `western-cape` (`packages/app/src/constants/regions.ts`,
`data-pipeline/src/regions/westernCapePipelineConfig.ts`) is a real,
published second region and a useful template for a small one: one metro
(City of Cape Town), two transit sources (MyCiTi, PRASA rail), reusing the
existing PRASA adapter as-is.

If what you actually want is a new *dataset* rather than a new geography —
a different kind of layer, or a domain with no `data-pipeline` source at all
— see [`docs/building-a-domain.md`](building-a-domain.md) instead;
`packages/app/src/domains/heritage-sites/` is a worked example of exactly
that. This doc is for extending the pipeline-backed `spatial-apartheid-legacy`
shape (municipalities, township areas, job-centre drive times, transit
overlays) to cover somewhere else.

## What a `RegionDefinition` is

```ts
export interface RegionDefinition {
  id: string;
  label: string;
  kind: "province" | "national" | "custom";
}
```

`id` drives the region's output directory
(`packages/web/public/data/<id>/`) and the URLs `@karta/web` fetches
township/area data from. `kind` matters to the data pipeline: `runRegion`
(`data-pipeline/src/run.ts`) only auto-builds `"province"`-kind regions via
`runAllProvinceRegions()`. A `"national"` or `"custom"`-kind region needs
either its own explicit `--region <id>` build invocation or an extension to
that filter — `runAllProvinceRegions` doesn't loop over every `REGIONS`
entry today, only province-kind ones.

## 1. Register the region

Add an entry to `REGIONS` in `packages/app/src/constants/regions.ts`. `RegionId`
is derived from `REGIONS` itself (`(typeof REGIONS)[number]["id"]`), so
`METROS`' `regionId` field and anything else typed against `RegionId` gets
the new id for free once it's added here.

## 2. Give it metros, if it's a province-kind region

`MetroId` (`packages/app/src/constants/metros.ts`) is a **closed string
union**, hardcoded to the ten current metro ids (the nine Gauteng
municipalities plus `cape-town`) — it isn't derived from `REGIONS`. A new
province-kind region with its own municipalities needs new ids added to
that union too, plus entries in `METROS` tagged with the new `regionId`.

Each new metro then needs the same setup `data-pipeline/README.md`'s
"Adding a new metro" section documents in full: a bounding box in
`METRO_BBOX` (`data-pipeline/src/constants/metroBbox.ts`), job centres in
`JOB_CENTERS` (`data-pipeline/src/constants/jobCenters.ts`), and township
area definitions in `packages/app/src/constants/townships.ts` — see that
section, and
[`docs/data/tshwane-area-classification.md`](data/tshwane-area-classification.md)
for the classification methodology, rather than duplicating it here.

**This is the part that's genuinely Gauteng/South-Africa-shaped, not just
under-configured.** The boundary source (`SP_SA_2011`, Stats SA's Census
2011 sub-place shapefile) and its adapter
(`data-pipeline/src/adapters/boundaries.ts`) assume that specific dataset's
schema. A region outside South Africa needs an equivalent boundary adapter
producing the same normalized shape, not just new config values — this is
real pipeline work, not a config-only extension point.

## 3. Write a `RegionPipelineConfig`

Follow `data-pipeline/src/regions/gautengPipelineConfig.ts` (many metros,
several transit sources merged per layer) or the smaller
`westernCapePipelineConfig.ts` (one metro, two transit sources, one of them
— PRASA rail — reusing the existing `adapters/prasa.ts` fetcher as-is since
its Overpass query already matches on operator/network regardless of
region) as a template: one file exporting a `RegionPipelineConfig` —

```ts
export interface RegionPipelineConfig {
  regionId: string;
  metros: MetroDefinition[];
  sources: PipelineSource[]; // one per transit layer this region produces
  requiredNetworks: readonly string[]; // network names every publish must include
}
```

`sources` can be empty if the region has no transit overlays yet — `runRegion`
still builds and publishes the township/area choropleth data. Register the
new config in `REGION_PIPELINE_CONFIGS` (`data-pipeline/src/regionPipelineConfigs.ts`);
`getRegionPipelineConfig(id)` and `--region <id>` both read from that list.

## 4. Know what `packages/web` does — and doesn't — pick up automatically

- **Township/area choropleth data merges across regions automatically.**
  `App.tsx` calls `buildRegionDataUrls()` directly (looping every entry in
  `REGIONS`) to fetch and merge `townships.display.v1.geojson` and
  `township-areas.display.v1.geojson` from every configured region into one
  `FeatureCollection`. No code change needed here for a new region.
- **Transit overlay layers do not merge automatically, but can share a
  layer.** `spatial-apartheid-legacy`'s transit layers (`rapid-rail`,
  `bus-rapid-transit`, `commuter-rail`, `bus`, defined in
  `packages/app/src/domains/spatial-apartheid-legacy/layers.ts`) each declare
  a fixed `dataSource` array, not `buildRegionDataUrls()`. `MapView`'s
  `useLayerData` fetches every URL in `Layer.dataSource` literally and merges
  the results, so a new region's transit files are picked up only once
  `layers.ts` lists them explicitly — `multiRegionDataUrls()` (a small local
  helper, not `buildRegionDataUrls()`, since `packages/app` can't depend on
  `packages/web`) does this for `bus-rapid-transit` and `commuter-rail`,
  whose pipeline configs both regions define a source for. `rapid-rail` and
  `bus` stay Gauteng-only, since Western Cape has no equivalent transit
  network configured today (no Gautrain- or Tshwane-bus-equivalent source in
  `westernCapePipelineConfig.ts`) — add the new region's URL to a transit
  layer's `dataSource` array only once its pipeline config actually produces
  that layer's file, or add a new layer entirely if the new region's network
  is distinct enough to warrant its own legend entry.
- **The map's viewport and search coverage share one constant.** `App.tsx`'s
  `SEARCH_COVERAGE_BOUNDS` (the "outside South Africa" search guard) is
  passed directly as `MapView`'s `bounds` prop too — a plain hardcoded
  rectangle covering mainland South Africa, not derived from `REGIONS`. The
  map always opens framing the whole country regardless of which regions
  have published data, so adding a region whose mapped data
  falls outside that rectangle only matters if it's outside South Africa
  entirely; there's no per-region viewport logic today.
- **Copy is domain-wide, not per-region.** The domain `story`
  (`messages/{locale}.json`'s `domain_story_title`/`domain_story_body`) and
  page title/meta description describe the domain's overall framing, not any
  one region — keep new region-specific detail out of it unless it changes
  what the story is claiming; a second region whose own framing doesn't fit
  the existing story is probably a second domain instead — see
  [`docs/building-a-domain.md`](building-a-domain.md).

## 5. Rebuild and validate

```bash
cd data-pipeline
npm run run -- --region <id>
npm run validate
```

Builds are fail-closed: `runRegion` validates required output files, required
transit networks, and checksums before atomically promoting the staged
output to `packages/web/public/data/<id>/`.
