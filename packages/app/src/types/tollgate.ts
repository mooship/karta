import type { Feature, Point } from "geojson";

/** Per-feature properties for a physical toll plaza on a tolled route through Gauteng. */
export interface TollgateProperties {
  id: string;
  name: string;
  /** The tolled route this plaza sits on, e.g. "N1", "N3". */
  route: string;
  /** The concessionaire or authority that collects tolls at this plaza. */
  operator: string;
}

/** A single toll plaza, as a Point GeoJSON feature. */
export type TollgateFeature = Feature<Point, TollgateProperties>;
