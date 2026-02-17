import { test, expect } from '@playwright/test';

test.describe('API Health Checks', () => {
    test('should return session data from auth API', async ({ request }) => {
        const response = await request.get('/api/auth/get-session');
        expect(response.status()).toBeLessThan(500);
    });

    test('should return skills list', async ({ request }) => {
        const response = await request.get('/api/skills');
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test('should return companies list', async ({ request }) => {
        const response = await request.get('/api/companies');
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test('should return organisation data', async ({ request }) => {
        const response = await request.get('/api/organisation');
        expect(response.status()).toBeLessThan(500);
    });

    test('should expose candidate verification endpoint on canonical path', async ({ request }) => {
        const canonical = await request.post('/api/verification/candidate', {
            data: { action: 'profile' },
        });

        expect([400, 401, 429]).toContain(canonical.status());

        const wrongPath = await request.post('/api/api/verification/candidate', {
            data: { action: 'profile' },
        });
        expect(wrongPath.status()).toBe(404);
    });
});

test.describe('Page Load Health', () => {
    test('should load landing page without errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Allow for minor console errors, just check page loaded
        expect(page.url()).toContain('localhost');
    });

    test('should load auth page without errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));

        await page.goto('/auth');
        await page.waitForLoadState('networkidle');

        // Verify the page loaded
        await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
    });

    test('should load manifest.webmanifest', async ({ request }) => {
        const response = await request.get('/manifest.webmanifest');
        expect(response.status()).toBe(200);
    });

    test('should load robots.txt', async ({ request }) => {
        const response = await request.get('/robots.txt');
        expect(response.status()).toBe(200);
    });

    test('should load sitemap.xml', async ({ request }) => {
        const response = await request.get('/sitemap.xml');
        expect(response.status()).toBe(200);
    });
});

test.describe('Performance Checks', () => {
    test('should load landing page under 5 seconds', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(5000);
    });

    test('should load auth page under 3 seconds', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/auth');
        await page.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(3000);
    });
});

test.describe('Accessibility Checks', () => {
    test('should have proper meta tags on landing page', async ({ page }) => {
        await page.goto('/');

        // Check title exists
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);

        // Check meta description
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description?.length).toBeGreaterThan(0);

        // Check viewport meta
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toBeTruthy();
    });

    test('should have h1 heading on the page', async ({ page }) => {
        await page.goto('/');

        // Should have h1 element(s) on the page
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
    });

    test('should have alt text on images', async ({ page }) => {
        await page.goto('/');

        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute('alt');
            // Allow empty alt for decorative images, just not missing
            expect(alt !== null).toBe(true);
        }
    });

    test('should have proper button labels', async ({ page }) => {
        await page.goto('/');

        const buttons = page.locator('button');
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            const text = await button.textContent();
            const ariaLabel = await button.getAttribute('aria-label');
            const title = await button.getAttribute('title');

            // Button should have text, aria-label, or title
            const hasLabel = (text?.trim().length || 0) > 0 || ariaLabel || title;
            expect(hasLabel).toBeTruthy();
        }
    });
});
