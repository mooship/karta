import { cookieName as LOCALE_COOKIE_NAME } from "../src/paraglide/runtime.js";
import { expect, test } from "./fixtures";
import { E2E } from "./selectors";

test.describe("language toggle", () => {
  test("switching language reloads the document in the new locale, persists via cookie, and survives a reload", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByTestId(E2E.locationSearchInput);
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      "Search town, suburb or station",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.getByTestId(E2E.settingsMenuTrigger).click();

    await Promise.all([
      page.waitForEvent("load"),
      page.getByTestId(`${E2E.languageToggle}-option-af`).click(),
    ]);

    await expect(page.locator("html")).toHaveAttribute("lang", "af");
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      "Soek dorp, voorstad of stasie",
    );

    const cookies = await page.context().cookies();
    const localeCookie = cookies.find(
      (cookie) => cookie.name === LOCALE_COOKIE_NAME,
    );
    expect(localeCookie?.value).toBe("af");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("lang", "af");
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      "Soek dorp, voorstad of stasie",
    );
  });

  test("server-renders the locale cookie's language on the very first response, not just after client hydration corrects it", async ({
    page,
    baseURL,
  }) => {
    // Pre-set the locale cookie (as setLocale()'s reload would have already
    // done) before the very first navigation, then read the *raw* response
    // body -- not the live DOM, which client-side hydration could silently
    // repair even if the server got the locale wrong.
    await page.context().addCookies([
      {
        name: LOCALE_COOKIE_NAME,
        value: "af",
        url: baseURL,
      },
    ]);

    const response = await page.goto("/");
    const body = (await response?.text()) ?? "";

    expect(body).toContain('<html lang="af"');
  });
});
