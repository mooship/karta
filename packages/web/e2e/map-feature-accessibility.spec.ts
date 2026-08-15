import { expect, test } from "./fixtures";
import { E2E } from "./selectors";

test.describe("map feature keyboard accessibility", () => {
  test("the location search box is visible up front and shows a visible focus ring", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByTestId(E2E.locationSearchInput);

    await expect(searchInput).toBeVisible();

    await searchInput.focus();

    await expect(searchInput).toBeFocused();
    await expect(searchInput).toHaveCSS("outline-style", "solid");
  });

  test("searching by name and choosing a feature result opens that feature's popup, by keyboard or pointer", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByTestId(E2E.locationSearchInput);
    await searchInput.focus();
    await searchInput.fill("Botshabelo");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId(E2E.townshipPopup)).toBeVisible();

    // Choosing by pointer is a separate path from the keys above.
    await searchInput.fill("Mabopane");
    await page
      .getByTestId(E2E.locationSearchResults)
      .getByRole("option")
      .first()
      .click();

    await expect(page.getByTestId(E2E.townshipPopup).locator("h2")).toHaveText(
      "Mabopane",
    );
    await expect(page.getByTestId(E2E.mapView).getByRole("status")).toHaveText(
      /Mabopane.*selected/i,
    );
  });
});
