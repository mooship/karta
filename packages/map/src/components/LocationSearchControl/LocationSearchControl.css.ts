import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { vars } from "@karta/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { eyebrowLabel, searchInput } from "../../shared.css";
import { designTokens } from "../../theme/mapTokens";

export const root = style({
  display: "grid",
  gap: "0.375rem",
  width: "min(28rem, calc(100vw - 7rem))",
  "@media": {
    [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
      width: "100%",
    },
  },
});

export const label = style([
  eyebrowLabel,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    color: vars.color.onSurfaceVariant,
    fontSize: designTokens.fontSizeMd,
  },
]);

globalStyle(`.${label} svg`, {
  width: "0.9rem",
  height: "0.9rem",
});

export const inputRow = style({
  position: "relative",
});

export const input = style([
  searchInput,
  {
    padding: "0.5rem 3.25rem 0.5rem 0.625rem",
    letterSpacing: "0.004em",
    textOverflow: "ellipsis",
    selectors: {
      "&:focus-visible": {
        outline: `${designTokens.focusRingWidth} solid ${vars.color.onSurface}`,
        outlineOffset: 2,
      },
    },
  },
]);

/**
 * Sized to meet the design system's touch-target floor -- with `.input` at
 * the same height, this now matches it exactly rather than poking out
 * above/below, so `right` only needs to clear the input's own rounded
 * border rather than also room for a taller button.
 */
export const clearButton = style({
  position: "absolute",
  top: "50%",
  right: "0.1rem",
  transform: "translateY(-50%)",
  width: designTokens.controlHeight,
  height: designTokens.controlHeight,
  minHeight: 0,
});

globalStyle(`.${clearButton} svg`, {
  width: "0.9rem",
  height: "0.9rem",
});

export const status = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  margin: 0,
  color: vars.color.onSurfaceVariant,
  fontSize: designTokens.fontSizeMd,
});

export const results = style({
  listStyle: "none",
  display: "grid",
  gap: "0.3rem",
  margin: 0,
  padding: 0,
  maxHeight: "min(40dvh, 15rem)",
  overflowY: "auto",
});

export const resultButton = style({
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  width: "100%",
  minHeight: designTokens.controlHeight,
  padding: "0.45rem 0.55rem",
  border: "1px solid transparent",
  borderRadius: vars.shape.cornerSmall,
  background: vars.color.surfaceContainer,
  color: vars.color.onSurface,
  font: "inherit",
  textAlign: "left",
  cursor: "pointer",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}, transform ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  selectors: {
    "&:focus-visible": {
      outline: `${designTokens.focusRingWidth} solid ${vars.color.onSurface}`,
      outlineOffset: 2,
    },
    "&:hover": {
      background: vars.color.surfaceContainerHover,
    },
    "&:active": {
      transform: "scale(0.99)",
    },
    '&[data-active="true"]': {
      background: vars.state.selected,
      borderColor: vars.color.primary,
    },
  },
});

/**
 * A feature result (select it on the map) and a place result (fly to it)
 * do meaningfully different things when chosen, so each option is marked
 * with a small icon rather than relying on a visual grouping/heading --
 * keeps the whole list a single flat ARIA listbox instead of nested groups.
 */
export const resultIcon = style({
  flexShrink: 0,
  width: "1rem",
  height: "1rem",
  color: vars.color.onSurfaceVariant,
});
