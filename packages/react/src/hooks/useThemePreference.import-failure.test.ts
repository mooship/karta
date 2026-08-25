import { describe, expect, it, vi } from "vitest";

describe("useThemePreference module-evaluation localStorage failure", () => {
  it("does not throw on module import when localStorage.getItem throws", async () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new DOMException("blocked", "SecurityError");
      });

    await expect(import("./useThemePreference")).resolves.toBeDefined();

    getItemSpy.mockRestore();
  });
});
