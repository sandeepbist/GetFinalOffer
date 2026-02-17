import { test, expect, loginAs, waitForPageLoad } from './fixtures';

test.describe('Candidate Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'candidate');
        await waitForPageLoad(page);
        // Extra wait for dashboard content to load
        await page.waitForTimeout(2000);
    });

    test('should display dashboard after login', async ({ page }) => {
        await expect(page).toHaveURL(/\/dashboard/);

        // Should have header with sign out button
        await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    });

    test('should display header with navigation', async ({ page }) => {
        // Header should have logo link
        await expect(page.getByRole('link', { name: /getfinaloffer/i })).toBeVisible();

        // Should have sign out button
        await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    });

    test('should have theme toggle', async ({ page }) => {
        // Look for theme toggle button
        const themeToggle = page.getByRole('button', { name: /dark mode|light mode|switch to/i });
        await expect(themeToggle).toBeVisible();
    });

    test('should be able to sign out', async ({ page }) => {
        // Look for sign out button in header
        const signOutButton = page.getByRole('button', { name: /sign out/i });
        await expect(signOutButton).toBeVisible();

        await signOutButton.click();
        await page.waitForTimeout(2000);

        // Should redirect to landing or auth page
        const url = page.url();
        expect(url.includes('/auth') || url === '/' || url.endsWith(':3000/')).toBe(true);
    });

    test('should toggle dark mode', async ({ page }) => {
        // Find and click theme toggle
        const themeToggle = page.getByRole('button', { name: /dark mode|light mode|switch to/i });
        await expect(themeToggle).toBeVisible();

        await themeToggle.click();
        await page.waitForTimeout(500);

        // Verify header is still visible after toggle
        await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    });
});
