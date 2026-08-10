# Karta Design System

Karta adopts Google's Material 3 (M3) design language directly, rather than
an app-owned system with its own vocabulary. Structural chrome is built on
real `@material/web` components wherever practical, and Karta's own
hand-rolled chrome (Leaflet's popup/control markup, which this app styles
globally rather than replacing) themes itself from the same M3 tokens.
Tokens use Material's own naming (`--md-sys-color-primary`,
`--md-sys-shape-corner-medium`, …) rather than app-invented names, so the
system stays legible to anyone who already knows Material 3, and so
`@material/web` components pick up Karta's theme automatically — they read
these exact custom property names with no per-component configuration.

## Design direction

- Adopt Material 3's system wholesale rather than reinventing it: colour
	roles, shape scale, elevation, and state layers all follow the M3 spec's
	own token names and values.
- Brand identity lives in one place — the seed colour a theme is generated
	from, and the typeface tokens — not in bespoke token architecture.
- Preserve map-first communication: interface chrome must support evidence
	and place-reading, never dominate it. Floating controls, rounded pill
	search fields, and a bottom-sheet-style info panel take cues from
	consumer map products' conventions for this — content fills the frame,
	controls float, and a drag handle exposes more detail on demand.

## Colour tokens — generated from a single seed

Every `--md-sys-color-*` role is generated from one brand seed colour (the
historical `--color-ochre` accent, `#8a5a1e`) using Material Color
Utilities' HCT-based tonal palette algorithm — the same engine behind
Android's Material You dynamic theming. `packages/web/scripts/generateM3Theme.ts`
owns this: it builds a `SchemeTonalSpot` (light and dark) from the seed via
`MaterialDynamicColors`, and writes the resolved hex values into the
generated token block in `packages/web/src/index.css`.

To change Karta's brand colour, edit `SEED_COLOR_HEX` in that script and
re-run `npm run generate:theme --workspace @karta/web` — never hand-edit
the hex values inside the `/* GENERATED M3 ... TOKENS */` markers directly,
since the next run overwrites them.

The generated role set covers the full M3 2021+ scheme, including the
surface-container tiers `@material/web` components expect:

`primary`/`onPrimary`/`primaryContainer`/`onPrimaryContainer`,
`secondary`/`onSecondary`/`secondaryContainer`/`onSecondaryContainer`,
`tertiary`/`onTertiary`/`tertiaryContainer`/`onTertiaryContainer`,
`error`/`onError`/`errorContainer`/`onErrorContainer`,
`background`/`onBackground`, `surface`/`onSurface`,
`surfaceVariant`/`onSurfaceVariant`, `outline`/`outlineVariant`,
`surfaceContainerLowest` → `surfaceContainerHighest`, `surfaceDim`/`surfaceBright`,
`inverseSurface`/`inverseOnSurface`/`inversePrimary`, `scrim`, `shadow`,
`surfaceTint`.

Karta's old semantic names (`--color-primary`, `--color-paper`, `--color-line`, …)
have been fully retired in favour of the M3 role names directly — there is
no alias layer, so a component either uses an M3 role or an explicit
app-specific composite token (below).

### Redearth → error

The old `--color-redearth` accent was only ever used to signal a failure or
warning state (a data-load-failure badge, an out-of-coverage message), so
it maps directly onto M3's `error`/`errorContainer` roles rather than
surviving as a separate custom colour — the semantic role already existed
in M3, Karta just hadn't been using it.

### App-specific composite tokens

A handful of tokens are genuinely app-specific (map label rendering isn't
part of the M3 spec) and stay under Karta's own names, but are built from
M3 roles rather than raw hex values, so they stay theme-adaptive:
`--color-map-label-surface`, `--color-map-label-surface-secondary`,
`--color-map-label-outline`, `--color-map-label-text`, `--leaflet-zoom-divider`.

## Shape, elevation, and state

- **Shape**: `--md-sys-shape-corner-none` through `-extra-large` and `-full`
	use M3's own baseline shape scale (4/8/12/16/28px, 9999px for pills),
	rather than app-chosen radii.
