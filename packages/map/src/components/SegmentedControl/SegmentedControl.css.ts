import { vars } from "@karta/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { visuallyHidden } from "../../shared.css";
import { designTokens } from "../../theme/mapTokens";

export const group = style({
  display: "flex",
  flexWrap: "wrap",
  gap: designTokens.controlGap,
  border: `1px solid ${vars.color.outline}`,
  borderRadius: vars.shape.cornerMedium,
  background: vars.color.surfaceContainer,
  margin: 0,
  padding: designTokens.controlPadding,
  minWidth: 0,
});

export const legend = visuallyHidden;

const segmentedControlSelect = keyframes({
  from: { transform: "scale(0.92)" },
  to: { transform: "scale(1)" },
});

export const option = style({
  flex: 1,
  minHeight: designTokens.controlHeight,
  padding: `0 ${designTokens.space3}`,
  border: "1px solid transparent",
  borderRadius: vars.shape.cornerSmall,
  background: "transparent",
  color: vars.color.onSurface,
  fontFamily: designTokens.fontBody,
  fontSize: designTokens.fontSizeBase,
  fontWeight: 500,
  cursor: "pointer",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}, color ${vars.motion.durationShort} ${vars.motion.easeStandard}, transform ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  selectors: {
    "&:hover": {
      background: vars.state.hover,
    },
    /**
     * Replays whenever this attribute selector starts matching -- i.e.
     * every time a click actually changes the selected option, not on
     * unrelated re-renders -- giving the newly-picked option a small
     * settle-in pop rather than an instant colour swap.
     */
    '&[aria-pressed="true"]': {
      background: vars.state.selected,
      color: vars.color.onSurface,
      fontWeight: 700,
      animationName: segmentedControlSelect,
      animationDuration: vars.motion.durationMedium,
      animationTimingFunction: vars.motion.easeSpring,
    },
    "&:active": {
      transform: "scale(0.98)",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&:focus-visible": {
      outline: `${designTokens.focusRingWidth} solid ${vars.color.onSurface}`,
      outlineOffset: -2,
    },
  },
});
