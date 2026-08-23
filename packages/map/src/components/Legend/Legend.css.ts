import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { vars } from "@karta/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { designTokens } from "../../theme/mapTokens";

export const groups = style({
  display: "grid",
  gap: "1rem",
  selectors: {
    '&[data-compact="true"]': {
      gap: "0.75rem",
    },
  },
  "@media": {
    [`screen and (min-width: ${MOBILE_BREAKPOINT_PX + 1}px)`]: {
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
    },
  },
});

export const fullWidthGroup = style({
  "@media": {
    [`screen and (min-width: ${MOBILE_BREAKPOINT_PX + 1}px)`]: {
      gridColumn: "1 / -1",
    },
  },
});

export const groupTitle = style({
  margin: "0 0 0.5rem",
  color: vars.color.onSurfaceVariant,
  fontFamily: designTokens.fontMono,
  fontSize: designTokens.fontSizeSm,
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
});

export const legend = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
});

const legendEntryIn = keyframes({
  from: { opacity: 0, transform: "translateX(-4px)" },
  to: { opacity: 1, transform: "translateX(0)" },
});

/**
 * 40ms per entry, capped after four -- @karta/web's LayerToggles (a
 * consumer, not a dependency of this package) mirrors this same rhythm for
 * its own list rows, so keep the two in step if either changes.
 */
export const entry = style({
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  /**
   * Runs once per entry as it mounts (a fresh key entering the DOM, whether
   * on first render or when toggling a layer adds a new legend section) --
   * existing entries don't replay this on unrelated re-renders since their
   * DOM node persists. Each list's own stagger restarts from its first
   * child (nth-child counts among `.entry`'s own siblings under whichever
   * `<ul>` renders it, not globally), so independent legend groups cascade
   * in on their own beat rather than sharing one running count.
   */
  animationName: legendEntryIn,
  animationDuration: vars.motion.durationMedium,
  animationTimingFunction: vars.motion.easeDecelerate,
  animationFillMode: "backwards",
  selectors: {
    "&:nth-child(2)": { animationDelay: "40ms" },
    "&:nth-child(3)": { animationDelay: "80ms" },
    "&:nth-child(4)": { animationDelay: "120ms" },
    "&:nth-child(n + 5)": { animationDelay: "160ms" },
  },
});

export const swatch = style({
  display: "inline-block",
  width: "1rem",
  height: "1rem",
  flexShrink: 0,
  border: `1px solid ${vars.color.outlineVariant}`,
  borderRadius: vars.shape.cornerExtraSmall,
});

export const lineSwatch = style({
  display: "inline-block",
  width: "1.125rem",
  height: "0.25rem",
  flexShrink: 0,
  borderRadius: "1px",
});

export const symbolGroup = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  flexShrink: 0,
});

export const dotSwatch = style({
  display: "inline-block",
  width: "0.5rem",
  height: "0.5rem",
  flexShrink: 0,
  borderRadius: vars.shape.cornerFull,
  border: `1px solid color-mix(in srgb, ${vars.color.onSurface} 30%, transparent)`,
});

export const symbolNote = style({
  color: vars.color.onSurfaceVariant,
  fontSize: designTokens.fontSizeSm,
});

export const label = style({
  fontSize: designTokens.fontSizeBase,
  color: vars.color.onSurface,
});

globalStyle(`.${groups}[data-compact="true"] .${label}`, {
  fontSize: designTokens.fontSizeMd,
});

export const empty = style({
  margin: 0,
  color: vars.color.onSurfaceVariant,
  fontSize: designTokens.fontSizeMd,
});
