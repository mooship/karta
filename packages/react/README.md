# `@karta/react`

React hooks for Karta apps. No map, Leaflet or domain-data dependency.

## What belongs here

| Hook or export | Purpose |
|---|---|
| `usePrefersDarkMode(): boolean` | Tracks the OS `prefers-color-scheme: dark` media query. |
| `useThemePreference()`, `setThemePreference(preference)`, `initTheme(config)` | A `useSyncExternalStore` theme store (`"system" \| "light" \| "dark"`), saved to `localStorage`. Keeps `document.documentElement.dataset.theme` and `<meta name="theme-color">` in sync. |
| `useResolvedDarkTheme(): boolean` | Combines the two above into the value a caller renders against: `true` for `"dark"`, `false` for `"light"`, and the OS setting for `"system"`. |
| `useModelContextTool(definition)`, `isModelContextSupported()` | Registers a [WebMCP](https://webmachinelearning.github.io/webmcp/) tool with `document.modelContext.registerTool()` and unregisters it on unmount or when `definition` becomes `null`. |
| `useCanHover(): boolean` | Tracks `(hover: hover) and (pointer: fine)`, for hover-only affordances that would misfire on touch. Starts as `false` to avoid an SSR mismatch. |
| `useIsDesktopViewport(): boolean`, `MOBILE_BREAKPOINT_PX`, `getViewportWidth()` | The shared desktop and mobile breakpoint. |
| `useLatestRef(value)` | A ref that always holds the latest render's value, for listeners bound once by outside code. |
| `useDeferredReadyAttribute(attribute)` | Returns `ref`, `markNotReady` and `markReadyAfterPaint` for a DOM attribute that a CSS rule uses to pause and resume an animation. |

Notes:

- `useModelContextTool` re-registers only when `definition.name` changes. `description` and `inputSchema` are read once at registration, and `execute` is read from a ref, so a new closure on each render doesn't cause churn. It does nothing where `document.modelContext` is missing or blocked by Permissions-Policy.
- `useLatestRef` assigns `ref.current` during render rather than in an effect, so a listener never reads a stale value.
- `markReadyAfterPaint()` waits two animation frames before setting `attribute="true"`. A CSS animation's clock starts when it is attached to the element, not when it is first painted, so without the wait an animation can look as if it has already run ahead. It writes to the DOM directly because the CSS rule is the only consumer.

Call `initTheme({ storageKey, colors })` once at app start, before hydration and before any component using `useThemePreference()` mounts. The storage key and colours belong to the app. `initTheme` also re-reads the stored preference under the new key, because the module's own read at import time uses the default config.

```tsx
// entry.client.tsx, before hydrateRoot
import { initTheme } from "@karta/react";

initTheme({
  storageKey: "my-app-theme",
  colors: { light: "#ffffff", dark: "#000000" },
});
```

## What doesn't belong here

- Leaflet, map rendering, or any dependency on `@karta/map` or `@karta/core`.
- Domain data or app-specific values such as colours and storage keys. Pass those to `initTheme` instead.