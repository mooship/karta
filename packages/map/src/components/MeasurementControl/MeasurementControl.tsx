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
   * Whether the host app's own overlapping panel (if it has one) is open.
   * Defaults to `false`. While `panelOpen` is `true`, this control collapses
   * to its idle toggle button regardless of `active` — with the host's sheet
   * covering most of the map there's no room to show the full measurement
   * panel or click a measurement point — but stays visible and tappable
   * rather than disappearing outright: tapping it calls `onRequestPanelClose`
   * instead of `onToggleActive`, so it doubles as a way to dismiss the
   * host's panel and get the map back. `active`/`mode`/`points` stay owned
   * by the caller and untouched while collapsed, so a measurement in
   * progress resumes exactly where it left off once the host panel closes —
   * the caller is expected to also stop listening for map clicks in the
   * meantime (see `MapView`'s `measurementInteractive`), so clicks on
   * whatever sliver of map stays visible don't silently add points nobody
   * can see.
   */
  panelOpen?: boolean;
  /**
   * Called when the idle toggle is tapped while `panelOpen` is `true`, in
   * place of `onToggleActive`. Omit if the caller has no overlapping panel
   * (or no way to close it) — the toggle simply no-ops in that case rather
   * than falling back to `onToggleActive`, which would start a measurement
   * behind a panel that's still covering the map.
   */
  onRequestPanelClose?: () => void;
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
  onRequestPanelClose,
}: MeasurementControlProps) {
  const rootProps = {
    className: styles.root,
    "data-testid": "measurement-control-root",
    "data-panel-open": panelOpen ? "true" : "false",
  } as const;

  if (!active || panelOpen) {
    return (
      <div {...rootProps}>
        <IconButton
          label={panelOpen ? "Back to map" : "Measure distance and area"}
          data-testid="measurement-control-toggle"
          data-e2e="measurement-control-toggle"
          onClick={panelOpen ? onRequestPanelClose : onToggleActive}
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
