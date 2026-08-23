import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { appVars } from "../../theme/app.css";

export const body = style({
  margin: 0,
  padding: "0 0.625rem",
  color: vars.color.onSurface,
  fontSize: appVars.fontSize.base,
  lineHeight: 1.5,
});
