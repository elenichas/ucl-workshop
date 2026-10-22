import { chromium } from '@playwright/test'
const [url, out, w, h] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const p = await b.newPage({ viewport: { width: +w || 1400, height: +h || 900 } })
const errs = []
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', e => errs.push(String(e)))
await p.goto(url); await p.waitForTimeout(3500)
await p.screenshot({ path: out })
console.log('errors:', errs.slice(0,5))
await b.close()
