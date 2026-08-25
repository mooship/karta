import { afterEach, describe, expect, it, vi } from "vitest";
import { safeStorage } from "./safeStorage";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("safeStorage", () => {
  it("gets and sets a value through localStorage when it works normally", () => {
    safeStorage.set("k", "v");
    expect(safeStorage.get("k")).toBe("v");
  });

  it("removes a value through localStorage when it works normally", () => {
    safeStorage.set("k", "v");
    safeStorage.remove("k");
    expect(safeStorage.get("k")).toBeNull();
  });

  it("returns null instead of throwing when getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });

    expect(safeStorage.get("k")).toBeNull();
  });

  it("does not throw when setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });

    expect(() => safeStorage.set("k", "v")).not.toThrow();
  });

  it("does not throw when removeItem throws", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });

    expect(() => safeStorage.remove("k")).not.toThrow();
  });
});
