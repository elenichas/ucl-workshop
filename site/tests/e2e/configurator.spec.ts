import { expect, test } from '@playwright/test'

// Browser tests: a real browser opens the built site and uses it like a person would.
// They run twice — on a desktop and on a phone viewport (see playwright.config.ts).

const status = (page: import('@playwright/test').Page) => page.getByRole('status')

test('the landing page leads to the configurator', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Design a vessel')
  await page.getByRole('link', { name: /open the configurator/i }).click()
  await expect(page).toHaveURL(/#\/configure/)
})

test('the default vase is ready to print in PLA', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('tab', { name: /Make/ }).click()
  await expect(status(page)).toHaveText(/ready to print/i)
})

test('switching to the clay printer flags the thin wall; the Clay pot preset fixes it', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('tab', { name: /Make/ }).click()
  await page.getByLabel('Printer').selectOption('clay')
  await expect(status(page)).toHaveText(/will not print/i)
  await page.getByRole('tab', { name: /Start/ }).click()
  await page.getByRole('radio', { name: /ready-made design/ }).click()
  await page.getByRole('button', { name: /^Clay pot/ }).click()
  await page.getByRole('tab', { name: /Make/ }).click()
  await expect(status(page)).not.toHaveText(/will not print/i)
})

test('each start exposes its own controls', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('button', { name: /^Box$/ }).click()
  await expect(page.getByRole('slider', { name: 'Corner rounding' })).toBeVisible()
  await page.getByRole('tab', { name: /Start/ }).click()
  await page.getByRole('button', { name: /^Sphere$/ }).click()
  await expect(page.getByRole('slider', { name: 'Squash' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Corner rounding' })).toHaveCount(0)
  await expect(page.getByText(/Height is derived/)).toBeVisible()
})

test('sliders work with the keyboard', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('tab', { name: /Form/ }).click()
  await page.getByRole('slider', { name: 'Height' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('spinbutton', { name: 'Height' })).toHaveValue('181')
})

test('an image becomes a vase outline', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('radio', { name: /Another way/ }).click()
  await page.getByRole('button', { name: /From an image/ }).click()
  await page.getByRole('button', { name: /Try a sample sketch/ }).click()
  await expect(page.getByText('Colours found in the image')).toBeVisible()
})

test('the system map highlights the current start', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('button', { name: /^Box$/ }).click()
  await page.getByRole('button', { name: /How it works/ }).click()
  await expect(page.getByRole('dialog')).toContainText('The system behind the configurator')
  await expect(page.getByRole('dialog').getByRole('button', { name: /Box/, pressed: true })).toBeVisible()
})

test('exports an STL and a Rhino 3DM file', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('tab', { name: /Make/ }).click()
  let download = page.waitForEvent('download')
  await page.getByRole('button', { name: /^STL/ }).click()
  expect((await download).suggestedFilename()).toBe('amphora.stl')
  download = page.waitForEvent('download')
  await page.getByRole('button', { name: /^3DM/ }).click()
  expect((await download).suggestedFilename()).toBe('amphora.3dm')
})

test('the course chapters render', async ({ page }) => {
  await page.goto('/#/course')
  await page.getByRole('link', { name: /Starting systematically/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Starting systematically')
})

test('present mode: keyboard steps through slides, overview jumps', async ({ page }) => {
  await page.goto('/#/course')
  await page.getByRole('link', { name: /Present the course/ }).click()
  await expect(page.getByText(/^1 \/ \d+/)).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByText(/^2 \/ \d+/)).toBeVisible()
  await page.keyboard.press('o')
  await page.getByRole('dialog', { name: 'All slides' }).getByRole('button', { name: /one shared pipeline/i }).click()
  await expect(page.getByText('Shared pipeline', { exact: true })).toBeVisible()
})

test('present mode exports a PowerPoint file', async ({ page }) => {
  test.skip(test.info().project.name === 'phone', 'export is a desktop task')
  test.setTimeout(240_000)
  await page.goto('/#/present')
  const download = page.waitForEvent('download', { timeout: 200_000 })
  await page.getByRole('button', { name: /PowerPoint/ }).click()
  expect((await download).suggestedFilename()).toBe('Prompt-to-Print.pptx')
})

test('project files are readable on the site, without GitHub', async ({ page }) => {
  await page.goto('/#/files')
  await expect(page.getByRole('heading', { name: 'Everything we wrote down' })).toBeVisible()
  await page.getByRole('link', { name: /^PLAN\.md/ }).first().click()
  await expect(page.getByRole('button', { name: /Download/ })).toBeVisible()
  await page.goto('/#/course/00-welcome')
  await expect(page.locator('.prose a[href*="github.com/elenichas"]')).toHaveCount(0)
})

test('dimensions can be shown in the 3D view', async ({ page }) => {
  await page.goto('/#/configure')
  await page.getByRole('button', { name: /Dimensions/ }).click()
  await expect(page.getByText(/^H \d+ mm$/)).toBeVisible()
  await expect(page.getByText(/^R \d+ mm$/)).toBeVisible()
  await page.getByRole('button', { name: /^Box$/ }).click()
  await expect(page.getByText(/^Diagonal \d+ mm$/)).toBeVisible()
})
