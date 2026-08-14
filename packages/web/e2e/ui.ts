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
 * Fails the first request matching `urlPattern` with a 500, then lets every
 * later one through, for tests asserting a load-error state and its retry
 * recovery. The returned object's `requestCount` updates live as requests
 * arrive, so a test can assert on it after triggering the retry.
 */
export async function mockFailOnceThenSucceed(
  page: Page,
  urlPattern: string,
): Promise<{ requestCount: number }> {
  const state = { requestCount: 0 };
  await page.route(urlPattern, (route) => {
    state.requestCount += 1;
    if (state.requestCount === 1) {
      return route.fulfill({ status: 500, body: "Internal Server Error" });
    }
    return route.continue();
  });
  return state;
}
