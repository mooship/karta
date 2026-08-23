import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";
import { eyebrowLabel, popoverIn } from "../../shared.css";
import { designTokens } from "../../theme/mapTokens";

export const container = style({
  position: "relative",
});

export const menu = style([
  popoverIn,
  {
    position: "absolute",
    bottom: "calc(100% + 0.5rem)",
    left: 0,
    isolation: "isolate",
    display: "flex",
    flexDirection: "column",
    gap: designTokens.space2,
    /**
     * No min-width here: a `minWidth: "max-content"` used to sit alongside
     * this `width`, but min-width always wins the two against each other,
     * so once any child's own content (e.g. a `SegmentedControl` with
     * enough options) grew wider than this cap, the whole menu was forced
     * wider than the viewport instead of letting that child wrap. Children
     * must wrap/shrink to fit this width, not the other way around.
     */
    width: "min(21rem, calc(100vw - 2.5rem))",
    padding: "0.875rem",
    border: `1px solid ${vars.color.outline}`,
    borderRadius: vars.shape.cornerLarge,
    background: vars.color.surfaceContainerHigh,
    boxShadow: vars.elevation.shadow3,
  },
]);

export const title = style([
  eyebrowLabel,
  {
    color: vars.color.onSurface,
    fontSize: designTokens.fontSizeSm,
  },
]);

export const basemapHint = style({
  margin: 0,
  maxWidth: "21rem",
  color: vars.color.onSurfaceVariant,
  fontFamily: designTokens.fontBody,
  fontSize: designTokens.fontSizeMd,
  lineHeight: 1.35,
});
