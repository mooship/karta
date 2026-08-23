import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/martian-mono/index.css";
import "leaflet/dist/leaflet.css";
import {
  isRouteErrorResponse,
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { buildPageMeta } from "./buildPageMeta";
import { SITE_URL } from "./constants/siteConfig";
import { THEME_COLOR, THEME_STORAGE_KEY } from "./constants/themeConfig";
import "./index.css";
import { m } from "./paraglide/messages.js";
import { getLocale, getTextDirection } from "./paraglide/runtime.js";
import styles from "./root.module.css";

/**
 * Pre-hydration theme-bootstrap script: reads the stored theme preference
 * and sets `data-theme` before first paint, avoiding a flash of the wrong
 * theme. Inlined (rather than an external `/theme-bootstrap.js` file) so it
 * runs without an extra render-blocking network request; the exact source
 * below is hashed into `_headers`' `Content-Security-Policy` `script-src` —
 * changing this string requires recomputing that hash (see `_headers`).
 */
const THEME_BOOTSTRAP_SCRIPT = `(() => {
  const stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  if (stored === "light" || stored === "dark") {
    document.documentElement.dataset.theme = stored;
  }
})();`;

/**
 * React Router route module export: page `<title>`/`<meta>` tags, including
 * Open Graph, Twitter card, and `Dataset` JSON-LD structured data, all
 * derived by `buildPageMeta` from this route's own title/description/URL.
 * @remarks Runs per request rather than once at module scope, like
 *   `layers/registry.ts`'s getters — `buildPageMeta`'s `getLocale()` call
 *   and every `m.*()` call below must reflect the current request's locale,
 *   not whichever locale first touched this Cloudflare Workers isolate.
 */
export const meta: MetaFunction = () =>
  buildPageMeta({
    title: m.app_heading(),
    description: m.meta_description(),
    url: SITE_URL,
  });

/**
 * Leaflet's default `{s}` subdomain shards for the CARTO basemap tile
 * hosts, matching the library's own default `subdomains: "abc"` option.
 * @remarks Kept as a named list rather than repeated per `<link>` entry
 *   below, and preconnected individually rather than to the bare
 *   `basemaps.cartocdn.com` apex domain: the default `"street"` basemap's
 *   tiles (see `packages/map`'s `basemaps.ts`) are actually requested from
 *   these three subdomains, so a preconnect to the apex domain alone warms
 *   a connection nothing ends up using.
 */
const CARTO_TILE_SUBDOMAINS = ["a", "b", "c"];

/**
 * React Router route module export: `<link>` tags — self-hosted font/style
 * stylesheets, favicons, and basemap-provider preconnects.
 * @remarks Deliberately preloads no layer GeoJSON, not even a
 *   `defaultVisible` layer's. Nothing can consume that data until the map
 *   bundle has downloaded, hydrated, and mounted Leaflet, so a `preload`
 *   only puts hundreds of kilobytes of it on the wire *alongside* the very
 *   scripts and stylesheets that gate the map's first paint — measured via
 *   Lighthouse, preloading the default choropleth (~600KB compressed) cost
 *   ~0.9s of LCP and ~1.7s of Speed Index under throttled mobile
 *   conditions, because it starved the render-critical requests of
 *   bandwidth. `App`/`useLayerData` request it after hydration instead,
 *   where it competes with nothing.
 */
export const links: LinksFunction = () => [
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "preconnect", href: "https://tile.openstreetmap.org" },
  ...CARTO_TILE_SUBDOMAINS.map((subdomain) => ({
    rel: "preconnect" as const,
    href: `https://${subdomain}.basemaps.cartocdn.com`,
  })),
];

/**
 * React Router route module export: the document shell (`<html>`/`<head>`/`<body>`)
 * wrapping every route. Sets the pre-hydration `theme-color` meta tags and
 * inlines `THEME_BOOTSTRAP_SCRIPT` to apply the stored theme before paint.
 * `lang`/`dir` read `getLocale()`/`getTextDirection()` rather than a fixed
 * `"en"` — on the server that's resolved by `paraglideMiddleware` from the
 * request's locale cookie/`Accept-Language` header, and on the client from
 * the same cookie, so the two agree and there's nothing to hydrate around.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <html lang={locale} dir={getTextDirection(locale)}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="theme-color"
          content={THEME_COLOR.light}
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content={THEME_COLOR.dark}
          media="(prefers-color-scheme: dark)"
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, module-scope literal — see THEME_BOOTSTRAP_SCRIPT
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** React Router route module export: the root route component. */
export default function Root() {
  return <Outlet />;
}

/**
 * React Router route module export: the top-level error boundary. Catches
 * any render, loader, or action error uncaught by a more specific route
 * (there is currently only the one index route, so in practice this is the
 * whole app) and unmatched-route 404s, replacing `<Outlet />` inside
 * `Layout` with a recoverable fallback instead of a blank page.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const { title, message } = isNotFound
    ? {
        title: m.error_boundary_not_found_title(),
        message: m.error_boundary_not_found_message(),
      }
    : {
        title: m.error_boundary_generic_title(),
        message: m.error_boundary_generic_message(),
      };

  return (
    <div className={styles.errorBoundary} role="alert">
      <h1>{title}</h1>
      <p>{message}</p>
      <button type="button" onClick={() => window.location.reload()}>
        {m.error_boundary_reload()}
      </button>
    </div>
  );
}
