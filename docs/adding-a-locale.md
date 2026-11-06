# Adding a new locale

`packages/web` sources all its UI copy from
[`@inlang/paraglide-js`](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
messages (`en` and `af`, English and Afrikaans), compiled at build time into
the checked-in `src/paraglide/`. These are the steps for adding a third
locale. Only `packages/web` is involved: the SDK packages'
own chrome (`SettingsMenu`, `ThemeToggle`, `BasemapToggle`) stays hardcoded
English on purpose, since they can't depend on an app-specific message
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

`baseLocale` stays `"en"`. It's the fallback a first-time visitor gets when
their browser's `Accept-Language` doesn't match a configured locale (see
`strategy` below).

## 2. Add the message file

Copy `packages/web/messages/en.json` to `packages/web/messages/<new-locale>.json`
and translate every value. Keep the `$schema` line, keep every key, and
preserve every `{placeholder}` token exactly. `localeParity.test.ts`
(`packages/web/messages/`) fails the build if a locale is missing a key,
has an extra one, uses different interpolation placeholders than `en` for
the same key, or has an empty value. It discovers locale files by globbing
`messages/*.json`, so adding the file is enough. You don't need to register
it anywhere else in the test suite.

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
TypeScript fails the build until this entry is added, so a locale can't ship
without a name in the language picker.

## 4. Compile

```bash
npm run messages:compile -w @karta/web
```

This regenerates `packages/web/src/paraglide/` (the `m.*` message
functions `layerTranslations.ts` and every component call, plus the
runtime's locale/text-direction logic) from `project.inlang/settings.json`
and `messages/*.json`. Commit the regenerated files. CI's "Verify compiled
Paraglide messages are up to date" step
(`.github/workflows/ci.yml`) re-runs this command and fails the build if
`git diff` finds anything uncommitted.

## 5. What you don't need to touch

- Layer and story translations. The `LAYER_TEXT` and `LAYER_GROUP_TEXT`
  tables in `layerTranslations.ts` call `m.<message_id>()` functions, which
  resolve against the locale active at request time. Once the new locale's
  JSON has every key (step 2), the existing entries pick it up.
- Right-to-left layout. `root.tsx`'s `Layout` reads `getTextDirection(locale)`
  from paraglide's runtime for the document's `dir` attribute, so the library
  handles RTL locales.
- First-visit locale detection. `strategy: ["cookie", "preferredLanguage", "baseLocale"]`
  (`vite.config.ts`'s `paraglideVitePlugin`, mirrored in `messages:compile`'s
  CLI flags) already serves a new visitor in their browser's
  `Accept-Language` if it matches the new locale, once it is registered in
  step 1.

## 6. Verify

```bash
npm run test -w @karta/web    # localeParity.test.ts, LanguageToggle.test.tsx
npm run dev -w @karta/web     # pick the new locale from the settings menu
```
