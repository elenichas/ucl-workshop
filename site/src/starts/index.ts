import { box, cone, polygon, round, sphere } from './shapes'
import { draw, image, sketch } from './drawn'
import { carve } from './carve'
import type { StartId, StartModule } from './types'

/** Every way to start a vase. Add a module here and it appears in the app and the system map. */
export const STARTS: StartModule[] = [round, sphere, box, polygon, cone, draw, sketch, image, carve]

export const getStart = (id: StartId) => STARTS.find((s) => s.id === id) ?? round

export const FAMILIES: { id: StartModule['family']; name: string; blurb: string }[] = [
  { id: 'shape', name: 'A shape', blurb: 'Pick a simple solid and adjust it.' },
  { id: 'draw', name: 'Draw a profile', blurb: 'Drag points on half the silhouette.' },
  { id: 'sketch', name: 'Sketch', blurb: 'Draw the outline freehand.' },
  { id: 'image', name: 'An image', blurb: 'Use a photo or drawing for the outline and colours.' },
  { id: 'carve', name: 'Carve', blurb: 'Cut a solid with another shape.' },
]

export type { StartId, StartModule }
