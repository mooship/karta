# Adding a new region

`REGIONS` (`packages/app/src/constants/regions.ts`) is the registry the data
pipeline and `packages/web` are both written to loop over — today it holds a
single entry, `gauteng`. This walks through what registering a second region
actually touches, and is honest about the places that still assume Gauteng's
shape (Census 2011 sub-places, OSRM car routing, South African transit
operators) rather than being generic.

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
union**, hardcoded to the nine current Gauteng municipality ids — it isn't
derived from `REGIONS`. A new province-kind region with its own
municipalities needs new ids added to that union too, plus entries in
`METROS` tagged with the new `regionId`.

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

Follow `data-pipeline/src/regions/gautengPipelineConfig.ts` as a template:
one file exporting a `RegionPipelineConfig` —

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
- **Transit overlay layers do not.** `spatial-apartheid-legacy`'s transit
  layers (`rapid-rail`, `bus-rapid-transit`, `commuter-rail`, `bus`, defined
  in `packages/app/src/domains/spatial-apartheid-legacy/layers.ts`) each
  declare a single hardcoded-to-`gauteng` `dataSource` URL via a local
  `dataUrl()` helper, not `buildRegionDataUrls()`. `MapView`'s `useLayerData`
  fetches `Layer.dataSource` literally, so a new region's transit files
  won't be fetched until `layers.ts` is changed to include them — either by
  adding the new region's URLs to each transit layer's `dataSource` array,
  or by new layers entirely if the new region's transit networks are
  distinct enough to warrant their own legend entries.
- **The map's viewport and search coverage are still single-region
  constants.** `App.tsx`'s `GAUTENG_BOUNDS` (initial map framing) and
  `SEARCH_COVERAGE_BOUNDS` (the "outside South Africa" search guard) are
  plain hardcoded rectangles, not derived from `REGIONS`. Combining two
  geographically distant regions into one deployed app's viewport/search
  behaviour is not a solved problem today — widening or restructuring those
  constants is part of the work, not a pre-built extension point.
- **Copy is still single-domain.** The domain `story`, page title, and meta
  description (`messages/{locale}.json`) describe Gauteng specifically. A
  second region under the same `spatial-apartheid-legacy` domain needs that
  copy generalized or reworded; a second region that warrants its own
  framing is probably a second domain instead — see
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
