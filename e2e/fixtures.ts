import { test as base, Page } from '@playwright/test';

export const CANDIDATE_CREDENTIALS = {
  email: 'a@a.com',
  password: '123456789',
};

export const RECRUITER_CREDENTIALS = {
  email: 'harsh@airbnb.com',
  password: '123456789',
};

export const test = base.extend<{
  candidatePage: Page;
  recruiterPage: Page;
}>({
  candidatePage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, 'candidate');
    await use(page);
    await context.close();
  },
  recruiterPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, 'recruiter');
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';

export async function loginAs(page: Page, role: 'candidate' | 'recruiter') {
  const credentials = role === 'candidate' ? CANDIDATE_CREDENTIALS : RECRUITER_CREDENTIALS;

  await page.goto('/auth');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  await page.getByPlaceholder(/name@company\.com/i).fill(credentials.email);
  await page.locator('input[type="password"]').first().fill(credentials.password);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/dashboard', { timeout: 30000 });
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
}

export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `playwright-screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}
