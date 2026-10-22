import type { ControlDef, Values } from '@/design/controls'
import type { Field } from '@/geometry/types'
import type { Design } from '@/design/design'

export type StartId = 'round' | 'sphere' | 'box' | 'polygon' | 'cone' | 'draw' | 'sketch' | 'image' | 'carve'

/**
 * A STARTING POINT
 * ----------------
 * Each way of starting a vase is one small module. It declares:
 * - which controls it exposes (the UI is generated from this),
 * - how it describes the form (its "representation"),
 * - which algorithm steps it adds before the shared pipeline,
 * - what changes in the results,
 * - and a function that turns its values into a Field.
 * The system map in the app and the course is drawn from these same declarations.
 */
export interface StartModule {
  id: StartId
  name: string
  /** Which group it appears in on the start screen */
  family: 'shape' | 'draw' | 'sketch' | 'image' | 'carve'
  blurb: string
  controls: ControlDef[]
  defaults: Values
  /** Adds the shared cross-section controls (sides, star, softness, section twist) */
  usesSection: boolean
  /** How the form is described, in one line */
  representation: string
  /** Steps this start adds before the shared pipeline */
  steps: string[]
  /** What is different about the results */
  results: string[]
  /** Values → field. Carve has no field of its own (it builds one and cuts it). */
  field?: (values: Values, design: Design) => Field
}
