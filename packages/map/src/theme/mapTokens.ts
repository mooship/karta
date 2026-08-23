import {
  DESIGN_TOKEN_CSS_VAR_DEFAULTS,
  type DesignTokenCssVar,
} from "../constants/designTokenDefaults";
import {
  MOBILE_LAYOUT_CSS_VAR_DEFAULTS,
  type MobileLayoutCssVar,
} from "../constants/mobileLayoutTokens";
import {
  Z_INDEX_CSS_VAR_DEFAULTS,
  type ZIndexCssVar,
} from "../constants/zIndexTokens";

/**
 * Builds `var(name, default)` for a token name/default pair, the single
 * place that pairing is constructed so a `.css.ts` file can never reference
 * one of this package's bespoke tokens and forget its documented fallback —
 * the exact failure `designTokenDefaults.test.ts`/`zIndexTokens.test.ts`/
 * `mobileLayoutTokens.test.ts` guard against for `.module.css` files.
 */
function cssVarWithFallback<Name extends string>(
  name: Name,
  defaults: Record<Name, string>,
): string {
  return `var(${name}, ${defaults[name]})`;
}

const designTokenVar = (name: DesignTokenCssVar) =>
  cssVarWithFallback(name, DESIGN_TOKEN_CSS_VAR_DEFAULTS);

const zIndexTokenVar = (name: ZIndexCssVar) =>
  cssVarWithFallback(name, Z_INDEX_CSS_VAR_DEFAULTS);

const mobileLayoutTokenVar = (name: MobileLayoutCssVar) =>
  cssVarWithFallback(name, MOBILE_LAYOUT_CSS_VAR_DEFAULTS);

/**
 * Typed `var(--name, default)` accessors for {@link DESIGN_TOKEN_CSS_VAR_DEFAULTS}
 * — `@karta/map`'s own bespoke typography/spacing/control-sizing contract,
 * not part of the M3 spec (see `packages/theme` for that). A `.css.ts` file
 * should reach these tokens only through this object, never by hand-typing
 * `var(--name, ...)` itself, so the fallback can never drift from the
 * documented default.
 */
export const designTokens = {
  fontBody: designTokenVar("--font-body"),
  fontMono: designTokenVar("--font-mono"),
  fontSizeSm: designTokenVar("--font-size-sm"),
  fontSizeMd: designTokenVar("--font-size-md"),
  fontSizeBase: designTokenVar("--font-size-base"),
  space2: designTokenVar("--space-2"),
  space3: designTokenVar("--space-3"),
  controlHeight: designTokenVar("--control-height"),
  controlGap: designTokenVar("--control-gap"),
  controlPadding: designTokenVar("--control-padding"),
  dragHandleWidth: designTokenVar("--drag-handle-width"),
  dragHandleWidthDragging: designTokenVar("--drag-handle-width-dragging"),
  dragHandleHeight: designTokenVar("--drag-handle-height"),
  focusRingWidth: designTokenVar("--focus-ring-width"),
} as const;

/** Typed `var(--name, default)` accessor for {@link Z_INDEX_CSS_VAR_DEFAULTS}. */
export const zIndexTokens = {
  floatingControlZIndex: zIndexTokenVar("--floating-control-z-index"),
} as const;

/** Typed `var(--name, default)` accessors for {@link MOBILE_LAYOUT_CSS_VAR_DEFAULTS}. */
export const mobileLayoutTokens = {
  mobileControlEdge: mobileLayoutTokenVar("--mobile-control-edge"),
  mobileControlBottom: mobileLayoutTokenVar("--mobile-control-bottom"),
  mobileControlSize: mobileLayoutTokenVar("--mobile-control-size"),
  mobileControlGap: mobileLayoutTokenVar("--mobile-control-gap"),
  mobileSafeTop: mobileLayoutTokenVar("--mobile-safe-top"),
  mobileSearchClearance: mobileLayoutTokenVar("--mobile-search-clearance"),
  panelRepositionDuration: mobileLayoutTokenVar("--panel-reposition-duration"),
  mobileSheetHeightMedium: mobileLayoutTokenVar("--mobile-sheet-height-medium"),
  mobileSheetHeightFull: mobileLayoutTokenVar("--mobile-sheet-height-full"),
} as const;
