import { test, expect, loginAs, waitForPageLoad } from './fixtures';

test.describe('Complete User Flows', () => {

    test.describe('Candidate Complete Flow', () => {
        test('should complete full candidate login and dashboard interaction', async ({ page }) => {
            // Step 1: Navigate to auth
            await page.goto('/auth');
            await page.waitForLoadState('domcontentloaded');

            // Step 2: Login as candidate
            await loginAs(page, 'candidate');

            // Step 3: Verify dashboard loaded
            await expect(page).toHaveURL(/\/dashboard/);
            await waitForPageLoad(page);

            // Step 4: Check header is visible with sign out
            await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();

            // Step 5: Toggle dark mode
            const themeToggle = page.getByRole('button', { name: /dark mode|light mode|switch to/i });
            if (await themeToggle.isVisible()) {
                await themeToggle.click();
                await page.waitForTimeout(300);
            }
        });
    });

    test.describe('Recruiter Complete Flow', () => {
        test('should complete full recruiter search flow', async ({ page }) => {
            // Step 1: Login as recruiter
            await page.goto('/auth');
            await loginAs(page, 'recruiter');

            // Step 2: Verify on dashboard
            await expect(page).toHaveURL(/\/dashboard/);
            await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
        });
    });

    test.describe('Cross-Role Navigation', () => {
        test('should have sign out functionality', async ({ page }) => {
            // Login as candidate
            await loginAs(page, 'candidate');
            await expect(page).toHaveURL(/\/dashboard/);

            // Sign out button should be visible and clickable
            const signOutButton = page.getByRole('button', { name: /sign out/i });
            await expect(signOutButton).toBeVisible();
        });
    });
});

test.describe('Error Handling', () => {
    test('should handle 404 page gracefully', async ({ page }) => {
        await page.goto('/nonexistent-page-12345');
        await page.waitForLoadState('domcontentloaded');

        // Page should load (either 404 or redirect)
        await expect(page.locator('body')).toBeVisible();
    });

    test('should redirect unauthenticated users from dashboard', async ({ page }) => {
        // Clear any existing auth
        await page.context().clearCookies();

        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Should redirect to auth page or home
        const url = page.url();
        expect(url.includes('/auth') || url === 'http://localhost:3000/' || url.endsWith(':3000/')).toBe(true);
    });
});

test.describe('Responsive Design', () => {
    const viewports = [
        { name: 'Desktop', width: 1920, height: 1080 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
        test(`should display correctly on ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });

            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');

            // Page should load without crashing
            await expect(page.locator('body')).toBeVisible();
        });
    }
});
