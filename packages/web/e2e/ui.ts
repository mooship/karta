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
 * Fails the first request to each distinct *resource* matching `urlPattern`
 * with a 500, then lets every later request to that same resource through,
 * for tests asserting a load-error state and its retry recovery. Tracked by
 * pathname, not the full URL — `urlPattern` can match more than one real
 * resource (e.g. a merged multi-region fetch), and each one gets its own
 * single failure rather than only the first request to be made at all; the
 * app's own retry path (`App.tsx`'s `cacheBust`) appends a `?retry=N` query
 * string specifically to defeat browser caching, so a full-URL comparison
 * would treat that retried request as a *new* resource and fail it too,
 * leaving no successful attempt for the test's single retry click to land
 * on. The returned object's `requestCount` updates live as requests arrive,
 * so a test can assert on it after triggering the retry.
 */
export async function mockFailOnceThenSucceed(
  page: Page,
  urlPattern: string,
): Promise<{ requestCount: number }> {
  const state = { requestCount: 0 };
  const failedResources = new Set<string>();
  await page.route(urlPattern, (route) => {
    state.requestCount += 1;
    const resource = new URL(route.request().url()).pathname;
    if (!failedResources.has(resource)) {
      failedResources.add(resource);
      return route.fulfill({ status: 500, body: "Internal Server Error" });
    }
    return route.continue();
  });
  return state;
}
