/**
 * Shared cache policy for the generated static-content routes
 * (`robots.txt`, `sitemap.xml`, `llms.txt`) — their bodies are computed
 * once at module scope and never vary per request.
 */
const STATIC_ROUTE_CACHE_CONTROL = "public, max-age=3600";

/**
 * Builds a `Response` for a resource route serving pre-computed static
 * text (plain text or XML), consistently cached.
 */
export function staticTextResponse(
  body: string,
  contentType: string,
): Response {
  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": STATIC_ROUTE_CACHE_CONTROL,
    },
  });
}
