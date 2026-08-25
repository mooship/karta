/**
 * `localStorage` access that never throws. `getItem`/`setItem`/`removeItem`
 * can all throw synchronously (Safari private-mode edge cases, a sandboxed
 * iframe without `allow-same-origin`, a strict privacy extension), so every
 * call is caught and degrades to a no-op/`null` rather than crashing the
 * caller -- including a caller running at module-evaluation time, where an
 * uncaught throw would fail the whole import.
 * @remarks Internal to `@karta/react`, not part of its public API -- any
 *   hook in this package that reads or writes `localStorage` should go
 *   through this instead of wrapping its own call sites in try/catch.
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage blocked or unavailable -- see the module doc comment above.
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage blocked or unavailable -- see the module doc comment above.
    }
  },
};
