import { expect, test } from "@playwright/test";

test.describe("public smoke", () => {
  test("homepage renders core content", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("body")).toContainText(/Shiksha/i);
  });

  test("registration page is reachable", async ({ page }) => {
    const response = await page.goto("/registration");
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("body")).toContainText(/register|registration/i);
  });

  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/api/v2/health");
    expect(response.ok()).toBeTruthy();
    const payload = (await response.json()) as { status?: string; ok?: boolean };
    expect(payload.status === "ok" || payload.ok === true).toBeTruthy();
  });
});
