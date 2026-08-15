import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { paraglideMiddleware } from "./paraglide/server.js";

/**
 * React Router server entry point: streams the SSR response for a request
 * via `ServerRouter`, logging (but not surfacing) render errors to the
 * console.
 * @remarks Wraps the render in `paraglideMiddleware` itself, rather than
 *   leaving that to `workers/app.ts`, so the locale it resolves into
 *   AsyncLocalStorage is visible to `getLocale()`/`m.*()` calls made during
 *   this render (`root.tsx`'s `Layout`/`meta`). `workers/app.ts` is bundled
 *   separately by wrangler (it statically imports `paraglide/server.js` from
 *   source), while this file is bundled by Vite as part of the same
 *   `react-router build` output as `root.tsx` — two different bundlers
 *   producing two different copies of `paraglide/runtime.js`, each with its
 *   own module-scope `serverAsyncLocalStorage`. Wrapping in `workers/app.ts`
 *   populated only *its* copy; `root.tsx`'s `getLocale()` call (from the
 *   Vite-built copy) never saw it and always fell back to `baseLocale`
 *   ("en") regardless of the request's locale cookie or `Accept-Language` —
 *   silently discarded by React's client-side hydration correcting the
 *   mismatch afterwards, but not before it briefly rendered the wrong
 *   locale (and, as a further side effect, dropped the `data-theme`
 *   attribute — see `useThemePreference`'s self-healing effect). This app
 *   has no route loaders and no `"url"` locale strategy, so wrapping just
 *   the render here (rather than the outer request-matching step too) is
 *   sufficient: `meta()` and `Layout` are the only locale-dependent reads,
 *   and both run during this render.
 */
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return paraglideMiddleware(request, async () => {
    const body = await renderToReadableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        signal: request.signal,
        onError(error) {
          console.error(error);
        },
      },
    );

    responseHeaders.set("Content-Type", "text/html");

    return new Response(body, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  });
}
