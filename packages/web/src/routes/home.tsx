import type { LinksFunction } from "react-router";
import { App } from "../App";
import { SITE_URL } from "../constants/siteConfig";

/** React Router route module export: the `/` route's canonical `<link>`. */
export const links: LinksFunction = () => [
  { rel: "canonical", href: SITE_URL },
];

/** React Router route module export: the `/` route, rendering the app shell. */
export default function HomeRoute() {
  return <App />;
}
