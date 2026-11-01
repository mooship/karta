import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Claude Code's remote/web sessions preinstall a fixed Chromium revision under
// /opt/pw-browsers rather than the revision this project's @playwright/test
// version expects, and block `playwright install` from re-fetching it. Point
// at that preinstalled binary only when it's present so local/CI runs (which
// install the matching revision via `playwright:install`) are unaffected.
const remoteSessionChromium = "/opt/pw-browsers/chromium";
const executablePath = existsSync(remoteSessionChromium)
  ? remoteSessionChromium
  : undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // The `wrangler dev` preview server backing `webServer` below is a single
  // local process, not Cloudflare's real distributed edge — running many
  // basemap-switching tests concurrently (each spinning up its own MapLibre
  // GL instance, which fetches its own worker script) has been observed to
  // overwhelm it under CI, crashing the server mid-run ("Connection reset by
  // peer") and cascading into unrelated test failures across the whole
  // suite. Serialize CI runs to avoid that; local runs keep full parallelism.
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    testIdAttribute: "data-e2e",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    command: "npm run build && npm run preview:e2e -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
