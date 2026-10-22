/**
 * PRINTER PROFILES
 * ----------------
 * We don't know yet which machines the lab has, so every printer is a profile.
 * When you find out, edit this list: delete the ones you don't have, add yours,
 * change the build volume and nozzle. The whole app (checks, material choices) follows.
 *
 * Values are typical for each category, not for a specific brand.
 */
export type Technology = 'fdm' | 'paste' | 'resin'

export interface PrinterProfile {
  id: string
  name: string
  /** One line a student understands */
  description: string
  technology: Technology
  /** Usable build volume in mm (x = width, y = depth, z = height) */
  build: { x: number; y: number; z: number }
  /** Nozzle diameter in mm (for resin printers: the smallest reliable feature) */
  nozzle: number
  /** Materials this machine can print */
  materials: string[]
  /** Typical speed of laying down material, in mm³ per second — for a rough time estimate */
  flowRate: number
  /** Can it print more than one colour in one object (e.g. a colour gradient)? */
  multiColor: boolean
}

export const PRINTERS: PrinterProfile[] = [
  {
    id: 'fdm-desktop',
    name: 'Desktop plastic printer',
    description: 'The common lab printer: melts a plastic filament through a 0.4 mm nozzle.',
    technology: 'fdm',
    build: { x: 250, y: 210, z: 220 },
    nozzle: 0.4,
    materials: ['pla', 'petg'],
    flowRate: 12,
    multiColor: false,
  },
  {
    id: 'fdm-multi',
    name: 'Multi-colour plastic printer',
    description: 'A desktop printer with a filament changer: it can switch colours layer by layer.',
    technology: 'fdm',
    build: { x: 256, y: 256, z: 256 },
    nozzle: 0.4,
    materials: ['pla', 'petg'],
    flowRate: 10,
    multiColor: true,
  },
  {
    id: 'fdm-large',
    name: 'Large-format plastic printer',
    description: 'A bigger plastic printer with a wider 0.8 mm nozzle — faster, less detail.',
    technology: 'fdm',
    build: { x: 400, y: 400, z: 450 },
    nozzle: 0.8,
    materials: ['pla', 'petg'],
    flowRate: 30,
    multiColor: false,
  },
  {
    id: 'clay',
    name: 'Clay (paste) printer',
    description: 'Pushes soft clay through a 2–3 mm nozzle. Walls must be thick, overhangs gentle.',
    technology: 'paste',
    build: { x: 300, y: 300, z: 400 },
    nozzle: 2.5,
    materials: ['stoneware', 'porcelain'],
    flowRate: 60,
    multiColor: false,
  },
  {
    id: 'resin',
    name: 'Resin printer',
    description: 'Cures liquid resin with light. Very fine detail, small build volume.',
    technology: 'resin',
    build: { x: 218, y: 123, z: 220 },
    nozzle: 0.1,
    materials: ['resin'],
    flowRate: 8,
    multiColor: false,
  },
]

export const getPrinter = (id: string) => PRINTERS.find((p) => p.id === id) ?? PRINTERS[0]
