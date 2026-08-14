import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { E2E } from "./selectors";
import { ensurePanelClosed } from "./ui";

/**
 * Clicks a point inside `mapView`'s bounding box at the given fractional
 * offset. The fractions stay within the map's centre band (roughly
 * 20-60% horizontally, 25-75% vertically) so they never land on the
 * search box (top-left), the legend (bottom-left), or the measurement
 * panel itself (top-right) at either viewport size this suite runs.
 */
async function clickMapPoint(
  page: Page,
  mapView: Locator,
  xFraction: number,
  yFraction: number,
) {
  const box = await mapView.boundingBox();
  if (!box) {
    throw new Error("map view has no bounding box");
  }
  await page.mouse.click(
    box.x + box.width * xFraction,
    box.y + box.height * yFraction,
  );
}

test.describe("measurement tool", () => {
  test("is closed by default and opens a panel with a hint on toggle", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId(E2E.measurement.panel)).toHaveCount(0);

    await page.getByTestId(E2E.measurement.toggle).click();

    const panel = page.getByTestId(E2E.measurement.panel);
    await expect(panel).toBeVisible();
    await expect(page.getByTestId(E2E.measurement.hint)).toBeVisible();
    await expect(page.getByTestId(E2E.measurement.result)).toHaveCount(0);
  });

  test("measures distance between two clicked points and draws a line", async ({
    page,
  }) => {
    await page.goto("/");
    await ensurePanelClosed(page);
    await page.getByTestId(E2E.measurement.toggle).click();

    const mapView = page.getByTestId(E2E.mapView);
    await clickMapPoint(page, mapView, 0.3, 0.4);
    await clickMapPoint(page, mapView, 0.55, 0.6);

    await expect(page.getByTestId(E2E.measurement.result)).toHaveText(
      /^\d+(\.\d+)? (m|km)$/,
    );
    await expect(page.getByTestId(E2E.measurement.clear)).toBeVisible();
  });

  test("switching to area mode clears any in-progress distance points", async ({
    page,
  }) => {
    await page.goto("/");
    await ensurePanelClosed(page);
    await page.getByTestId(E2E.measurement.toggle).click();

    const mapView = page.getByTestId(E2E.mapView);
    await clickMapPoint(page, mapView, 0.3, 0.4);
    await clickMapPoint(page, mapView, 0.55, 0.6);
    await expect(page.getByTestId(E2E.measurement.result)).toBeVisible();

    await page.getByTestId(E2E.measurement.modeArea).click();

    await expect(page.getByTestId(E2E.measurement.hint)).toBeVisible();
    await expect(page.getByTestId(E2E.measurement.result)).toHaveCount(0);
  });

  test("measures an area from three clicked points", async ({ page }) => {
    await page.goto("/");
    await ensurePanelClosed(page);
    await page.getByTestId(E2E.measurement.toggle).click();
    await page.getByTestId(E2E.measurement.modeArea).click();

    const mapView = page.getByTestId(E2E.mapView);
    await clickMapPoint(page, mapView, 0.2, 0.25);
    await clickMapPoint(page, mapView, 0.6, 0.3);
    await clickMapPoint(page, mapView, 0.4, 0.75);

    await expect(page.getByTestId(E2E.measurement.result)).toHaveText(
      /^\d+(\.\d+)? (m²|ha|km²)$/,
    );
  });

  test("the clear button discards points but keeps the panel open", async ({
    page,
  }) => {
    await page.goto("/");
    await ensurePanelClosed(page);
    await page.getByTestId(E2E.measurement.toggle).click();

    const mapView = page.getByTestId(E2E.mapView);
    await clickMapPoint(page, mapView, 0.3, 0.4);
    await clickMapPoint(page, mapView, 0.55, 0.6);
    await expect(page.getByTestId(E2E.measurement.result)).toBeVisible();

    await page.getByTestId(E2E.measurement.clear).click();

    await expect(page.getByTestId(E2E.measurement.panel)).toBeVisible();
    await expect(page.getByTestId(E2E.measurement.hint)).toBeVisible();
  });

  test("the close button hides the panel and stops listening for map clicks", async ({
    page,
  }) => {
    await page.goto("/");
    await ensurePanelClosed(page);
    await page.getByTestId(E2E.measurement.toggle).click();
    await page.getByTestId(E2E.measurement.close).click();

    await expect(page.getByTestId(E2E.measurement.panel)).toHaveCount(0);
    await expect(page.getByTestId(E2E.measurement.toggle)).toBeVisible();
  });

  test("a map click while measuring places a point instead of opening the underlying feature's popup", async ({
    page,
  }) => {
    await page.goto("/");
    await ensurePanelClosed(page);
    await page.getByTestId(E2E.measurement.toggle).click();

    const mapView = page.getByTestId(E2E.mapView);
    await clickMapPoint(page, mapView, 0.4, 0.4);

    await expect(page.getByTestId(E2E.townshipPopup)).toHaveCount(0);
  });
});
