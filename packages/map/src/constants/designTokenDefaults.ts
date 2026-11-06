/**
 * CSS custom properties `@karta/map`'s components read for their
 * typography, spacing, control sizing, and focus-ring geometry. The colour,
 * shape and elevation tokens in `docs/design-system.md` have no fallback;
 * these do. Each is read via `var(--name, <default>)` with the default
 * listed here, so a host that hasn't defined its own still gets a working
 * look rather than invalid CSS.
 * @remarks A host that uses Karta's design system in full (as
 *   `packages/web`'s `index.css` does) should still declare these
 *   explicitly rather than rely on the fallback matching by coincidence.
 *   See `App.css.ts`'s note on `MOBILE_LAYOUT_CSS_VAR_DEFAULTS`.
 */
export const DESIGN_TOKEN_CSS_VAR_DEFAULTS = {
  /** Body text typeface. */
  "--font-body": '"Public Sans Variable", system-ui, sans-serif',
  /** Monospace typeface, used only for figures that need to line up (measurements, counts). */
  "--font-mono":
    'ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace',
  /** Smallest size in this package's compact UI-chrome type scale. */
  "--font-size-sm": "0.75rem",
  /** Default body/label size in this package's compact UI-chrome type scale. */
  "--font-size-md": "0.8125rem",
  /** Slightly larger size for a control's own primary label. */
  "--font-size-base": "0.875rem",
  /** Small gap, e.g. between an icon and its label. */
  "--space-2": "0.5rem",
  /** Medium gap, e.g. below a heading. */
  "--space-3": "0.75rem",
  /** Minimum touch target height/width for an interactive control. */
  "--control-height": "44px",
  /** Gap between elements within a single control. */
  "--control-gap": "0.25rem",
  /** Internal padding within a single control. */
  "--control-padding": "0.25rem",
  /** Width of a mobile bottom-sheet drag handle at rest. */
  "--drag-handle-width": "2.5rem",
  /** Width of a mobile bottom-sheet drag handle while actively being dragged. */
  "--drag-handle-width-dragging": "3rem",
  /** Height (thickness) of a mobile bottom-sheet drag handle. */
  "--drag-handle-height": "0.25rem",
  /** Focus ring thickness for keyboard-focused controls. */
  "--focus-ring-width": "2px",
} as const;

/** A CSS custom property name declared by `DESIGN_TOKEN_CSS_VAR_DEFAULTS`. */
export type DesignTokenCssVar = keyof typeof DESIGN_TOKEN_CSS_VAR_DEFAULTS;
