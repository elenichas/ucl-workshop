import PptxGenJS from 'pptxgenjs'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { toPng } from 'html-to-image'
import { SlideView, SLIDE_W } from './SlideView'
import { stepsOf, type Slide } from './types'

/**
 * POWERPOINT EXPORT — built in the browser with PptxGenJS.
 * Text stays text (editable in PowerPoint). Diagrams and 3D views are rendered
 * offscreen in their final state and placed as images. Speaker notes go into
 * PowerPoint's notes field. Animations don't carry over: every point is visible.
 */
const C = { paper: 'F3EFE7', raised: 'FBF9F4', ink: '1C1A17', muted: '5E5850', line: 'D9D2C5', clay: 'A6482A' }
const DISPLAY = 'Georgia', BODY = 'Arial', MONO = 'Courier New'
const inch = (px: number) => px / (SLIDE_W / 13.333)
const pt = (px: number) => Math.round(px * 0.6)

export async function exportDeck(deck: Slide[], progress: (msg: string) => void) {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.title = 'Prompt to Print'
  pptx.company = 'UCL workshop'

  for (let i = 0; i < deck.length; i++) {
    progress(`Slide ${i + 1} of ${deck.length}…`)
    const s = deck[i]
    const slide = pptx.addSlide()
    slide.background = { color: C.paper }
    if (s.notes) slide.addNotes(s.notes)
    slide.addText(`${i + 1}`, { x: inch(1500), y: inch(850), w: inch(80), h: inch(30), fontFace: MONO, fontSize: 9, color: C.muted, align: 'right' })
    await addContent(slide, s)
  }
  progress('Saving file…')
  await pptx.writeFile({ fileName: 'Prompt-to-Print.pptx' })
}

type PSlide = PptxGenJS.Slide

function title(slide: PSlide, text: string, y = 80) {
  slide.addText(text, { x: inch(96), y: inch(y), w: inch(1408), h: inch(110), fontFace: DISPLAY, fontSize: pt(72), color: C.ink, valign: 'top', fit: 'shrink' })
}

