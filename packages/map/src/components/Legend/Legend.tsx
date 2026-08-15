import type { Layer } from "@karta/core";
import {
  DEFAULT_NO_DATA_COLOR,
  DEFAULT_NO_DATA_COLOR_DARK,
  resolveThemedColor,
} from "@karta/core";
import { useResolvedDarkTheme } from "@karta/react";
import { useMemo } from "react";
import { useDomain } from "../../context/DomainContext";
import styles from "./Legend.module.css";

interface LegendProps {
  mode?: "all" | "active";
  visibleLayerIds?: string[];
  compact?: boolean;
}

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
            label: "No data",
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

function getLegendAriaLabel(mode: "all" | "active", label: string) {
  if (mode === "active") {
    return `Active map layers legend: ${label}`;
  }
  return label;
}

/**
 * Renders choropleth and transit layer legend entries for a map domain.
 * @remarks Must be rendered inside a `DomainProvider`. Choropleth swatches
 *   resolve each bucket's `darkColor` over `color` while dark theme is
 *   active, matching the fill `MapView` renders for the same theme.
 * @example
 * <DomainProvider domain={GAUTENG_SPATIAL_LEGACY_DOMAIN}>
 *   <Legend mode="active" visibleLayerIds={["townships"]} />
 * </DomainProvider>
 */
export function Legend({
  mode = "all",
  visibleLayerIds = [],
  compact = false,
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
    () => choroplethLegends(layers, activeLayerIds, resolvedDark),
    [layers, activeLayerIds, resolvedDark],
  );
  const transitEntries = useMemo(
    () => getTransitEntries(layers, activeLayerIds),
    [layers, activeLayerIds],
  );
  const hasAnyLegendSection =
    choroplethSections.length > 0 || transitEntries.length > 0;

  return (
    <div className={styles.groups} data-compact={compact ? "true" : undefined}>
      {choroplethSections.map(({ layer, entries }) => (
        <div key={layer.id}>
          <h3 className={styles.groupTitle}>{layer.label}</h3>
          <ul
            className={styles.legend}
            aria-label={getLegendAriaLabel(mode, layer.label)}
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
      {transitEntries.length > 0 ? (
        <div className={styles.fullWidthGroup}>
          <h3 className={styles.groupTitle}>Transit routes</h3>
          <ul
            className={styles.legend}
            aria-label={getLegendAriaLabel(mode, "Transit route colours")}
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
                  {entry.hasStations ? (
                    <span className={styles.symbolNote}>
                      {" "}
                      · line + stations
                    </span>
                  ) : (
                    <span className={styles.symbolNote}> · route only</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {!hasAnyLegendSection ? (
        <p className={styles.empty}>Turn on layers to view their legend.</p>
      ) : null}
    </div>
  );
}
