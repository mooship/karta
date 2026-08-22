import type { Layer } from "@karta/core";
import { SITE_URL } from "../constants/siteConfig";
import { getLayers, getStory } from "../layers/registry";
import { m } from "../paraglide/messages.js";
import { staticTextResponse } from "./staticTextResponse";

function toLayerLine(layer: Layer): string {
  return layer.description
    ? `- ${layer.label}: ${layer.description}`
    : `- ${layer.label}`;
}

const pagesSection = `## Pages\n\n- [Map](${SITE_URL}/): the interactive map application.\n- [Privacy Policy](${SITE_URL}/privacy): what data this site collects.`;
const layersSection = `## Map layers\n\n${getLayers().map(toLayerLine).join("\n")}`;
const story = getStory();
const storySection = story
  ? `## Story\n\n### ${story.title}\n\n${story.body}`
  : undefined;

const LLMS_TXT_BODY = `${[
  `# ${m.app_title()}`,
  `> ${m.meta_description()}`,
  pagesSection,
  layersSection,
  storySection,
]
  .filter((section): section is string => section !== undefined)
  .join("\n\n")}\n`;

/**
 * React Router resource route: generates `/llms.txt` (the
 * [llmstxt.org](https://llmstxt.org/) convention for briefing AI agents/
 * crawlers) from the published domain's layer catalogue and story, so it
 * can't drift out of sync with what the map actually shows the way a
 * hand-maintained file would.
 * @remarks Reads `getLayers()`/`getStory()` from `layers/registry.ts`
 *   (rather than `@karta/app`'s domain directly) for parity with the rest
 *   of the app's copy, but this route runs outside `paraglideMiddleware`'s
 *   locale context — a resource route with no default export short-circuits
 *   before `entry.server.tsx` — so every read here resolves to the base
 *   locale (English), which is the intended, single, canonical file for
 *   this route regardless of requester locale. `LLMS_TXT_BODY` is computed
 *   once at module scope rather than per request, since nothing about it
 *   varies request-to-request.
 */
export function loader(): Response {
  return staticTextResponse(LLMS_TXT_BODY, "text/plain; charset=utf-8");
}
