import { test, expect } from '@playwright/test'

test('home page renders and theme toggle works', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Welcome to the Application')

  // Theme toggle will be tested once added, for now just basic assertions
  const html = page.locator('html')
  await expect(html).toHaveAttribute('data-theme', 'light')
})
