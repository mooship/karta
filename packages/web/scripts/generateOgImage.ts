/**
 * Renders `public/og-image.png`, the Open Graph/Twitter card preview image
 * used by `root.tsx`'s `meta()`, from a small self-contained HTML template.
 *
 * @remarks
 * Run with `npm run generate:og-image -w @karta/web` after brand
 * copy or colours change. There's no image-generation library in the
 * dependency tree (no `sharp`/`satori`/`resvg`), but `@playwright/test`'s
 * bundled Chromium already is, so this reuses it as a one-shot HTML-to-PNG
 * renderer rather than adding a new dependency for the same job. Uses the
 * same self-hosted Source Serif 4 and Public Sans font files, `SITE_URL`, brand copy
 * (`m.app_title()`/`m.meta_description()`) and colour tokens in
 * `src/index.css` as the live app, so the card can't drift from what a
 * visitor sees after clicking through.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_URL,
} from "../src/constants/siteConfig";
import { m } from "../src/paraglide/messages.js";

const SERIF_FONT_PATH = fileURLToPath(
  import.meta.resolve(
    "@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2",
  ),
);
const SANS_FONT_PATH = fileURLToPath(
  import.meta.resolve(
    "@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2",
  ),
);
const OUTPUT_PATH = fileURLToPath(
  new URL("../public/og-image.png", import.meta.url),
);
const INDEX_CSS_PATH = fileURLToPath(
  new URL("../src/index.css", import.meta.url),
);

const TITLE = m.app_title();
const TAGLINE = m.meta_description();
const URL_LABEL = SITE_URL.replace(/^https?:\/\//, "");

/**
 * Reads one `--md-sys-color-<role>` hex value out of `index.css`'s
 * light colour token block, so the card uses the app's own palette rather
 * than a second copy of the hex values that could drift.
 */
function readM3LightColor(indexCss: string, role: string): string {
  const startMarker = "/* LIGHT COLOUR TOKENS";
  const endMarker = "/* END LIGHT COLOUR TOKENS */";
  const start = indexCss.indexOf(startMarker);
  const end = indexCss.indexOf(endMarker, start);
  const block = indexCss.slice(start, end);
  const match = block.match(
    new RegExp(`--md-sys-color-${role}:\\s*(#[0-9a-fA-F]{3,8});`),
  );
  if (!match) {
    throw new Error(
      `Could not find --md-sys-color-${role} in index.css's light colour tokens`,
    );
  }
  return match[1];
}

const indexCss = readFileSync(INDEX_CSS_PATH, "utf8");
const surfaceColor = readM3LightColor(indexCss, "surface");
const primaryColor = readM3LightColor(indexCss, "primary");
const onSurfaceColor = readM3LightColor(indexCss, "on-surface");
const secondaryColor = readM3LightColor(indexCss, "secondary");

const TEMPLATE = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Source Serif 4 Variable";
    src: url("file://${SERIF_FONT_PATH}") format("woff2");
    font-weight: 200 900;
  }
  @font-face {
    font-family: "Public Sans Variable";
    src: url("file://${SANS_FONT_PATH}") format("woff2");
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
    background: ${surfaceColor};
    font-family: "Public Sans Variable", sans-serif;
    position: relative;
    overflow: hidden;
  }
  .frame {
    position: absolute;
    inset: 40px;
    border: 2px solid ${onSurfaceColor};
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
    font-family: "Source Serif 4 Variable", serif;
    font-size: 112px;
    font-weight: 600;
    color: ${onSurfaceColor};
    line-height: 1;
  }
  .rule {
    margin-top: 36px;
    width: 160px;
    height: 6px;
    background: ${primaryColor};
  }
  .tagline {
    margin-top: 32px;
    max-width: 820px;
    font-size: 34px;
    font-weight: 400;
    line-height: 1.35;
    color: ${onSurfaceColor};
  }
  .url {
    position: absolute;
    left: 96px;
    bottom: 72px;
    font-size: 26px;
    font-weight: 500;
    color: ${secondaryColor};
  }
</style>
</head>
<body>
  <div class="frame"></div>
  <div class="content">
    <div class="title">${TITLE}</div>
    <div class="rule"></div>
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
