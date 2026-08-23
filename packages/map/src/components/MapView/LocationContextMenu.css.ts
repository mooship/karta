import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { designTokens } from "../../theme/mapTokens";

export const menu = style({
  display: "grid",
  gap: "0.25rem",
  minWidth: "11rem",
});

export const menuItem = style({
  width: "100%",
  padding: "0.4rem 0.5rem",
  border: "none",
  borderRadius: vars.shape.cornerSmall,
  background: "transparent",
  color: vars.color.onSurface,
  font: "inherit",
  fontSize: designTokens.fontSizeMd,
  textAlign: "left",
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

export const result = style({
  display: "block",
  margin: 0,
  padding: "0.4rem 0.5rem",
  color: vars.color.onSurface,
  fontSize: designTokens.fontSizeMd,
});
