import { cloudflare } from "@cloudflare/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { FontaineTransform } from "fontaine";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isTest = mode === "test" || process.env.VITEST === "true";

  return {
    cacheDir: "node_modules/.vite",
    plugins: [
      // Must run before reactRouter()/cloudflare()/react(): .css.ts files
      // need to resolve to plain CSS before route/SSR transformation or the
      // JSX transform ever sees them.
      vanillaExtractPlugin(),
      ...(isTest
        ? [react()]
        : [
            cloudflare({
              viteEnvironment: { name: "ssr" },
            }),
            reactRouter(),
            FontaineTransform.vite({
              fallbacks: ["Arial", "sans-serif"],
              resolvePath: (id) =>
                new URL(`./node_modules/${id}`, import.meta.url),
            }),
            /**
             * Recompiles `messages/{locale}.json` into `src/paraglide/` on
             * every `dev`/`build` (and `react-router typegen`, which also
             * spins up this Vite pipeline) — that checked-in output is the
             * source of truth `vitest` reads from, so these options must stay
             * identical to `messages:compile`'s CLI flags: a mismatch here
             * regenerates the committed output without `.d.ts` files or with a
             * stray `.gitignore` next time either runs.
             *
             * `strategy: ["cookie", "preferredLanguage", "baseLocale"]`: a
             * first-time visitor is served in their browser's `Accept-Language`
             * (`preferredLanguage`), falling back to English; a manual pick
             * from `LanguageToggle` persists in a first-party `PARAGLIDE_LOCALE`
             * cookie so the *next* request's SSR render, not just the client,
             * reflects it — `localStorage` alone can't do that (it isn't sent
             * with the request), which would otherwise render the wrong
             * locale's text server-side and produce a real hydration mismatch
             * on the very next load, not just a cosmetic flash. This is a
             * single-purpose functional cookie storing a language code only —
             * nothing identifying, nothing shared across origins — so it
             * doesn't reintroduce the tracking this app otherwise avoids.
             * Deliberately no `"url"` strategy: this app has one route, so
             * locale-prefixed paths would add routing/redirect machinery
             * (`paraglideMiddleware`'s URL localisation, `localizeHref`,
             * `urlPatterns`) with nothing for it to disambiguate.
             */
            paraglideVitePlugin({
              project: "./project.inlang",
              outdir: "./src/paraglide",
              strategy: ["cookie", "preferredLanguage", "baseLocale"],
              emitTsDeclarations: true,
              emitGitIgnore: false,
              emitPrettierIgnore: false,
              emitReadme: false,
            }),
          ]),
    ],
    /**
     * MapLibre GL constructs its own tile-parsing Web Worker with
     * `new Worker(url, { type: "module" })` (see `VectorBasemapLayer.tsx`'s
     * `?worker&url` import of that worker chunk) — Vite's own default worker
     * output format is `"iife"`, not `"es"`, which mismatches what the
     * browser is told to expect. Chromium tolerates that mismatch; it's the
     * suspected cause of the basemap silently failing to render on Safari
     * specifically, since WebKit's module-worker handling is stricter.
     * Forcing `"es"` here makes the built worker chunk match the
     * `type: "module"` MapLibre actually requests.
     */
    worker: {
      format: "es",
    },
    build: {
      assetsInlineLimit: 0,
      cssCodeSplit: true,
      /**
       * `maplibre-gl` (the vector-basemap renderer `VectorBasemapLayer`
       * dynamically imports) is ~270KB gzipped on its own and dwarfs Vite's
       * default 500kB warning threshold no matter how it's split. It's
       * already isolated into its own async chunk — never part of the
       * initial bundle, and never fetched at all unless a caller registers a
       * vector-kind basemap (this app doesn't) — so raise the limit past its
       * known size rather than let an expected, already-lazy chunk mask
       * warnings about future eagerly-loaded bloat.
       */
      chunkSizeWarningLimit: 1100,
      rolldownOptions: {
        output: {
          entryFileNames: "assets/js/[name]-[hash].js",
          chunkFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const firstName = assetInfo.names?.[0] ?? assetInfo.name ?? "";

            if (/\.css$/i.test(firstName)) {
              return "assets/css/[name]-[hash][extname]";
            }

            if (/\.(woff2?|ttf|otf|eot)$/i.test(firstName)) {
              return "assets/fonts/[name]-[hash][extname]";
            }

            if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(firstName)) {
              return "assets/img/[name]-[hash][extname]";
            }

            return "assets/misc/[name]-[hash][extname]";
          },
          codeSplitting: {
            groups: [
              /**
               * `react-dom`'s server renderer is deliberately *not* matched
               * here, so it isn't pulled into the vendor chunk every visitor
               * downloads before the map can paint. `MapView` imports it
               * dynamically (to render a feature popup's markup on first
               * click); leaving it ungrouped lets that stay a genuinely
               * async chunk, whereas naming a group for it makes React
               * Router emit a `modulepreload` for the chunk and fetch it up
               * front anyway.
               */
              {
                name: "react-vendor",
                test: /node_modules\/(?:(?:react|scheduler)\/|react-dom\/(?!server|cjs\/react-dom-server))/,
              },
              {
                name: "map-vendor",
                test: /node_modules\/(leaflet|react-leaflet)\//,
              },
              {
                name: "ui-vendor",
                test: /node_modules\/(lucide-react|zustand|usehooks-ts|zod)\//,
              },
              {
                name: "maplibre-vendor",
                test: /node_modules\/(maplibre-gl|@maplibre\/maplibre-gl-leaflet)\//,
              },
            ],
          },
        },
      },
    },
    test: {
      environment: "happy-dom",
      setupFiles: ["./vitest.setup.ts"],
      globals: true,
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.{idea,git,cache,output,temp}/**",
        "e2e/**",
      ],
    },
  };
});
