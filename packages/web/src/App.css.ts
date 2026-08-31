import { MOBILE_BREAKPOINT_PX } from "@karta/react";
import { vars } from "@karta/theme";
import {
  createVar,
  fallbackVar,
  globalStyle,
  keyframes,
  style,
} from "@vanilla-extract/css";
import {
  eyebrowLabel,
  visuallyHidden as sharedVisuallyHidden,
} from "./shared.css";
import { appVars } from "./theme/app.css";

const mobileMediaQuery = `screen and (max-width: ${MOBILE_BREAKPOINT_PX}px)`;
const desktopMediaQuery = `screen and (min-width: ${MOBILE_BREAKPOINT_PX + 1}px)`;

/**
 * The mobile Explore sheet's live drag offset, applied imperatively via
 * `@vanilla-extract/dynamic`'s `setElementVars()` in `App.tsx` (replacing
 * an `as CSSProperties` cast that smuggled the same custom property past
 * React's types) — a CSSOM `style.setProperty()` call rather than a React
 * `style` prop, so the value never appears as a literal attribute in
 * server-rendered HTML, which this app's `'unsafe-inline'`-free `style-src`
 * would otherwise refuse to apply once parsed.
 */
export const panelDragOffset = createVar();

export const app = style({
  position: "relative",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  /**
   * `mobileSafeTop` through `floatingControlZIndex` below (see
   * theme/app.css.ts's `appVars.mobileLayout`/`appVars.floatingControlZIndex`)
   * fill two of `@karta/map`'s own documented CSS contracts --
   * `MOBILE_LAYOUT_CSS_VAR_DEFAULTS` and `Z_INDEX_CSS_VAR_DEFAULTS`
   * (packages/map/src/constants/mobileLayoutTokens.ts and zIndexTokens.ts)
   * -- the values `MobileLegend`/`MeasurementControl`/`DesktopLegend` read
   * to position, time, and stack themselves around this app's own search
   * box, Explore sheet, safe-area insets, and peer floating controls. They
   * happen to equal those contracts' own defaults here (this app's layout
   * is what those defaults were drawn from), but are declared explicitly
   * rather than left to fall through, so this file stays the single place
   * that describes this app's own mobile chrome geometry, and a future
   * change here doesn't silently rely on the SDK's defaults matching by
   * coincidence. `panelRepositionDuration` further below *is* part of that
   * shared contract; the Explore panel's entrance fade, by contrast,
   * reuses `vars.motion.durationMedium` rather than a bespoke duration of
   * its own, since it's the same short-distance settle every other
   * popover/list-entrance in this app already uses.
   */
  vars: {
    [appVars.mobileLayout.safeTop]: "env(safe-area-inset-top)",
    [appVars.mobileLayout.controlEdge]: "0.75rem",
    [appVars.mobileLayout.controlSize]: "44px",
    [appVars.mobileLayout.controlGap]: "0.625rem",
    [appVars.mobileLayout.controlBottom]:
      "calc(1.5rem + env(safe-area-inset-bottom))",
    /**
     * The stacking layer this app's own peer floating controls
     * (`.settingsControl`, `.locationSearchControl` below) share with
     * `@karta/map`'s `DesktopLegend`/`MobileLegend`/`MeasurementControl`
     * -- see the intro comment above. `panel`, `panelTrigger`, `dataError`,
     * and `skipLink` further down are deliberately sequenced above this
     * layer (1245/1250/1300/2000); each is single-use and not duplicated
     * anywhere else, so they stay plain literals rather than `calc()`
     * offsets from this token, but their ordering relative to it is
     * intentional, not coincidental.
     */
    [appVars.floatingControlZIndex]: "1240",
    /**
     * The mobile info panel's two sheet heights, shared with any control
     * (the legend trigger, the measurement tool) that needs to reposition
     * or resize itself around however much of the viewport the sheet is
     * currently covering.
     */
    [appVars.mobileLayout.sheetHeightMedium]: "min(66dvh, 36rem)",
    [appVars.mobileLayout.sheetHeightFull]: "min(84dvh, 45rem)",
    /**
     * How far down the search box's whole rendered footprint reaches (see
     * MeasurementControl.css.ts's mobile `insetBlockStart`) -- shared so
     * any other control stacking beneath the search box (the legend
     * trigger, when the info panel is open) can clamp itself to the same
     * boundary instead of hardcoding its own copy of this measurement.
     * 8.25rem leaves a comfortable double-digit-pixel gap beneath the
     * search box's ~116px mobile footprint (its `top` offset plus wrapper
     * padding/border plus the app-name label and search field) -- 7.5rem
     * left only a few pixels.
     */
    [appVars.mobileLayout.searchClearance]: "8.25rem",
    /**
     * How long any control that repositions itself around the mobile
     * Explore sheet (the panel toggle, `MobileLegend`'s trigger) takes to
     * slide back to its base position, shared across `packages/web` and
     * `@karta/map` so the two move at the same speed instead of two
     * independently hand-tuned durations drifting apart.
     */
    [appVars.mobileLayout.panelRepositionDuration]: "300ms",
  },
});

