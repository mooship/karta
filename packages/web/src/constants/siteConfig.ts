/**
 * Canonical production origin, with no trailing slash.
 * @remarks Single source of truth for `workers/app.ts`'s old-hostname
 *   redirect target and for every absolute URL emitted by the generated
 *   `robots.txt`/`sitemap.xml`/`llms.txt` routes, so the production domain
 *   can't drift out of sync between them.
 */
export const SITE_URL = "https://karta.timothybrits.co.za";
