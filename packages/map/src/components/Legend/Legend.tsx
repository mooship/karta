import type { Layer } from "@karta/core";
import {
  DEFAULT_NO_DATA_COLOR,
  DEFAULT_NO_DATA_COLOR_DARK,
  resolveThemedColor,
} from "@karta/core";
import { useResolvedDarkTheme } from "@karta/react";
import { memo, useMemo } from "react";
import { useDomain } from "../../context/DomainContext";
import * as styles from "./Legend.css";

/**
 * `Legend`'s own overridable copy, all defaulting to English. Factored out
 * from `LegendProps` so `DesktopLegend`/`MobileLegend` -- which each render
 * a `Legend` internally -- can accept and forward the same set without
 * repeating every field.
 */
export interface LegendLabels {
  /** Fallback bucket label for a choropleth value outside every configured bucket. Defaults to `"No data"`. */
  noDataLabel?: string;
  /** Heading above the transit-route entries. Defaults to `"Transit routes"`. */
  transitRoutesLabel?: string;
  /** `aria-label` on the transit entries' own list. Defaults to `"Transit route colours"`. */
  transitColorsAriaLabel?: string;
  /** Shown in place of any legend sections when `mode="active"` and no layer is visible. Defaults to `"Turn on layers to view their legend."`. */
  emptyMessage?: string;
  /** Appended to a transit entry that has station markers as well as a route line. Defaults to `" · line + stations"`. */
  lineAndStationsNote?: string;
  /** Appended to a transit entry that has a route line only. Defaults to `" · route only"`. */
  routeOnlyNote?: string;
  /** Builds a choropleth section's `aria-label` when `mode="active"`, from that section's own heading text. Defaults to `` (label) => `Active map layers legend: ${label}` ``. */
  formatActiveAriaLabel?: (label: string) => string;
}

interface LegendProps extends LegendLabels {
  mode?: "all" | "active";
  visibleLayerIds?: string[];
  compact?: boolean;
}

const DEFAULT_NO_DATA_LABEL = "No data";
const DEFAULT_TRANSIT_ROUTES_LABEL = "Transit routes";
const DEFAULT_TRANSIT_COLORS_ARIA_LABEL = "Transit route colours";
const DEFAULT_EMPTY_MESSAGE = "Turn on layers to view their legend.";
const DEFAULT_LINE_AND_STATIONS_NOTE = " · line + stations";
const DEFAULT_ROUTE_ONLY_NOTE = " · route only";
const DEFAULT_FORMAT_ACTIVE_ARIA_LABEL = (label: string) =>
  `Active map layers legend: ${label}`;

/**
 * Resolves choropleth legend sections, one per visible choropleth layer.
 * @param dark - When `true`, each bucket's `darkColor` is shown instead of
 *   `color` (falling back to `color` when unset), so the legend swatch
 *   always matches what `MapView` actually renders for the same theme.
 */
function choroplethLegends(
  layers: readonly Layer[],
  visibleLayerIds: string[] | undefined,
  dark: boolean,
  noDataLabel: string,
) {
  return layers.flatMap((layer) => {
    if (layer.style.kind !== "choropleth") {
      return [];
    }
    if (visibleLayerIds && !visibleLayerIds.includes(layer.id)) {
      return [];
    }
    return [
      {
        layer,
        entries: [
          ...layer.style.buckets.map((bucket) => ({
            label: bucket.label,
            color: resolveThemedColor(bucket.color, bucket.darkColor, dark),
          })),
          {
            label: noDataLabel,
            color: resolveThemedColor(
              DEFAULT_NO_DATA_COLOR,
              DEFAULT_NO_DATA_COLOR_DARK,
              dark,
            ),
          },
        ],
      },
    ];
  });
}

/**
 * Resolves point-layer legend sections, one per visible point-kind layer
 * (e.g. a hand-plotted layer of notable locations), each rendered with its
 * own heading like a choropleth section rather than folded into the
 * "Transit routes" heading, which is specific to line layers.
 */
function pointLegends(
  layers: readonly Layer[],
  visibleLayerIds: string[] | undefined,
) {
  return layers.flatMap((layer) => {
    if (
      !layer.available ||
      layer.style.kind !== "point" ||
      (visibleLayerIds && !visibleLayerIds.includes(layer.id))
    ) {
      return [];
    }

    const { style } = layer;
    const entries = style.colorClassification
      ? style.colorClassification.stops.map((stop) => ({
          label: stop.label,
          color: stop.value,
        }))
      : [{ label: style.legendLabel, color: style.color }];

    return [{ layer, entries }];
  });
}

function getTransitEntries(
  layers: readonly Layer[],
  visibleLayerIds?: string[],
) {
  return layers.flatMap((layer) => {
    if (
      !layer.available ||
      layer.style.kind !== "line" ||
      (visibleLayerIds && !visibleLayerIds.includes(layer.id))
    ) {
      return [];
    }

    const { style } = layer;
    const hasStations = layer.hasPointGeometry === true;

    if (style.colorClassification) {
      return style.colorClassification.stops.map((stop) => ({
        label: stop.label,
        color: stop.value,
        hasStations,
      }));
    }

    return [{ label: style.legendLabel, color: style.color, hasStations }];
  });
}

