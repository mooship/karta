import { expect, test } from "./fixtures";
import { E2E } from "./selectors";
import { ensurePanelOpen } from "./ui";

test.describe("feature browser", () => {
  test("lists the visible browsable layer's features, searchable by name", async ({
    page,
  }) => {
    await page.goto("/d/gauteng-spatial-legacy");
    await ensurePanelOpen(page);

    await page.getByTestId(E2E.panelTab.browse).click();

    const list = page.getByTestId(E2E.featureBrowser);
    await expect(list).toBeVisible();
    await expect(list.getByRole("option").first()).toBeVisible();

    const search = page.getByTestId(E2E.featureBrowserSearch);
    await search.fill("mamelodi");

    const options = list.getByRole("option");
    await expect(options.first()).toBeVisible();
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
    for (const option of await options.all()) {
      await expect(option).toContainText(/mamelodi/i);
    }
  });

  test("selecting an entry updates the shared URL and opens its map popup", async ({
    page,
  }) => {
    await page.goto("/d/gauteng-spatial-legacy");
    await ensurePanelOpen(page);

    await page.getByTestId(E2E.panelTab.browse).click();
    await page.getByTestId(E2E.featureBrowserSearch).fill("mamelodi");

    const option = page
      .getByTestId(E2E.featureBrowser)
      .getByRole("option")
      .first();
    const label = await option.textContent();
    await option.click();

    await expect
      .poll(() => new URL(page.url()).searchParams.has("feature"))
      .toBe(true);
    await expect(page.getByTestId(E2E.featurePopup)).toBeVisible();
    if (label) {
      await expect(page.getByTestId(E2E.featurePopup)).toContainText(label);
    }
  });

  test("every option is reachable by keyboard, with roving tabindex", async ({
    page,
  }) => {
    await page.goto("/d/gauteng-spatial-legacy");
    await ensurePanelOpen(page);

    await page.getByTestId(E2E.panelTab.browse).click();
    await page.getByTestId(E2E.featureBrowserSearch).fill("mamelodi");

    const options = page.getByTestId(E2E.featureBrowser).getByRole("option");
    const first = options.first();
    await first.focus();
    await expect(first).toHaveAttribute("tabindex", "0");

    await page.keyboard.press("End");
    const last = options.last();
    await expect(last).toBeFocused();
    await expect(last).toHaveAttribute("tabindex", "0");
    await expect(first).toHaveAttribute("tabindex", "-1");
  });
});
