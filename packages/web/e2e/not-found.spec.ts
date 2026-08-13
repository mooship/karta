import { expect, test } from "./fixtures";

test.describe("unmatched routes", () => {
  test("shows a not-found message instead of a blank page", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist");

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(
      alert.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await expect(
      alert.getByText("The page you're looking for doesn't exist."),
    ).toBeVisible();
  });
});
