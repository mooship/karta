import { SegmentedControl } from "@karta/map";
import { m } from "../../paraglide/messages.js";
import {
  getLocale,
  type Locale,
  locales,
  setLocale,
} from "../../paraglide/runtime.js";

/**
 * Each configured locale's own name for itself (its autonym), shown as-is
 * regardless of the currently active locale — the standard convention for
 * language pickers, since a translated language name is often less
 * recognisable to a reader of that language than its autonym.
 */
const LOCALE_AUTONYMS: Record<Locale, string> = {
  en: "English",
  st: "Sesotho",
  zu: "isiZulu",
  xh: "isiXhosa",
  af: "Afrikaans",
};

/**
 * A `SegmentedControl` for picking the app's language. Reads the active
 * locale directly from paraglide's `getLocale()` rather than taking it as a
 * prop, since `setLocale()` reloads the document by default (see its
 * `LanguageToggle`-driven cookie writes in `vite.config.ts`'s
 * `paraglideVitePlugin` comment) — there is no in-page reactive locale state
 * for a caller to own.
 */
export function LanguageToggle() {
  return (
    <SegmentedControl
      label={m.language_toggle_label()}
      options={locales.map((locale) => ({
        id: locale,
        label: LOCALE_AUTONYMS[locale],
      }))}
      value={getLocale()}
      onChange={(locale) => setLocale(locale)}
      testId="language"
    />
  );
}
