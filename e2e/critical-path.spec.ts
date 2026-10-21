import { test, expect } from '@playwright/test'

const email = process.env.E2E_EMAIL ?? ''
const password = process.env.E2E_PASSWORD ?? ''
const describeCritical = email && password ? test.describe : test.describe.skip

describeCritical('pitch MVP authenticated navigation', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.setItem('ushqn_lang', 'en'))
  })

  test('login → journey → portfolio → olympiads → marketplace', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email', { exact: true }).fill(email)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.getByRole('button', { name: /Sign in/ }).click()
    await expect(page).toHaveURL(/\/home/, { timeout: 45_000 })
    await expect(page.getByRole('heading', { name: /Your journey,/ })).toBeVisible()
    await page.goto('/profile')
    await expect(page.locator('main')).toBeVisible()
    await page.goto('/olympiads')
    await expect(page.getByRole('heading', { name: 'Olympiads', exact: true })).toBeVisible()
    await page.goto('/marketplace')
    await expect(page.getByRole('heading', { name: 'Turn your talents into opportunities' })).toBeVisible()
    await page.goto('/roadmap')
    await page.getByLabel(/Technology & engineering/).check()
    await page.getByRole('button', { name: 'See my plan' }).click()
    await expect(page.getByRole('heading', { name: 'Directions to explore' })).toBeVisible()
  })
})