async function addContent(slide: PSlide, s: Slide) {
  switch (s.kind) {
    case 'title': {
      slide.addText(s.meta ?? '', { x: inch(96), y: inch(80), w: inch(800), h: inch(40), fontFace: BODY, fontSize: 12, color: C.muted, charSpacing: 2 })
      slide.addText(s.title, { x: inch(96), y: inch(260), w: inch(760), h: inch(320), fontFace: DISPLAY, fontSize: pt(130), color: C.ink, valign: 'bottom', fit: 'shrink' })
      slide.addText(s.subtitle, { x: inch(96), y: inch(600), w: inch(760), h: inch(140), fontFace: BODY, fontSize: pt(36), color: C.muted, valign: 'top' })
      const img = await capture(s, '[data-export="vase"]')
      if (img) slide.addImage({ data: img.data, x: inch(890), y: 0, w: inch(710), h: inch(900) })
      return
    }
    case 'chapter':
      slide.addText(s.part.toUpperCase(), { x: inch(96), y: inch(80), w: inch(1200), h: inch(40), fontFace: BODY, fontSize: 12, color: C.muted, charSpacing: 2 })
      slide.addText(s.number, { x: inch(96), y: inch(250), w: inch(300), h: inch(70), fontFace: MONO, fontSize: pt(44), color: C.clay })
      slide.addText(s.title, { x: inch(96), y: inch(330), w: inch(1300), h: inch(300), fontFace: DISPLAY, fontSize: pt(130), color: C.ink, valign: 'top', fit: 'shrink' })
      slide.addText(s.summary, { x: inch(96), y: inch(700), w: inch(1300), h: inch(120), fontFace: BODY, fontSize: pt(28), color: C.muted, valign: 'top' })
      return
    case 'statement':
      slide.addText(s.text, { x: inch(112), y: inch(160), w: inch(1300), h: inch(400), fontFace: DISPLAY, fontSize: pt(96), color: C.ink, valign: 'bottom', fit: 'shrink' })
      if (s.sub) slide.addText(s.sub, { x: inch(112), y: inch(600), w: inch(1200), h: inch(200), fontFace: BODY, fontSize: pt(30), color: C.muted, valign: 'top' })
      return
    case 'bullets':
      title(slide, s.title)
      slide.addText(
        s.points.map((p, i) => ({ text: p, options: { bullet: { type: 'number' as const, numberStartAt: i === 0 ? 1 : undefined }, paraSpaceAfter: 14 } })),
        { x: inch(96), y: inch(250), w: inch(1408), h: inch(520), fontFace: BODY, fontSize: pt(38), color: C.ink, valign: 'top' },
      )
      if (s.aside) slide.addText(s.aside, { x: inch(96), y: inch(800), w: inch(1408), h: inch(40), fontFace: MONO, fontSize: pt(22), color: C.muted })
      return
    case 'compare':
      title(slide, s.title)
      ;[s.left, s.right].forEach((col, i) => {
        slide.addText(col.label.toUpperCase(), { x: inch(96 + i * 730), y: inch(260), w: inch(680), h: inch(40), fontFace: BODY, fontSize: 13, color: i ? C.clay : C.muted, charSpacing: 2 })
        slide.addText(col.points.map((p) => ({ text: p, options: { bullet: true, paraSpaceAfter: 10 } })), { x: inch(96 + i * 730), y: inch(320), w: inch(680), h: inch(480), fontFace: BODY, fontSize: pt(32), color: C.ink, valign: 'top' })
      })
      return
    case 'table': {
      title(slide, s.title)
      const rows: PptxGenJS.TableRow[] = [
        s.head.map((h) => ({ text: h.toUpperCase(), options: { bold: false, fontSize: 11, color: C.muted, charSpacing: 1, border: [{ type: 'none' }, { type: 'none' }, { pt: 1.5, color: C.ink }, { type: 'none' }] } })),
        ...s.rows.map((r) => r.map((c, j) => ({ text: c, options: { fontSize: pt(27), color: j === 0 ? C.ink : C.muted, bold: j === 0, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: C.line }, { type: 'none' }] } }))),
      ] as PptxGenJS.TableRow[]
      slide.addTable(rows, { x: inch(96), y: inch(250), w: inch(1408), fontFace: BODY, valign: 'top', margin: [6, 8, 6, 0] })
      return
    }
    case 'code':
      title(slide, s.title)
      slide.addText((s.lang === 'prompt' ? 'PROMPT\n' : '') + s.code, {
        x: inch(96), y: inch(260), w: inch(1408), h: inch(420), fontFace: MONO, fontSize: pt(26), color: C.ink, valign: 'top',
        fill: { color: C.raised }, line: { color: s.lang === 'prompt' ? C.clay : C.line, width: 1 }, margin: 18,
      })
      if (s.caption) slide.addText(s.caption, { x: inch(96), y: inch(710), w: inch(1408), h: inch(80), fontFace: BODY, fontSize: pt(26), color: C.muted })
      return
    case 'visual': {
      title(slide, s.title)
      const img = await capture(s, '.visual-area')
      if (img) place(slide, img, { x: 96, y: 230, w: 1408, h: s.caption ? 570 : 620 })
      if (s.caption) slide.addText(s.caption, { x: inch(96), y: inch(820), w: inch(1408), h: inch(50), fontFace: BODY, fontSize: pt(22), color: C.muted })
      return
    }
    case 'vase': {
      slide.addText(s.title, { x: inch(96), y: inch(96), w: inch(560), h: inch(300), fontFace: DISPLAY, fontSize: pt(66), color: C.ink, valign: 'top', fit: 'shrink' })
      if (s.caption) slide.addText(s.caption, { x: inch(96), y: inch(420), w: inch(560), h: inch(140), fontFace: BODY, fontSize: pt(26), color: C.muted, valign: 'top' })
      slide.addText(s.designs.map((d) => ({ text: d.label, options: { bullet: true } })), { x: inch(96), y: inch(600), w: inch(560), h: inch(220), fontFace: BODY, fontSize: pt(26), color: C.muted, valign: 'bottom' })
      const img = await capture(s, '[data-export="vase"]')
      if (img) slide.addImage({ data: img.data, x: inch(690), y: 0, w: inch(910), h: inch(900) })
      return
    }
    case 'images': {
      title(slide, s.title)
      for (let i = 0; i < s.images.length; i++) {
        const data = await urlToDataUrl(`${import.meta.env.BASE_URL}${s.images[i].src}`)
        if (data) slide.addImage({ data, x: inch(96 + i * 724), y: inch(240), w: inch(684), h: inch(540), sizing: { type: 'cover', w: inch(684), h: inch(540) } })
        slide.addText(s.images[i].label, { x: inch(96 + i * 724), y: inch(790), w: inch(684), h: inch(40), fontFace: MONO, fontSize: pt(22), color: C.muted })
      }
      return
    }
  }
}

/** Fit an image inside a box, keeping its proportions. */
function place(slide: PSlide, img: { data: string; w: number; h: number }, box: { x: number; y: number; w: number; h: number }) {
  const k = Math.min(box.w / img.w, box.h / img.h)
  const w = img.w * k, h = img.h * k
  slide.addImage({ data: img.data, x: inch(box.x + (box.w - w) / 2), y: inch(box.y + (box.h - h) / 2), w: inch(w), h: inch(h) })
}

/** Render a slide offscreen in its final state and take a picture of one part of it. */
async function capture(s: Slide, selector: string): Promise<{ data: string; w: number; h: number } | null> {
  const host = document.createElement('div')
  host.className = 'export-host'
  host.style.cssText = 'position:fixed;left:-20000px;top:0;width:1600px;height:900px;pointer-events:none'
  document.body.appendChild(host)
  const root = createRoot(host)
  try {
    root.render(createElement(SlideView, { slide: s, step: stepsOf(s), exporting: true }))
    await wait(s.kind === 'visual' ? 250 : 1100) // 3D needs a moment to draw
    const node = host.querySelector(selector) as HTMLElement | null
    if (!node) return null
    // SVG colours come from CSS classes; copy the final colours onto each shape
    // so the picture keeps them (otherwise shapes turn black).
    node.querySelectorAll<SVGElement>('svg *').forEach((el) => {
      const cs = getComputedStyle(el)
      el.style.fill = cs.fill
      el.style.stroke = cs.stroke
      el.style.opacity = cs.opacity
    })
    const data = await toPng(node, { pixelRatio: 1.5, cacheBust: true, backgroundColor: '#' + C.paper })
    return { data, w: node.offsetWidth, h: node.offsetHeight }
  } catch (e) {
    console.warn('Could not capture slide', e)
    return null
  } finally {
    root.unmount()
    host.remove()
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function urlToDataUrl(url: string): Promise<string | null> {
  try {
    const blob = await (await fetch(url)).blob()
    return await new Promise((resolve) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}
