import { describe, expect, it, vi } from "vitest";

const TEST_COLORS = { light: "#edeff2", dark: "#23262c" };

/**
 * Kept in its own file: happy-dom's `Storage.prototype.getItem` can only be
 * reliably intercepted by `vi.spyOn` before any real (unmocked) call to that
 * method has happened in the same test environment, so the spy here is set
 * up before this file's first import of the module under test.
 */
describe("useThemePreference initTheme localStorage failure", () => {
  it("falls back to the system preference when initTheme's localStorage.getItem throws", async () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new DOMException("blocked", "SecurityError");
      });

    const { initTheme, useThemePreference } = await import(
      "./useThemePreference"
    );
    const { renderHook } = await import("@testing-library/react");

    expect(() =>
      initTheme({ storageKey: "test-theme", colors: TEST_COLORS }),
    ).not.toThrow();
    const { result } = renderHook(() => useThemePreference());

    expect(result.current).toBe("system");

    getItemSpy.mockRestore();
  });
});
