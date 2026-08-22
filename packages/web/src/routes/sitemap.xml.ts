import { SITE_URL } from "../constants/siteConfig";
import { staticTextResponse } from "./staticTextResponse";

/**
 * Every page this site wants indexed, kept in step with `routes.ts` by
 * hand — there are only two routes today, so an abstraction deriving this
 * from the route config would add indirection with nothing to reuse it.
 */
const SITEMAP_XML_BODY = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;

/**
 * React Router resource route: generates `/sitemap.xml` from
 * `SITEMAP_XML_BODY`/`SITE_URL` rather than a hand-maintained static file,
 * so every emitted URL is guaranteed absolute and points at the current
 * production origin.
 */
export function loader(): Response {
  return staticTextResponse(SITEMAP_XML_BODY, "application/xml; charset=utf-8");
}
