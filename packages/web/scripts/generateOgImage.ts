/**
 * Renders `public/og-image.png`, the Open Graph/Twitter card preview image
 * used by `root.tsx`'s `meta()`, from a small self-contained HTML template.
 *
 * @remarks
 * Run with `npm run generate:og-image --workspace @karta/web` after changing
 * the brand copy/colours below. There's no image-generation library in the
 * dependency tree (no `sharp`/`satori`/`resvg`), but `@playwright/test`'s
 * bundled Chromium already is — this reuses it as a one-shot HTML-to-PNG
 * renderer rather than adding a new dependency for the same job. Uses the
 * same self-hosted Inter/Martian Mono font files and M3 brand colours
 * (`SEED_COLOR_HEX` in `generateM3Theme.ts`) as the live app, so the card
 * matches what a visitor sees after clicking through.
 */
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const INTER_FONT_PATH = fileURLToPath(
  import.meta.resolve(
    "@fontsource-variable/inter/files/inter-latin-standard-normal.woff2",
  ),
);
const MARTIAN_MONO_FONT_PATH = fileURLToPath(
  import.meta.resolve(
    "@fontsource-variable/martian-mono/files/martian-mono-latin-standard-normal.woff2",
  ),
);
const OUTPUT_PATH = fileURLToPath(
  new URL("../public/og-image.png", import.meta.url),
);

const TITLE = "Karta";
const TAGLINE =
  "Visualising how apartheid-era spatial planning still shapes commute times and access to jobs across Gauteng.";
const URL_LABEL = "karta.timothybrits.co.za";

const TEMPLATE = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Inter Variable";
    src: url("file://${INTER_FONT_PATH}") format("woff2");
    font-weight: 100 900;
  }
  @font-face {
    font-family: "Martian Mono Variable";
    src: url("file://${MARTIAN_MONO_FONT_PATH}") format("woff2");
    font-weight: 100 900;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    width: ${OG_IMAGE_WIDTH}px;
    height: ${OG_IMAGE_HEIGHT}px;
    background: #f4fbfa;
    font-family: "Inter Variable", sans-serif;
    position: relative;
    overflow: hidden;
  }
  .accent {
    position: absolute;
    top: -220px;
    right: -220px;
    width: 640px;
    height: 640px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #7fd7da, #00696d 70%);
    opacity: 0.9;
  }
  .content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 96px;
  }
  .title {
    font-size: 108px;
    font-weight: 800;
    color: #00696d;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .tagline {
    margin-top: 32px;
    max-width: 820px;
    font-size: 34px;
    font-weight: 500;
    line-height: 1.35;
    color: #161d1d;
  }
  .url {
    position: absolute;
    left: 96px;
    bottom: 72px;
    font-family: "Martian Mono Variable", monospace;
    font-size: 26px;
    font-weight: 500;
    color: #4a6364;
  }
</style>
</head>
<body>
  <div class="accent"></div>
  <div class="content">
    <div class="title">${TITLE}</div>
    <div class="tagline">${TAGLINE}</div>
  </div>
  <div class="url">${URL_LABEL}</div>
</body>
</html>`;

/**
 * Renders {@link TEMPLATE} with a headless Chromium page sized exactly to
 * the OG image's target dimensions and writes the resulting screenshot to
 * {@link OUTPUT_PATH}.
 * @remarks Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to point at a specific
 *   Chromium binary (e.g. one pre-installed at a fixed path outside
 *   Playwright's own version-pinned cache) instead of `playwright install`ing
 *   a matching browser; unset, this launches Playwright's own resolved
 *   Chromium as usual.
 */
async function generateOgImage(): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), "karta-og-image-"));
  const tempHtmlPath = join(tempDir, "og-image.html");
  writeFileSync(tempHtmlPath, TEMPLATE);

  const browser = await chromium.launch(
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : undefined,
  );
  try {
    const page = await browser.newPage({
      viewport: { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT },
    });
    await page.goto(`file://${tempHtmlPath}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: OUTPUT_PATH });
  } finally {
    await browser.close();
    rmSync(tempDir, { recursive: true, force: true });
  }

  console.log(`Wrote ${OUTPUT_PATH}`);
}

await generateOgImage();
