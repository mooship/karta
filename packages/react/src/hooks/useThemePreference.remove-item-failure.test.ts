import { describe, expect, it, vi } from "vitest";

const TEST_COLORS = { light: "#edeff2", dark: "#23262c" };

/**
 * Kept in its own file so this is the only test spying on
 * `Storage.prototype.removeItem` here: happy-dom only lets `vi.spyOn`
 * intercept a `Storage` method reliably before any real (unmocked) call to
 * that same method has happened in the environment.
 */
describe("useThemePreference setThemePreference removeItem failure", () => {
  it("does not throw when localStorage.removeItem throws", async () => {
    const { initTheme, setThemePreference } = await import(
      "./useThemePreference"
    );
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
