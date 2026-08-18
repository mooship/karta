import { getDomainDefinition } from "@karta/app";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { App } from "../App";
import { localizeDomainLabel } from "../layers/layerTranslations";
import { getLocalizedDomain } from "../layers/registry";
import { m } from "../paraglide/messages.js";

/** Data this route's `loader` hands to its component and `meta`. */
export interface DomainRouteLoaderData {
  domainId: string;
}

/**
 * React Router route module export: the `/d/:domainId` loader. Validates
 * the param against `@karta/app`'s `DOMAINS` registry server-side, so an
 * unregistered id 404s (caught by `root.tsx`'s `ErrorBoundary`) before
 * `App` ever tries to resolve a domain that doesn't exist, rather than
 * `App` itself throwing partway through rendering.
 */
export function loader({ params }: LoaderFunctionArgs): DomainRouteLoaderData {
  const domainId = params.domainId ?? "";
  if (!getDomainDefinition(domainId)) {
    throw new Response("Not Found", { status: 404 });
  }
  return { domainId };
}

/**
 * React Router route module export: the `/d/:domainId` route's `<title>`/
 * description, specific to the routed domain rather than the app-wide
 * fallback `root.tsx`'s own `meta` provides — there are now two indexable
 * URLs, so both need copy that actually describes what's on the page.
 * Reuses each domain's own `story` body as the description rather than
 * introducing a parallel set of per-domain SEO-copy message keys; a domain
 * with no `story` falls back to the app-wide description.
 */
export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  const domainId = loaderData?.domainId;
  const definition = domainId ? getDomainDefinition(domainId) : undefined;
  const label = definition
    ? localizeDomainLabel(definition.id, definition.label)
    : undefined;
  const story = domainId ? getLocalizedDomain(domainId).story : undefined;

  return [
    { title: label ? `${m.app_title()} — ${label}` : m.app_title() },
    {
      name: "description",
      content: story?.body ?? m.meta_description(),
    },
  ];
};

/** React Router route module export: the `/d/:domainId` route, rendering the app shell for the routed domain. */
export default function DomainRoute({
  loaderData,
}: {
  loaderData: DomainRouteLoaderData;
}) {
  return <App domainId={loaderData.domainId} />;
}
