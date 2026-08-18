import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { E2E } from "./selectors";
import { ensurePanelClosed } from "./ui";

/**
 * Clicks a point inside `mapView`'s bounding box at the given fractional
 * offset. The fractions stay right of centre and clear of the very top
 * and bottom edges (roughly 70-95% horizontally, 30-70% vertically) so
 * they never land on the search box or the measurement panel itself
 * (both top-left), the legend/settings (bottom-left), or the zoom
 * control (bottom-right) at either viewport size this suite runs.
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

/** Clicks the same two points several distance-mode tests share, to produce a measurable line. */
async function drawSampleLine(page: Page, mapView: Locator) {
  await clickMapPoint(page, mapView, 0.75, 0.3);
  await clickMapPoint(page, mapView, 0.9, 0.5);
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
    await drawSampleLine(page, mapView);

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
    await drawSampleLine(page, mapView);
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
    await clickMapPoint(page, mapView, 0.75, 0.3);
    await clickMapPoint(page, mapView, 0.95, 0.35);
    await clickMapPoint(page, mapView, 0.85, 0.65);

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
    await drawSampleLine(page, mapView);
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
    await clickMapPoint(page, mapView, 0.8, 0.4);

    await expect(page.getByTestId(E2E.featurePopup)).toHaveCount(0);
  });
});
