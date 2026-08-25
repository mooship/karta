import { describe, expect, it, vi } from "vitest";

const TEST_COLORS = { light: "#edeff2", dark: "#23262c" };

/**
 * Kept in its own file so this is the only test spying on
 * `Storage.prototype.setItem` here: happy-dom only lets `vi.spyOn`
 * intercept a `Storage` method reliably before any real (unmocked) call to
 * that same method has happened in the environment.
 */
describe("useThemePreference setThemePreference setItem failure", () => {
  it("does not throw when localStorage.setItem throws, keeping the in-memory preference for the session", async () => {
    const { initTheme, setThemePreference, useThemePreference } = await import(
      "./useThemePreference"
    );
    initTheme({ storageKey: "test-theme", colors: TEST_COLORS });

    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("blocked", "SecurityError");
      });
    const { renderHook } = await import("@testing-library/react");

    expect(() => setThemePreference("dark")).not.toThrow();
    const { result } = renderHook(() => useThemePreference());

    expect(result.current).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    setItemSpy.mockRestore();
  });
});
