import { expect, test } from "./fixtures";
import { E2E } from "./selectors";
import { ensurePanelOpen } from "./ui";

test.describe("domain switcher", () => {
  test("a plain visit lands on the default domain's route", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/d\/gauteng-spatial-legacy$/);
  });

  test("marks the active domain and switches domains via the settings menu", async ({
    page,
  }) => {
    await page.goto("/d/gauteng-spatial-legacy");
    await page.getByTestId(E2E.settingsMenuTrigger).click();

    const legacyLink = page.getByTestId(
      E2E.domainSwitcherLink.gautengSpatialLegacy,
    );
    const heritageLink = page.getByTestId(E2E.domainSwitcherLink.heritageSites);
    await expect(legacyLink).toHaveAttribute("aria-current", "page");
    await expect(heritageLink).not.toHaveAttribute("aria-current", "page");

    await heritageLink.click();

    await expect(page).toHaveURL(/\/d\/heritage-sites$/);

    await ensurePanelOpen(page);
    await expect(page.getByTestId("layer-toggle-heritage-sites")).toBeVisible();
    await expect(
      page.getByTestId(E2E.layerToggle.townships),
    ).not.toBeAttached();

    await page.getByTestId(E2E.settingsMenuTrigger).click();
    await expect(
      page.getByTestId(E2E.domainSwitcherLink.heritageSites),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByTestId(E2E.domainSwitcherLink.gautengSpatialLegacy),
    ).not.toHaveAttribute("aria-current", "page");
  });

  test("every domain link is reachable by keyboard with a visible focus ring", async ({
    page,
  }) => {
    await page.goto("/d/gauteng-spatial-legacy");
    await page.getByTestId(E2E.settingsMenuTrigger).click();

    // Tab-driven, not .focus() -- :focus-visible (which DomainSwitcher.module.css
    // keys its outline off) only engages for keyboard-triggered focus, not
    // script-triggered focus.
    const legacyLink = page.getByTestId(
      E2E.domainSwitcherLink.gautengSpatialLegacy,
    );
    await expect(legacyLink).not.toBeFocused();
    const MAX_TAB_PRESSES = 20;
    for (let attempt = 0; attempt < MAX_TAB_PRESSES; attempt += 1) {
      if (await legacyLink.evaluate((el) => el === document.activeElement)) {
        break;
      }
      await page.keyboard.press("Tab");
    }
    await expect(legacyLink).toBeFocused();

    const outlineWidth = await legacyLink.evaluate(
      (element) => getComputedStyle(element).outlineWidth,
    );
    expect(outlineWidth).not.toBe("0px");

    await page.keyboard.press("Tab");
    const heritageLink = page.getByTestId(E2E.domainSwitcherLink.heritageSites);
    await expect(heritageLink).toBeFocused();
  });

  test("an unregistered domain id shows the not-found page", async ({
    page,
  }) => {
    await page.goto("/d/not-a-real-domain");

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(
      alert.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });
});
