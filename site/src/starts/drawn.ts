import { sampledValue, smoothSamples, splineRadius } from '@/geometry/curves'
import { sectionFactor } from './shapes'
import type { StartModule } from './types'

// ---------------------------------------------------------------------------
export const draw: StartModule = {
  id: 'draw',
  name: 'Draw a profile',
  family: 'draw',
  blurb: 'Drag points to draw half of the silhouette — like an interpolated curve in Rhino — and spin it.',
  controls: [
    { key: 'height', label: 'Height', unit: 'mm', min: 40, max: 400, step: 1, help: 'Total height. Your points stretch to fit.' },
  ],
  defaults: { height: 200 },
  usesSection: true,
  representation: 'Your control points (height %, radius mm) → a smooth spline',
  steps: ['Sort points by height', 'Smooth spline through the points', 'Revolve the profile'],
  results: ['Any silhouette you can draw', 'Sharp changes = steep overhangs — the check tells you where'],
  field: (v, d) => ({
    height: v.height,
    radius: (t, theta) => Math.max(2, splineRadius(d.profilePoints, t)) * sectionFactor(v, t, theta),
  }),
}

// ---------------------------------------------------------------------------
export const sketch: StartModule = {
  id: 'sketch',
  name: 'Sketch',
  family: 'sketch',
  blurb: 'Draw the outline freehand — with a mouse, a finger or a pen. The app tidies it up.',
  controls: [
    { key: 'height', label: 'Height', unit: 'mm', min: 40, max: 400, step: 1, help: 'Total height.' },
    { key: 'width', label: 'Widest diameter', unit: 'mm', min: 30, max: 300, step: 1, help: 'The widest point of your sketch becomes this wide.' },
    { key: 'smoothing', label: 'Smoothing', unit: '%', min: 0, max: 1, step: 0.01, percent: true, help: 'Irons out the wobbles of a hand-drawn line.' },
  ],
  defaults: { height: 190, width: 130, smoothing: 0.35 },
  usesSection: true,
  representation: 'A freehand stroke → 64 radius samples, bottom to top',
  steps: ['Resample the stroke into rows', 'Smooth the wobbles', 'Scale to height and width', 'Revolve'],
  results: ['Hand-drawn character', 'Proportions come from your drawing, size from the sliders'],
  field: (v, d) => {
    const s = smoothSamples(d.sketch, v.smoothing)
    return { height: v.height, radius: (t, theta) => Math.max(2, (sampledValue(s, t) * v.width) / 2) * sectionFactor(v, t, theta) }
  },
}

// ---------------------------------------------------------------------------
export const image: StartModule = {
  id: 'image',
  name: 'From an image',
  family: 'image',
  blurb: 'Upload a photo or a drawing of a vase. The app finds its outline — and can borrow its colours.',
  controls: [
    { key: 'height', label: 'Height', unit: 'mm', min: 40, max: 400, step: 1, help: 'Total height.' },
    { key: 'width', label: 'Widest diameter', unit: 'mm', min: 30, max: 300, step: 1, help: 'The widest point of the outline becomes this wide.' },
    { key: 'threshold', label: 'Outline sensitivity', unit: '%', min: 0.05, max: 0.95, step: 0.01, percent: true, help: 'Which pixels count as "vase". Move it until the red outline fits.' },
    { key: 'smoothing', label: 'Smoothing', unit: '%', min: 0, max: 1, step: 0.01, percent: true, help: 'Irons out noise from the photo.' },
  ],
  defaults: { height: 190, width: 130, threshold: 0.5, smoothing: 0.25 },
  usesSection: true,
  representation: 'Image pixels → outline per row → 64 radius samples',
  steps: ['Grey-scale + threshold', 'Find left & right edge of every row', 'Smooth and scale', 'Revolve'],
  results: ['Silhouette borrowed from a reference', 'Colours can be taken from the image', 'Busy backgrounds confuse the outline'],
  field: (v, d) => {
    const s = smoothSamples(d.imageStart?.samples ?? [], v.smoothing)
    return { height: v.height, radius: (t, theta) => Math.max(2, (sampledValue(s, t) * v.width) / 2) * sectionFactor(v, t, theta) }
  },
}
