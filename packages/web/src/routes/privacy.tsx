import type { LinksFunction, MetaFunction } from "react-router";
import { buildPageMeta } from "../buildPageMeta";
import {
  PRIVACY_POLICY_TITLE,
  PrivacyPolicy,
} from "../components/PrivacyPolicy/PrivacyPolicy";
import { SITE_URL } from "../constants/siteConfig";

/** This route's own meta description, distinct from the root route's site-wide one. */
const PRIVACY_POLICY_DESCRIPTION =
  "Karta's privacy policy: a static-content map with no accounts, no forms, and no server-side database of visitor data.";

/** Canonical URL of this route, shared by its `meta` and `links` exports. */
const PRIVACY_URL = `${SITE_URL}/privacy`;

/**
 * React Router route module export: the `/privacy` route's `<title>`/`<meta>`
 * tags, via the same `buildPageMeta` the root route uses, so this page's
 * Open Graph/Twitter/JSON-LD tags describe itself rather than inheriting
 * the root route's Gauteng-map-specific ones.
 */
export const meta: MetaFunction = () =>
  buildPageMeta({
    title: `${PRIVACY_POLICY_TITLE} — Karta`,
    description: PRIVACY_POLICY_DESCRIPTION,
    url: PRIVACY_URL,
  });

/** React Router route module export: the `/privacy` route's canonical `<link>`. */
export const links: LinksFunction = () => [
  { rel: "canonical", href: PRIVACY_URL },
];

/** React Router route module export: the `/privacy` route, rendering the site's privacy policy. */
export default function PrivacyRoute() {
  return <PrivacyPolicy />;
}
