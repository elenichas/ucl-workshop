import type { VaseMesh } from '@/geometry/types'
import type { MaterialProfile } from '@/config/materials'
import type { PrinterProfile } from '@/config/printers'
import type { Design } from '@/design/design'
import { getPattern } from '@/geometry/patterns'

/**
 * PRINTABILITY CHECKS
 * -------------------
 * Each rule looks at the measured vase + printer + material and answers:
 *   pass  — fine
 *   warn  — will probably print, but check
 *   fail  — will not print as is
 * Rules are small and independent, so you can add your own (see the challenge cards).
 * They read the measured mesh, not the sliders — so they work for every starting point.
 */
export type Verdict = 'pass' | 'warn' | 'fail'

export interface CheckResult {
  id: string
  title: string
  verdict: Verdict
  /** One sentence explaining why, with numbers */
  detail: string
}

export interface CheckInput {
  design: Design
  mesh: VaseMesh
  printer: PrinterProfile
  material: MaterialProfile
}

type Rule = (i: CheckInput) => CheckResult

const mm = (v: number) => `${v.toFixed(1)} mm`
const deg = (v: number) => `${Math.round(v)}°`

export const materialMatchesPrinter: Rule = ({ printer, material }) => {
  const ok = printer.materials.includes(material.id)
  return {
    id: 'material',
    title: 'Material and printer match',
    verdict: ok ? 'pass' : 'fail',
    detail: ok ? `${printer.name} can print ${material.name}.` : `${printer.name} cannot print ${material.name}.`,
  }
}

export const fitsBuildVolume: Rule = ({ mesh, printer }) => {
  const { width, depth, height } = mesh.stats
  // The vase may be turned on the bed, so compare the bigger side with the bigger side.
  const [a, b] = [width, depth].sort((p, q) => q - p)
  const [bx, by] = [printer.build.x, printer.build.y].sort((p, q) => q - p)
  const ok = a <= bx && b <= by && height <= printer.build.z
  const size = `${mm(width)} × ${mm(depth)} × ${mm(height)} tall`
  return {
    id: 'build-volume',
    title: 'Fits the printer',
    verdict: ok ? 'pass' : 'fail',
    detail: `${size} ${ok ? 'fits in' : 'does not fit in'} ${printer.build.x}×${printer.build.y}×${printer.build.z} mm.`,
  }
}

export const wallThickness: Rule = ({ mesh, printer, material, design }) => {
  const needed = Math.max(material.minWall, printer.nozzle * 2)
  const actual = mesh.stats.minWall ?? design.wall.wallThickness
  const measured = mesh.stats.minWall !== null
  let verdict: Verdict = actual >= needed ? 'pass' : actual >= needed * 0.75 ? 'warn' : 'fail'
  if (!measured && verdict === 'pass') verdict = 'warn'
  return {
    id: 'wall',
    title: 'Wall thickness',
    verdict,
    detail: measured
      ? `Thinnest wall is ${mm(actual)}; ${material.name} on this printer needs at least ${mm(needed)}.`
      : `Walls are ${mm(actual)} (needs ${mm(needed)}), but cuts can leave thinner edges — check the section view.`,
  }
}

export const overhang: Rule = ({ mesh, material }) => {
  const a = mesh.stats.maxOverhangDeg
  const limit = material.maxOverhang
  const verdict: Verdict = a <= limit ? 'pass' : a <= limit + 10 ? 'warn' : 'fail'
  return {
    id: 'overhang',
    title: 'Overhangs',
    verdict,
    detail:
      verdict === 'pass'
        ? `Steepest lean is ${deg(a)}; ${material.name} manages up to ${deg(limit)}.`
        : `The wall leans ${deg(a)} outward at ${mm(mesh.stats.maxOverhangAt)} high; ${material.name} manages about ${deg(limit)}. It may sag or collapse.`,
  }
}

