# Design system

Karta should look like a survey office map or a good atlas plate: paper,
ink and one warm accent. The map carries the evidence, and the interface
stays quiet around it.

All tokens live in `packages/web/src/index.css`. Components are plain
React styled with vanilla-extract (`*.css.ts` beside each component) and
read those tokens through `@karta/theme`. See "Styling implementation"
below.

## Principles

- The map comes first. Chrome supports reading the map and never competes
  with the data layers.
- One accent. Ochre marks the current selection, focus and links. Data
  colours belong to the map layers, not the interface.
- Hairlines over shadows. Panels sit on a 1px rule, like the margin of a
  printed sheet.
- Sentence case everywhere, including small labels. No uppercase or
  letter-spaced eyebrow labels.

## Colour

The token names (`--md-sys-color-primary`, `--md-sys-color-surface` and so
on) are kept from the app's earlier Material 3 theme so components didn't
need renaming. The values are Karta's own and are written by hand inside
the `LIGHT COLOUR TOKENS` and `DARK COLOUR TOKENS` blocks of `index.css`.
There are two dark blocks (one for `prefers-color-scheme: dark`, one for
`:root[data-theme="dark"]`); keep them in step.

| Role | Light | Dark |
| --- | --- | --- |
| Surface (paper) | `#f6f2e9` | `#16130f` |
| On surface (ink) | `#1f1b16` | `#ede6da` |
| On surface variant | `#4f4a42` | `#bdb4a6` |
| Primary (ochre) | `#8c520f` | `#e3a85a` |
| Outline | `#7f766a` | `#8e8579` |
| Outline variant (hairline) | `#cfc6b6` | `#48423a` |
| Error | `#a3261b` | `#ff9c8f` |

Every text pairing meets WCAG 2.2 AA (4.5:1) on every surface container in
both modes, and outlines used as control boundaries meet 3:1. Check any
new pairing before adding it.

`error` and `error-container` are used for failure and warning states,
such as a layer that failed to load or a search outside the covered area.

App-specific tokens are built from these roles with `color-mix()`, so they
follow the theme: `--color-map-label-surface`,
`--color-map-label-surface-secondary`, `--color-map-label-outline`,
`--color-map-label-text` and `--leaflet-zoom-divider`.

### Map layer colours

Layer colours are set per domain in `layers.ts`, not in `index.css`.

- Sequential layers (travel times) use ordered single-hue ramps that run
  light to dark, so more always means darker.
- Transit lines are told apart by pattern and weight as well as colour:
  rapid rail is a solid ink line, commuter rail is dashed, buses are a
  fine dotted grey line, and BRT routes have a paper casing so they hold
  up against both basemaps.
- Line colours are checked for 3:1 against the light basemap. Lines with
  a `darkColor` switch in dark mode.

## Typography

| Token | Family | Use |
| --- | --- | --- |
| `--font-display` | Source Serif 4 | Panel headings, place names in popups, the privacy page |
| `--font-body` | Public Sans | Everything else |
| `--font-mono` | System monospace | The map scale bar only |

Both web fonts are OFL and self-hosted from `@fontsource-variable`
packages, imported in `root.tsx`. Figures that need to line up use
`font-variant-numeric: tabular-nums` in Public Sans rather than a mono
face.

The type scale for map chrome is compact and never goes below 12px:
`--font-size-xs` and `--font-size-sm` are 12px, `--font-size-md` is 13px,
`--font-size-base` is 14px and `--font-size-lg` is 18px. Small labels are
12px, weight 600, sentence case, with no extra tracking.

## Shape, elevation and state

- **Shape:** 2px for controls (`corner-extra-small`, `corner-small`) and
  4px for panels (`corner-medium` and up). `corner-full` is only for chips,
  round markers and the drag handle.
- **Elevation:** `--md-sys-elevation-shadow-1` and `-2` are a 1px hairline.
  `-3` adds a faint shadow for menus that float over the map.
- **State:** `--state-hover` (8%) and `--state-pressed` (12%) tint with
  on-surface. `--state-selected` (12%) tints with the primary colour.
  `--md-sys-color-surface-container-hover` is an opaque hover colour for
  controls that can't show the surface through a transparent tint.

## Motion

- `--motion-ease-standard` is the default, for hover and press feedback
  and anything that can repeat quickly.
- `--motion-ease-decelerate` is for one-shot entrances over a short
  distance: popovers, error toasts, the info panel's fade and the staggered
  entrance of the legend and layer list. `--motion-ease-accelerate` is its
  exit pair and isn't used yet.
- `--motion-ease-large-surface` is an alias for the standard curve. Use it
  for anything that moves a large surface a long way, such as the mobile
  Explore sheet's close slide. The decelerate curve front-loads its
  travel, which looks violent over a long distance.
- `--motion-ease-spring` is a small overshoot for rare, one-off emphasis
  (a `SegmentedControl` option settling into place). Don't use it on
  anything that repeats or moves a large surface.

`prefers-reduced-motion` collapses every animation and transition.

## Component library

Components are written in plain React, not `@material/web`. That library
was tried and reverted: its Lit custom elements throw
`ReferenceError: HTMLElement is not defined` under the Cloudflare Workers
SSR, so each component needed a client-only mount gate, which caused a
hydration mismatch. Unit tests also couldn't use `getByRole`, because
happy-dom doesn't render Shadow DOM. Plain React has none of those
problems.

## Styling implementation

Component styles use [vanilla-extract](https://vanilla-extract.style/),
which compiles to static CSS at build time and works with the SSR setup.

`@karta/theme` gives `.css.ts` files typed access to the tokens: `vars`
(colour, shape, elevation, state and motion) and `mapLabelVars` (the map
label tokens). Both use `createGlobalThemeContract`, which declares no
values and emits no CSS. `index.css` stays the only place values and
light and dark switching are defined. The point is that
`vars.color.primary` fails at compile time if mistyped, where a
hand-typed `var(--md-sys-color-primary)` string fails silently.

There are two kinds of token:

- **No fallback:** `@karta/theme`'s `vars` and `mapLabelVars`, and
  `appVars` in `packages/web/src/theme/app.css.ts` (spacing, font sizes,
  mobile layout). The host app must define these.
- **With fallback:** `designTokens`, `zIndexTokens` and
  `mobileLayoutTokens` in `packages/map/src/theme/mapTokens.ts`. Each is
  `var(name, default)`, so a host that hasn't adopted Karta's tokens still
  gets a working `@karta/map` UI. One helper builds every entry, so a
  `.css.ts` file can't use one of these and forget its fallback.

`@karta/map` and `@karta/theme` ship source with no build step, so
`@vanilla-extract/css` is a runtime dependency of both (and of
`@karta/web`). A host that embeds `@karta/map` must register
`@vanilla-extract/vite-plugin`'s `vanillaExtractPlugin()` in its own Vite
config.

## Accessibility

- Touch targets are at least 44px.
- Every control works from the keyboard and shows a visible focus ring.
- Text meets 4.5:1 and UI boundaries and map lines meet 3:1, in both
  themes.
- Map layers never rely on colour alone: transit lines also differ by
  pattern, and every value shown on the map is also available in the
  popup and the Browse list.
- `prefers-reduced-motion` collapses animation and transition durations.
- `prefers-contrast: more` darkens `outline` and `outline-variant` to
  `on-surface`.

## Guardrails

- Use the existing tokens. Don't add a second set of token names for
  something that already has one.
- Don't add `@material/web` or any other Shadow DOM component library.
- Keep new chrome quiet. If it competes with the map layers, cut it back.