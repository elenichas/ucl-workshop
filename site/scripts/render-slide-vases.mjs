// Renders the vases on the "vase" slides to pictures in public/slides/.
// The slides show these pictures (no live 3D), so stepping is a clean cut.
// Usage (inside site/): npm run build && npx vite preview --port 4173 &  then  node scripts/render-slide-vases.mjs
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const slides = [{ id: 'starts', count: 5 }, { id: 'twist', count: 4 }]

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })
await page.addInitScript(() => { window.__LIVE_VASE__ = true })
await page.goto(`${BASE}/#/present`)
await page.waitForTimeout(1000)
const total = await page.evaluate(() => document.body.innerText.match(/\d+\s*\/\s*(\d+)/)?.[1])
for (let s = 0; s < Number(total); s++) {
  await page.goto(`${BASE}/#/present?s=${s}`)
  await page.reload()
  await page.waitForTimeout(600)
  const el = page.locator('[data-export="vase"]')
  if (!(await el.count())) continue
  const title = await page.locator('h2').first().textContent()
  // hide everything else (slide labels sit on top of the panel)
  await page.addStyleTag({ content: 'body * { visibility: hidden } [data-export="vase"], [data-export="vase"] * { visibility: visible }' })
  const spec = title.includes('twist') ? slides[1] : slides[0]
  for (let i = 0; i < spec.count; i++) {
    if (i > 0) await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `public/slides/vase-${spec.id}-${i}.png`, clip: await el.locator('canvas').boundingBox() })
    console.log(`vase-${spec.id}-${i}.png`)
  }
}
await browser.close()
