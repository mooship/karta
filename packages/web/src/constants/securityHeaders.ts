/**
 * Builds this app's Content-Security-Policy directive string.
 * @param nonce - When given, added to `script-src` as `'nonce-<value>'`,
 *   alongside the static hash below. Omit for the static default used by
 *   `public/_headers` (static-asset responses have no per-request nonce)
 *   and by `workers/app.ts`'s 500 fallback (a plain-text body with nothing
 *   inline to allow).
 * @remarks The `sha256-` source keeps allowing `root.tsx`'s inlined
 *   `THEME_BOOTSTRAP_SCRIPT` — a genuinely static script authored directly
 *   in JSX, not one React injects itself, so a hash (not a nonce) is the
 *   right fit for it. A nonce, once supplied, additionally covers the
 *   streaming/hydration `<script>` tags React itself injects during SSR,
 *   which a hash can't: their content isn't static across requests.
 *   `entry.server.tsx` generates one nonce per request via {@link
 *   generateNonce}, sets it here for the response header, and passes the
 *   same value to `renderToReadableStream`'s own `nonce` option so both
 *   sides agree. `script-src` deliberately omits `https://ajax.cloudflare.com`
 *   (Rocket Loader): nothing in this app requests or documents that Speed
 *   feature, and it isn't a Workers Static Assets/SSR concept this codebase
 *   controls — if a zone-level Cloudflare setting enables Rocket Loader for
 *   this domain, it needs its own allowlist entry back, added deliberately
 *   alongside enabling that setting, not carried here as a standing default.
 *   `frame-src 'none'` is explicit rather than left to fall back through
 *   `child-src`/`default-src`: this app never embeds an iframe, matching the
 *   symmetric `frame-ancestors 'none'` (this app is never embedded either),
 *   and an explicit value avoids `child-src`'s legacy fallback behaviour
 *   (covering both framing *and* worker sources) unintentionally narrowing
 *   `frame-src` to whatever `child-src` allows for workers.
 */
export function buildContentSecurityPolicy(nonce?: string): string {
  const scriptSources = [
    "'self'",
    "'sha256-HG8PUaCswII51AFFCizfjxISB0x6tOe/Gqljp1vzDRw='",
    ...(nonce ? [`'nonce-${nonce}'`] : []),
    "https://static.cloudflareinsights.com",
  ];

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self'",
    "img-src 'self' data: blob: https://tile.openstreetmap.org https://server.arcgisonline.com https://tiles.openfreemap.org",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com https://tile.openstreetmap.org https://server.arcgisonline.com https://nominatim.openstreetmap.org https://tiles.openfreemap.org",
    "worker-src 'self' blob:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}

/**
 * Generates a fresh, per-request Content-Security-Policy nonce: 16
 * cryptographically random bytes, base64-encoded per the CSP spec's own
 * nonce format.
 * @remarks Base64's alphabet (`A-Za-z0-9+/=`) contains neither `'` nor `;`,
 *   so the result is always safe to embed directly inside a `'nonce-<value>'`
 *   CSP source without further escaping.
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Security response headers applied to every request.
 * @remarks The single source of truth for this app's security headers.
 *   `public/_headers`' `/*` block carries the exact same header/value pairs
 *   for Cloudflare's Workers Static Assets responses (its own `_headers`
 *   convention — a plain static file, not generated from this module) —
 *   `securityHeaders.test.ts` parses that file and asserts it stays in sync
 *   with this constant. `workers/app.ts` applies this constant directly to
 *   its own SSR-rendered responses, which `_headers` does not reach: the
 *   `_headers` convention only covers responses served straight from the
 *   Workers Static Assets binding, not ones this Worker's own `fetch`
 *   handler dynamically renders. Its `Content-Security-Policy` entry is the
 *   nonce-free default from {@link buildContentSecurityPolicy} — the
 *   per-request, nonce-bearing policy `entry.server.tsx` sets on a
 *   successful SSR response takes precedence over this one, which only
 *   ends up applied to responses with no CSP of their own (see
 *   `workers/app.ts`'s `withSecurityHeaders`).
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), camera=(), microphone=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": buildContentSecurityPolicy(),
};
