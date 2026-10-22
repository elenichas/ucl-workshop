import { clamp } from './curves'
import type { Relief } from './patterns'

/** The pixels of an image: RGBA, row by row (same shape as the browser's ImageData). */
export interface Pixels {
  width: number
  height: number
  data: Uint8ClampedArray
}

/**
 * IMAGE → OUTLINE
 * 1. Guess the background colour from the four corners.
 * 2. A pixel is "vase" if it differs enough from the background (the threshold).
 * 3. For each row, find the leftmost and rightmost vase pixel: half that is the radius.
 * 4. Resample to 64 rows (bottom → top) and scale so the widest row = 1.
 */
export function extractOutline(img: Pixels, threshold: number, rows = 64) {
  const { width: w, height: h, data } = img
  const px = (x: number, y: number) => {
    const i = (y * w + x) * 4
    return [data[i], data[i + 1], data[i + 2]]
  }
  const corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)]
  const bg = [0, 1, 2].map((c) => corners.reduce((s, p) => s + p[c], 0) / 4)
  const limit = clamp(threshold, 0.02, 0.98) * 255 * 0.9

  const halfWidths: number[] = []
  const mask = new Uint8Array(w * h)
  let top = -1, bottom = -1
  for (let y = 0; y < h; y++) {
    let left = -1, right = -1
    for (let x = 0; x < w; x++) {
      const [r, g, b] = px(x, y)
      const diff = Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(b - bg[2]))
      if (diff > limit) {
        mask[y * w + x] = 1
        if (left < 0) left = x
        right = x
      }
    }
    const hw = left >= 0 && right - left > 2 ? (right - left) / 2 : 0
    halfWidths.push(hw)
    if (hw > 0) { if (top < 0) top = y; bottom = y }
  }
  if (top < 0) return { samples: [] as number[], mask, aspect: 1, found: false }

  const span = halfWidths.slice(top, bottom + 1)
  const max = Math.max(...span)
  const samples: number[] = []
  for (let i = 0; i < rows; i++) {
    // i = 0 is the bottom of the vase, i.e. the last image row
    const y = (1 - i / (rows - 1)) * (span.length - 1)
    const y0 = Math.floor(y), y1 = Math.min(span.length - 1, y0 + 1)
    const v = span[y0] + (span[y1] - span[y0]) * (y - y0)
    samples.push(Math.max(0.04, v / max))
  }
  return { samples, mask, aspect: (bottom - top) / (2 * max), found: true }
}

/** The main colours of an image (a few rounds of k-means), ignoring the background. */
export function extractPalette(img: Pixels, k = 5): string[] {
  const { width: w, height: h, data } = img
  const step = Math.max(1, Math.floor(Math.sqrt((w * h) / 4000)))
  const pts: number[][] = []
  const corner = [data[0], data[1], data[2]]
  for (let y = 0; y < h; y += step)
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4
      const p = [data[i], data[i + 1], data[i + 2]]
      if (Math.abs(p[0] - corner[0]) + Math.abs(p[1] - corner[1]) + Math.abs(p[2] - corner[2]) > 40) pts.push(p)
    }
  if (pts.length < k) return []
  let centres = Array.from({ length: k }, (_, i) => pts[Math.floor(((i + 0.5) / k) * pts.length)])
  for (let iter = 0; iter < 8; iter++) {
    const sums = centres.map(() => [0, 0, 0, 0])
    for (const p of pts) {
      let best = 0, bd = Infinity
      centres.forEach((c, ci) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2
        if (d < bd) { bd = d; best = ci }
      })
      sums[best][0] += p[0]; sums[best][1] += p[1]; sums[best][2] += p[2]; sums[best][3]++
    }
    centres = sums.map((s, i) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : centres[i]))
  }
  const hex = (c: number[]) => '#' + c.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')
  return [...new Set(centres.map(hex))]
}

/** Brightness map for the "Image relief" pattern (light = raised). */
export function toRelief(img: Pixels, outW = 256, outH = 128): Relief {
  const out = new Float32Array(outW * outH)
  for (let y = 0; y < outH; y++)
    for (let x = 0; x < outW; x++) {
      const sx = Math.floor((x / outW) * img.width), sy = Math.floor((y / outH) * img.height)
      const i = (sy * img.width + sx) * 4
      out[y * outW + x] = (0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2]) / 255
    }
  return { width: outW, height: outH, data: out }
}

/** Browser only: read an uploaded file into pixels (scaled down for speed). */
export async function fileToPixels(file: Blob, maxSize = 320): Promise<{ pixels: Pixels; preview: string }> {
  const url = URL.createObjectURL(file)
  try {
    const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image()
      im.onload = () => resolve(im)
      im.onerror = () => reject(new Error('This file could not be read as an image.'))
      im.src = url
    })
    const scale = Math.min(1, maxSize / Math.max(imgEl.width, imgEl.height))
    const w = Math.max(1, Math.round(imgEl.width * scale)), h = Math.max(1, Math.round(imgEl.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(imgEl, 0, 0, w, h)
    const id = ctx.getImageData(0, 0, w, h)
    return { pixels: { width: w, height: h, data: id.data }, preview: canvas.toDataURL('image/jpeg', 0.8) }
  } finally {
    URL.revokeObjectURL(url)
  }
}