function getLegendAriaLabel(
  mode: "all" | "active",
  label: string,
  formatActiveAriaLabel: (label: string) => string,
) {
  if (mode === "active") {
    return formatActiveAriaLabel(label);
  }
  return label;
}

function LegendComponent({
  mode = "all",
  visibleLayerIds = [],
  compact = false,
  noDataLabel = DEFAULT_NO_DATA_LABEL,
  transitRoutesLabel = DEFAULT_TRANSIT_ROUTES_LABEL,
  transitColorsAriaLabel = DEFAULT_TRANSIT_COLORS_ARIA_LABEL,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  lineAndStationsNote = DEFAULT_LINE_AND_STATIONS_NOTE,
  routeOnlyNote = DEFAULT_ROUTE_ONLY_NOTE,
  formatActiveAriaLabel = DEFAULT_FORMAT_ACTIVE_ARIA_LABEL,
}: LegendProps) {
  const { getLayers } = useDomain();
  const layers = getLayers();
  const isActiveMode = mode === "active";
  const resolvedDark = useResolvedDarkTheme();
  const activeLayerIds = isActiveMode ? visibleLayerIds : undefined;
  /**
   * @remarks Both derived lists walk every layer (and, for choropleths,
   *   every bucket) and allocate a fresh entry object per swatch. Memoised
   *   for the same reason `MapView` memoises its own derived layer maps: the
   *   legend re-renders on unrelated parent state (panel drag frames, menu
   *   toggles), and rebuilding these each time also gave every rendered
   *   entry a new identity for no benefit.
   */
  const choroplethSections = useMemo(
    () => choroplethLegends(layers, activeLayerIds, resolvedDark, noDataLabel),
    [layers, activeLayerIds, resolvedDark, noDataLabel],
  );
  const transitEntries = useMemo(
    () => getTransitEntries(layers, activeLayerIds),
    [layers, activeLayerIds],
  );
  const pointSections = useMemo(
    () => pointLegends(layers, activeLayerIds),
    [layers, activeLayerIds],
  );
  const hasAnyLegendSection =
    choroplethSections.length > 0 ||
    transitEntries.length > 0 ||
    pointSections.length > 0;

  return (
    <div className={styles.groups} data-compact={compact ? "true" : undefined}>
      {choroplethSections.map(({ layer, entries }) => (
        <div key={layer.id}>
          <h3 className={styles.groupTitle}>{layer.label}</h3>
          <ul
            className={styles.legend}
            aria-label={getLegendAriaLabel(
              mode,
              layer.label,
              formatActiveAriaLabel,
            )}
          >
            {entries.map((entry) => (
              <li key={entry.label} className={styles.entry}>
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className={styles.label}>{entry.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {pointSections.map(({ layer, entries }) => (
        <div key={layer.id}>
          <h3 className={styles.groupTitle}>{layer.label}</h3>
          <ul
            className={styles.legend}
            aria-label={getLegendAriaLabel(
              mode,
              layer.label,
              formatActiveAriaLabel,
            )}
          >
            {entries.map((entry) => (
              <li key={entry.label} className={styles.entry}>
                <span
                  className={styles.dotSwatch}
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className={styles.label}>{entry.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {transitEntries.length > 0 ? (
        <div className={styles.fullWidthGroup}>
          <h3 className={styles.groupTitle}>{transitRoutesLabel}</h3>
          <ul
            className={styles.legend}
            aria-label={getLegendAriaLabel(
              mode,
              transitColorsAriaLabel,
              formatActiveAriaLabel,
            )}
          >
            {transitEntries.map((entry) => (
              <li key={entry.label} className={styles.entry}>
                <span className={styles.symbolGroup} aria-hidden="true">
                  <span
                    className={styles.lineSwatch}
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.hasStations ? (
                    <span
                      className={styles.dotSwatch}
                      style={{ backgroundColor: entry.color }}
                    />
                  ) : null}
                </span>
                <span className={styles.label}>
                  {entry.label}
                  <span className={styles.symbolNote}>
                    {entry.hasStations ? lineAndStationsNote : routeOnlyNote}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {!hasAnyLegendSection ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : null}
    </div>
  );
}

/**
 * Renders choropleth and transit layer legend entries for a map domain.
 * @remarks Must be rendered inside a `DomainProvider`. Choropleth swatches
 *   resolve each bucket's `darkColor` over `color` while dark theme is
 *   active, matching the fill `MapView` renders for the same theme. Memoized
 *   like `MapView` itself, since it renders inside the same panel/bottom-sheet
 *   tree that re-renders on unrelated parent state (drag frames, menu toggles).
 * @example
 * <DomainProvider domain={GAUTENG_SPATIAL_LEGACY_DOMAIN}>
 *   <Legend mode="active" visibleLayerIds={["townships"]} />
 * </DomainProvider>
 */
export const Legend = memo(LegendComponent);
