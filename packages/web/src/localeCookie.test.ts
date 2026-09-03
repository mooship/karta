import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { hardenLocaleCookieSecurity } from "./localeCookie";
import { cookieName, setLocale } from "./paraglide/runtime.js";

function clearLocaleCookie(): void {
  // biome-ignore lint/suspicious/noDocumentCookie: test-only cleanup, mirroring the assignment under test
  document.cookie = `${cookieName}=; path=/; max-age=0`;
}

describe("hardenLocaleCookieSecurity", () => {
  beforeAll(() => {
    hardenLocaleCookieSecurity();
  });

  afterEach(() => {
    clearLocaleCookie();
    vi.restoreAllMocks();
  });

  it("writes Secure and SameSite=Lax on the locale cookie setLocale() sets", () => {
    const cookieSetterSpy = vi.spyOn(document, "cookie", "set");

    setLocale("af", { reload: false });

    const writtenCookieStrings = cookieSetterSpy.mock.calls.map(
      ([value]) => value,
    );
    expect(
      writtenCookieStrings.some(
        (value) =>
          value.includes(`${cookieName}=af`) &&
          value.includes("Secure") &&
          value.includes("SameSite=Lax"),
      ),
    ).toBe(true);
  });

  it("still sets the locale cookie value Paraglide itself would set", () => {
    setLocale("en", { reload: false });

    expect(document.cookie).toContain(`${cookieName}=en`);
  });

  it("does not recurse into itself when wrapping the original setLocale", () => {
    expect(() => setLocale("af", { reload: false })).not.toThrow();
  });
});
