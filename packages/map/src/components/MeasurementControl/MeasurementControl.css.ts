import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { eyebrowLabel } from "../../shared.css";
import {
  designTokens,
  mobileLayoutTokens,
  zIndexTokens,
} from "../../theme/mapTokens";

/**
 * Every map corner is already spoken for by the time this control has to
 * find a spot: top-right holds the info panel and its toggle (the panel
 * is open by default on desktop, and its content routinely reaches from
 * just below the toggle almost to the viewport's bottom edge); top-left
 * holds the search box; bottom-left stacks the basemap/theme settings and
 * the legend; bottom-right holds Leaflet's own zoom control. The one
 * reliably free strip is directly beneath the search box on the left --
 * settings/legend sit much further down, so this control stacks there
 * instead of contesting a corner. 9rem clears the search box's whole
 * rendered footprint, not just its own content box: measured at ~128px
 * from the viewport edge (its `top` offset plus its wrapper's
 * padding/border plus the app-name label and search field it now stacks),
 * with a comfortable double-digit-pixel gap left beneath it -- the previous
 * 7.5rem was measured before the app-name label was added above the
 * search field and had come to overlap it by a few pixels.
 */
export const root = style({
  position: "absolute",
  insetInlineStart: "1.25rem",
  insetBlockStart: "9rem",
  zIndex: zIndexTokens.floatingControlZIndex,
  "@media": {
    /**
     * `mobileControlEdge`/`mobileSearchClearance`/`mobileSafeTop` are
     * `@karta/map`'s own documented mobile layout contract (see
     * MOBILE_LAYOUT_CSS_VAR_DEFAULTS, ../../constants/mobileLayoutTokens.ts,
     * for the full set and their defaults, used via mapTokens.ts's typed
     * helper below) -- a host app defines these to tell every mobile
     * floating control where its own search box and safe-area insets
     * actually are, rather than each control needing its own bespoke prop
     * for the same handful of app-composition values.
     */
    [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
      insetInlineStart: mobileLayoutTokens.mobileControlEdge,
      insetBlockStart: `calc(${mobileLayoutTokens.mobileSearchClearance} + ${mobileLayoutTokens.mobileSafeTop})`,
    },
  },
});

export const panel = style({
  display: "grid",
  gap: "0.5rem",
  width: "min(16rem, calc(100vw - 4rem))",
  padding: "0.75rem",
  borderRadius: vars.shape.cornerSmall,
  background: vars.color.surfaceContainer,
  boxShadow: vars.elevation.shadow2,
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
});

export const title = style([
  eyebrowLabel,
  {
    color: vars.color.onSurfaceVariant,
    fontSize: designTokens.fontSizeMd,
  },
]);

export const hint = style({
  margin: 0,
  color: vars.color.onSurfaceVariant,
  fontSize: designTokens.fontSizeSm,
  lineHeight: 1.35,
});

export const resultRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
});

export const result = style({
  color: vars.color.onSurface,
  fontFamily: designTokens.fontMono,
  fontSize: designTokens.fontSizeBase,
  fontWeight: 700,
});
