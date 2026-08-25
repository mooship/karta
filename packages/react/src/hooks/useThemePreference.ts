import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import { safeStorage } from "./safeStorage";

/**
 * Ambient, type-only: this package has no dependency on `@types/node`, but
 * bundlers (Vite, webpack) statically replace the literal expression
 * `process.env.NODE_ENV` and dead-code-eliminate the branch it guards in
 * production builds, so the check below is written to match that idiom
 * rather than importing a real Node type.
 */
declare const process: { env?: { NODE_ENV?: string } } | undefined;

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 * @remarks `useLayoutEffect` fires synchronously before the browser paints,
 *   which matters here: the effect it backs re-applies `data-theme` after a
 *   React hydration-mismatch recovery elsewhere in the tree can silently
 *   drop it (see `useThemePreference` below), and a plain `useEffect` is a
 *   passive effect that only runs *after* paint — leaving one visible frame
 *   of the wrong theme before it catches up, exactly the flash this exists
 *   to prevent. `useLayoutEffect` itself is a no-op during SSR and logs a
 *   warning if called there, so this swaps to `useEffect` server-side rather
 *   than suppressing that warning.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Explicit theme choice. `"system"` follows the OS `prefers-color-scheme`. */
export type ThemePreference = "system" | "light" | "dark";

/**
 * Every valid `ThemePreference` value, for callers that need to enumerate
 * them (e.g. building a picker's option list) rather than just narrow to
 * the type.
 */
export const THEME_PREFERENCES: readonly ThemePreference[] = [
  "system",
  "light",
  "dark",
];

/** Configuration for the theme preference system. */
export interface ThemeConfig {
  /** localStorage key used to persist the preference. */
  storageKey: string;
  /** CSS color values used in the `<meta name="theme-color">` tag. */
  colors: { light: string; dark: string };
}

const DEFAULT_CONFIG: ThemeConfig = {
  storageKey: "karta-theme",
  colors: { light: "#ffffff", dark: "#000000" },
};

let config: ThemeConfig = DEFAULT_CONFIG;
let initialized = false;
let warnedAboutMissingInit = false;

/**
 * Configures the theme preference system with app-specific values.
 * @param themeConfig - The storage key and colour values to use.
 * @remarks Call once at app bootstrap before any component renders. Re-reads
 *   the stored preference under the new `storageKey`, since the module's
 *   initial read (at import time, before `initTheme` can run) used whatever
 *   config was active then — typically the built-in default. Notifies any
 *   already-subscribed components in case this runs after mount (e.g. HMR),
 *   so the store never holds a stale preference silently.
 * @example
 * initTheme({ storageKey: "karta-theme", colors: THEME_COLOR });
 */
export function initTheme(themeConfig: ThemeConfig): void {
  initialized = true;
  config = themeConfig;
  if (typeof window !== "undefined") {
    currentPreference = readStoredPreference();
    applyThemeAttribute(currentPreference);
    for (const listener of listeners) {
      listener();
    }
  }
}

const THEME_COLOR_OVERRIDE_ATTR = "data-theme-override";

function isExplicitTheme(value: string | null): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

/**
 * @remarks Both call sites (`initTheme`, module init) already guard with
 *   `typeof window === "undefined"` before calling this. Reads through
 *   `safeStorage` rather than `localStorage` directly, so a blocked store
 *   degrades to the `"system"` default rather than failing the whole module
 *   import when this runs at module-evaluation time (see the module-level
 *   call below).
 */
function readStoredPreference(): ThemePreference {
  const stored = safeStorage.get(config.storageKey);
  return isExplicitTheme(stored) ? stored : "system";
}

/** @remarks Only called from `applyThemeAttribute`, which already returns before calling it if `document` is undefined. */
function syncThemeColorMeta(preference: ThemePreference) {
  const existingOverride = document.querySelector(
    `meta[name="theme-color"][${THEME_COLOR_OVERRIDE_ATTR}]`,
  );
  if (preference === "system") {
    existingOverride?.remove();
    return;
  }
  const content = config.colors[preference];
  if (existingOverride) {
    existingOverride.setAttribute("content", content);
    return;
  }
  const override = document.createElement("meta");
  override.setAttribute("name", "theme-color");
  override.setAttribute("content", content);
  override.setAttribute(THEME_COLOR_OVERRIDE_ATTR, "");
  document.head.prepend(override);
}

function applyThemeAttribute(preference: ThemePreference) {
  if (typeof document === "undefined") {
    return;
  }
  if (preference === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = preference;
  }
  syncThemeColorMeta(preference);
}

let currentPreference: ThemePreference = "system";
if (typeof window !== "undefined") {
  currentPreference = readStoredPreference();
}
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return currentPreference;
}

function getServerSnapshot(): ThemePreference {
  return "system";
}

/**
 * Sets the user's theme preference, persists it to localStorage, and updates
 * the document's `data-theme` attribute and theme-color meta tag.
 * @param preference - `"system"` removes any explicit override.
 * @remarks Persists through `safeStorage`, so a blocked or unavailable store
 *   (see its doc comment) doesn't throw -- the preference still takes effect
 *   in memory and on the document for the current session, it just won't
 *   survive a reload.
 */
export function setThemePreference(preference: ThemePreference) {
  currentPreference = preference;
  if (typeof window !== "undefined") {
    if (preference === "system") {
      safeStorage.remove(config.storageKey);
    } else {
      safeStorage.set(config.storageKey, preference);
    }
  }
  applyThemeAttribute(preference);
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Returns the current theme preference, updating reactively when it changes.
 * @remarks Call `initTheme` before any component using this hook mounts.
 *   Re-applies the `data-theme` attribute (and theme-color meta tag) to the
 *   document on mount and whenever the preference value itself changes,
 *   rather than trusting `initTheme`'s pre-hydration script-tag write to
 *   stick — a React hydration-mismatch recovery elsewhere in the tree can
 *   rebuild `<html>`'s attributes from its own JSX-managed props alone,
 *   silently dropping this attribute since React never owned it. That
 *   in-memory preference itself survives any such recovery untouched, so
 *   this effect self-heals the DOM from it on this hook's next mount (e.g.
 *   the remount a mismatch recovery forces) or next `preference` change —
 *   not on every unrelated render, since the effect's dependency array is
 *   `[preference]`; an attribute cleared by something that leaves both the
 *   component tree and `preference` untouched would need a fresh
 *   `setThemePreference()` call to be repaired. Called before `initTheme`,
 *   this falls back to the built-in default `storageKey`/`colors` and logs
 *   one development-mode warning, rather than silently persisting under a
 *   key/branding that isn't the caller's own.
 */
export function useThemePreference() {
  if (
    !initialized &&
    !warnedAboutMissingInit &&
    typeof process !== "undefined" &&
    process.env?.NODE_ENV !== "production"
  ) {
    warnedAboutMissingInit = true;
    console.warn(
      "useThemePreference() was called before initTheme() -- falling back to " +
        `the default storageKey (${JSON.stringify(DEFAULT_CONFIG.storageKey)}) and colors. ` +
        "Call initTheme({ storageKey, colors }) once at app bootstrap, before any component mounts.",
    );
  }
  const preference = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  useIsomorphicLayoutEffect(() => {
    applyThemeAttribute(preference);
  }, [preference]);
  return preference;
}
