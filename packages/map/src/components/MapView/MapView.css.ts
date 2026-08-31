import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { mapLabelVars, vars } from "@karta/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { visuallyHidden as sharedVisuallyHidden } from "../../shared.css";
import { designTokens } from "../../theme/mapTokens";

export const mapWrapper = style({
  position: "absolute",
  inset: 0,
});

export const map = style({
  height: "100%",
  width: "100%",
  background: vars.color.surface,
});

export const visuallyHidden = sharedVisuallyHidden;

export const darkTile = style({
  filter: "brightness(1.22) contrast(0.94) saturate(0.92)",
});

/**
 * Approximates a dark variant for a cartographic (non-imagery) basemap that
 * has no official dark tile set, so it doesn't sit jarringly bright under
 * an otherwise dark UI: inverting lightness and rotating hue back to its
 * original angle turns a light basemap dark while roughly preserving its
 * relative colours, then brightness/contrast are tempered to avoid a
 * harsh, over-inverted look.
 */
export const dimmedTile = style({
  filter: "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)",
});

/**
 * Toggle-marker class for the attribution control's expanded state, added/
 * removed via `classList.toggle` by `CollapsibleAttribution` in
 * `MapView.tsx` (not a React `className` prop — Leaflet owns this DOM node
 * directly). Carries no styles of its own; only the compound selectors
 * below, combined with `.leaflet-control-attribution`, do.
 */
export const attributionExpanded = style({});

/**
 * Collapses Leaflet's default attribution control — required credit text
 * for the current basemap's tile/style provider(s) (OpenStreetMap,
 * OpenFreeMap, Esri), which combined can run long enough to span most of
 * the viewport width and collide with the bottom-left scale control — to a
 * small `ⓘ` indicator by default, expanding to full width and wrapping
 * onto further lines (rather than overflowing) once `attributionExpanded`
 * is toggled on. Targets Leaflet's own DOM (not this package's), hence
 * globalStyle rather than a scoped class.
 * @remarks The real attribution text and links stay in the DOM and the
 *   accessibility tree throughout collapse/expand — only their *visible*
 *   rendering is suppressed, via `fontSize: 0` on collapse, never
 *   `display`/`visibility`, which would also hide them from assistive
 *   technology. Collapsing this visually must never remove the credit
 *   these providers require in exchange for their tiles/styles.
 * @remarks `position: absolute` unconditionally, in both states, is
 *   deliberate: Leaflet stacks every bottom-right control (the zoom
 *   control included) in one shared, bottom-anchored flow container, so a
 *   control that's only *sometimes* taken out of that flow shifts its
 *   siblings the moment it toggles, exactly when it's meant to stop doing
 *   that. Applying it always instead means this control never contributes
 *   to that flow's height at all, in either state — the zoom control's
 *   position is unaffected by anything this one does. An explicit `width`
 *   (not `max-width`) in the expanded state sidesteps a separate hazard:
 *   the corner container it's absolutely positioned against is only as
 *   wide as the zoom control above it, so a shrink-to-fit width here would
 *   resolve against that narrow box and wrap into an unreadably narrow,
 *   tall column instead of the wide, few-line box intended.
 */
globalStyle(".leaflet-control-attribution", {
  position: "absolute",
  right: 0,
  bottom: 0,
  boxSizing: "border-box",
  width: "1.75rem",
  height: "1.75rem",
  overflow: "hidden",
  cursor: "pointer",
  // Zeroes the real attribution text/links visually — including any bare
  // text node Leaflet renders directly inside this container, which a
  // child-element selector (`> *`) can't reach — while leaving them fully
  // present for assistive technology, which reads DOM text regardless of
  // font-size.
  fontSize: 0,
});

globalStyle(".leaflet-control-attribution::before", {
  content: '"ⓘ"',
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: designTokens.fontSizeMd,
  fontWeight: 700,
});

globalStyle(`.leaflet-control-attribution.${attributionExpanded}`, {
  width: "min(60vw, 22rem)",
  height: "auto",
  overflow: "visible",
  overflowWrap: "break-word",
  whiteSpace: "normal",
  cursor: "auto",
  // Restores the ambient font-size (from this control's own DOM parent,
  // not from the `fontSize: 0` rule above, since that rule targets the
  // same element rather than an ancestor) now that the real text is meant
  // to be visible again.
  fontSize: "inherit",
  "@media": {
    [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
      width: "52vw",
      fontSize: designTokens.fontSizeMd,
    },
  },
});

globalStyle(`.leaflet-control-attribution.${attributionExpanded}::before`, {
  content: "none",
});

export const areaLabel = style({
  padding: "3px 6px",
  border: `1px solid ${mapLabelVars.outline}`,
  borderRadius: vars.shape.cornerSmall,
  background: mapLabelVars.surface,
  boxShadow: vars.elevation.shadow1,
  color: mapLabelVars.text,
  fontFamily: designTokens.fontMono,
  fontSize: designTokens.fontSizeMd,
  fontWeight: 700,
  letterSpacing: 0,
  pointerEvents: "none",
  selectors: {
    "&::before": {
      display: "none",
    },
  },
});

export const areaLabelPrimary = style({
  display: "none",
});

export const areaLabelMajor = style({
  display: "block",
});

export const areaLabelSecondary = style({
  display: "none",
  background: mapLabelVars.surfaceSecondary,
  fontSize: designTokens.fontSizeMd,
  fontWeight: 600,
  opacity: 0.94,
});

/**
 * Marker classes toggled directly on the Leaflet map container's DOM
 * element (via `classList.toggle`, not a React `className` prop -- see
 * `AreaLabelVisibility` in `MapView.tsx`), so they carry no styling of
 * their own; only the compound selectors below, targeting a label that's a
 * descendant of one of these, do.
 */
export const showPrimaryLabels = style({});
export const showSecondaryLabels = style({});

globalStyle(`.${showPrimaryLabels} .${areaLabelPrimary}`, {
  display: "block",
});

globalStyle(`.${showSecondaryLabels} .${areaLabelSecondary}`, {
  display: "block",
});
