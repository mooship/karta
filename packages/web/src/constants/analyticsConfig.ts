/**
 * Same-origin endpoint `useLayerUsageBeacon` posts layer-toggle events to,
 * handled by `workers/app.ts` (not a React Router route — see that file's
 * own doc comment) via `analytics/layerUsage.ts`'s `handleLayerUsageRequest`.
 * @remarks Exported so `PrivacyPolicy.tsx`/`PRIVACY.md` can reference the
 *   real path rather than repeating it as a hardcoded string that could
 *   silently drift from what the app actually calls, matching the existing
 *   pattern for `THEME_STORAGE_KEY`/the locale cookie name.
 */
export const LAYER_USAGE_ENDPOINT = "/api/layer-usage";
