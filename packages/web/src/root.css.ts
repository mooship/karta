import { vars } from "@karta/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { appVars } from "./theme/app.css";

export const errorBoundary = style({
  display: "grid",
  placeItems: "center",
  gap: "0.75rem",
  height: "100dvh",
  padding: "2rem",
  textAlign: "center",
  background: vars.color.surface,
  color: vars.color.onSurface,
  fontFamily: appVars.font.body,
});

globalStyle(`.${errorBoundary} h1`, {
  margin: 0,
  fontSize: "1.5rem",
});

globalStyle(`.${errorBoundary} p`, {
  margin: 0,
  maxWidth: "32rem",
  color: vars.color.onSurfaceVariant,
});

globalStyle(`.${errorBoundary} button`, {
  minHeight: "48px",
  padding: "0 1.5rem",
  border: `1px solid ${vars.color.outlineVariant}`,
  borderRadius: vars.shape.cornerMedium,
  background: vars.color.primary,
  color: vars.color.onPrimary,
  fontFamily: appVars.font.body,
  fontSize: "1rem",
  cursor: "pointer",
});
