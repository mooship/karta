import { expect, type Page } from "@playwright/test";
import { E2E } from "./selectors";

export async function ensurePanelOpen(page: Page) {
  const panelToggle = page.getByTestId(E2E.panelToggle);
  await expect(panelToggle).toBeVisible();

  if ((await panelToggle.getAttribute("aria-expanded")) === "false") {
    await panelToggle.click();
    await expect(panelToggle).toHaveAttribute("aria-expanded", "true");
  }
}

/**
 * Closes the info panel if it's open (it's open by default on desktop
 * viewports), so its layer list doesn't overlap the right side of the map.
 */
export async function ensurePanelClosed(page: Page) {
  const panelToggle = page.getByTestId(E2E.panelToggle);
  await expect(panelToggle).toBeVisible();

  if ((await panelToggle.getAttribute("aria-expanded")) === "true") {
    await panelToggle.click();
    await expect(panelToggle).toHaveAttribute("aria-expanded", "false");
  }
}

/**
 * Fails the first request to each distinct URL matching `urlPattern` with a
 * 500, then lets every later request to that same URL through, for tests
 * asserting a load-error state and its retry recovery. Tracked per distinct
 * URL, not globally — `urlPattern` can match more than one real URL (e.g. a
 * merged multi-region fetch), and each one gets its own single failure
 * rather than only the first URL to be requested at all. The returned
 * object's `requestCount` updates live as requests arrive, so a test can
 * assert on it after triggering the retry.
 */
export async function mockFailOnceThenSucceed(
  page: Page,
  urlPattern: string,
): Promise<{ requestCount: number }> {
  const state = { requestCount: 0 };
  const failedUrls = new Set<string>();
  await page.route(urlPattern, (route) => {
    state.requestCount += 1;
    const url = route.request().url();
    if (!failedUrls.has(url)) {
      failedUrls.add(url);
      return route.fulfill({ status: 500, body: "Internal Server Error" });
    }
    return route.continue();
  });
  return state;
}
