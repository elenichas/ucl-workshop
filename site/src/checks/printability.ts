import type { VaseMesh, VaseParams } from '@/geometry/types'
import type { MaterialProfile } from '@/config/materials'
import type { PrinterProfile } from '@/config/printers'

/**
 * PRINTABILITY CHECKS
 * -------------------
 * Each rule looks at the vase + printer + material and answers:
 *   pass  — fine
 *   warn  — will probably print, but check
 *   fail  — will not print as is
 * Rules are small and independent, so you can add your own (see hands-on challenge cards).
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
  params: VaseParams
  mesh: VaseMesh
  printer: PrinterProfile
  material: MaterialProfile
}

type Rule = (i: CheckInput) => CheckResult

const mm = (v: number) => `${v.toFixed(1)} mm`
const deg = (v: number) => `${Math.round(v)}°`

export const fitsBuildVolume: Rule = ({ params, mesh, printer }) => {
  const d = mesh.stats.maxDiameter
  const fitsXY = d <= Math.min(printer.build.x, printer.build.y)
  const fitsZ = params.height <= printer.build.z
  const ok = fitsXY && fitsZ
  return {
    id: 'build-volume',
    title: 'Fits the printer',
    verdict: ok ? 'pass' : 'fail',
    detail: ok
      ? `${mm(d)} wide × ${mm(params.height)} tall fits in ${printer.build.x}×${printer.build.y}×${printer.build.z} mm.`
      : `${mm(d)} wide × ${mm(params.height)} tall does not fit in ${printer.build.x}×${printer.build.y}×${printer.build.z} mm.`,
  }
}

export const wallThickness: Rule = ({ mesh, printer, material }) => {
  const needed = Math.max(material.minWall, printer.nozzle * 2)
  const actual = mesh.stats.minWall
  const verdict: Verdict = actual >= needed ? 'pass' : actual >= needed * 0.75 ? 'warn' : 'fail'
  return {
    id: 'wall',
    title: 'Wall thickness',
    verdict,
    detail: `Thinnest wall is ${mm(actual)}; ${material.name} on this printer needs at least ${mm(needed)}.`,
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

export const stability: Rule = ({ params, mesh }) => {
  const footToHeight = params.baseDiameter / params.height
  const footToWidest = params.baseDiameter / mesh.stats.maxDiameter
  const verdict: Verdict = footToHeight >= 0.3 && footToWidest >= 0.45 ? 'pass' : footToHeight >= 0.2 && footToWidest >= 0.3 ? 'warn' : 'fail'
  return {
    id: 'stability',
    title: 'Stands steady',
    verdict,
    detail:
      verdict === 'pass'
        ? `The base is wide enough for its height and width.`
        : `The base (${mm(params.baseDiameter)}) is small compared to the height (${mm(params.height)}) or the widest point (${mm(mesh.stats.maxDiameter)}). It may tip over — or fall over while printing.`,
  }
}

export const detailSize: Rule = ({ params, printer }) => {
  const smallest = Math.min(params.ribCount > 0 ? params.ribDepth : Infinity, params.waveCount > 0 ? params.waveDepth : Infinity)
  if (!Number.isFinite(smallest) || smallest === 0) {
    return { id: 'detail', title: 'Surface detail', verdict: 'pass', detail: 'Smooth surface — nothing too small to print.' }
  }
  const verdict: Verdict = smallest >= printer.nozzle * 2 ? 'pass' : smallest >= printer.nozzle ? 'warn' : 'fail'
  return {
    id: 'detail',
    title: 'Surface detail',
    verdict,
    detail:
      verdict === 'pass'
        ? `Ribs and ripples (${mm(smallest)}) are well above the ${mm(printer.nozzle)} nozzle.`
        : `Ribs or ripples of ${mm(smallest)} are close to the ${mm(printer.nozzle)} nozzle — they will look blurry or vanish.`,
  }
}

export const materialMatchesPrinter: Rule = ({ printer, material }) => {
  const ok = printer.materials.includes(material.id)
  return {
    id: 'material',
    title: 'Material and printer match',
    verdict: ok ? 'pass' : 'fail',
    detail: ok ? `${printer.name} can print ${material.name}.` : `${printer.name} cannot print ${material.name}.`,
  }
}

export const RULES: Rule[] = [materialMatchesPrinter, fitsBuildVolume, wallThickness, overhang, stability, detailSize]

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
