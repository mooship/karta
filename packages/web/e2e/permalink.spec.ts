import { expect, test } from "./fixtures";
import { E2E } from "./selectors";
import { ensurePanelOpen } from "./ui";

test.describe("shareable map links", () => {
  test("toggling a layer, switching basemap, and switching tabs update the URL, and reopening it restores that view", async ({
    page,
  }) => {
    await page.goto("/");

    // Switched before the panel opens: on a mobile viewport the open panel
    // is a bottom sheet that covers the settings trigger's corner.
    await page.getByTestId(E2E.settingsMenuTrigger).click();
    await page.getByTestId(E2E.basemapOption.satellite).click();
    await page.keyboard.press("Escape");

    await ensurePanelOpen(page);

    const rapidRailCheckbox = page.getByTestId(E2E.layerToggle.rapidRail);
    await rapidRailCheckbox.check();

    await page.getByTestId(E2E.panelTab.story).click();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("layers"))
      .toBe("townships,rapid-rail");
    await expect
      .poll(() => new URL(page.url()).searchParams.get("basemap"))
      .toBe("satellite");
    await expect
      .poll(() => new URL(page.url()).searchParams.get("panel"))
      .toBe("story");

    const sharedUrl = page.url();
    await page.goto(sharedUrl);
    await ensurePanelOpen(page);

    // The restored view opens on the Story tab (per `panel=story`), so the
    // layer toggles below aren't rendered until switching back to it.
    await expect(
      page.getByRole("heading", { name: "Why this map exists" }),
    ).toBeVisible();
    await expect(
      page.locator(".leaflet-tile-pane img").first(),
    ).toHaveAttribute("src", /arcgisonline\.com/);

    await page.getByTestId(E2E.panelTab.layers).click();
    await expect(page.getByTestId(E2E.layerToggle.rapidRail)).toBeChecked();
  });

  test("selecting a map feature updates the URL, and reopening it restores that selection", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByTestId(E2E.locationSearchInput);
    await searchInput.focus();
    await searchInput.fill("Botshabelo");

    // The feature list populates asynchronously after the search box itself
    // is already interactive, so wait for the option to appear before
    // driving it by keyboard -- see map-feature-accessibility.spec.ts.
    await expect(
      page.getByRole("option", { name: "Botshabelo" }),
    ).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    const popup = page.getByTestId(E2E.townshipPopup);
    await expect(popup).toBeVisible();
    await expect(popup.locator("h2")).toHaveText("Botshabelo");

    await expect
      .poll(() => new URL(page.url()).searchParams.get("feature"))
      .not.toBeNull();

    const sharedUrl = page.url();
    await page.goto(sharedUrl);

    const restoredPopup = page.getByTestId(E2E.townshipPopup);
    await expect(restoredPopup).toBeVisible({ timeout: 15_000 });
    await expect(restoredPopup.locator("h2")).toHaveText("Botshabelo");
  });

  test("a plain visit with no query string carries no permalink params", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/$/);
    expect(new URL(page.url()).search).toBe("");
  });
});
