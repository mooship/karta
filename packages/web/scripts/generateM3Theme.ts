/**
 * Regenerates the Material 3 colour token block in `src/index.css` from a
 * single seed colour, using Material Color Utilities' HCT-based tonal
 * palette algorithm (the same engine Material You / Android theming uses).
 *
 * @remarks
 * Run with `npm run generate:theme --workspace @karta/web` after changing
 * `SEED_COLOR_HEX` below. The script owns the `/* GENERATED M3 TOKENS *\/`
 * block in `index.css` end to end — hand edits inside that block are
 * overwritten on the next run, so any change to Karta's brand colour must
 * happen here, not by hand-editing the generated hex values.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  argbFromHex,
  type DynamicColor,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeTonalSpot,
} from "@material/material-color-utilities";

/** Karta's brand accent (the historical `--color-ochre` value) — the single seed every M3 tonal palette is derived from. */
const SEED_COLOR_HEX = "#8a5a1e";

/** Every M3 colour role consumed by `@material/web` components or by Karta's own hand-rolled chrome (Leaflet controls, popups). */
const COLOR_ROLES = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "outline",
  "outlineVariant",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceDim",
  "surfaceBright",
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
  "scrim",
  "shadow",
  "surfaceTint",
] as const;

/** camelCase M3 role name → kebab-case `--md-sys-color-*` custom property suffix (e.g. `onPrimaryContainer` → `on-primary-container`). */
function tokenNameFor(role: string): string {
  return `--md-sys-color-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

/** Provides every {@link COLOR_ROLES} role's `DynamicColor` resolver; stateless with respect to light/dark, so built once and shared by both `resolveScheme` calls. */
const dynamicColors = new MaterialDynamicColors() as unknown as Record<
  (typeof COLOR_ROLES)[number],
  () => DynamicColor
>;

/** Resolves every {@link COLOR_ROLES} role to its hex value for one light/dark `SchemeTonalSpot`. */
function resolveScheme(scheme: SchemeTonalSpot): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const role of COLOR_ROLES) {
    resolved[role] = hexFromArgb(dynamicColors[role]().getArgb(scheme));
  }
  return resolved;
}

/** Renders a resolved role map as two-space-indented `--md-sys-color-x: #hex;` lines, matching `index.css`. */
function renderTokenLines(roles: Record<string, string>): string {
  return COLOR_ROLES.map(
    (role) => `  ${tokenNameFor(role)}: ${roles[role]};`,
  ).join("\n");
}

const sourceHct = Hct.fromInt(argbFromHex(SEED_COLOR_HEX));
const lightRoles = resolveScheme(new SchemeTonalSpot(sourceHct, false, 0));
const darkRoles = resolveScheme(new SchemeTonalSpot(sourceHct, true, 0));

const indexCssPath = fileURLToPath(
  new URL("../src/index.css", import.meta.url),
);
const original = readFileSync(indexCssPath, "utf8");

const startMarker =
  "/* GENERATED M3 LIGHT TOKENS — see scripts/generateM3Theme.ts */";
const endMarker = "/* END GENERATED M3 LIGHT TOKENS */";
const darkStartMarker =
  "/* GENERATED M3 DARK TOKENS — see scripts/generateM3Theme.ts */";
const darkEndMarker = "/* END GENERATED M3 DARK TOKENS */";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replaces every occurrence of a `start...end` marker pair with fresh
 * `body` content. Karta's dark tokens are declared twice (once under
 * `prefers-color-scheme: dark`, once under `[data-theme="dark"]`), so this
 * must replace all matches, not just the first.
 */
function replaceAllBlocks(
  source: string,
  start: string,
  end: string,
  body: string,
): string {
  const pattern = new RegExp(
    `${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`,
    "g",
  );
  const replacementCount = source.match(pattern)?.length ?? 0;
  if (replacementCount === 0) {
    throw new Error(`Could not find ${start} / ${end} markers in index.css`);
  }
  return source.replace(pattern, `${start}\n${body}\n  ${end}`);
}

let next = replaceAllBlocks(
  original,
  startMarker,
  endMarker,
  renderTokenLines(lightRoles),
);
next = replaceAllBlocks(
  next,
  darkStartMarker,
  darkEndMarker,
  renderTokenLines(darkRoles),
);

writeFileSync(indexCssPath, next);

console.log(
  `Regenerated M3 tokens in ${indexCssPath} from seed ${SEED_COLOR_HEX}`,
);
