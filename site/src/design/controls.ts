/**
 * A control the configurator exposes. The UI is generated from these definitions,
 * and so is the system map — one source of truth.
 */
export interface NumberControl {
  kind?: 'number'
  key: string
  label: string
  unit: string
  min: number
  max: number
  step: number
  help: string
  /** shown ×100 with a % sign */
  percent?: boolean
}

export interface ChoiceControl {
  kind: 'choice'
  key: string
  label: string
  options: { value: number; label: string }[]
  help: string
}

export type ControlDef = NumberControl | ChoiceControl

export type Values = Record<string, number>

export const defaultsOf = (controls: ControlDef[], overrides: Values = {}): Values => {
  const v: Values = {}
  for (const c of controls) v[c.key] = c.kind === 'choice' ? c.options[0].value : (c.min + c.max) / 2
  return { ...v, ...overrides }
}

/** Shared cross-section controls for starting points that are defined by a profile. */
export const SECTION_CONTROLS: ControlDef[] = [
  { key: 'sides', label: 'Cross-section sides', unit: '', min: 0, max: 12, step: 1, help: '0 = round. 3–12 turns every horizontal slice into a polygon.' },
  { key: 'star', label: 'Star depth', unit: '%', min: 0, max: 0.6, step: 0.01, percent: true, help: 'Pulls every other corner inwards — polygon becomes a star.' },
  { key: 'softness', label: 'Softness', unit: '%', min: 0, max: 1, step: 0.01, percent: true, help: 'Blends the polygon back towards a circle.' },
  { key: 'sectionTwist', label: 'Section twist', unit: '°', min: -180, max: 180, step: 1, help: 'Rotates the cross-section from bottom to top.' },
]

export const SECTION_DEFAULTS: Values = { sides: 0, star: 0, softness: 0, sectionTwist: 0 }
