import { expect, test } from '@playwright/test'

test('public landing and login routes render', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/USHQN/)
  await expect(page.locator('body')).toContainText('USHQN')

  await page.goto('/login')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.locator('form')).toBeVisible()
})
