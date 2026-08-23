import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { appVars } from "./theme/app.css";

/**
 * Small style utilities shared across this app's own vanilla-extract style
 * files via array composition (`style([shared.x, {...}])`) -- this app's
 * convention for a rule set two or more components need identically, in
 * place of hand-copying it. Add to this file rather than re-copying an
 * existing component's rules.
 * @remarks Unlike `@karta/map`'s own `shared.css.ts`, this app's
 *   `eyebrowLabel` includes `color`/`font-size` directly: those vary per
 *   consumer in the SDK package (where overriding a composed property used
 *   to rely on CSS Modules' unordered cascade -- no longer a concern under
 *   vanilla-extract's array composition, but the split is kept as-is here
 *   too, for consistency), but this app has exactly one style for each and
 *   no reason to let a consumer override them.
 */
export const eyebrowLabel = style({
  margin: 0,
  color: vars.color.onSurfaceVariant,
  fontFamily: appVars.font.mono,
  fontSize: appVars.fontSize.xs,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
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
