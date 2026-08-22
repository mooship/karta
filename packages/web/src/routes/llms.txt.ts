import type { Layer } from "@karta/core";
import { SITE_URL } from "../constants/siteConfig";
import { getLayers, getStory } from "../layers/registry";
import { m } from "../paraglide/messages.js";

function toLayerLine(layer: Layer): string {
  return layer.description
    ? `- ${layer.label}: ${layer.description}`
    : `- ${layer.label}`;
}

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
 *   this route regardless of requester locale.
 */
export function loader(): Response {
  const story = getStory();
  const layersSection = getLayers().map(toLayerLine).join("\n");
  const storySection = story
    ? `\n\n## Story\n\n### ${story.title}\n\n${story.body}`
    : "";

  const body = `# ${m.app_title()}\n\n> ${m.meta_description()}\n\n## Pages\n\n- [Map](${SITE_URL}/): the interactive map application.\n- [Privacy Policy](${SITE_URL}/privacy): what data this site collects.\n\n## Map layers\n\n${layersSection}${storySection}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
