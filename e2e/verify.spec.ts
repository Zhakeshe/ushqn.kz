import { expect, test } from '@playwright/test'

test('landing presents five core modules and switches languages', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/USHQN/)
  await page.locator('header select').selectOption('en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your goals.')
  await expect(page.locator('#platform article')).toHaveCount(5)
  await expect(page.getByRole('link', { name: 'Build my portfolio' })).toHaveAttribute('href', '/register')
  await page.locator('header select').selectOption('kk')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Сенің мақсатың.')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Сенің мақсатың.')
})

test('registration and login routes render', async ({ page }) => {
  await page.goto('/register')
  await expect(page.locator('form')).toBeVisible()
  await page.goto('/login')
  await expect(page.locator('form')).toBeVisible()
})

test('mobile landing has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  expect(fits).toBe(true)
})
