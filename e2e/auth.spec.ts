import { test, expect } from '@playwright/test';
import { CANDIDATE_CREDENTIALS, RECRUITER_CREDENTIALS } from './fixtures';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('domcontentloaded');
  });

  test('renders auth page and login controls', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByPlaceholder(/name@company\.com/i)).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows remember me checkbox', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: /remember me/i })).toBeVisible();
  });

  test('candidate login redirects to dashboard', async ({ page }) => {
    await page.getByPlaceholder(/name@company\.com/i).fill(CANDIDATE_CREDENTIALS.email);
    await page.locator('input[type="password"]').first().fill(CANDIDATE_CREDENTIALS.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('recruiter login redirects to dashboard', async ({ page }) => {
    await page.getByPlaceholder(/name@company\.com/i).fill(RECRUITER_CREDENTIALS.email);
    await page.locator('input[type="password"]').first().fill(RECRUITER_CREDENTIALS.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('invalid credentials keep user on auth flow', async ({ page }) => {
    await page.getByPlaceholder(/name@company\.com/i).fill('invalid@email.com');
    await page.locator('input[type="password"]').first().fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForTimeout(2000);

    const stillOnAuth = page.url().includes('/auth');
    const hasError = await page.locator('[role="alert"]').isVisible().catch(() => false);
    expect(stillOnAuth || hasError).toBe(true);
  });

  test('shows sign up action', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });
});
