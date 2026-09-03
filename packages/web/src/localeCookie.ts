import {
  cookieDomain,
  cookieMaxAge,
  cookieName,
  overwriteSetLocale,
  type SetLocaleFn,
  setLocale,
} from "./paraglide/runtime.js";

/**
 * Upgrades Paraglide's own cookie-based locale persistence (`setLocale()`,
 * called by `LanguageToggle`) to set `Secure` and `SameSite=Lax` on the
 * `PARAGLIDE_LOCALE` cookie — attributes the generated Paraglide runtime has
 * no compiler option to configure (`@inlang/paraglide-js`'s
 * `CompilerOptions` exposes `cookieName`/`cookieMaxAge`/`cookieDomain`, but
 * nothing for the cookie's security attributes), since it writes the cookie
 * via a bare `document.cookie` assignment carrying only `path`/`max-age`
 * (and `domain`, if configured). Uses Paraglide's own `overwriteSetLocale()`
 * extension point rather than hand-editing the generated
 * `src/paraglide/runtime.js`, which the next `messages:compile` run would
 * silently regenerate without this fix.
 * @remarks Must run once, before any `setLocale()` call — call it at
 *   bootstrap, mirroring `initTheme()` in `entry.client.tsx`. Snapshots the
 *   pre-overwrite `setLocale` into a local variable first: `setLocale` is a
 *   live module binding, so reading it again *after* `overwriteSetLocale`
 *   reassigns it would resolve to this very wrapper and recurse forever.
 *   The re-issued `document.cookie` write below runs synchronously right
 *   after delegating to the original `setLocale()` (this app's configured
 *   strategies carry no async custom strategy, so it returns synchronously)
 *   and so still completes before the reload/navigation `setLocale()`
 *   triggers actually unloads the page.
 */
export function hardenLocaleCookieSecurity(): void {
  const originalSetLocale: SetLocaleFn = setLocale;

  overwriteSetLocale((newLocale, options) => {
    const result = originalSetLocale(newLocale, options);
    if (typeof document !== "undefined") {
      const cookieString = `${cookieName}=${newLocale}; path=/; max-age=${cookieMaxAge}; Secure; SameSite=Lax`;
      // biome-ignore lint/suspicious/noDocumentCookie: deliberately re-issuing Paraglide's own cookie write with the Secure/SameSite attributes it has no compiler option to add
      document.cookie = cookieDomain
        ? `${cookieString}; domain=${cookieDomain}`
        : cookieString;
    }
    return result;
  });
}
