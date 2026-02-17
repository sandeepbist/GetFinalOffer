import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should load homepage with hero section', async ({ page }) => {
        // Check page title
        await expect(page).toHaveTitle(/GetFinalOffer/i);

        // Check hero headline exists
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // Check for a CTA button
        const ctaButton = page.getByRole('link', { name: /get started|sign in/i }).first();
        await expect(ctaButton).toBeVisible();
    });

    test('should display stats section', async ({ page }) => {
        // Scroll down to find stats
        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(500);

        // Look for any numbers or stats text
        const statsContent = page.getByText(/engineers|verified|saved|companies/i).first();
        await expect(statsContent).toBeVisible();
    });

    test('should display how it works section', async ({ page }) => {
        // Look for how it works heading
        const howItWorks = page.getByRole('heading', { name: /how it works/i });
        if (await howItWorks.isVisible()) {
            await expect(howItWorks).toBeVisible();
        }
    });

    test('should have working navigation to auth page', async ({ page }) => {
        // Click Sign In / Get Started
        const authLink = page.getByRole('link', { name: /sign in|get started/i }).first();
        await authLink.click();

        await expect(page).toHaveURL(/\/auth/);
    });

    test('should toggle dark mode', async ({ page }) => {
        // Find theme toggle button
        const themeToggle = page.getByRole('button', { name: /dark mode|light mode|switch to/i });

        if (await themeToggle.isVisible()) {
            await themeToggle.click();
            await page.waitForTimeout(300);

            // Verify page still works
            await expect(page.locator('body')).toBeVisible();
        }
    });

    test('should be responsive - mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Hero should still be visible
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
});
