import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { vars } from "@karta/theme";
import {
  createVar,
  fallbackVar,
  globalStyle,
  style,
} from "@vanilla-extract/css";
import { customScrollbar, eyebrowLabel, popoverIn } from "../../shared.css";
import {
  designTokens,
  mobileLayoutTokens,
  zIndexTokens,
} from "../../theme/mapTokens";

/**
 * The sheet's live drag offset, set per-render via
 * `@vanilla-extract/dynamic`'s `assignInlineVars()` in `MobileLegend.tsx`
 * (replacing an `as CSSProperties` cast that smuggled the same custom
 * property past React's types).
 */
export const sheetDragOffset = createVar();

export const container = style({
  position: "absolute",
  left: "1.25rem",
  bottom: `calc(3.25rem + ${designTokens.controlHeight} + 0.75rem)`,
  zIndex: zIndexTokens.floatingControlZIndex,
  display: "block",
  "@media": {
    [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
      left: mobileLayoutTokens.mobileControlEdge,
      bottom: `calc(${mobileLayoutTokens.mobileControlBottom} + ${mobileLayoutTokens.mobileControlSize} + 3rem + ${mobileLayoutTokens.mobileControlSize} + ${mobileLayoutTokens.mobileControlGap})`,
      /**
       * `mobileLayoutTokens.panelRepositionDuration` is the same duration a
       * host's own bottom-sheet panel-toggle button is expected to use for
       * this identical kind of move, so the two controls climb/descend at
       * one shared speed rather than two hand-tuned durations drifting
       * apart -- both fall back to the exact same defaults declared in
       * MOBILE_LAYOUT_CSS_VAR_DEFAULTS if a host defines neither.
       * `--motion-ease-large-surface` (falling back to M3's flatter
       * Standard curve, same as its host-side default) rather than an
       * Emphasized curve -- this trigger climbs the same large distance as
       * the host's own sheet, and Emphasized easing's front-loaded motion
       * reads as violent rather than smooth over a move this size (see a
       * host's own design-system docs, e.g. packages/web's Motion section,
       * for the full rationale). Matching curves, not just duration, is
       * what keeps this trigger's climb and the sheet's rise visually
       * arriving together rather than merely finishing at the same
       * declared length -- a host's own equivalent trigger should use the
       * same curve as its sheet for the same reason. A host's
       * `data-panel-open` (or equivalent) should flip back to `false` the
       * moment its sheet *starts* closing, not once its exit animation has
       * already finished, so this transition carries the trigger back down
       * in step with the sheet's slide-out instead of snapping into place
       * only after it's already gone.
       */
      transition: `bottom ${mobileLayoutTokens.panelRepositionDuration} var(--motion-ease-large-surface, cubic-bezier(0.2, 0, 0, 1))`,
    },
  },
  selectors: {
    /**
     * Climbs to sit just above the sheet (its own height plus a gap), but
     * never higher than clearing the search box (see
     * MeasurementControl.css.ts's `mobileSearchClearance`, the same
     * boundary that control's own toggle sits below) plus this trigger's
     * own height and `MeasurementControl`'s own idle toggle stacked
     * beneath it -- on a "full" sheet there's so little headroom left
     * above it that an unclamped climb pushes the trigger off the top of
     * the screen entirely. `MeasurementControl` collapses to its idle
     * toggle whenever the host panel is open (see its own mobile rules)
     * but stays visible, so this ceiling still has to reserve room for it
     * alongside the search box. `--sheet-height` is set per panel size
     * below, matching `MeasurementControl`'s own pattern for the same
     * terms.
     */
    '&[data-panel-open="true"]': {
      "@media": {
        [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
          bottom: `min(calc(var(--sheet-height) + 0.75rem + env(safe-area-inset-bottom)), calc(100dvh - ${mobileLayoutTokens.mobileSearchClearance} - ${mobileLayoutTokens.mobileSafeTop} - (${mobileLayoutTokens.mobileControlSize} * 2)))`,
        },
      },
    },
    '&[data-panel-open="true"][data-panel-size="medium"]': {
      "@media": {
        [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
          vars: {
            "--sheet-height": mobileLayoutTokens.mobileSheetHeightMedium,
          },
        },
      },
    },
    '&[data-panel-open="true"][data-panel-size="full"]': {
      "@media": {
        [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
          vars: {
            "--sheet-height": mobileLayoutTokens.mobileSheetHeightFull,
          },
        },
      },
    },
  },
});

export const sheet = style([
  customScrollbar,
  popoverIn,
  {
    position: "absolute",
    left: 0,
    bottom: "calc(100% + 0.5rem)",
    isolation: "isolate",
    width: "min(21rem, calc(100vw - 1.5rem))",
    maxHeight: "min(46dvh, 24rem)",
    padding: "0.875rem",
    border: `1px solid ${vars.color.outline}`,
    borderRadius: vars.shape.cornerLarge,
    background: vars.color.surfaceContainerHigh,
    boxShadow: vars.elevation.shadow3,
    overflowY: "auto",
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
    transform: `translateY(${fallbackVar(sheetDragOffset, "0px")})`,
    transition: `transform ${vars.motion.durationMedium} ${vars.motion.easeDecelerate}`,
    selectors: {
      '&[data-dragging="true"]': {
        transition: "none",
      },
    },
  },
]);

/**
 * The legend's own popover normally opens upward from its trigger
 * (`.sheet`'s default `bottom: calc(100% + 0.5rem)`), which is fine when
 * the trigger sits low, near the settings/basemap stack. Anchored from the
 * top instead while the host panel is open, opening upward would push it
 * off the top of the screen -- it opens downward, toward the map, instead.
 */
globalStyle(`.${container}[data-panel-open="true"] .${sheet}`, {
  "@media": {
    [`screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`]: {
      top: "calc(100% + 0.5rem)",
      bottom: "auto",
    },
  },
});

export const dragHandleButton = style({
  display: "grid",
  placeItems: "center",
  width: "100%",
  minHeight: designTokens.controlHeight,
  padding: 0,
  marginBottom: designTokens.space2,
  border: 0,
  borderRadius: vars.shape.cornerSmall,
  background: "transparent",
  cursor: "pointer",
  touchAction: "none",
  selectors: {
    "&:focus-visible": {
      outline: `${designTokens.focusRingWidth} solid ${vars.color.onSurface}`,
      outlineOffset: 2,
    },
  },
});

export const dragHandle = style({
  display: "block",
  width: designTokens.dragHandleWidth,
  height: designTokens.dragHandleHeight,
  borderRadius: vars.shape.cornerFull,
  background: vars.color.outlineVariant,
  transition: `width ${vars.motion.durationShort} ${vars.motion.easeStandard}, background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
});

globalStyle(`.${sheet}[data-dragging="true"] .${dragHandle}`, {
  width: designTokens.dragHandleWidthDragging,
});

export const title = style([
  eyebrowLabel,
  {
    margin: `0 0 ${designTokens.space3}`,
    color: vars.color.onSurface,
    fontSize: designTokens.fontSizeSm,
  },
]);
