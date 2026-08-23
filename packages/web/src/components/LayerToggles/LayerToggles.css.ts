import { vars } from "@karta/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { eyebrowLabel } from "../../shared.css";
import { appVars } from "../../theme/app.css";

export const groups = style({
  display: "grid",
  gap: "0.75rem",
});

export const group = style({
  display: "grid",
  gap: "0.25rem",
});

export const groupTitle = style([
  eyebrowLabel,
  {
    padding: "0 0.625rem",
  },
]);

export const groupHint = style({
  margin: 0,
  padding: "0 0.625rem",
  color: vars.color.onSurfaceVariant,
  fontSize: appVars.fontSize.sm,
  lineHeight: 1.35,
});

export const divider = style({
  height: "1px",
  margin: "0.125rem 0.625rem",
  background: `color-mix(in srgb, ${vars.color.outlineVariant} 45%, transparent)`,
});

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
});

const layerRowIn = keyframes({
  from: { opacity: 0, transform: "translateY(4px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const row = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.25rem 0.625rem",
  padding: "0.5rem 0.625rem",
  minHeight: "48px",
  borderRadius: vars.shape.cornerSmall,
  fontSize: appVars.fontSize.base,
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  /**
   * Runs once as each row mounts (each group's own list, on first render)
   * -- a checkbox toggle re-renders the same DOM node rather than
   * remounting it, so this doesn't replay on every click, only on genuine
   * entrance.
   */
  animationName: layerRowIn,
  animationDuration: vars.motion.durationMedium,
  animationTimingFunction: vars.motion.easeDecelerate,
  animationFillMode: "backwards",
  selectors: {
    "&:hover": {
      background: vars.state.hover,
    },
    '&[data-unavailable="true"]': {
      color: vars.color.onSurfaceVariant,
    },
    '&[data-unavailable="true"]:hover': {
      background: "transparent",
    },
  },
});

/**
 * 40ms per row, capped after four -- the same stagger rhythm as
 * @karta/map's Legend (Legend.css.ts's `entry` rules), so cascading lists
 * read as one motion language across the app rather than two independently
 * hand-tuned timings. Ancestor-qualified (`.list .row`, not just `.row`)
 * matching the original -- `row` only ever renders inside `list` today, but
 * the qualifier is preserved rather than dropped as part of this migration.
 */
globalStyle(`.${list} .${row}:nth-child(2)`, { animationDelay: "40ms" });
globalStyle(`.${list} .${row}:nth-child(3)`, { animationDelay: "80ms" });
globalStyle(`.${list} .${row}:nth-child(4)`, { animationDelay: "120ms" });
globalStyle(`.${list} .${row}:nth-child(n + 5)`, { animationDelay: "160ms" });

/**
 * `display: contents` drops this label's own box so its children keep
 * participating directly in `.row`'s flex layout, exactly as when the
 * label wrapped the whole row -- while still scoping the label's native
 * click-to-toggle behaviour to just these children, not the download link
 * rendered as `.row`'s other child.
 */
export const rowLabel = style({
  display: "contents",
  cursor: "pointer",
});

globalStyle(`.${row}[data-unavailable="true"] .${rowLabel}`, {
  cursor: "not-allowed",
});

export const checkbox = style({
  appearance: "none",
  position: "relative",
  flexShrink: 0,
  width: "2.25rem",
  height: "1.25rem",
  margin: 0,
  borderRadius: vars.shape.cornerFull,
  background: `color-mix(in srgb, ${vars.color.outlineVariant} 42%, transparent)`,
  cursor: "pointer",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      top: "2px",
      left: "2px",
      width: "1rem",
      height: "1rem",
      borderRadius: vars.shape.cornerFull,
      background: vars.color.onSurface,
      transition: `transform ${vars.motion.durationShort} ${vars.motion.easeDecelerate}`,
    },
    "&:checked": {
      background: vars.color.primary,
    },
    "&:checked::before": {
      transform: "translateX(1rem)",
      background: vars.color.onPrimary,
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.4,
    },
  },
});

export const label = style({
  flex: "1 1 auto",
  minWidth: 0,
});

export const description = style({
  flexBasis: "100%",
  marginLeft: "2.875rem",
  color: vars.color.onSurfaceVariant,
  fontSize: appVars.fontSize.sm,
  lineHeight: 1.35,
});

export const badge = style({
  flexShrink: 0,
  marginLeft: "2.875rem",
  fontFamily: appVars.font.mono,
  fontSize: appVars.fontSize.sm,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  color: vars.color.onSurfaceVariant,
  border: `1px solid ${vars.color.outlineVariant}`,
  borderRadius: vars.shape.cornerSmall,
  padding: "0.125rem 0.375rem",
});

export const badgeError = style({
  flexBasis: "100%",
  marginLeft: "2.875rem",
  fontSize: appVars.fontSize.sm,
  lineHeight: 1.35,
  color: vars.color.error,
});

/**
 * Groups every dataSource's download link + CSV button pair and pushes the
 * whole group to the row's right edge with a single `marginLeft: "auto"` --
 * applying that to each `.download` icon individually (the previous
 * approach) split the row's free space between every auto margin instead,
 * scattering the icons across the row rather than clustering them.
 */
export const downloads = style({
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  gap: "0.25rem",
  marginLeft: "auto",
});

/**
 * `download` is shared by an `<a>` (the GeoJSON link) and a `<button>`
 * (the CSV export trigger) so they read as one visual family; the reset
 * properties below (`border`/`background`/`padding`/`font`/`cursor`) only
 * affect the `<button>` in practice, since a plain `<a>` has no default
 * browser chrome to begin with, but without them the button showed its
 * native outline and background instead of matching the link.
 */
export const download = style({
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  width: appVars.controlHeight,
  height: appVars.controlHeight,
  border: 0,
  borderRadius: vars.shape.cornerFull,
  background: "transparent",
  padding: 0,
  color: vars.color.onSurfaceVariant,
  font: "inherit",
  cursor: "pointer",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  selectors: {
    "&:hover": {
      background: vars.state.hover,
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
});

globalStyle(`.${checkbox}:focus-visible, .${download}:focus-visible`, {
  outline: `${appVars.focusRingWidth} solid ${vars.color.onSurface}`,
  outlineOffset: 2,
});

export const downloadIcon = style({
  width: "1.125rem",
  height: "1.125rem",
});
