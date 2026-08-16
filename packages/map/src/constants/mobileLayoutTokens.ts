/**
 * CSS custom properties `@karta/map`'s mobile floating-control components
 * (`MobileLegend`, `MeasurementControl`) read from an ancestor element to
 * position and time themselves around the rest of a host app's mobile
 * chrome — a search box, a bottom sheet/info panel, safe-area insets — that
 * only the host itself knows the shape of. Each is read via `var(--name,
 * <default>)` in those components' own stylesheets, using exactly the
 * default value listed here, so a host that defines none of them still gets
 * a fully working (if generic) mobile layout; a host composing its own
 * mobile chrome around these components should define whichever of these it
 * needs to coordinate with, on an ancestor of both (typically wherever
 * `MapView` and its sibling controls are mounted).
 * @remarks This is the mobile layout equivalent of the M3 colour/shape/
 *   elevation tokens documented in `docs/design-system.md` at the repo
 *   root — a contract this package declares and a host app may override —
 *   except these describe app-composition geometry (where does *your*
 *   search box sit, how tall is *your* bottom sheet) rather than visual
 *   design tokens, so they're kept separate from that shared token set
 *   rather than folded into it.
 */
export const MOBILE_LAYOUT_CSS_VAR_DEFAULTS = {
  /** Horizontal inset of floating mobile controls from the viewport edge. */
  "--mobile-control-edge": "0.75rem",
  /** Vertical offset of the lowest-stacked floating control from the viewport's bottom edge. */
  "--mobile-control-bottom": "calc(1.5rem + env(safe-area-inset-bottom))",
  /** Width/height of a square floating icon control — also this package's own minimum touch target. */
  "--mobile-control-size": "44px",
  /** Gap between floating controls stacked along the same edge. */
  "--mobile-control-gap": "0.625rem",
  /** Safe-area inset from the top of the viewport (notches, status bars). */
  "--mobile-safe-top": "env(safe-area-inset-top)",
  /**
   * How far down the host's own search box (or equivalent top chrome)
   * reaches, so a control stacking beneath it doesn't overlap.
   */
  "--mobile-search-clearance": "8.25rem",
  /**
   * How long a control takes to reposition itself around a host bottom
   * sheet opening, closing, or resizing, so multiple controls doing so move
   * in step with each other and with the sheet itself.
   */
  "--panel-reposition-duration": "300ms",
  /** Height of a host bottom sheet at its default ("medium") size. */
  "--mobile-sheet-height-medium": "min(66dvh, 36rem)",
  /** Height of a host bottom sheet at its expanded ("full") size. */
  "--mobile-sheet-height-full": "min(84dvh, 45rem)",
} as const;

/** A CSS custom property name declared by `MOBILE_LAYOUT_CSS_VAR_DEFAULTS`. */
export type MobileLayoutCssVar = keyof typeof MOBILE_LAYOUT_CSS_VAR_DEFAULTS;
