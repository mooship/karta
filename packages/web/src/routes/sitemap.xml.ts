import { SITE_URL } from "../constants/siteConfig";

/** One `<url>` entry in the generated sitemap. */
interface SitemapEntry {
  readonly path: string;
  readonly changefreq: "weekly" | "yearly";
  readonly priority: number;
}

/**
 * Every page this site wants indexed, kept in step with `routes.ts` by
 * hand — there are only two routes today, so deriving this from the route
 * config would add an abstraction with nothing to reuse it.
 */
const SITEMAP_ENTRIES: readonly SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/privacy", changefreq: "yearly", priority: 0.3 },
];

function toUrlXml(entry: SitemapEntry): string {
  return `  <url>\n    <loc>${SITE_URL}${entry.path}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`;
}

/**
 * React Router resource route: generates `/sitemap.xml` from
 * `SITEMAP_ENTRIES`/`SITE_URL` rather than a hand-maintained static file,
 * so every emitted URL is guaranteed absolute and points at the current
 * production origin.
 */
export function loader(): Response {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SITEMAP_ENTRIES.map(toUrlXml).join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