const mapLoadingPulse = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.6 },
});

export const mapLoading = style({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  /**
   * A `background-image` (unlike the plain `background-color` this
   * replaced) is eligible to become the page's Largest Contentful Paint
   * element. This placeholder is present in the server-rendered HTML,
   * before hydration, and covers the whole map viewport, so it lets the
   * browser register a meaningful full-viewport paint immediately instead
   * of waiting ~5s for React to hydrate, `MapView` to lazy-load, and
   * Leaflet to mount and fetch its first basemap tile -- measured via
   * Lighthouse to move the reported LCP element (and its score) off that
   * first tile entirely.
   */
  backgroundImage: `linear-gradient(180deg, ${vars.color.surface} 0%, ${vars.color.surfaceContainerLow} 100%)`,
  color: vars.color.onSurfaceVariant,
  fontFamily: appVars.font.mono,
  fontSize: appVars.fontSize.sm,
  textTransform: "uppercase",
  animation: `${mapLoadingPulse} 1.6s ${vars.motion.easeStandard} infinite`,
  /**
   * The fade-out itself must be visible (not an instant swap) -- this
   * placeholder is held past Leaflet's own mount until the basemap has
   * actually painted (see `App.tsx`'s `basemapVisuallyReady`), so by the
   * time it's cleared the real map is typically already filling the frame
   * behind it; cutting straight to `display: none` there reads as a flash.
   * `visibility` is given a matching transition-delay so it only takes
   * effect once the opacity fade has finished, rather than instantly
   * popping the element out of hit-testing/the accessibility tree the
   * moment the fade starts.
   */
  transition: `opacity ${vars.motion.durationMedium} ${vars.motion.easeStandard}, visibility 0s linear ${vars.motion.durationMedium}`,
  selectors: {
    /**
     * Once the real map has painted over this placeholder, stop rendering
     * it entirely rather than leaving its pulse animation compositing
     * forever on a full-viewport layer nobody sees. Safe to do well after
     * paint -- Chrome only excludes an element from Largest Contentful
     * Paint consideration when it's removed from the *DOM*, not when it's
     * hidden via `visibility`.
     */
    '&[aria-hidden="true"]': {
      opacity: 0,
      visibility: "hidden",
      animationPlayState: "paused",
    },
  },
});

