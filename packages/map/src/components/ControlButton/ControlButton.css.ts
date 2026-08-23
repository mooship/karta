import { vars } from "@karta/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { designTokens } from "../../theme/mapTokens";

const baseTransition = `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}, border-color ${vars.motion.durationShort} ${vars.motion.easeStandard}, box-shadow ${vars.motion.durationShort} ${vars.motion.easeStandard}, translate ${vars.motion.durationShort} ${vars.motion.easeStandard}, scale ${vars.motion.durationShort} ${vars.motion.easeStandard}`;

/**
 * `.button`'s own base transition list, plus an optional
 * `--control-button-extra-transition` a caller can set (via its own class
 * on this same element, or an inline style) to append further transitions
 * -- e.g. `App.css.ts`'s `panelTrigger`, which also needs this element's
 * `bottom` position to transition. This is a real, documented extension
 * point rather than the cascade-order trick the CSS Modules version relied
 * on (a same-specificity selector deliberately written to outrank this
 * one): CSS's `transition` shorthand doesn't merge across rules, so two
 * rules setting `transition` independently would have one silently
 * overwrite the other regardless of which "should" win; a caller instead
 * only ever sets the extra-transition custom property, never `transition`
 * itself, so there's no rule to lose that race.
 */
export const button = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: designTokens.space2,
  minHeight: designTokens.controlHeight,
  minWidth: designTokens.controlHeight,
  padding: 0,
  border: `1px solid ${vars.color.outline}`,
  borderRadius: vars.shape.cornerMedium,
  background: vars.color.surfaceContainer,
  boxShadow: vars.elevation.shadow1,
  color: vars.color.onSurface,
  fontFamily: designTokens.fontBody,
  fontSize: designTokens.fontSizeBase,
  fontWeight: 600,
  letterSpacing: "0.01em",
  cursor: "pointer",
  transition: `${baseTransition}, var(--control-button-extra-transition, none)`,
  selectors: {
    '&[data-shape="icon"]': {
      width: designTokens.controlHeight,
    },
    '&[data-shape="pill"]': {
      padding: "0 1.125rem",
      borderRadius: vars.shape.cornerFull,
    },
    '&[data-variant="embedded"]': {
      borderColor: "transparent",
      background: "transparent",
      boxShadow: "none",
    },
    "&:hover": {
      background: vars.color.surfaceContainerHover,
      boxShadow: vars.elevation.shadow2,
      translate: "0 -0.5px",
    },
    "&:active": {
      scale: "0.97",
      background: `color-mix(in srgb, ${vars.color.surfaceContainer} 88%, ${vars.color.onSurface} 12%)`,
    },
    '&[data-variant="embedded"]:hover': {
      background: vars.state.hover,
      boxShadow: "none",
      translate: "none",
    },
    "&:focus-visible": {
      outline: `${designTokens.focusRingWidth} solid ${vars.color.onSurface}`,
      outlineOffset: 2,
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
      boxShadow: "none",
      translate: "none",
      scale: "1",
    },
  },
});

globalStyle(`${button} svg`, {
  width: "1.125rem",
  height: "1.125rem",
});
