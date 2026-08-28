import type { MetroDefinition } from "@karta/app";
import type { FeatureCollection } from "geojson";

/**
 * Declares how the data pipeline produces one region's transit layer.
 * @remarks `fetch()` does the actual network/OSM/Overpass fetching and
 *   returns the layer's raw `FeatureCollection`; `runRegion` (`src/run.ts`)
 *   writes the result to `packages/web/public/data/<regionId>/<outputFileName>`.
 */
export interface PipelineSource {
  /** Matches the corresponding `Layer.id` in the region's domain (e.g. `SPATIAL_APARTHEID_LEGACY_LAYERS`). */
  layerId: string;
  fetch(): Promise<FeatureCollection>;
  outputFileName: string;
}

/**
 * Declaratively describes one region's full data pipeline: which metros it
 * covers and which transit sources to fetch. Passed to `runRegion` (`src/run.ts`).
 */
export interface RegionPipelineConfig {
  regionId: string;
  /** Metros this region's boundary/routing steps loop over. */
  metros: MetroDefinition[];
  /** One `PipelineSource` per transit layer this region produces. */
  sources: PipelineSource[];
  /**
   * Transit network names (as they appear in a feature's `network`
   * property) every published build of this region must have at least one
   * feature for -- see `countTransitNetworks`/`assertCompleteNetworkCoverage`.
   */
  requiredNetworks: readonly string[];
}
