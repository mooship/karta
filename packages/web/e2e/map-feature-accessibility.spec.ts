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

    // The feature list populates asynchronously (township data fetch, then
    // MapView's onSelectableFeaturesChange callback) after the search box
    // itself is already interactive, so wait for the option to actually
    // appear before driving it by keyboard -- unlike a pointer click, the
    // keys below don't retry against a dropdown that isn't there yet.
    await expect(
      page.getByRole("option", { name: "Botshabelo" }),
    ).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(page.getByTestId(E2E.townshipPopup)).toBeVisible();

    // Choosing by pointer is a separate path from the keys above. Several
    // real townships share a "Mabopane" prefix (Mabopane A, Mabopane M,
    // etc.), and feature results aren't alphabetically sorted, so the first
    // match isn't necessarily plain "Mabopane" -- read its actual label
    // rather than assuming which one it is.
    const firstFeatureOption = page
      .getByTestId(E2E.locationSearchResults)
      .getByRole("option")
      .first();
    const selectedLabel = (await firstFeatureOption.textContent())?.trim();
    await firstFeatureOption.click();

    // Leaflet's popup close animation leaves the previous (Botshabelo)
    // popup element in the DOM for a moment after the new one is added, so
    // `.last()` -- the most recently appended, i.e. the new popup -- avoids
    // a strict-mode violation from briefly matching both.
    await expect(
      page.getByTestId(E2E.townshipPopup).last().locator("h2"),
    ).toHaveText(selectedLabel ?? "");
    await expect(page.getByTestId(E2E.mapView).getByRole("status")).toHaveText(
      new RegExp(`${selectedLabel}.*selected`, "i"),
    );
  });
});
