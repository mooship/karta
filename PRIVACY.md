# Privacy policy

_Last updated: 2026-08-25_

_This mirrors the policy on the site at `/privacy`
(`packages/web/src/components/PrivacyPolicy/PrivacyPolicy.tsx`). Keep both in
sync when either changes._

Karta is a static-content map. There are no user accounts, no forms and no
server-side database of visitor data. The site stores or sends only the
following.

## Cookies

The site sets one first-party cookie, `PARAGLIDE_LOCALE`, when you pick a
language from the language switcher. It stores only that language code,
contains no personal data, and is used only to serve the page in your chosen
language on later visits. It is not used for tracking or analytics.

## Local storage

Your browser's `localStorage`, under the key `buffer-zones-theme`, stores your
light or dark theme preference. It stays on your device and is never sent to a
server.

## Analytics

This site uses Cloudflare Web Analytics for aggregate page-view counts. It is
cookieless, does not fingerprint visitors, does not track you across sites,
and stores no personal data. Requests are made to
`static.cloudflareinsights.com` and `cloudflareinsights.com`.

## Error reporting

If the app hits an unexpected error in your browser, it sends a short
diagnostic report (the error message, a stack trace and the page URL) to this
site's own server, where it is written to Cloudflare's operational logs so the
fault can be fixed. No cookies, personal data or persistent identifiers are
attached to the report, and it is not stored in any database.

## Hosting logs

Cloudflare, as host, may log standard request metadata (IP address, user
agent, timestamp) as part of normal operation. See Cloudflare's own privacy
policy.

## Map tiles and location search

The basemap tile providers (OpenFreeMap and Esri) may log tile requests,
including your IP address, as part of serving imagery. Location search
queries go to OpenStreetMap's Nominatim geocoding service, which may also log
the query and your IP address. This is standard for any web map.

## No location tracking

The browser's geolocation API is not used, and it is disabled at the
HTTP-header level with `Permissions-Policy`.