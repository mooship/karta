# Adding a new locale

`packages/web` sources all its UI copy from
[`@inlang/paraglide-js`](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
messages (`en`/`af` today — English, Afrikaans), compiled at build time into
the checked-in `src/paraglide/`. This walks through adding a third locale.
It's a `packages/web`-only workflow: the domain-agnostic SDK packages'
own chrome (`SettingsMenu`, `ThemeToggle`, `BasemapToggle`) stays hardcoded
English by design, since they can't depend on an app-specific message
catalogue.

## 1. Register the locale

Add the new locale code to `locales` in
`packages/web/project.inlang/settings.json`:

```json
{
  "baseLocale": "en",
  "locales": ["en", "af", "<new-locale>"]
}
```

`baseLocale` stays `"en"` — it's the fallback a first-time visitor gets when
their browser's `Accept-Language` doesn't match a configured locale (see
`strategy` below).

## 2. Add the message file

Copy `packages/web/messages/en.json` to `packages/web/messages/<new-locale>.json`
and translate every value. Keep the `$schema` line, keep every key, and
preserve every `{placeholder}` token exactly — `localeParity.test.ts`
(`packages/web/messages/`) fails the build if a locale is missing a key,
has an extra one, uses different interpolation placeholders than `en` for
the same key, or has an empty value. It discovers locale files by globbing
`messages/*.json`, not a hand-maintained import list, so adding the file is
enough on its own — you don't need to register it anywhere else in the test
suite.

## 3. Give it an autonym

Add the new locale's own name for itself to `LOCALE_AUTONYMS` in
`packages/web/src/components/LanguageToggle/LanguageToggle.tsx`:

```ts
const LOCALE_AUTONYMS: Record<Locale, string> = {
  en: "English",
  af: "Afrikaans",
  "<new-locale>": "<its own name for itself>",
};
```

`Locale` is generated from `project.inlang/settings.json`'s `locales` array
(step 1), so `LOCALE_AUTONYMS` being a `Record<Locale, string>` means
TypeScript itself fails the build until this entry is added — you can't
silently ship a locale with no name in the language picker.

## 4. Compile

```bash
npm run messages:compile --workspace @karta/web
```

This regenerates `packages/web/src/paraglide/` (the `m.*` message
functions `layerTranslations.ts` and every component call, plus the
runtime's locale/text-direction logic) from `project.inlang/settings.json`
and `messages/*.json`. Commit the regenerated files — CI's "Verify compiled
Paraglide messages are up to date" step
(`.github/workflows/ci.yml`) re-runs this command and fails the build if
`git diff` finds anything uncommitted.

## 5. What you don't need to touch

- **Layer/story translations.** `layerTranslations.ts`'s `LAYER_TEXT`/
  `LAYER_GROUP_TEXT` tables call `m.<message_id>()` functions, which resolve
  against whichever locale is active at request time — once the new
  locale's JSON has full key parity (step 2), every existing translation
  entry picks it up automatically.
- **Right-to-left layout.** `root.tsx`'s `Layout` reads `getTextDirection(locale)`
  from paraglide's runtime for the document's `dir` attribute — an RTL
  locale is handled by the library itself, not a manual CSS switch.
- **First-visit locale detection.** `strategy: ["cookie", "preferredLanguage", "baseLocale"]`
  (`vite.config.ts`'s `paraglideVitePlugin`, mirrored in `messages:compile`'s
  CLI flags) already serves a new visitor in their browser's
  `Accept-Language` if it matches the new locale — no extra wiring needed
  once the locale is registered in step 1.

## 6. Verify

```bash
npm run test --workspace @karta/web   # localeParity.test.ts, LanguageToggle.test.tsx
npm run dev --workspace @karta/web    # pick the new locale from the settings menu
```
