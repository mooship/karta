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
 *   handler dynamically renders.
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), camera=(), microphone=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'sha256-HG8PUaCswII51AFFCizfjxISB0x6tOe/Gqljp1vzDRw=' https://static.cloudflareinsights.com https://ajax.cloudflare.com; style-src 'self'; img-src 'self' data: blob: https://tile.openstreetmap.org https://server.arcgisonline.com https://tiles.openfreemap.org; font-src 'self'; connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com https://tile.openstreetmap.org https://server.arcgisonline.com https://nominatim.openstreetmap.org https://tiles.openfreemap.org; worker-src 'self' blob:; child-src blob:; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'",
};
