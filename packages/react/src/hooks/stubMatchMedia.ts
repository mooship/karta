import { vi } from "vitest";

/**
 * Stubs `window.matchMedia` for tests exercising a `useMediaQuery`-based
 * hook (e.g. {@link usePrefersDarkMode}, {@link useCanHover}).
 * @remarks Shared across those hooks' test files so the stub — including
 *   its `change` event plumbing — is defined once rather than hand-copied
 *   per hook.
 * @returns `triggerChange` to simulate the OS/browser flipping the query's
 *   match state, and the underlying `mediaQueryList` mock for asserting on
 *   `addEventListener`/`removeEventListener` calls.
 */
export function stubMatchMedia(initialMatches: boolean) {
  let changeListener: (() => void) | undefined;
  let matches = initialMatches;

  const mediaQueryList = {
    get matches() {
      return matches;
    },
    addEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === "change") {
        changeListener = listener;
      }
    }),
    removeEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === "change" && changeListener === listener) {
        changeListener = undefined;
      }
    }),
  };

  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mediaQueryList));

  return {
    triggerChange(nextMatches: boolean) {
      matches = nextMatches;
      changeListener?.();
    },
    mediaQueryList,
  };
}
