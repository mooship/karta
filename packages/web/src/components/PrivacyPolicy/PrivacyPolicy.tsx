import { THEME_STORAGE_KEY } from "../../constants/themeConfig";
import { cookieName as LOCALE_COOKIE_NAME } from "../../paraglide/runtime.js";
import * as styles from "./PrivacyPolicy.css";

/** ISO date this policy's content was last reviewed for accuracy. */
const LAST_UPDATED = "2026-08-18";

/** This page's title, shared with `routes/privacy.tsx`'s `<title>` so the two can't drift apart. */
export const PRIVACY_POLICY_TITLE = "Privacy policy";

/**
 * The site's privacy policy page content.
 * @remarks Deliberately English-only, unlike the rest of this app's UI copy
 *   (see `messages/*.json`) — legal text carries more risk from an
 *   inaccurate machine translation than the benefit of matching the site's
 *   usual localisation, so it stays in one language everywhere. Reads
 *   `THEME_STORAGE_KEY`/`cookieName` from the modules that actually set
 *   them rather than repeating those strings as literals, so this copy
 *   can't silently drift out of sync with what the app actually stores.
 *   Content here must stay in sync with the root `PRIVACY.md`, which
 *   mirrors it for readers browsing the repository directly.
 */
export function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{PRIVACY_POLICY_TITLE}</h1>
      <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

      <p className={styles.body}>
        Karta is a static-content map: there are no user accounts, no forms, and
        no server-side database of visitor data. This page explains the few
        things the site does store or send on your behalf.
      </p>

      <h2 className={styles.sectionTitle}>Cookies</h2>
      <p className={styles.body}>
        The site sets one first-party cookie, <code>{LOCALE_COOKIE_NAME}</code>,
        when you manually pick a language from the language switcher. It stores
        only that language code, contains no personal data, and is used solely
        to serve the page in your chosen language on later visits — it is not
        used for tracking or analytics.
      </p>

      <h2 className={styles.sectionTitle}>Local storage</h2>
      <p className={styles.body}>
        Your browser's <code>localStorage</code>, under the key{" "}
        <code>{THEME_STORAGE_KEY}</code>, stores your light/dark theme
        preference. This stays on your device — it is never sent to any server.
      </p>

      <h2 className={styles.sectionTitle}>Analytics</h2>
      <p className={styles.body}>
        This site uses Cloudflare Web Analytics for aggregate page-view counts.
        It is cookieless, does not fingerprint visitors, does not track you
        across sites, and stores no personal data. Requests are made to{" "}
        <code>static.cloudflareinsights.com</code> and{" "}
        <code>cloudflareinsights.com</code>.
      </p>

      <h2 className={styles.sectionTitle}>Hosting logs</h2>
      <p className={styles.body}>
        Cloudflare, as host, may log standard request metadata (IP address, user
        agent, timestamp) as part of normal operation — see{" "}
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noreferrer"
        >
          Cloudflare's own privacy policy
        </a>
        .
      </p>

      <h2 className={styles.sectionTitle}>Map tiles and location search</h2>
      <p className={styles.body}>
        The basemap tile providers — OpenStreetMap, CARTO (used for the
        dark-theme basemap), and Esri — may log tile requests, including IP
        address, as part of serving imagery. This is standard for any web map.
        Typing in the search box sends your query to OpenStreetMap's Nominatim
        geocoding service, which may likewise log the query and your IP address.
      </p>

      <h2 className={styles.sectionTitle}>No location tracking</h2>
      <p className={styles.body}>
        The browser's geolocation API is not used by this site, and is disabled
        at the HTTP-header level via a <code>Permissions-Policy</code> header.
      </p>

      <a className={styles.backLink} href="/">
        Back to the map
      </a>
    </div>
  );
}
