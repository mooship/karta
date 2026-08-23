import { vars } from "@karta/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { designTokens } from "./theme/mapTokens";

/**
 * Small style utilities shared across this package's own vanilla-extract
 * style files via array composition (`style([shared.x, {...}])`) -- this
 * package's convention for a rule set two or more components need
 * identically, in place of hand-copying it. Add to this file rather than
 * re-copying an existing component's rules.
 * @remarks `color` and `font-size` are deliberately left out of
 *   {@link eyebrowLabel}: they vary per consumer. Under CSS Modules'
 *   `composes:` that split existed because overriding a composed property
 *   would have relied on cascade order between two same-specificity class
 *   selectors -- order the spec didn't actually guarantee. vanilla-extract's
 *   `style([base, overrides])` has deterministic, well-defined ordering
 *   (the array's later entries win), so that constraint no longer applies
 *   -- but the split itself is kept as-is here since removing it isn't
 *   this migration's job.
 */
export const eyebrowLabel = style({
  margin: 0,
  fontFamily: designTokens.fontMono,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

export const customScrollbar = style({
  scrollbarColor: `${vars.color.outlineVariant} transparent`,
  scrollbarWidth: "thin",
  "::-webkit-scrollbar": {
    width: 8,
  },
  "::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "::-webkit-scrollbar-thumb": {
    border: "2px solid transparent",
    borderRadius: vars.shape.cornerFull,
    background: vars.color.onSurfaceVariant,
    backgroundClip: "padding-box",
  },
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

/**
 * Text-input chrome shared by `LocationSearchControl`'s place/feature
 * search box and `FeatureBrowser`'s filter box -- each composes this and
 * adds only its own padding (the search box reserves room for its clear
 * button; the filter box doesn't need one) plus any input-specific
 * touches.
 */
export const searchInput = style({
  width: "100%",
  minHeight: designTokens.controlHeight,
  border: `1px solid ${vars.color.outline}`,
  borderRadius: vars.shape.cornerSmall,
  background: vars.color.surfaceContainer,
  color: vars.color.onSurface,
  font: "inherit",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  ":focus": {
    background: vars.color.surfaceContainerHigh,
  },
  "::-webkit-search-cancel-button": {
    display: "none",
  },
});

const popoverInKeyframes = keyframes({
  from: { opacity: 0, transform: "translateY(6px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

/**
 * A small card's fade+settle entrance, composed by any trigger-anchored
 * popover (`SettingsMenu`'s dropdown, `MobileLegend`'s sheet) so they read
 * as the same motion rather than two independently hand-tuned copies of
 * the identical recipe.
 */
export const popoverIn = style({
  animationName: popoverInKeyframes,
  animationDuration: vars.motion.durationMedium,
  animationTimingFunction: vars.motion.easeDecelerate,
});
