import { expect, test } from '@playwright/test'

test('landing presents five core modules and switches languages', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/USHQN/)
  await page.locator('header select').selectOption('en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('USHQN')
  await expect(page.getByRole('tab')).toHaveCount(5)
  await page.getByRole('tab', { name: '03 Olympiads' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('New challenge.')
  await expect(
    page.getByRole('link', { name: 'Build my portfolio', exact: true }).first(),
  ).toHaveAttribute('href', '/register')
  await page.locator('header select').selectOption('kk')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('USHQN')
  await expect(
    page.getByRole('button', { name: /USHQN кімге арналған/ }),
  ).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('USHQN')
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
  const fits = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  )
  expect(fits).toBe(true)
})
