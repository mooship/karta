import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { appVars } from "./theme/app.css";

/**
 * Small style utilities shared across this app's own vanilla-extract style
 * files via array composition (`style([shared.x, {...}])`). That is this app's
 * convention for a rule set two or more components need identically, in
 * place of hand-copying it. Add to this file rather than re-copying an
 * existing component's rules.
 * @remarks Unlike `@karta/map`'s own `shared.css.ts`, this app's
 *   `eyebrowLabel` sets `color` and `font-size` directly. The SDK
 *   package leaves them to each consumer; this app has one style for each.
 */
export const eyebrowLabel = style({
  margin: 0,
  color: vars.color.onSurfaceVariant,
  fontFamily: appVars.font.body,
  fontSize: appVars.fontSize.xs,
  fontWeight: 600,
});

export const link = style({
  color: vars.color.primary,
});

export const visuallyHidden = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
});
