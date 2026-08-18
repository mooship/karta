# Privacy Policy

_Last updated: 2026-08-18_

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

**Layer-usage analytics:** when you turn a map layer on or off, the site
sends a same-origin request to `/api/layer-usage` recording only which layer
id changed and whether it's now visible — no timestamp, no session id, no IP
address, no cookie, and nothing else that could identify you or your visit.
It's aggregated with Cloudflare Analytics Engine into layer-level totals;
there is no way to reconstruct an individual visitor's session from it. Sent
via `navigator.sendBeacon`, and skipped entirely if your browser signals Do
Not Track or Global Privacy Control.

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
