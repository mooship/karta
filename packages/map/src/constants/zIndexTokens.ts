/**
 * CSS custom properties `@karta/map`'s floating map controls read for their
 * stacking order (`z-index`), so a host app's own floating chrome (a search
 * box, a settings button) and this package's own controls (`DesktopLegend`,
 * `MobileLegend`, `MeasurementControl`) share one coordinated layer instead
 * of each hand-typing the same magic number and risking it silently
 * drifting apart. Each is read via `var(--name, <default>)` in those
 * components' own stylesheets, using exactly the default value listed
 * here, so a host that defines none of them still gets a fully working
 * (if generic) stacking order.
 * @remarks A host element that needs to sit above or below this whole
 *   layer (an info panel, a toast, a skip link) should express that as its
 *   own deliberately-chosen value relative to `--floating-control-z-index`,
 *   not an unrelated hand-typed number with no documented relationship to
 *   it.
 */
export const Z_INDEX_CSS_VAR_DEFAULTS = {
  /**
   * Shared stacking layer for a host's own peer floating map controls (a
   * search box, a settings button) and this package's own (legend,
   * measurement tool) — so they interleave correctly regardless of which
   * package renders which one.
   */
  "--floating-control-z-index": "1240",
} as const;

/** A CSS custom property name declared by `Z_INDEX_CSS_VAR_DEFAULTS`. */
export type ZIndexCssVar = keyof typeof Z_INDEX_CSS_VAR_DEFAULTS;
