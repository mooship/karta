import { index, type RouteConfig, route } from "@react-router/dev/routes";

/**
 * This app's full route table. `home.tsx` (the map) and `privacy.tsx` are
 * the only routes with UI; `robots.txt.ts`/`sitemap.xml.ts`/`llms.txt.ts`
 * are resource routes serving static text built once at module scope, with
 * no loader logic that varies per request; `log-error.ts` is the only route
 * with a real per-request `action` (see `clientErrorReporting.ts`).
 */
export default [
  index("./routes/home.tsx"),
  route("privacy", "./routes/privacy.tsx"),
  route("robots.txt", "./routes/robots.txt.ts"),
  route("sitemap.xml", "./routes/sitemap.xml.ts"),
  route("llms.txt", "./routes/llms.txt.ts"),
  route("log-error", "./routes/log-error.ts"),
] satisfies RouteConfig;
