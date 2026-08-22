import { SITE_URL } from "../constants/siteConfig";
import { staticTextResponse } from "./staticTextResponse";

const ROBOTS_TXT_BODY = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

/**
 * React Router resource route: generates `/robots.txt` from `SITE_URL`
 * rather than a hand-maintained static file, so its `Sitemap:` directive
 * can't drift from the app's actual production origin.
 */
export function loader(): Response {
  return staticTextResponse(ROBOTS_TXT_BODY, "text/plain; charset=utf-8");
}
