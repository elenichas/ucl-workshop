import { describe, expect, it } from 'vitest'
import { extractOutline, extractPalette } from './imageProfile'
import { buildDesign } from './buildDesign'
import { getPreset, newDesign, surfaceFor, withStartValues } from '@/design/design'

/** A fake 60×100 image: white background, a black "vase" that is wider at the bottom. */
function fakeImage() {
  const w = 60, h = 100
  const data = new Uint8ClampedArray(w * h * 4).fill(255)
  for (let y = 10; y < 90; y++) {
    const half = y < 50 ? 10 : 20 // narrow top half, wide bottom half
    for (let x = 30 - half; x < 30 + half; x++) {
      const i = (y * w + x) * 4
      data[i] = 120; data[i + 1] = 60; data[i + 2] = 40
    }
  }
  return { width: w, height: h, data }
}

describe('image start', () => {
  it('finds the outline: wide at the bottom, half as wide at the top', () => {
    const { samples, found } = extractOutline(fakeImage(), 0.5)
    expect(found).toBe(true)
    expect(samples[2]).toBeCloseTo(1, 1)
    expect(samples[samples.length - 3]).toBeCloseTo(0.5, 1)
  })
  it('finds the colour of the vase, not the background', () => {
    expect(extractPalette(fakeImage(), 2)).toContain('#783c28')
  })
})

describe('carve', () => {
  it('subtracting cutters removes material', () => {
    const base = withStartValues({ ...newDesign(), start: 'carve', surface: surfaceFor('none') }, 'carve', { cutterCount: 1, cutterSize: 10, cutterX: 500 })
    const cut = withStartValues(base, 'carve', { cutterCount: 3, cutterSize: 50, cutterX: 0 })
    const a = buildDesign(base, 'draft').stats.volume
    const b = buildDesign(cut, 'draft').stats.volume
    expect(b).toBeLessThan(a * 0.97)
  })
  it('the Lantern preset builds a mesh with measured stats', () => {
    const s = buildDesign(getPreset('lantern'), 'draft').stats
    expect(s.height).toBeGreaterThan(100)
    expect(s.minWall).toBeNull()
  })
})
