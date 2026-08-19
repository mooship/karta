# Karta Design System

Karta adopts Google's Material 3 (M3) design language directly, rather than
an app-owned system with its own vocabulary. Every component is Karta's own
plain React + CSS Modules, styled entirely from M3 tokens — colour roles,
shape scale, elevation, state layers — so the visual result is faithfully
Material 3 without depending on Google's own component library (see
"Component library" below for why). Tokens use Material's own naming
(`--md-sys-color-primary`, `--md-sys-shape-corner-medium`, …) rather than
app-invented names, so the system stays legible to anyone who already
knows Material 3.

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

Every `--md-sys-color-*` role is generated from one brand seed colour (a
deep teal, `#0E8388`, chosen over the app's original ochre for a bolder,
more distinctive identity while still reading as serious civic
infrastructure rather than a consumer product) using Material Color
Utilities' HCT-based tonal palette algorithm — the same engine behind
Android's Material You dynamic theming. `packages/web/scripts/generateM3Theme.ts`
owns this: it builds a `SchemeTonalSpot` (light and dark) from the seed via
`MaterialDynamicColors`, and writes the resolved hex values into the
generated token block in `packages/web/src/index.css`.

To change Karta's brand colour, edit `SEED_COLOR_HEX` in that script and
re-run `npm run generate:theme --workspace @karta/web` — never hand-edit
the hex values inside the `/* GENERATED M3 ... TOKENS */` markers directly,
since the next run overwrites them.

The generated role set covers the full M3 2021+ scheme:

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
- **Elevation**: `--md-sys-elevation-shadow-1/2/3` holds a static box-shadow
	computed with the same two-layer 30%/15%-opacity formula Material 3's own
	`<md-elevation>` component uses internally (studied from
	`@material/web/elevation/internal/elevation-styles.css` — see
	"Component library" below for why that's a reference, not a dependency),
	not an invented approximation.
- **State layers**: `--state-hover` (8%), `--state-pressed` (12%), and
	`--state-selected` (12%, tinted with `--md-sys-color-primary` instead of
	`--md-sys-color-on-surface`) match M3's own ripple/state-layer opacities.
- **Motion**: `--motion-ease-decelerate`/`--motion-ease-accelerate` use M3's
	*Emphasized* easing set (not the flatter Standard curves) for anything
	entering/settling or leaving the screen once — panels, sheets, popovers,
	legend/layer-list entrance stagger, error toasts — so chrome feels more
	alive without adding a second, app-invented motion vocabulary.
	`--motion-ease-standard` stays the flatter M3 Standard curve for
	hover/press feedback and anything that can repeat in quick succession,
	where the extra emphasis would read as jitter rather than character.
	`--motion-ease-spring` is a small-overshoot curve reserved for isolated,
	one-shot punctuation (a `SegmentedControl` option popping into place on
	selection) — not part of the M3 spec's named easing sets, but in the
	spirit of Material You's own spring-based motion physics, and never used
	on anything that repeats rapidly or moves a large surface. All of it
	still collapses under `prefers-reduced-motion` via the existing global
	rule (see "Accessibility policy" below).

## Typography

Karta keeps its own type families — Inter Variable and Martian Mono
Variable — rather than switching to Roboto. The compact
`--font-size-xs` → `--font-size-lg` scale stays app-specific rather than
adopting M3's full typescale (display/headline/title roles sized for hero
text this dense map-chrome app never shows).

## Component library

Karta implements Material 3 components itself, as plain React + CSS
Modules against the tokens above, rather than depending on
`@material/web` (Google's own Shadow DOM custom element library). That
was tried first and reverted: `@material/web`'s components are Lit-based
custom elements, and getting them safe under this app's Cloudflare
Workers SSR required a real workaround (importing them at all throws
`ReferenceError: HTMLElement is not defined` under workerd), which in
turn meant a client-only-mount gate for every single primitive to avoid a
React hydration mismatch, an `ElementInternals` polyfill for unit tests
(happy-dom has none), and unit tests that couldn't use ARIA-role queries
at all (`getByRole` can't see into a Shadow DOM happy-dom never renders).
That's real, compounding friction for every future component, not a
one-off cost — and none of it is specific to Material 3 as a *design
system*, only to `@material/web`'s specific Shadow DOM delivery
mechanism. A plain React implementation gets the same HCT-generated
colours, same shape scale, same elevation formula, with none of it:
normal SSR, normal hydration, normal `getByRole` tests, no extra runtime
weight.

## Accessibility policy

- Minimum 44px touch targets for all interactive controls.
- Keyboard operation and visible focus remain mandatory for all controls.
- Honour reduced motion: `prefers-reduced-motion` collapses animation/transition
	durations globally.
- `prefers-contrast: more` strengthens `--md-sys-color-outline`/`-outline-variant`
	to `--md-sys-color-on-surface`.
- Preserve or improve current Lighthouse accessibility score.

## Implementation guardrails

- One design system: don't reintroduce app-invented token names for
	anything the M3 spec already names — extend the generated M3 tokens
	instead.
- Don't hand-edit generated hex values in `index.css`'s `GENERATED M3 ...
	TOKENS` blocks; change the seed colour and re-run `generate:theme`.
- No `@material/web` (or any other Shadow DOM custom element component
	library) dependency — see "Component library" above. Build new controls
	as plain React + CSS Modules against the M3 tokens.
- Avoid visual novelty that competes with evidence layers.

## Success criteria

- Chrome feels cohesive as one floating Material control layer over the map.
- Mobile sheet drag and snap feel physically continuous and interruptible.
- Typography hierarchy is clearer at all sizes without visual noise.
- Reduced-motion mode remains fully usable.
- Existing unit and e2e behaviour is preserved or improved.
