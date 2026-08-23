import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { customScrollbar, eyebrowLabel } from "../../shared.css";
import { designTokens, zIndexTokens } from "../../theme/mapTokens";

export const container = style([
  customScrollbar,
  {
    position: "absolute",
    left: "1.25rem",
    bottom: `calc(3.25rem + ${designTokens.controlHeight} + 0.75rem)`,
    zIndex: zIndexTokens.floatingControlZIndex,
    width: "min(15rem, calc(100vw - 2.5rem))",
    maxHeight: "min(40dvh, 20rem)",
    padding: "0.875rem",
    border: `1px solid ${vars.color.outline}`,
    borderRadius: vars.shape.cornerLarge,
    background: vars.color.surfaceContainerHigh,
    boxShadow: vars.elevation.shadow3,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  },
]);

export const title = style([
  eyebrowLabel,
  {
    margin: `0 0 ${designTokens.space3}`,
    color: vars.color.onSurface,
    fontSize: designTokens.fontSizeSm,
  },
]);
