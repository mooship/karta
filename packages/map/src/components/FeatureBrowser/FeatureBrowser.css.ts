import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { eyebrowLabel, searchInput, visuallyHidden } from "../../shared.css";
import { designTokens } from "../../theme/mapTokens";

export const browser = style({
  display: "grid",
  gap: "0.75rem",
});

export const filterLabel = visuallyHidden;

export const filterInput = style([
  searchInput,
  {
    padding: "0.5rem 0.625rem",
  },
]);

export const empty = style({
  margin: 0,
  padding: "0 0.625rem",
  color: vars.color.onSurfaceVariant,
  fontSize: designTokens.fontSizeSm,
  lineHeight: 1.35,
});

export const groups = style({
  display: "grid",
  gap: "0.75rem",
});

export const groupTitle = style([
  eyebrowLabel,
  {
    padding: "0 0.625rem",
    color: vars.color.onSurfaceVariant,
    // Not part of @karta/map's own documented DESIGN_TOKEN_CSS_VAR_DEFAULTS
    // contract (unlike the sm/md/base font-size tokens) -- matches the
    // original .module.css reference exactly.
    fontSize: "var(--font-size-xs, 0.6875rem)",
  },
]);

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
});

/**
 * `content-visibility: auto` lets the browser skip layout/style/paint work
 * for a row scrolled out of view, without any hand-rolled windowing --
 * `FeatureBrowser` can render several thousand rows at once (one per
 * selectable feature across every visible layer, e.g. every township in a
 * region), and only a small fraction are ever on screen. `contain-intrinsic-size`
 * reserves `row`'s own `minHeight` plus `list`'s `gap` so an off-screen row's
 * collapsed box still holds its place in the scroll container -- without it,
 * skipped rows report zero size and the scrollbar/scroll position jump as
 * rows above the viewport are skipped or un-skipped while scrolling.
 */
export const listItem = style({
  contentVisibility: "auto",
  containIntrinsicSize: "auto 50px",
});

export const row = style({
  display: "block",
  width: "100%",
  minHeight: "48px",
  padding: "0.5rem 0.625rem",
  border: 0,
  borderRadius: vars.shape.cornerSmall,
  background: "transparent",
  color: vars.color.onSurface,
  font: "inherit",
  textAlign: "left",
  cursor: "pointer",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  selectors: {
    "&:hover": {
      background: vars.state.hover,
    },
    '&[aria-current="true"]': {
      background: vars.state.selected,
      fontWeight: 600,
    },
    "&:focus-visible": {
      outline: `${designTokens.focusRingWidth} solid ${vars.color.onSurface}`,
      outlineOffset: -2,
    },
  },
});
