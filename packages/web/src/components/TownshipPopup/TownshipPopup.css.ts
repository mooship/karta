import { vars } from "@karta/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { appVars } from "../../theme/app.css";

export const popup = style({
  fontFamily: appVars.font.body,
  minWidth: "14rem",
});

export const name = style({
  fontFamily: appVars.font.display,
  fontSize: appVars.fontSize.lg,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  margin: "0 0 0.5rem",
});

export const rows = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: "0.15rem 0.75rem",
  margin: 0,
  fontSize: appVars.fontSize.base,
});

globalStyle(`.${rows} dt`, {
  color: vars.color.onSurfaceVariant,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontSize: appVars.fontSize.sm,
  alignSelf: "center",
});

globalStyle(`.${rows} dd`, {
  margin: 0,
  textAlign: "right",
});

export const value = style({
  fontFamily: appVars.font.mono,
  fontVariantNumeric: "tabular-nums",
});
