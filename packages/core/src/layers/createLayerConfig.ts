import type { Feature } from "geojson";
import type { PathOptions } from "leaflet";
import type {
  ChoroplethLayerStyle,
  Classification,
  GraduatedClassification,
  Layer,
} from "../types/layer";
import { resolveClassification } from "./classification";

/**
 * Leaflet path configuration for a single layer.
 * @remarks
 * Exactly one of `pathOptions`/`styleFn` is populated, never both: a layer
 * whose style has no data-driven `Classification` resolves to a single
 * static `pathOptions` object, while a layer with at least one
 * `Classification` resolves to a `styleFn` so each feature's style is
 * computed per-feature from its properties.
 */
export interface LeafletLayerConfig {
  pathOptions?: PathOptions & { noClip?: boolean; radius?: number };
  styleFn?: (
    feature?: Feature,
  ) => PathOptions & { noClip?: boolean; radius?: number };
}

/**
 * Resolves a themed CSS color: `darkColor` when `dark` is `true` and set,
 * otherwise `color`.
 * @remarks Shared by choropleth bucket resolution here and by `@karta/map`'s
 *   `Legend`, so a bucket's rendered fill and its legend swatch always agree
 *   on the same light/dark fallback rule.
 */
export function resolveThemedColor(
  color: string,
  darkColor: string | undefined,
  dark: boolean,
): string {
  return (dark && darkColor) || color;
}

/** Default swatch/fill colour for a choropleth feature with no bucketed value. */
export const DEFAULT_NO_DATA_COLOR = "#8A93A5";
/** Shown instead of `DEFAULT_NO_DATA_COLOR` while dark theme is active. */
export const DEFAULT_NO_DATA_COLOR_DARK = "#5b6476";

/** Static Leaflet path fields shared by every line layer, classified or not. */
const LINE_PATH_DEFAULTS = {
  opacity: 0.95,
  noClip: true,
  lineCap: "round" as const,
  lineJoin: "round" as const,
};

/**
 * Adapts a choropleth style's `buckets` into a `GraduatedClassification`, so
 * choropleth fill color resolves through the same `resolveClassification`
 * machinery as line/point classifications, instead of a separate
 * implementation of the same sort-by-max/find/fallback lookup.
 * @param fallbackColor - Already-resolved swatch/fill colour for a feature
 *   with no bucketed value (see `resolveThemedColor`) -- resolved once by
 *   the caller rather than threading both `noDataColor` and
 *   `darkNoDataColor` through here just to resolve them per call.
 * @param dark - When `true`, prefers each bucket's `darkColor` over `color`,
 *   falling back to `color` for a bucket that doesn't define one.
 */
function bucketsToClassification(
  style: ChoroplethLayerStyle,
  fallbackColor: string,
  dark: boolean,
): GraduatedClassification<string> {
  return {
    kind: "graduated",
    propertyKey: style.propertyKey,
    stops: style.buckets.map((bucket) => ({
      max: bucket.max,
      value: resolveThemedColor(bucket.color, bucket.darkColor, dark),
      label: bucket.label,
    })),
    fallback: fallbackColor,
  };
}

/**
 * Resolves a per-feature style value from a `Classification` when one is
 * configured, falling back to the layer's static style value otherwise.
 */
function resolveStyleValue<T>(
  classification: Classification<T> | undefined,
  properties: Record<string, unknown> | null | undefined,
  fallback: T,
): T {
  return classification
    ? resolveClassification(classification, properties)
    : fallback;
}

/** Options for `createLayerConfig`. */
export interface CreateLayerConfigOptions {
  /** CSS color used when a choropleth feature has no value. Defaults to `DEFAULT_NO_DATA_COLOR`. */
  noDataColor?: string;
  /** Shown instead of `noDataColor` while `dark` is `true`. Defaults to `DEFAULT_NO_DATA_COLOR_DARK`. */
  darkNoDataColor?: string;
  /**
   * When `true`, choropleth buckets prefer their `darkColor` over `color`
   * (see `ColorBucket`). Defaults to `false`.
   */
  dark?: boolean;
}

/**
 * Converts a `Layer` descriptor into a Leaflet path configuration object.
 * @param layer - The layer to configure.
 * @returns A `LeafletLayerConfig` with either `pathOptions` or `styleFn`.
 * @example
 * const { styleFn } = createLayerConfig(layer);
 * return <GeoJSON data={data} style={styleFn} />;
 */
export function createLayerConfig(
  layer: Layer,
  options: CreateLayerConfigOptions = {},
): LeafletLayerConfig {
  const {
    noDataColor = DEFAULT_NO_DATA_COLOR,
    darkNoDataColor = DEFAULT_NO_DATA_COLOR_DARK,
    dark = false,
  } = options;
  const style = layer.style;

  switch (style.kind) {
    case "choropleth": {
      const classification = bucketsToClassification(
        style,
        resolveThemedColor(noDataColor, darkNoDataColor, dark),
        dark,
      );
      return {
        styleFn: (feature) => {
          const emphasised = style.resolveEmphasis?.(feature?.properties);
          return {
            fillColor: resolveClassification(
              classification,
              feature?.properties,
            ),
            fillOpacity: emphasised
              ? (style.emphasisOpacity ?? style.baseOpacity)
              : style.baseOpacity,
            weight: 0,
          };
        },
      };
    }
    case "line": {
      if (style.colorClassification || style.weightClassification) {
        return {
          styleFn: (feature) => ({
            ...LINE_PATH_DEFAULTS,
            color: resolveStyleValue(
              style.colorClassification,
              feature?.properties,
              style.color,
            ),
            weight: resolveStyleValue(
              style.weightClassification,
              feature?.properties,
              style.weight,
            ),
          }),
        };
      }
      return {
        pathOptions: {
          ...LINE_PATH_DEFAULTS,
          color: style.color,
          weight: style.weight,
        },
      };
    }
    case "point": {
      if (style.colorClassification || style.radiusClassification) {
        return {
          styleFn: (feature) => {
            const color = resolveStyleValue(
              style.colorClassification,
              feature?.properties,
              style.color,
            );
            return {
              color,
              fillColor: color,
              radius: resolveStyleValue(
                style.radiusClassification,
                feature?.properties,
                style.radius,
              ),
            };
          },
        };
      }
      return { pathOptions: { color: style.color, fillColor: style.color } };
    }
  }
}
