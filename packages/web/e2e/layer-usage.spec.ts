import type { Route } from "@playwright/test";
import { expect, test } from "./fixtures";
import { E2E } from "./selectors";
import { ensurePanelOpen } from "./ui";

interface CapturedBeacon {
  body: unknown;
}

async function captureLayerUsageBeacons(
  page: import("@playwright/test").Page,
): Promise<CapturedBeacon[]> {
  const captured: CapturedBeacon[] = [];
  await page.route("**/api/layer-usage", async (route: Route) => {
    const request = route.request();
    let body: unknown;
    try {
      body = JSON.parse(request.postData() ?? "{}");
    } catch {
      body = request.postData();
    }
    captured.push({ body });
    await route.fulfill({ status: 204, body: "" });
  });
  return captured;
}

test.describe("layer-usage analytics", () => {
  test("toggling a layer on sends exactly one beacon with only {layerId, visible}", async ({
    page,
  }) => {
    const beacons = await captureLayerUsageBeacons(page);
    await page.goto("/d/gauteng-spatial-legacy");
    await ensurePanelOpen(page);

    await page.getByTestId(E2E.layerToggle.rapidRail).check();

    await expect.poll(() => beacons.length, { timeout: 5000 }).toBe(1);
    expect(beacons[0]?.body).toEqual({
      events: [{ layerId: "rapid-rail", visible: true }],
    });
  });

  test("collapses a rapid on/off toggle of the same layer into one beacon reflecting the final state", async ({
    page,
  }) => {
    const beacons = await captureLayerUsageBeacons(page);
    await page.goto("/d/gauteng-spatial-legacy");
    await ensurePanelOpen(page);

    const checkbox = page.getByTestId(E2E.layerToggle.rapidRail);
    await checkbox.check();
    await checkbox.uncheck();
    await checkbox.check();

    await expect.poll(() => beacons.length, { timeout: 5000 }).toBe(1);
    expect(beacons[0]?.body).toEqual({
      events: [{ layerId: "rapid-rail", visible: true }],
    });
  });

  test("does not fire on a plain page load", async ({ page }) => {
    const beacons = await captureLayerUsageBeacons(page);
    await page.goto("/d/gauteng-spatial-legacy");
    await ensurePanelOpen(page);

    await page.waitForTimeout(3000);

    expect(beacons).toHaveLength(0);
  });

  test("does not fire when a permalink restores non-default layer state", async ({
    page,
  }) => {
    const beacons = await captureLayerUsageBeacons(page);
    await page.goto("/d/gauteng-spatial-legacy?layers=townships%2Crapid-rail");
    await ensurePanelOpen(page);

    await expect(page.getByTestId(E2E.layerToggle.rapidRail)).toBeChecked();
    await page.waitForTimeout(3000);

    expect(beacons).toHaveLength(0);
  });
});
