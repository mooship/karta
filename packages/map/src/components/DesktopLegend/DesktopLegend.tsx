import { memo } from "react";
import { Legend, type LegendLabels } from "../Legend/Legend";
import styles from "./DesktopLegend.module.css";

interface DesktopLegendProps {
  visibleLayerIds: string[];
  /** Hides the panel, e.g. while another bottom-left overlay (Settings) is open over it. */
  suppressed?: boolean;
  /** Visible heading text and `aria-label` for the panel. Defaults to `"Map legend"`. */
  title?: string;
  /** Overridable copy passed straight through to the internal `Legend`. */
  legendLabels?: LegendLabels;
}

const DEFAULT_TITLE = "Map legend";

function DesktopLegendComponent({
  visibleLayerIds,
  suppressed = false,
  title = DEFAULT_TITLE,
  legendLabels,
}: DesktopLegendProps) {
  if (suppressed) {
    return null;
  }

  return (
    <section
      className={styles.container}
      aria-label={title}
      data-testid="desktop-legend"
      data-e2e="desktop-legend"
    >
      <h2 className={styles.title}>{title}</h2>
      <Legend
        mode="active"
        visibleLayerIds={visibleLayerIds}
        compact
        {...legendLabels}
      />
    </section>
  );
}

/**
 * Always-visible legend panel for desktop viewports, showing only the
 * currently active layers.
 * @remarks Must be rendered inside a `DomainProvider`. Memoized so unrelated
 *   parent re-renders (e.g. panel drag frames) don't force this subtree
 *   through reconciliation when `visibleLayerIds`/`suppressed` haven't changed.
 */
export const DesktopLegend = memo(DesktopLegendComponent);
