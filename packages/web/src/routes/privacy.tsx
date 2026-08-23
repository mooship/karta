import type { LinksFunction, MetaFunction } from "react-router";
import {
  PRIVACY_POLICY_TITLE,
  PrivacyPolicy,
} from "../components/PrivacyPolicy/PrivacyPolicy";
import { SITE_URL } from "../constants/siteConfig";

/** This route's own meta description, distinct from the root route's site-wide one. */
const PRIVACY_POLICY_DESCRIPTION =
  "Karta's privacy policy: a static-content map with no accounts, no forms, and no server-side database of visitor data.";

/**
 * React Router route module export: the `/privacy` route's `<title>`/`<meta>`
 * tags.
 * @remarks A route's `meta` export replaces its parent's entirely unless it
 *   re-includes them via `matches` — this pulls in the root route's Open
 *   Graph/Twitter/viewport tags rather than losing them, and overrides only
 *   `title` and `description` for this page rather than inheriting the
 *   root's Gauteng-map-specific ones.
 */
export const meta: MetaFunction = ({ matches }) => {
  const inheritedMeta = matches
    .flatMap((match) => match.meta ?? [])
    .filter(
      (tag) =>
        !("title" in tag) && !("name" in tag && tag.name === "description"),
    );

  return [
    ...inheritedMeta,
    { title: `${PRIVACY_POLICY_TITLE} — Karta` },
    { name: "description", content: PRIVACY_POLICY_DESCRIPTION },
  ];
};

/** React Router route module export: the `/privacy` route's canonical `<link>`. */
export const links: LinksFunction = () => [
  { rel: "canonical", href: `${SITE_URL}/privacy` },
];

/** React Router route module export: the `/privacy` route, rendering the site's privacy policy. */
export default function PrivacyRoute() {
  return <PrivacyPolicy />;
}
