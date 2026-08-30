import { createRequestHandler } from "react-router";
import { SECURITY_HEADERS } from "../src/constants/securityHeaders";
import { SITE_URL } from "../src/constants/siteConfig";

const OLD_HOSTNAME = "buffer-zones.timothybrits.co.za";
const NEW_HOSTNAME = new URL(SITE_URL).hostname;

const requestHandler = createRequestHandler(
  () => import("../build/server/index.js"),
  import.meta.env?.MODE ?? "production",
);

/**
 * The Cloudflare Workers entry point. Permanently redirects requests for the
 * app's old hostname to its current one, then delegates everything else to
 * the built React Router server bundle. There are no Cloudflare bindings to
 * thread through, so the request is passed on with no `RouterContextProvider`.
 * @remarks Locale resolution (`paraglideMiddleware`) deliberately happens
 *   inside `entry.server.tsx`, not here, even though this file is also a
 *   valid place to call it. This file is bundled by wrangler (esbuild)
 *   directly from source, while `../build/server/index.js` is a separate
 *   artifact already bundled by Vite — two different bundlers, so
 *   `paraglide/runtime.js` (and its module-scope AsyncLocalStorage) ends up
 *   duplicated rather than shared between them. Wrapping here would resolve
 *   the locale into a copy of that state the render never reads from,
 *   leaving `getLocale()` inside the render permanently falling back to
 *   `baseLocale`. `entry.server.tsx` shares Vite's single build graph with
 *   `root.tsx`, so wrapping there is what actually reaches `getLocale()`.
 * @remarks The `try`/`catch` around `requestHandler` is a last-resort net,
 *   not the primary error path — `entry.server.tsx`'s `onError` and
 *   `root.tsx`'s `ErrorBoundary` catch render/loader/action errors and log
 *   them via `console.error` before this ever sees them. This only fires
 *   for a failure outside that render lifecycle entirely (e.g. the dynamic
 *   `import("../build/server/index.js")` itself failing), where an
 *   unhandled throw would otherwise surface as a bare Workers runtime
 *   exception instead of a logged error and a response.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === OLD_HOSTNAME) {
      url.hostname = NEW_HOSTNAME;
      return Response.redirect(url.toString(), 301);
    }
    try {
      return withSecurityHeaders(await requestHandler(request));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response("Internal Server Error", { status: 500 }),
      );
    }
  },
} satisfies ExportedHandler;

/**
 * Adds this app's `SECURITY_HEADERS` to `response`, without disturbing
 * headers `response` already set — except `Content-Security-Policy`, which
 * is deliberately skipped here.
 * @remarks `public/_headers`' own `/*` block covers every response served
 *   directly from the Workers Static Assets binding, but this Worker's own
 *   `fetch` handler — every SSR-rendered document, including error
 *   responses — sits outside that binding entirely, so those headers never
 *   reach it. See `securityHeaders.ts`'s own comment for the full picture
 *   and how the two are kept in sync.
 * @remarks CSP is excluded here specifically, not an oversight: applying
 *   `SECURITY_HEADERS`' `script-src`/`style-src` (no `'unsafe-inline'`, only
 *   one hardcoded script hash for the theme-bootstrap `<script>`) to an
 *   SSR-streamed response also blocks React Router's own inline
 *   hydration/streaming `<script>` tags and React's inline
 *   `style="display:none"` attribute on Suspense fallbacks — neither is
 *   coverable by that one static hash, and CSP hashes don't apply to style
 *   *attributes* at all without the separate `'unsafe-hashes'` keyword
 *   (confirmed live: enabling this broke hydration entirely, blanking the
 *   map). Closing this gap correctly needs a per-request nonce threaded
 *   through `entry.server.tsx`'s `renderToReadableStream` call, which is
 *   share-safe to fix in isolation and verify against a real browser next.
 */
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (name === "Content-Security-Policy") {
      continue;
    }
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
