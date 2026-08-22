import { SITE_URL } from "../constants/siteConfig";

/**
 * React Router resource route: generates `/robots.txt` from `SITE_URL`
 * rather than a hand-maintained static file, so its `Sitemap:` directive
 * can't drift from the app's actual production origin.
 */
export function loader(): Response {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
