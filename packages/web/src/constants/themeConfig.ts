/** The `<meta name="theme-color">` value for each theme, passed to `@karta/react`'s `initTheme`. */
export const THEME_COLOR = {
  light: "#f6f2e9",
  dark: "#16130f",
} as const;

/**
 * localStorage key the stored theme preference is read/written under.
 * @remarks Predates the Karta rename (from when this app was called
 *   "buffer-zones") and is kept as-is to avoid discarding users' stored
 *   preference.
 */
export const THEME_STORAGE_KEY = "buffer-zones-theme";
