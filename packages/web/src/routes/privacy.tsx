import type { MetaFunction } from "react-router";
import { PrivacyPolicy } from "../components/PrivacyPolicy/PrivacyPolicy";

/** React Router route module export: the `/privacy` route's `<title>`. */
export const meta: MetaFunction = () => [{ title: "Privacy policy — Karta" }];

/** React Router route module export: the `/privacy` route, rendering the site's privacy policy. */
export default function PrivacyRoute() {
  return <PrivacyPolicy />;
}