- **Elevation**: real `@material/web` components compute their own shadow
	via an internal `<md-elevation>` keyed to `--md-sys-color-shadow` and an
	interaction-driven level — no configuration needed. For Karta's own
	hand-rolled chrome (Leaflet popups/controls), `--md-sys-elevation-shadow-1/2/3`
	holds the equivalent static box-shadow, computed with the identical
	two-layer 30%/15%-opacity formula `@material/web` itself uses
	(`node_modules/@material/web/elevation/internal/elevation-styles.css`),
	not an invented approximation.
- **State layers**: `--state-hover` (8%), `--state-pressed` (12%), and
	`--state-selected` (12%, tinted with `--md-sys-color-primary` instead of
	`--md-sys-color-on-surface`) match M3's own ripple/state-layer opacities,
	for chrome that isn't a real `md-*` component (which handles its own
	state layer internally).

## Typography

Karta keeps its own type families — Inter Variable and Martian Mono
Variable — rather than switching to Roboto. `--md-ref-typeface-plain` and
`--md-ref-typeface-brand` (the M3 tokens components read for their
typescale) point at `--font-body`/`--font-display`, so every `@material/web`
component renders in Karta's fonts automatically. The compact
`--font-size-xs` → `--font-size-lg` scale stays app-specific rather than
adopting M3's full typescale (display/headline/title roles sized for hero
text this dense map-chrome app never shows).

## Component library

`@material/web` is a real dependency (`packages/map`), used directly for
interactive primitives — buttons, icon buttons, segmented buttons, menus,
text fields, switches — via thin `@lit/react` wrapper components
(`packages/map/src/components/md/`) so they compose naturally as React
components with typed props and proper event binding, rather than raw
custom-element JSX. Structural panels this app renders itself (the info
panel, bottom sheet, legend) stay Karta's own markup, themed with the same
M3 tokens, since they're app-shaped surfaces rather than generic controls
Material ships an equivalent for.

### Server rendering

`@material/web` components are Shadow DOM custom elements and do not
render their internal shadow content during SSR (React Router's server
render emits the custom element tag and its light-DOM children/attributes,
not Material's internal shadow markup). Every wrapped `md-*` primitive
therefore reserves its own layout box via `--control-height`/
`--control-height-compact` in the wrapper's CSS *before* the custom element
upgrades client-side, so hydration cannot shift layout (no CLS) even though
the control's Material chrome (ripple, elevation, exact shape) only paints
in after the browser executes `@material/web`'s registration JS. This is a
deliberate, accepted tradeoff — full SSR of Material's shadow DOM would
need `@lit-labs/ssr`'s declarative-shadow-DOM pipeline running alongside
React's, which is not worth the integration complexity for a control layer
this small.

## Accessibility policy

- Minimum 44px touch targets for all interactive controls.
- Keyboard operation and visible focus remain mandatory for all controls.
- Honour reduced motion: `prefers-reduced-motion` collapses animation/transition
	durations globally.
- `prefers-contrast: more` strengthens `--md-sys-color-outline`/`-outline-variant`
	to `--md-sys-color-on-surface` for structural chrome outside `md-*`
	components; Material Web's own components manage their own high-contrast
	behaviour.
- Preserve or improve current Lighthouse accessibility score.

## Implementation guardrails

- One design system: don't reintroduce app-invented token names for
	anything the M3 spec already names — extend the generated M3 tokens
	instead.
- Don't hand-edit generated hex values in `index.css`'s `GENERATED M3 ...
	TOKENS` blocks; change the seed colour and re-run `generate:theme`.
- Prefer a real `@material/web` component (via the `md/` wrapper layer)
	over hand-rolled chrome for anything Material already ships an
	equivalent for; reserve custom CSS for genuinely app-specific surfaces
	(the map itself, the bottom sheet, the legend).
- Avoid visual novelty that competes with evidence layers.

## Success criteria

- Chrome feels cohesive as one floating Material control layer over the map.
- Mobile sheet drag and snap feel physically continuous and interruptible.
- Typography hierarchy is clearer at all sizes without visual noise.
- Reduced-motion mode remains fully usable.
- Existing unit and e2e behaviour is preserved or improved.