const dataErrorIn = keyframes({
  from: { opacity: 0, transform: "translate(-50%, -50%) scale(0.96)" },
  to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

export const dataError = style({
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 1300,
  display: "grid",
  gap: "0.75rem",
  width: "min(22rem, calc(100% - 2rem))",
  padding: "1rem",
  border: `1px solid ${vars.color.error}`,
  borderRadius: vars.shape.cornerMedium,
  background: vars.color.surfaceContainerLow,
  color: vars.color.onSurface,
  boxShadow: vars.elevation.shadow3,
  transform: "translate(-50%, -50%)",
  animationName: dataErrorIn,
  animationDuration: vars.motion.durationMedium,
  animationTimingFunction: vars.motion.easeDecelerate,
});

globalStyle(`.${dataError} p`, {
  margin: 0,
});

globalStyle(`.${dataError} button`, {
  minHeight: "48px",
  border: `1px solid ${vars.color.outlineVariant}`,
  borderRadius: vars.shape.cornerSmall,
  background: "transparent",
  color: vars.color.onSurface,
  font: "inherit",
  cursor: "pointer",
  transition: `background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
});

globalStyle(`.${dataError} button:hover`, {
  background: vars.state.hover,
});

globalStyle(`.${dataError} button:focus-visible`, {
  outline: `${appVars.focusRingWidth} solid ${vars.color.onSurface}`,
  outlineOffset: 2,
});

export const skipLink = style({
  position: "absolute",
  top: "0.5rem",
  left: "0.5rem",
  zIndex: 2000,
  padding: "0.75rem 1rem",
  borderRadius: vars.shape.cornerSmall,
  background: vars.color.onSurface,
  color: vars.color.surface,
  fontWeight: 700,
  boxShadow: vars.elevation.shadow3,
  transform: "translateY(-160%)",
  transition: `transform ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
  selectors: {
    "&:focus": {
      transform: "translateY(0)",
    },
  },
});

export const visuallyHidden = sharedVisuallyHidden;

export const surface = style({
  position: "relative",
  borderRadius: vars.shape.cornerLarge,
  border: `1px solid ${vars.color.outline}`,
  background: vars.color.surfaceContainerHigh,
  boxShadow: vars.elevation.shadow3,
});

const panelIn = keyframes({
  from: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
  to: { opacity: 1, transform: "translateY(0) scale(1)" },
});

const panelSheetOut = keyframes({
  from: { transform: "translateY(0)" },
  to: { transform: "translateY(100%)" },
});

export const panel = style({
  position: "absolute",
  top: `calc(1.25rem + ${appVars.controlHeight} + 0.625rem)`,
  right: "1.25rem",
  zIndex: 1245,
  width: "30rem",
  maxWidth: "calc(100% - 2.5rem)",
  maxHeight: "calc(100% - 7rem)",
  overflow: "hidden",
  padding: "1.25rem 1.375rem 1.375rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  transition: `box-shadow ${vars.motion.durationMedium} ${vars.motion.easeStandard}`,
  /**
   * Shared by both breakpoints (the mobile media query below only changes
   * which attribute gates `animationPlayState`, not the animation
   * itself). Without an entrance animation here the panel simply appeared
   * the instant `hidden` came off, which read as an abrupt pop.
   * `.panelViewport` (this element's own child) deliberately has no
   * animation of its own -- an earlier version gave it a second,
   * shorter-travel `panelIn` run in parallel, meant to read as a subtler
   * companion fade. Measured against a live trace of both elements'
   * computed `opacity` frame by frame, that instead compounded
   * multiplicatively (a child at 51% opacity inside a parent also at 51%
   * renders at 26%), badly front-loading an already front-loaded
   * Emphasized-decelerate curve into a near-instant flash followed by a
   * long, barely-visible crawl to full opacity -- the "violent" pop this
   * animation exists to avoid, not fix. A single fade on this element
   * alone is what the child was always going to inherit anyway.
   */
  animationName: panelIn,
  animationDuration: vars.motion.durationMedium,
  animationTimingFunction: vars.motion.easeDecelerate,
  selectors: {
    "&[hidden]": {
      display: "none",
    },
  },
  "@media": {
    /**
     * Desktop only (the mobile sheet opens purely from a user tap, never
     * auto-opens, so it has no equivalent race to guard against).
     * `panelOpen` itself flips synchronously on hydration -- see the
     * effect that sets it in App.tsx for why that has to stay
     * deterministic -- but starting the whole app synchronously *and*
     * animating the panel in the very same commit as `MapView`'s own
     * heaviest mount work is what originally made the entrance visibly
     * stutter. Freezing `panelIn` at its first frame here, then resuming
     * it once `mapReady` (`data-entrance-ready`), keeps `panelOpen`
     * itself immediate while the animation only starts *ticking* once
     * that heavy work has settled -- nothing to visibly stutter while
     * it's paused, since a paused animation has no frame-to-frame changes
     * to repaint.
     */
    [desktopMediaQuery]: {
      animationPlayState: "paused",
    },
    [mobileMediaQuery]: {
      top: "auto",
      right: 0,
      left: 0,
      bottom: 0,
      width: "auto",
      maxWidth: "none",
      height: appVars.mobileLayout.sheetHeightMedium,
      maxHeight: "none",
      padding: "0.5rem 1rem max(1.25rem, env(safe-area-inset-bottom))",
      gap: "0.75rem",
      borderInline: 0,
      borderBottom: 0,
      borderRadius: `${vars.shape.cornerLarge} ${vars.shape.cornerLarge} 0 0`,
      transform: `translateY(calc(${fallbackVar(panelDragOffset, "0px")} * 0.14))`,
      transformOrigin: "bottom",
      transition: `height 320ms ${vars.motion.easeStandard}, transform ${vars.motion.durationMedium} ${vars.motion.easeDecelerate}, box-shadow ${vars.motion.durationMedium} ${vars.motion.easeStandard}`,
      /**
       * The entrance itself (`panelIn`, above) is declared once,
       * unconditionally -- this breakpoint only needs its own
       * `animationPlayState` gate (a different readiness attribute, set
       * from a user tap rather than `mapReady`). An earlier version
       * instead gave this breakpoint its own `panelSheetIn` keyframes,
       * sliding the sheet up from translateY(100%) over its full height
       * (up to the ~45rem `mobileLayout.sheetHeightFull`) on every open;
       * over that much travel it read as the sheet flying in from
       * off-screen rather than settling into place, and
       * Emphasized-decelerate over a long distance reads as a violent
       * whip regardless (see `docs/design-system.md`'s Motion section).
       * Reusing the same fade+scale as the desktop sidebar keeps both
       * entrances feeling like the same motion; `transformOrigin: "bottom"`
       * above keeps the scale settling from the sheet's own anchored edge
       * rather than its center. The *exit* keeps its own full-height
       * slide (`panelSheetOut` below) -- a completed downward drag needs
       * to continue in the same direction the user's finger was already
       * moving it, not evaporate in place.
       *
       * Paused at its first frame until `data-sheet-entrance-ready` -- set
       * via `@karta/react`'s `useDeferredReadyAttribute` (see its own doc
       * comment for why), called from `handlePanelToggle` in App.tsx.
       * Same reasoning as the desktop entrance's own `data-entrance-ready`
       * gate above, for a different trigger.
       */
      animationPlayState: "paused",
    },
  },
});

globalStyle(`.${app}[data-entrance-ready="true"] .${panel}`, {
  "@media": {
    [desktopMediaQuery]: {
      animationPlayState: "running",
    },
  },
});

globalStyle(`.${app}[data-sheet-entrance-ready="true"] .${panel}`, {
  "@media": {
    [mobileMediaQuery]: {
      animationPlayState: "running",
    },
  },
});

globalStyle(`.${panel}[data-panel-dragging="true"]`, {
  "@media": {
    [mobileMediaQuery]: {
      boxShadow: vars.elevation.shadow3,
      transition: "none",
    },
  },
});

globalStyle(`.${panel}[data-panel-closing="true"]`, {
  "@media": {
    [mobileMediaQuery]: {
      animation: `${panelSheetOut} ${appVars.mobileLayout.panelRepositionDuration} ${vars.motion.easeLargeSurface} forwards`,
      pointerEvents: "none",
    },
  },
});

globalStyle(`.${panel}[data-panel-size="full"]`, {
  "@media": {
    [mobileMediaQuery]: {
      height: appVars.mobileLayout.sheetHeightFull,
    },
  },
});

export const sheetHandleButton = style({
  display: "none",
  "@media": {
    [mobileMediaQuery]: {
      display: "grid",
      placeItems: "center",
      width: "100%",
      minHeight: "40px",
      padding: 0,
      border: 0,
      borderRadius: vars.shape.cornerSmall,
      background: "transparent",
      cursor: "pointer",
      touchAction: "none",
      selectors: {
        "&:focus-visible": {
          outline: `${appVars.focusRingWidth} solid ${vars.color.onSurface}`,
          outlineOffset: 2,
        },
      },
    },
  },
});

export const panelViewport = style({
  minHeight: 0,
  /**
   * `overflowY: "auto"` implicitly computes `overflowX` to `"auto"` too
   * (per the CSS overflow spec), which clips anything that visually
   * extends past this element's padding box -- including
   * `:focus-visible`/`:hover` effects on full-width children like buttons
   * and inputs. This inline padding gives those effects room so they
   * don't get cut off at the edges.
   */
  paddingInline: "0.3125rem",
  overflowY: "auto",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
  scrollbarColor: `${vars.color.outlineVariant} transparent`,
  scrollbarWidth: "thin",
  selectors: {
    "&::-webkit-scrollbar": {
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      border: "2px solid transparent",
      borderRadius: vars.shape.cornerFull,
      background: vars.color.onSurfaceVariant,
      backgroundClip: "padding-box",
    },
  },
});

export const sheetHandle = style({
  display: "none",
  "@media": {
    [mobileMediaQuery]: {
      display: "block",
      width: appVars.dragHandle.width,
      height: appVars.dragHandle.height,
      margin: "0 auto",
      borderRadius: vars.shape.cornerFull,
      background: vars.color.outlineVariant,
      transition: `width ${vars.motion.durationShort} ${vars.motion.easeStandard}, background-color ${vars.motion.durationShort} ${vars.motion.easeStandard}`,
    },
  },
});

globalStyle(`.${sheetHandleButton}[data-dragging="true"] .${sheetHandle}`, {
  "@media": {
    [mobileMediaQuery]: {
      width: appVars.dragHandle.widthDragging,
    },
  },
});

globalStyle(`.${sheetHandleButton}[data-drag-direction="up"] .${sheetHandle}`, {
  "@media": {
    [mobileMediaQuery]: {
      background: `color-mix(in srgb, ${vars.color.primary} 38%, ${vars.color.outlineVariant})`,
    },
  },
});

globalStyle(
  `.${sheetHandleButton}[data-drag-direction="down"] .${sheetHandle}`,
  {
    "@media": {
      [mobileMediaQuery]: {
        background: `color-mix(in srgb, ${vars.color.onSurface} 20%, ${vars.color.outlineVariant})`,
      },
    },
  },
);

export const panelTabs = style({
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "minmax(0, 1fr)",
  flexShrink: 0,
  borderBottom: `1px solid ${vars.color.outline}`,
});

export const panelTab = style({
  minHeight: "44px",
  padding: "0.625rem 0.75rem",
  border: 0,
  borderBottom: "3px solid transparent",
  borderRadius: `${vars.shape.cornerSmall} ${vars.shape.cornerSmall} 0 0`,
  background: "transparent",
  color: vars.color.onSurfaceVariant,
  fontFamily: appVars.font.mono,
  fontSize: appVars.fontSize.sm,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  selectors: {
    "&:hover": {
      background: vars.state.hover,
    },
    '&[aria-selected="true"]': {
      borderBottomColor: vars.color.primary,
      background: vars.state.selected,
      color: vars.color.onSurface,
    },
    "&:focus-visible": {
      outline: `${appVars.focusRingWidth} solid ${vars.color.onSurface}`,
      outlineOffset: -2,
    },
  },
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const sectionTitle = eyebrowLabel;

export const panelTrigger = style({
  position: "absolute",
  top: "1.25rem",
  right: "1.25rem",
  zIndex: 1250,
  "@media": {
    [mobileMediaQuery]: {
      top: "auto",
      right: appVars.mobileLayout.controlEdge,
      /**
       * Leaflet's bottom-right attribution control shares this corner and
       * can wrap onto two or three lines depending on viewport width and
       * the active basemap's credit length; clear it with a fixed margin
       * rather than the shared control-spacing baseline.
       */
      bottom: `calc(${appVars.mobileLayout.controlBottom} + 2rem)`,
      /**
       * Without this, `bottom` jumps instantly to its post-open value the
       * moment `data-panel-open` flips, teleporting to its final resting
       * spot above the sheet rather than climbing there. The sheet's own
       * entrance below is a quick in-place fade with no equivalent
       * physical climb to stay in lockstep with, but its *exit* still
       * slides the full sheet height off-screen (`panelSheetOut`) --
       * sharing that slide's own duration and easing
       * (`vars.motion.easeLargeSurface`, this trigger climbs the same
       * distance) is what keeps the trigger's climb and the sheet's
       * slide-out moving as one. `data-panel-open` (see App.tsx's
       * `panelVisuallyOpen`) flips back to `false` the moment the sheet
       * *starts* closing too, not once its own exit animation has already
       * finished, so this transition also carries the trigger back down
       * in step with the sheet's slide-out instead of snapping into place
       * a beat after it's already gone.
       *
       * This button is a `ControlButton`, whose own stylesheet
       * (`ControlButton.css.ts`) declares its own `transition` shorthand.
       * CSS's `transition` shorthand doesn't merge across rules --
       * whichever declaration wins the cascade wins outright, silently
       * dropping the other's transitioned properties -- so setting
       * `transition` again here would have one of the two lists silently
       * overwrite the other regardless of which "should" win.
       * `ControlButton` instead exposes a `--control-button-extra-transition`
       * custom property (defaulting to `none`) that it appends to its own
       * transition list, so this rule only ever sets that one custom
       * property -- never `transition` itself -- and there's no rule for
       * it to lose a race against.
       */
      vars: {
        "--control-button-extra-transition": `bottom ${appVars.mobileLayout.panelRepositionDuration} ${vars.motion.easeLargeSurface}`,
      },
    },
  },
});

globalStyle(`.${panelTrigger} svg`, {
  width: "1.125rem",
  height: "1.125rem",
});

export const panelTriggerLabel = style({
  display: "inline",
});

globalStyle(
  `.${app}[data-panel-open="true"][data-panel-size="medium"] .${panelTrigger}, .${app}[data-panel-open="true"][data-panel-size="full"] .${panelTrigger}`,
  {
    "@media": {
      [mobileMediaQuery]: {
        display: "grid",
        placeItems: "center",
        width: appVars.mobileLayout.controlSize,
        minWidth: appVars.mobileLayout.controlSize,
        minHeight: appVars.mobileLayout.controlSize,
        padding: 0,
        overflow: "hidden",
        borderRadius: vars.shape.cornerFull,
        gap: 0,
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
);

globalStyle(
  `.${app}[data-panel-open="true"][data-panel-size="medium"] .${panelTrigger}`,
  {
    "@media": {
      [mobileMediaQuery]: {
        bottom: `calc(${appVars.mobileLayout.sheetHeightMedium} + 0.75rem + env(safe-area-inset-bottom))`,
      },
    },
  },
);

globalStyle(
  `.${app}[data-panel-open="true"][data-panel-size="full"] .${panelTrigger}`,
  {
    "@media": {
      [mobileMediaQuery]: {
        bottom: `calc(${appVars.mobileLayout.sheetHeightFull} + 0.75rem + env(safe-area-inset-bottom))`,
      },
    },
  },
);

globalStyle(`.${app}[data-panel-open="true"] .${panelTriggerLabel}`, {
  "@media": {
    [mobileMediaQuery]: {
      display: "none",
    },
  },
});

globalStyle(`.${app}[data-panel-open="true"] .${panelTrigger} svg`, {
  "@media": {
    [mobileMediaQuery]: {
      width: "0.8rem",
      height: "0.8rem",
      strokeWidth: 1.9,
    },
  },
});

export const settingsControl = style({
  position: "absolute",
  bottom: "3.25rem",
  left: "1.25rem",
  zIndex: appVars.floatingControlZIndex,
  "@media": {
    [mobileMediaQuery]: {
      left: appVars.mobileLayout.controlEdge,
      bottom: `calc(${appVars.mobileLayout.controlBottom} + ${appVars.mobileLayout.controlSize} + 3rem)`,
    },
  },
});

export const locationSearchControl = style({
  position: "absolute",
  top: "1.25rem",
  left: "1.25rem",
  zIndex: appVars.floatingControlZIndex,
  padding: "0.75rem 0.875rem",
  "@media": {
    [mobileMediaQuery]: {
      top: `calc(0.75rem + ${appVars.mobileLayout.safeTop})`,
      left: "0.75rem",
      right: `calc(${appVars.mobileLayout.controlEdge} + ${appVars.mobileLayout.controlSize} + 0.625rem)`,
      width: "auto",
      maxWidth: "none",
      padding: "0.625rem 0.75rem",
    },
  },
});

/**
 * The only visible app name/title in the whole layout -- everything else
 * naming this app (the `<title>`, the page's own `<h1>`) is either in the
 * browser chrome or screen-reader-only, so a sighted first-time visitor had
 * no on-screen cue for what they were looking at. Placed inside the search
 * box's own surface rather than as new floating chrome, since every map
 * corner is already claimed by other controls (see MeasurementControl's
 * own note on this) and this box is already visible, already has padding,
 * and needs no new stacking context.
 */
export const appName = style([
  eyebrowLabel,
  {
    margin: "0 0 0.375rem",
    fontWeight: 600,
  },
]);

export const outOfCoverage = style({
  display: "block",
  margin: "0.5rem 0 0",
  color: vars.color.onSurfaceVariant,
  fontSize: appVars.fontSize.md,
});
