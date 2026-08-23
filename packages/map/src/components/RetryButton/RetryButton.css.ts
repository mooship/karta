import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { designTokens } from "../../theme/mapTokens";

export const button = style({
  flexShrink: 0,
  padding: "0.2rem 0.55rem",
  border: `1px solid ${vars.color.outlineVariant}`,
  borderRadius: vars.shape.cornerSmall,
  background: "transparent",
  color: vars.color.onSurface,
  font: "inherit",
  fontSize: designTokens.fontSizeSm,
  cursor: "pointer",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  ":hover": {
    background: vars.state.hover,
  },
  ":focus-visible": {
    outline: `${designTokens.focusRingWidth} solid ${vars.color.onSurface}`,
    outlineOffset: 2,
  },
});
