import { createGlobalThemeContract } from "@vanilla-extract/css";

/**
 * Typed view onto `packages/web/src/index.css`'s app-specific composite map
 * label tokens — `--color-map-label-*`, layered on top of the M3 roles in
 * {@link import("./m3.css").vars} rather than raw hex, so they stay
 * theme-adaptive automatically. See `docs/design-system.md`'s "App-specific
 * composite tokens" section.
 * @remarks Kept separate from {@link import("./m3.css").vars} since these
 *   aren't part of the M3 spec itself — a consumer that only needs the M3
 *   roles shouldn't have to reason about map-label-specific naming.
 */
export const mapLabelVars = createGlobalThemeContract({
  surface: "color-map-label-surface",
  surfaceSecondary: "color-map-label-surface-secondary",
  outline: "color-map-label-outline",
  text: "color-map-label-text",
});

/** The shape of {@link mapLabelVars}. */
export type MapLabelVars = typeof mapLabelVars;
