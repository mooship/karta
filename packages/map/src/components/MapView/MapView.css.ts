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
 * Combined OSM + basemap-provider attribution text can run long enough to
 * span most of the viewport width and collide with the bottom-left scale
 * control on narrow screens. Cap its width and let it wrap onto a second
 * line instead. Targets Leaflet's own DOM (not this package's), hence
 * globalStyle rather than a scoped class.
 */
globalStyle(".leaflet-control-attribution", {
  maxWidth: "min(60vw, 22rem)",
  overflowWrap: "break-word",
  whiteSpace: "normal",
  "@media": {
    [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
      maxWidth: "52vw",
      fontSize: designTokens.fontSizeMd,
    },
  },
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
