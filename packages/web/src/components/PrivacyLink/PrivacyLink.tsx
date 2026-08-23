import { m } from "../../paraglide/messages.js";
import * as styles from "./PrivacyLink.css";

/**
 * A plain link to the site's `/privacy` page, rendered inside
 * `SettingsMenu`'s `children` slot alongside `LanguageToggle`.
 * @remarks A real `<a>` rather than a React Router `<Link>` — leaving the
 *   map app for a separate static content page is a full navigation with
 *   nothing to preserve client-side, so there's no reason to pull the
 *   router into this app-shell component's dependency graph for it.
 */
export function PrivacyLink() {
  return (
    <a className={styles.link} href="/privacy" data-testid="privacy-link">
      {m.settings_privacy_link_label()}
    </a>
  );
}
