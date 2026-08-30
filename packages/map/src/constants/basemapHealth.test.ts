// @vitest-environment node
//
// Runs under Node's own fetch rather than this project's default happy-dom
// environment: happy-dom's fetch shim doesn't correctly honour a real
// `Access-Control-Allow-Origin: *` response header (confirmed via curl that
// OpenFreeMap sends one), and throws a same-origin-policy error on every
// cross-origin request regardless — a test-environment limitation, not a
// real CORS failure a browser would hit.
import { describe, expect, it } from "vitest";
import {
  getBasemapDefinition,
  getRegisteredBasemapIds,
  resetBasemapRegistry,
  type VectorBasemapDefinition,
} from "./basemaps";

/**
 * Fills a raster URL template's `{z}`/`{x}`/`{y}`/`{r}` placeholders with a
 * single always-valid tile coordinate, for a one-off live health check.
 */
function resolveSampleTileUrl(template: string): string {
  return template
    .replaceAll("{z}", "0")
    .replaceAll("{x}", "0")
    .replaceAll("{y}", "0")
    .replaceAll("{r}", "");
}

/**
 * Live network checks against every built-in basemap's real tile/style
 * endpoint, run against no mocks.
 * @remarks This exists because the CARTO incident this project's basemaps
 *   moved away from (see `basemaps.ts`'s own comment) couldn't have been
 *   caught by a mocked unit test: CARTO's anonymous endpoints kept returning
 *   HTTP 200 with a plausible, correctly-typed, correctly-sized PNG — a
 *   provider silently swapping in a "pay us" watermark image at the pixel
 *   level isn't something an automated check can detect without an image
 *   diff or OCR pass, neither of which this suite attempts. What it does
 *   check — a real HTTP round trip returning the right status, content
 *   type, and structurally valid body — would catch the much more common
 *   failure modes: a provider dropping free/anonymous access entirely
 *   (4xx/5xx, an HTML error/paywall page in place of the expected body, a
 *   redirect to a signup flow), a typo'd or dead URL, or a style JSON that
 *   no longer parses/has no sources. Network-dependent by design; a failure
 *   here means "go look at this basemap in a real browser," not necessarily
 *   "the code is wrong."
 */
describe("built-in basemap tile/style health (live network)", () => {
  resetBasemapRegistry();

  for (const id of getRegisteredBasemapIds()) {
    const definition = getBasemapDefinition(id);

    if (definition.kind === "vector") {
      it(`${id}: serves a valid MapLibre style JSON, not an error page`, async () => {
        const vectorDefinition = definition as VectorBasemapDefinition;
        const response = await fetch(vectorDefinition.styleUrl);

        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toMatch(/json/i);

        const style = await response.json();
        expect(style.version).toBe(8);
        expect(Object.keys(style.sources ?? {}).length).toBeGreaterThan(0);
      }, 15_000);
    } else {
      it(`${id}: serves a real image tile, not an error page`, async () => {
        const response = await fetch(resolveSampleTileUrl(definition.url));

        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toMatch(/^image\//i);

        const body = await response.arrayBuffer();
        expect(body.byteLength).toBeGreaterThan(200);
      }, 15_000);
    }
  }
});
