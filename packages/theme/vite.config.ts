import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";

/**
 * `vanillaExtractPlugin()` is required even for this package's own vitest
 * run: `createGlobalThemeContract` (in `m3.css.ts`/`mapLabel.css.ts`) only
 * runs correctly inside vanilla-extract's compiler context, which this
 * plugin provides. `@karta/theme` ships source with no build step, so every
 * consumer's own Vite/Vitest pipeline needs this plugin registered too (see
 * `packages/map/vite.config.ts`, `packages/web/vite.config.ts`).
 */
export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    name: "@karta/theme",
    environment: "node",
  },
});
