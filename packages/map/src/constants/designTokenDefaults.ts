/**
 * CSS custom properties `@karta/map`'s components read for their
 * typography, spacing, control sizing, and focus-ring geometry. Unlike the
 * M3 colour/shape/elevation tokens documented in `docs/design-system.md`
 * (an unconditional dependency this package assumes any host has already
 * adopted, with no sensible generic fallback for a missing colour role),
 * these describe Karta's own bespoke base design scale — not part of the
 * M3 spec — so each is read via `var(--name, <default>)` with the default
 * value listed here, letting a host that hasn't defined its own still get
 * a fully working (if generic) look rather than invalid CSS.
 * @remarks A host that *has* adopted Karta's design system in full (as
 *   `packages/web`'s `index.css` does) should still declare these
 *   explicitly rather than relying on the fallback matching by coincidence
 *   — see `App.css.ts`'s own note on `MOBILE_LAYOUT_CSS_VAR_DEFAULTS`
 *   for why.
 */
export const DESIGN_TOKEN_CSS_VAR_DEFAULTS = {
  /** Body text typeface. */
  "--font-body": '"Inter Variable", sans-serif',
  /** Monospace typeface, used for labels/values that read as data (coordinates, counts, uppercase headers). */
  "--font-mono": '"Martian Mono Variable", monospace',
  /** Smallest size in this package's compact UI-chrome type scale. */
  "--font-size-sm": "0.6875rem",
  /** Default body/label size in this package's compact UI-chrome type scale. */
  "--font-size-md": "0.75rem",
  /** Slightly larger size for a control's own primary label. */
  "--font-size-base": "0.8125rem",
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
