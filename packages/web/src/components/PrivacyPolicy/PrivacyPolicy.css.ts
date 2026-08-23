import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { link } from "../../shared.css";
import { appVars } from "../../theme/app.css";

export const page = style({
  boxSizing: "border-box",
  maxWidth: "40rem",
  margin: "0 auto",
  padding: `${appVars.space.space4} ${appVars.space.space3} 3rem`,
  color: vars.color.onSurface,
  fontFamily: appVars.font.body,
});

export const heading = style({
  margin: `0 0 ${appVars.space.space2}`,
  fontSize: "1.5rem",
});

export const updated = style({
  margin: `0 0 ${appVars.space.space4}`,
  color: vars.color.onSurfaceVariant,
  fontSize: appVars.fontSize.base,
});

export const sectionTitle = style({
  margin: `${appVars.space.space4} 0 ${appVars.space.space1}`,
  fontSize: "1.125rem",
  fontWeight: 600,
});

export const body = style({
  margin: `0 0 ${appVars.space.space2}`,
  lineHeight: 1.6,
});

export const backLink = style([
  link,
  {
    display: "inline-block",
    marginTop: appVars.space.space4,
  },
]);
