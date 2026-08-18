import { useSsrSafeMediaQuery } from "./useSsrSafeMediaQuery";

const QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Returns `true` when the primary pointer can hover, i.e. a mouse or
 * trackpad rather than a touchscreen.
 * @remarks Initialises to `false` on first render to avoid SSR mismatch.
 *   Intended for gating hover-only affordances (previews, tooltips) that
 *   would otherwise misfire from a touch device's synthetic mouse events.
 */
export function useCanHover() {
  return useSsrSafeMediaQuery(QUERY);
}
