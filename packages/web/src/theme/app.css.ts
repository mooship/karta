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
});
