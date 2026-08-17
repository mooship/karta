import { useMediaQuery } from "usehooks-ts";

/**
 * Wraps `usehooks-ts`'s `useMediaQuery` with the SSR-safe defaults every
 * media-query hook in this package needs: initialise to `false` on first
 * render rather than resolving from the (server-absent) `window`, so
 * hydration never mismatches the server-rendered markup.
 * @param query - A CSS media query string, e.g. `"(prefers-color-scheme: dark)"`.
 */
export function useSsrSafeMediaQuery(query: string): boolean {
  return useMediaQuery(query, {
    defaultValue: false,
    initializeWithValue: false,
  });
}
