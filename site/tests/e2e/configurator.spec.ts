import { expect, test } from '@playwright/test'

// Browser tests: a real browser opens the built site and uses it like a person would.
// They run twice — on a desktop and on a phone viewport (see playwright.config.ts).

test('the landing page leads to the configurator', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Design a vessel')
  await page.getByRole('link', { name: /open the configurator/i }).click()
  await expect(page).toHaveURL(/#\/configure/)
})

test('the default vase is ready to print in PLA', async ({ page }) => {
  await page.goto('/#/configure')
  await expect(page.getByRole('status')).toHaveText(/ready to print/i)
})

test('switching to the clay printer flags the thin wall', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('tab', { name: 'Make' }).click()
  await page.getByLabel('Printer').selectOption('clay')
  await expect(page.getByRole('status')).toHaveText(/will not print/i)
  // The "Clay pot" preset has thick walls and gentle overhangs.
  await page.getByRole('button', { name: 'Clay pot' }).click()
  await expect(page.getByRole('status')).not.toHaveText(/will not print/i)
})

test('sliders work with the keyboard', async ({ page }) => {
  await page.goto('/#/configure')
  const height = page.getByRole('slider', { name: 'Height' })
  await height.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('spinbutton', { name: 'Height' })).toHaveValue('181')
})

test('exports an STL file', async ({ page }) => {
  await page.goto('/#/configure')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: /^STL/ }).click()
  expect((await download).suggestedFilename()).toBe('amphora.stl')
})

test('the course chapters render', async ({ page }) => {
  await page.goto('/#/course')
  await page.getByRole('link', { name: /Starting systematically/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Starting systematically')
})

test('exports a Rhino 3DM file', async ({ page }) => {
  await page.goto('/#/configure')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: /^3DM/ }).click()
  expect((await download).suggestedFilename()).toBe('amphora.3dm')
})
