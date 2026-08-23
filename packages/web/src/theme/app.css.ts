import { createGlobalThemeContract } from "@vanilla-extract/css";

/**
 * Typed, compile-time-checked view onto this app's own local CSS custom
 * properties (declared in `src/index.css`, some shared in name with
 * `@karta/map`'s own bespoke token contract -- see
 * `packages/map/src/theme/mapTokens.ts`, `--space-2`/`-3` and
 * `--font-size-sm`/`-md`/`-base` among them). Declares NO values and emits
 * NO CSS: `index.css` stays the single source of truth. Unlike
 * `mapTokens.ts`'s helpers, these carry no `var(name, default)` fallback --
 * this app IS the definer of every one of these properties, so there's
 * nothing to fall back to.
 */
export const appVars = createGlobalThemeContract({
  space: {
    space1: "space-1",
    space2: "space-2",
    space3: "space-3",
    space4: "space-4",
  },
  font: {
    display: "font-display",
    body: "font-body",
    mono: "font-mono",
  },
  fontSize: {
    xs: "font-size-xs",
    sm: "font-size-sm",
    md: "font-size-md",
    base: "font-size-base",
    lg: "font-size-lg",
  },
  /**
   * `.app`'s own mobile chrome geometry (App.css.ts) -- shares names with
   * `@karta/map`'s `MOBILE_LAYOUT_CSS_VAR_DEFAULTS`/`Z_INDEX_CSS_VAR_DEFAULTS`
   * (packages/map/src/constants/mobileLayoutTokens.ts, zIndexTokens.ts),
   * since `MobileLegend`/`MeasurementControl`/`DesktopLegend` read these
   * very properties to position themselves around this app's own search
   * box, Explore sheet, and safe-area insets. This app declares the actual
   * values (equal to those contracts' own defaults, by design -- see
   * `App.css.ts`'s own note); this is purely a typed accessor for reading
   * them back within `packages/web`'s own style files.
   */
  mobileLayout: {
    safeTop: "mobile-safe-top",
    controlEdge: "mobile-control-edge",
    controlSize: "mobile-control-size",
    controlGap: "mobile-control-gap",
    controlBottom: "mobile-control-bottom",
    sheetHeightMedium: "mobile-sheet-height-medium",
    sheetHeightFull: "mobile-sheet-height-full",
    searchClearance: "mobile-search-clearance",
    panelRepositionDuration: "panel-reposition-duration",
  },
  floatingControlZIndex: "floating-control-z-index",
  /**
   * More names shared with `@karta/map`'s own bespoke token contract (see
   * `DESIGN_TOKEN_CSS_VAR_DEFAULTS`, packages/map/src/constants/designTokenDefaults.ts)
   * -- this app defines these too, so `.css.ts` files here get the same
   * typed, fallback-free access `space`/`font`/`fontSize` already do,
   * instead of hand-typing the raw custom property name.
   */
  controlHeight: "control-height",
  focusRingWidth: "focus-ring-width",
  dragHandle: {
    width: "drag-handle-width",
    widthDragging: "drag-handle-width-dragging",
    height: "drag-handle-height",
  },
});
