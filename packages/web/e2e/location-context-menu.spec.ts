import {
  expect,
  GEOCODER_REVERSE_PATTERN,
  GEOCODER_REVERSE_RESULT,
  test,
} from "./fixtures";
import { E2E } from "./selectors";

test.describe("location context menu", () => {
  test("right-clicking the map opens a menu offering to search that location, and choosing it shows the reverse-geocoded address", async ({
    page,
  }) => {
    await page.goto("/");

    const mapView = page.getByTestId(E2E.mapView);
    // Clicking dead centre (Playwright's default target when no `position`
    // is given) keeps the popup this opens well clear of the corner-docked
    // search/settings/panel controls at every viewport size this suite runs.
    await mapView.click({ button: "right" });

    const menu = page.getByTestId(E2E.locationContextMenu);
    const menuItem = menu.getByRole("menuitem", {
      name: /search this location/i,
    });
    await expect(menuItem).toBeVisible();

    await menuItem.click();

    await expect(menu.getByRole("status")).toHaveText(
      GEOCODER_REVERSE_RESULT.display_name,
    );
  });

  test("shows a fallback message when the point can't be reverse-geocoded", async ({
    page,
  }) => {
    await page.route(GEOCODER_REVERSE_PATTERN, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ error: "Unable to geocode" }),
      }),
    );

    await page.goto("/");

    const mapView = page.getByTestId(E2E.mapView);
    await mapView.click({ button: "right" });
    await page
      .getByTestId(E2E.locationContextMenu)
      .getByRole("menuitem", { name: /search this location/i })
      .click();

    await expect(
      page.getByTestId(E2E.locationContextMenu).getByRole("status"),
    ).toHaveText("No address found here.");
  });

  test("a plain left click on the map does not open the context menu", async ({
    page,
  }) => {
    await page.goto("/");

    const mapView = page.getByTestId(E2E.mapView);
    await mapView.click({ position: { x: 8, y: 8 } });

    await expect(page.getByTestId(E2E.locationContextMenu)).toHaveCount(0);
  });
});
