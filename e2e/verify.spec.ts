import { test } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'verification/screenshots/landing_v2.png', fullPage: true });

  await page.goto('/login');
  await page.screenshot({ path: 'verification/screenshots/login_v2.png', fullPage: true });
});
