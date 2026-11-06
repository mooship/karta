import { createGlobalThemeContract } from "@vanilla-extract/css";

/**
 * Typed view onto the colour, shape, elevation, state and motion tokens
 * documented in `docs/design-system.md` and defined in
 * `packages/web/src/index.css`. The `md-sys-*` names are kept from the
 * app's earlier Material 3 theme; the values are Karta's own.
 * @remarks Declares no values and emits no CSS. The host app defines every
 *   custom property, including the light and dark switching in
 *   `index.css`. This exists so a `.css.ts` file can write
 *   `vars.color.primary` instead of `"var(--md-sys-color-primary)"`, where
 *   a typo would fail silently. None of these has a fallback, unlike
 *   `@karta/map`'s own tokens in `packages/map/src/theme/mapTokens.ts`.
 */
export const vars = createGlobalThemeContract({
  color: {
    primary: "md-sys-color-primary",
    onPrimary: "md-sys-color-on-primary",
    primaryContainer: "md-sys-color-primary-container",
    onPrimaryContainer: "md-sys-color-on-primary-container",
    secondary: "md-sys-color-secondary",
    onSecondary: "md-sys-color-on-secondary",
    secondaryContainer: "md-sys-color-secondary-container",
    onSecondaryContainer: "md-sys-color-on-secondary-container",
    tertiary: "md-sys-color-tertiary",
    onTertiary: "md-sys-color-on-tertiary",
    tertiaryContainer: "md-sys-color-tertiary-container",
    onTertiaryContainer: "md-sys-color-on-tertiary-container",
    error: "md-sys-color-error",
    onError: "md-sys-color-on-error",
    errorContainer: "md-sys-color-error-container",
    onErrorContainer: "md-sys-color-on-error-container",
    background: "md-sys-color-background",
    onBackground: "md-sys-color-on-background",
    surface: "md-sys-color-surface",
    onSurface: "md-sys-color-on-surface",
    surfaceVariant: "md-sys-color-surface-variant",
    onSurfaceVariant: "md-sys-color-on-surface-variant",
    outline: "md-sys-color-outline",
    outlineVariant: "md-sys-color-outline-variant",
    surfaceContainerLowest: "md-sys-color-surface-container-lowest",
    surfaceContainerLow: "md-sys-color-surface-container-low",
    surfaceContainer: "md-sys-color-surface-container",
    surfaceContainerHigh: "md-sys-color-surface-container-high",
    surfaceContainerHighest: "md-sys-color-surface-container-highest",
    surfaceDim: "md-sys-color-surface-dim",
    surfaceBright: "md-sys-color-surface-bright",
    inverseSurface: "md-sys-color-inverse-surface",
    inverseOnSurface: "md-sys-color-inverse-on-surface",
    inversePrimary: "md-sys-color-inverse-primary",
    scrim: "md-sys-color-scrim",
    shadow: "md-sys-color-shadow",
    surfaceTint: "md-sys-color-surface-tint",
    /** Derived role written in index.css alongside the core roles. */
    surfaceContainerHover: "md-sys-color-surface-container-hover",
  },
  shape: {
    cornerNone: "md-sys-shape-corner-none",
    cornerExtraSmall: "md-sys-shape-corner-extra-small",
    cornerSmall: "md-sys-shape-corner-small",
    cornerMedium: "md-sys-shape-corner-medium",
    cornerLarge: "md-sys-shape-corner-large",
    cornerExtraLarge: "md-sys-shape-corner-extra-large",
    cornerFull: "md-sys-shape-corner-full",
  },
  elevation: {
    shadow1: "md-sys-elevation-shadow-1",
    shadow2: "md-sys-elevation-shadow-2",
    shadow3: "md-sys-elevation-shadow-3",
  },
  state: {
    hover: "state-hover",
    pressed: "state-pressed",
    selected: "state-selected",
  },
  motion: {
    durationShort: "motion-duration-short",
    durationMedium: "motion-duration-medium",
    easeStandard: "motion-ease-standard",
    easeDecelerate: "motion-ease-decelerate",
    easeAccelerate: "motion-ease-accelerate",
    easeSpring: "motion-ease-spring",
    easeLargeSurface: "motion-ease-large-surface",
  },
});

/** The shape of {@link vars}; every M3 token path this contract declares. */
export type M3Vars = typeof vars;
