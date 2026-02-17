import { test, expect } from "@playwright/test";

test.describe("Public Smoke", () => {
  test("landing page renders primary content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/GetFinalOffer/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("static metadata endpoints are available", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
  });
});
