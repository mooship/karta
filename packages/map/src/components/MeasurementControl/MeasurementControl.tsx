import { Ruler, X } from "lucide-react";
import { ControlButton } from "../ControlButton/ControlButton";
import { IconButton } from "../IconButton/IconButton";
import {
  SegmentedControl,
  type SegmentedControlOption,
} from "../SegmentedControl/SegmentedControl";
import styles from "./MeasurementControl.module.css";

/** Which quantity a `MeasurementControl` is currently measuring. */
export type MeasurementMode = "distance" | "area";

const MODE_OPTIONS: SegmentedControlOption<MeasurementMode>[] = [
  { id: "distance", label: "Distance" },
  { id: "area", label: "Area" },
];

/** Props for {@link MeasurementControl}. */
export interface MeasurementControlProps {
  /** Whether the measuring panel is open and the map is listening for clicks. */
  active: boolean;
  mode: MeasurementMode;
  /** Number of vertices clicked so far in the current measurement. */
  pointCount: number;
  /** A formatted, human-readable readout (e.g. `"1.2 km"`), or `null` before there are enough points to measure. */
  resultLabel: string | null;
  /** Toggles `active`; also used as the panel's own close action. */
  onToggleActive: () => void;
  onModeChange: (mode: MeasurementMode) => void;
  /** Discards the points clicked so far without leaving measuring mode. */
  onClear: () => void;
  /**
   * Whether the host app's own overlapping panel (if it has one) is open,
   * and if so whether it's expanded to its larger size. Defaults to
   * `false`/`false`. Mirrors `MobileLegend`'s `panelOpen`/`panelExpanded`
   * props: on narrow viewports this control caps its own height so it
   * can't grow down into space that panel's mobile sheet — or controls
   * that reposition themselves above that sheet, like the legend trigger
   * — already claim.
   */
  panelOpen?: boolean;
  panelExpanded?: boolean;
}

/**
 * A map control for measuring straight-line distance or enclosed area by
 * clicking points on the map.
 * @remarks Purely presentational — the click-to-add-point behaviour and the
 *   drawn preview line/polygon live in `MeasurementLayer`, which must be
 *   rendered inside the same `MapView`'s `MapContainer` and driven by the
 *   same `active`/`mode`/points state as this component. Text is
 *   deliberately hardcoded English, matching this package's other chrome
 *   (`SettingsMenu`, `ThemeToggle`, `BasemapToggle`): `@karta/map` has no
 *   access to a caller's translation catalogue.
 */
export function MeasurementControl({
  active,
  mode,
  pointCount,
  resultLabel,
  onToggleActive,
  onModeChange,
  onClear,
  panelOpen = false,
  panelExpanded = false,
}: MeasurementControlProps) {
  const rootProps = {
    className: styles.root,
    "data-testid": "measurement-control-root",
    "data-panel-open": panelOpen ? "true" : "false",
    "data-panel-size": panelExpanded ? "full" : "medium",
  } as const;

  if (!active) {
    return (
      <div {...rootProps}>
        <IconButton
          label="Measure distance and area"
          data-testid="measurement-control-toggle"
          data-e2e="measurement-control-toggle"
          onClick={onToggleActive}
        >
          <Ruler aria-hidden="true" />
        </IconButton>
      </div>
    );
  }

  return (
    <div {...rootProps}>
      <section
        className={styles.panel}
        aria-label="Measurement tool"
        data-testid="measurement-control-panel"
        data-e2e="measurement-control-panel"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Measure</h2>
          <IconButton
            label="Stop measuring"
            data-testid="measurement-control-close"
            data-e2e="measurement-control-close"
            onClick={onToggleActive}
          >
            <X aria-hidden="true" />
          </IconButton>
        </div>
        <SegmentedControl
          label="Measurement mode"
          testId="measurement-control-mode"
          options={MODE_OPTIONS}
          value={mode}
          onChange={onModeChange}
        />
        {pointCount === 0 ? (
          <p
            className={styles.hint}
            data-testid="measurement-control-hint"
            data-e2e="measurement-control-hint"
          >
            Click the map to start measuring.
          </p>
        ) : (
          <div className={styles.resultRow}>
            <output
              className={styles.result}
              data-testid="measurement-control-result"
              data-e2e="measurement-control-result"
            >
              {resultLabel}
            </output>
            <ControlButton
              shape="pill"
              variant="embedded"
              data-testid="measurement-control-clear"
              data-e2e="measurement-control-clear"
              onClick={onClear}
            >
              Clear
            </ControlButton>
          </div>
        )}
      </section>
    </div>
  );
}
