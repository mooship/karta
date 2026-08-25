import { describe, expect, it, vi } from "vitest";

const TEST_COLORS = { light: "#edeff2", dark: "#23262c" };

async function importFreshModule() {
  vi.resetModules();
  return import("./useThemePreference");
}

/**
 * A throwing `localStorage` (private-mode edge cases, sandboxed iframes,
 * privacy extensions) must degrade gracefully rather than crash. Tests are
 * ordered getItem, getItem, setItem, removeItem: happy-dom only lets
 * `vi.spyOn` intercept a `Storage.prototype` method reliably before any real
 * (unmocked) call to that same method has happened in this test environment,
 * so each spy below is armed before its method is ever called for real in
 * this file.
 */
describe("useThemePreference localStorage failure handling", () => {
  it("does not throw on module import when localStorage.getItem throws", async () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new DOMException("blocked", "SecurityError");
      });

    await expect(importFreshModule()).resolves.toBeDefined();

    getItemSpy.mockRestore();
  });

  it("falls back to the system preference when initTheme's localStorage.getItem throws", async () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new DOMException("blocked", "SecurityError");
      });

    const { initTheme, useThemePreference } = await importFreshModule();
    const { renderHook } = await import("@testing-library/react");

    expect(() =>
      initTheme({ storageKey: "test-theme", colors: TEST_COLORS }),
    ).not.toThrow();
    const { result } = renderHook(() => useThemePreference());

    expect(result.current).toBe("system");

    getItemSpy.mockRestore();
  });

  it("does not throw when localStorage.setItem throws, keeping the in-memory preference for the session", async () => {
    const { initTheme, setThemePreference, useThemePreference } =
      await importFreshModule();
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

  it("does not throw when localStorage.removeItem throws", async () => {
    const { initTheme, setThemePreference } = await importFreshModule();
    initTheme({ storageKey: "test-theme", colors: TEST_COLORS });
    setThemePreference("dark");

    const removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {
        throw new DOMException("blocked", "SecurityError");
      });

    expect(() => setThemePreference("system")).not.toThrow();
    expect(document.documentElement.dataset.theme).toBeUndefined();

    removeItemSpy.mockRestore();
  });
});
