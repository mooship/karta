import { createRequestHandler } from "react-router";

const OLD_HOSTNAME = "buffer-zones.timothybrits.co.za";
const NEW_HOSTNAME = "karta.timothybrits.co.za";

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
 */
export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    if (url.hostname === OLD_HOSTNAME) {
      url.hostname = NEW_HOSTNAME;
      return Response.redirect(url.toString(), 301);
    }
    return requestHandler(request);
  },
} satisfies ExportedHandler;
