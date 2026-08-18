import { DEFAULT_DOMAIN_ID } from "@karta/app";
import { redirect } from "react-router";

/**
 * React Router route module export: the `/` loader. 302s (not 301, so the
 * default domain can change later) to `/d/${DEFAULT_DOMAIN_ID}` — a single
 * canonical URL per domain keeps `aria-current` in the domain switcher and
 * shared permalinks unambiguous, and `lighthouserc.json` is pointed at the
 * `/d/...` URLs directly so this redirect never lands in a measured run.
 */
export function loader() {
  return redirect(`/d/${DEFAULT_DOMAIN_ID}`);
}

/** React Router route module export: the `/` route. Never rendered — `loader` always redirects first. */
export default function HomeRoute() {
  return null;
}
