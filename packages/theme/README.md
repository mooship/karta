# `@karta/theme`

Typed access to Karta's design tokens, built with [vanilla-extract](https://vanilla-extract.style/)'s `createGlobalThemeContract`. It has no dependency on any other Karta package, Leaflet or React.

## What's in it

- **`vars`**: the colour, shape, elevation, state and motion tokens documented in `docs/design-system.md` (`vars.color.primary`, `vars.shape.cornerMedium`, `vars.elevation.shadow2`, `vars.state.hover`, `vars.motion.easeStandard` and so on).
- **`mapLabelVars`**: the map label tokens built from those colours (`mapLabelVars.surface`, `.surfaceSecondary`, `.outline`, `.text`).

`createGlobalThemeContract` declares no values and emits no CSS. The host app (`packages/web/src/index.css` in this repo) defines every value and handles light and dark switching. This package only means a `.css.ts` file can write `vars.color.primary` instead of `"var(--md-sys-color-primary)"`, so a typo fails at compile time instead of silently.

None of these tokens has a fallback. `@karta/map`'s own typography, spacing and control sizing tokens (`packages/map/src/theme/mapTokens.ts`) do, because a missing control size has a sensible default and a missing colour doesn't.

```ts
// Button.css.ts
import { vars } from "@karta/theme";
import { style } from "@vanilla-extract/css";

export const button = style({
  background: vars.color.surfaceContainer,
  borderRadius: vars.shape.cornerMedium,
  boxShadow: vars.elevation.shadow1,
});
```

## Using it in a host app

This package ships source with no build step. A host app has to register `@vanilla-extract/vite-plugin`'s `vanillaExtractPlugin()` in its Vite config and define every custom property that `vars` and `mapLabelVars` point to. See the "Styling" section of `packages/map/README.md` and "Styling implementation" in `docs/design-system.md`.

## What doesn't belong here

- Token values or light and dark switching. Those belong to the host app.
- `@karta/map`'s own tokens (fonts, spacing, control sizing, z-index, mobile layout). They have fallbacks and live in `packages/map/src/theme/mapTokens.ts`.