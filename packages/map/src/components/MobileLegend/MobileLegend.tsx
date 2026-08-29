import { assignInlineVars } from "@vanilla-extract/dynamic";
import { BookOpen, X } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDismissableOverlay } from "../../hooks/useDismissableOverlay";
import { useSwipeToDismiss } from "../../hooks/useSwipeToDismiss";
import { IconButton } from "../IconButton/IconButton";
import { Legend, type LegendLabels } from "../Legend/Legend";
import * as styles from "./MobileLegend.css";

interface MobileLegendProps {
  visibleLayerIds: string[];
  suppressed: boolean;
  /** Whether the host app's own bottom-sheet panel is open, so this trigger's mobile CSS can climb above it instead of being covered. */
  panelOpen: boolean;
  /** Whether the host panel (when `panelOpen`) is at its larger "full" size rather than "medium", so the trigger climbs the matching extra distance. */
  panelExpanded: boolean;
  /** Visible heading text and open sheet's `aria-label`. Defaults to `"Map legend"`. */
  title?: string;
  /** Accessible label of the trigger button while the sheet is closed. Defaults to `"Open map legend"`. */
  openLabel?: string;
  /** Accessible label of the trigger button (and drag handle) while the sheet is open. Defaults to `"Close map legend"`. */
  closeLabel?: string;
  /** Overridable copy passed straight through to the internal `Legend`. */
  legendLabels?: LegendLabels;
}

const DEFAULT_TITLE = "Map legend";
const DEFAULT_OPEN_LABEL = "Open map legend";
const DEFAULT_CLOSE_LABEL = "Close map legend";

function MobileLegendComponent({
  visibleLayerIds,
  suppressed,
  panelOpen,
  panelExpanded,
  title = DEFAULT_TITLE,
  openLabel = DEFAULT_OPEN_LABEL,
  closeLabel = DEFAULT_CLOSE_LABEL,
  legendLabels,
}: MobileLegendProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!suppressed) {
      return;
    }
    setOpen(false);
  }, [suppressed]);

  const close = useCallback(() => setOpen(false), []);

  useDismissableOverlay({
    open,
    onClose: close,
    containerRef,
    triggerRef,
    initialFocusRef: titleRef,
  });

  const { dragOffsetPx, dragging, onPointerDown } = useSwipeToDismiss({
    enabled: open,
    onDismiss: close,
  });

  if (suppressed) {
    return null;
  }

  const dragStyle = assignInlineVars({
    [styles.sheetDragOffset]: `${dragOffsetPx}px`,
  });

  return (
    <div
      className={styles.container}
      ref={containerRef}
      data-panel-open={panelOpen ? "true" : "false"}
      data-panel-size={panelExpanded ? "full" : "medium"}
    >
      <IconButton
        ref={triggerRef}
        data-testid="mobile-legend-trigger"
        data-e2e="mobile-legend-trigger"
        aria-expanded={open}
        aria-controls="mobile-legend-content"
        label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
      </IconButton>
      {open ? (
        <section
          id="mobile-legend-content"
          className={styles.sheet}
          aria-label={title}
          data-testid="mobile-legend-content"
          data-e2e="mobile-legend-content"
          data-dragging={dragging ? "true" : "false"}
          style={dragStyle}
        >
          <button
            type="button"
            className={styles.dragHandleButton}
            data-testid="mobile-legend-drag-handle"
            aria-label={closeLabel}
            onPointerDown={onPointerDown}
            onClick={close}
          >
            <span className={styles.dragHandle} aria-hidden="true" />
          </button>
          <h2 className={styles.title} ref={titleRef} tabIndex={-1}>
            {title}
          </h2>
          <Legend
            mode="active"
            visibleLayerIds={visibleLayerIds}
            compact
            {...legendLabels}
          />
        </section>
      ) : null}
    </div>
  );
}

/**
 * Collapsible bottom-sheet legend trigger for mobile viewports, showing only
 * the currently active layers when opened.
 * @remarks Must be rendered inside a `DomainProvider`. Memoized so unrelated
 *   parent re-renders don't force this subtree through reconciliation when
 *   its own props haven't changed; the sheet's own drag-frame updates
 *   (`dragOffsetPx`, from `useSwipeToDismiss`) still re-render it as before,
 *   since that state lives inside this component.
 */
export const MobileLegend = memo(MobileLegendComponent);
