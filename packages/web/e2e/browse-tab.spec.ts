import { expect, test } from "./fixtures";
import { E2E } from "./selectors";
import { ensurePanelOpen } from "./ui";

test.describe("browse tab", () => {
  test("lists selectable features grouped by layer, and picking one opens its popup and updates the URL", async ({
    page,
  }) => {
    await page.goto("/");
    await ensurePanelOpen(page);

    await page.getByTestId(E2E.panelTab.browser).click();

    await expect(
      page.getByRole("heading", { name: "Modelled car time" }),
    ).toBeVisible();

    const filterInput = page.getByTestId(E2E.featureBrowser.filter);
    await expect(filterInput).toBeVisible();
    await filterInput.fill("Botshabelo");

    const result = page.getByRole("button", { name: "Botshabelo" });
    await expect(result).toBeVisible();
    await result.click();

    await expect(result).toHaveAttribute("aria-current", "true");
    await expect(page.getByTestId(E2E.townshipPopup).locator("h2")).toHaveText(
      "Botshabelo",
    );
    await expect
      .poll(() => new URL(page.url()).searchParams.get("feature"))
      .not.toBeNull();
  });

  test("shows an empty-state message for a filter that matches nothing", async ({
    page,
  }) => {
    await page.goto("/");
    await ensurePanelOpen(page);

    await page.getByTestId(E2E.panelTab.browser).click();

    const filterInput = page.getByTestId(E2E.featureBrowser.filter);
    await filterInput.fill("no such place exists anywhere");

    await expect(page.getByText("Nothing matched that search.")).toBeVisible();
  });
});
