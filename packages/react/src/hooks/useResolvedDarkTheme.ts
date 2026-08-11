import { usePrefersDarkMode } from "./usePrefersDarkMode";
import { useThemePreference } from "./useThemePreference";

/**
 * Resolves whether dark theme should currently render, combining the user's
 * explicit `useThemePreference()` choice with the OS-level
 * `usePrefersDarkMode()` signal for the `"system"` case.
 * @remarks Centralises the "`\"system\"` falls through to the OS setting"
 *   rule in one place, so callers don't each re-derive it from the two
 *   lower-level hooks.
 */
export function useResolvedDarkTheme(): boolean {
  const prefersDark = usePrefersDarkMode();
  const themePreference = useThemePreference();
  return (
    themePreference === "dark" || (themePreference === "system" && prefersDark)
  );
}