export const stability: Rule = ({ mesh }) => {
  const { footprint, height, maxDiameter } = mesh.stats
  const footToHeight = footprint / height
  const footToWidest = footprint / maxDiameter
  const verdict: Verdict = footToHeight >= 0.3 && footToWidest >= 0.45 ? 'pass' : footToHeight >= 0.2 && footToWidest >= 0.3 ? 'warn' : 'fail'
  return {
    id: 'stability',
    title: 'Stands steady',
    verdict,
    detail:
      verdict === 'pass'
        ? `The foot (${mm(footprint)}) is wide enough for its height and width.`
        : `The foot (${mm(footprint)}) is small compared to the height (${mm(height)}) or the widest point (${mm(maxDiameter)}). It may tip over — or fall over while printing.`,
  }
}

export const detailSize: Rule = ({ design, printer, mesh }) => {
  const pattern = getPattern(design.surface.pattern)
  const depth = design.surface.values.depth ?? 0
  if (pattern.id === 'none' || depth <= 0) {
    return { id: 'detail', title: 'Surface detail', verdict: 'pass', detail: 'Smooth surface — nothing too small to print.' }
  }
  const feature = Math.min(depth, pattern.featureSize(design.surface.values, Math.PI * mesh.stats.maxDiameter * 0.8))
  const verdict: Verdict = feature >= printer.nozzle * 2 ? 'pass' : feature >= printer.nozzle ? 'warn' : 'fail'
  return {
    id: 'detail',
    title: 'Surface detail',
    verdict,
    detail:
      verdict === 'pass'
        ? `${pattern.name}: smallest detail about ${mm(feature)}, well above the ${mm(printer.nozzle)} nozzle.`
        : `${pattern.name}: details of about ${mm(feature)} are close to the ${mm(printer.nozzle)} nozzle — they will blur or vanish.`,
  }
}

export const colours: Rule = ({ design, printer, material }) => {
  if (design.finish.mode !== 'gradient') {
    return { id: 'colour', title: 'Colour', verdict: 'pass', detail: 'One colour — any printer can do it.' }
  }
  if (printer.multiColor) {
    return { id: 'colour', title: 'Colour', verdict: 'pass', detail: `${printer.name} can switch colours as it prints the layers.` }
  }
  if (printer.technology === 'paste') {
    return { id: 'colour', title: 'Colour', verdict: 'warn', detail: `A clay printer prints one clay. The gradient has to be made with glazes after the first firing.` }
  }
  return {
    id: 'colour',
    title: 'Colour',
    verdict: 'warn',
    detail: `${printer.name} prints one colour of ${material.name}. Use a multi-colour printer, or paint the gradient afterwards.`,
  }
}

export const closedShape: Rule = ({ mesh }) => ({
  id: 'closed',
  title: 'Closed, solid shape',
  verdict: mesh.stats.watertight ? 'pass' : 'warn',
  detail: mesh.stats.watertight
    ? 'Every edge is shared by two triangles — slicers will know what is inside.'
    : 'The cut left some open or doubled edges. Most slicers repair this, but check the file in your slicer.',
})

export const RULES: Rule[] = [materialMatchesPrinter, fitsBuildVolume, wallThickness, overhang, stability, detailSize, colours, closedShape]

export function runChecks(input: CheckInput): CheckResult[] {
  return RULES.map((rule) => rule(input))
}

export function overall(results: CheckResult[]): Verdict {
  if (results.some((r) => r.verdict === 'fail')) return 'fail'
  if (results.some((r) => r.verdict === 'warn')) return 'warn'
  return 'pass'
}

/** Weight, material use and a very rough print time. */
export function estimates({ mesh, printer, material }: Pick<CheckInput, 'mesh' | 'printer' | 'material'>) {
  const cm3 = mesh.stats.volume / 1000
  const grams = cm3 * material.density
  const hours = mesh.stats.volume / printer.flowRate / 3600
  return { cm3, grams, hours, firedScale: 1 - material.shrinkage }
}
