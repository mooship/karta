# Privacy Policy

_Last updated: 2026-08-25_

_This mirrors the policy rendered on the site itself at `/privacy`
(`packages/web/src/components/PrivacyPolicy/PrivacyPolicy.tsx`); keep both in
sync when either changes._

Karta is a static-content map: there are no user accounts, no forms, and no
server-side database of visitor data.

**Cookies:** the site sets one first-party cookie, `PARAGLIDE_LOCALE`, when
you manually pick a language from the language switcher. It stores only that
language code, contains no personal data, and is used solely to serve the
page in your chosen language on later visits — it is not used for tracking or
analytics.

**Local storage:** your browser's `localStorage`, under the key
`buffer-zones-theme`, stores your light/dark theme preference. This stays on
your device — it is never sent to any server.

**Analytics:** this site uses Cloudflare Web Analytics for aggregate page-view
counts. It is cookieless, does not fingerprint visitors, does not track you
across sites, and stores no personal data. Requests are made to
`static.cloudflareinsights.com` and `cloudflareinsights.com`.

**Error reporting:** if the app hits an unexpected error in your browser, it
sends a short diagnostic report (the error message, a stack trace, and the
page URL) to this site's own server, where it is written to Cloudflare's
operational logs so the fault can be fixed. No cookies, personal data, or
persistent identifiers are attached to this report, and it is not stored in
any database.

**Hosting logs:** Cloudflare, as host, may log standard request metadata (IP
address, user agent, timestamp) as part of normal operation — see Cloudflare's
own privacy policy.

**Map tiles and location search:** the basemap tile providers (OpenStreetMap,
CARTO, Esri) may log tile requests, including IP address, as part of serving
imagery. CARTO tiles are used for the dark-theme basemap. Location search
queries are sent to OpenStreetMap's Nominatim geocoding service, which may
likewise log the query and your IP address. This is standard for any web map.

**No location tracking:** the browser's geolocation API is not used, and it is
disabled at the HTTP-header level via `Permissions-Policy`.
