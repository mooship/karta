import { useWindowSize } from "usehooks-ts";

/**
 * The viewport width, in pixels, above which the UI switches from its
 * mobile (bottom-sheet, floating-icon) layout to its desktop (persistent
 * sidebar) one.
 * @remarks The single source of truth for this threshold — every consumer
 *   (`useIsDesktopViewport` below, `@karta/map`'s `MapView`, and every
 *   `@media (max-width: 768px)` rule across `@karta/map`/`packages/web`'s
 *   own stylesheets) is expected to agree with this exact value rather than
 *   hand-typing `768` again. CSS media queries can't reference a JS
 *   constant directly, so those stay literal `768px` — each package's own
 *   test suite asserts its stylesheets never drift from this constant
 *   instead.
 */
export const MOBILE_BREAKPOINT_PX = 768;

/**
 * Reads the current viewport width, safe to call during SSR.
 * @returns `window.innerWidth`, or `MOBILE_BREAKPOINT_PX` itself on the
 *   server — chosen deliberately so `getViewportWidth() > MOBILE_BREAKPOINT_PX`
 *   always evaluates `false` before hydration, defaulting callers to the
 *   mobile layout rather than guessing a real device width.
 * @remarks For imperative, non-reactive reads only — inside an event
 *   handler, or a value recomputed on every render without itself
 *   triggering one. A component that needs to *re-render* when the
 *   viewport crosses the breakpoint should use `useIsDesktopViewport`
 *   instead.
 */
export function getViewportWidth(): number {
  /* v8 ignore start -- SSR guard: exercised by server rendering, not unit tests */
  if (typeof window === "undefined") {
    return MOBILE_BREAKPOINT_PX;
  }
  /* v8 ignore stop */

  return window.innerWidth;
}

/**
 * Whether the viewport is currently wider than `MOBILE_BREAKPOINT_PX`.
 * @remarks Tracks `window.innerWidth` (via `useWindowSize`'s own resize
 *   listener) rather than a `matchMedia` query, so it stays consistent with
 *   `getViewportWidth`'s own `window.innerWidth`-based imperative reads —
 *   the same underlying signal, reactive here instead of polled. Resolves
 *   to `false` (the mobile layout) until the width is first measured on the
 *   client, avoiding an SSR/hydration mismatch. For a one-off, non-reactive
 *   read (e.g. inside an event handler), use `getViewportWidth()` instead.
 */
export function useIsDesktopViewport(): boolean {
  const { width } = useWindowSize({ initializeWithValue: false });
  return (width ?? MOBILE_BREAKPOINT_PX) > MOBILE_BREAKPOINT_PX;
}
