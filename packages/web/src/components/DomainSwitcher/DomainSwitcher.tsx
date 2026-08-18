import { DOMAINS } from "@karta/app";
import { localizeDomainLabel } from "../../layers/layerTranslations";
import { m } from "../../paraglide/messages.js";
import styles from "./DomainSwitcher.module.css";

interface DomainSwitcherProps {
  /** The domain currently being viewed, marked with `aria-current="page"`. */
  activeDomainId: string;
}

/**
 * Links to every domain registered in `@karta/app`'s `DOMAINS`, rendered
 * inside `SettingsMenu`'s `children` slot alongside `LanguageToggle`/
 * `PrivacyLink`.
 * @remarks Plain `<a href="/d/<id>">` elements, not React Router `<Link>`s
 *   or buttons — switching domains discards the entire map, layer
 *   registry, and `useMapUiStore` state anyway (see that store's own
 *   module doc), so a full document navigation is the correct semantics,
 *   not a client-side one, and it's what keeps `useMapUiStore` safe to
 *   stay a plain module-scope singleton. Placed in the settings menu
 *   rather than as new floating map chrome: `App.module.css` already notes
 *   every map corner is claimed by another control (search, the info
 *   panel trigger, the legend, the settings trigger itself), and switching
 *   domains is a deliberate, infrequent action — the same category as the
 *   basemap/theme/language controls already grouped here, not a frequent
 *   map interaction that needs to be one tap away.
 */
export function DomainSwitcher({ activeDomainId }: DomainSwitcherProps) {
  return (
    <nav
      aria-label={m.domain_switcher_label()}
      data-testid="domain-switcher"
      data-e2e="domain-switcher"
    >
      <ul className={styles.list}>
        {DOMAINS.map((domain) => (
          <li key={domain.id}>
            <a
              href={`/d/${domain.id}`}
              className={styles.link}
              aria-current={domain.id === activeDomainId ? "page" : undefined}
              data-testid={`domain-switcher-link-${domain.id}`}
              data-e2e={`domain-switcher-link-${domain.id}`}
            >
              {localizeDomainLabel(domain.id, domain.label)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
