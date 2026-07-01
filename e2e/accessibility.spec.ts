import { expect, test } from "@playwright/test";

test.describe("accessibility baseline", () => {
  test("skip link targets main content", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test("document language is set", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBeTruthy();
  });

  test("primary navigation uses landmark roles", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });
});
