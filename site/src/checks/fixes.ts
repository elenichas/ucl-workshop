import { MATERIALS } from '@/config/materials'
import { PRINTERS } from '@/config/printers'
import { getPattern } from '@/geometry/patterns'
import { getStart } from '@/starts'
import type { CheckInput, CheckResult } from './printability'

/**
 * HOW TO FIX IT
 * -------------
 * For every check that warns or fails, a few concrete things to try, with numbers.
 * Each suggestion names the step (Form, Surface, Finish, Make) and the control to change,
 * so a student can act on it without guessing. Passing checks get no suggestions.
 */

const mm = (v: number) => `${Math.ceil(v)} mm`
const mm1 = (v: number) => `${(Math.ceil(v * 10) / 10).toFixed(1)} mm`

/** The label of the first control of the current start that matches one of the keys. */
function control(input: CheckInput, keys: string[]): string | undefined {
  return getStart(input.design.start).controls.find((c) => keys.includes(c.key))?.label
}

/** How to change the outline when the start has no slider for it. */
function reshape(input: CheckInput, what: string): string {
  switch (input.design.start) {
    case 'draw': return `On the Form step, drag the profile points to ${what}.`
    case 'sketch': return `On the Form step, redraw the outline to ${what}.`
    case 'image': return `Use an image whose outline will ${what}, or adjust it on the Form step.`
    case 'carve': return `On the Form step, change the start solid or the cutter to ${what}.`
    default: return `On the Form step, change the shape to ${what}.`
  }
}

function materialFixes({ printer, material }: CheckInput): string[] {
  const usable = MATERIALS.filter((m) => printer.materials.includes(m.id)).map((m) => m.name)
  const printers = PRINTERS.filter((p) => p.materials.includes(material.id)).map((p) => p.name)
  return [
    `On the Make step, choose a material this printer can use: ${usable.join(' or ')}.`,
    ...(printers.length ? [`Or keep ${material.name} and choose a printer that prints it: ${printers.join(' or ')}.`] : []),
  ]
}

function buildVolumeFixes(input: CheckInput): string[] {
  const { mesh, printer, material } = input
  const { width, depth, height } = mesh.stats
  const [a, b] = [width, depth].sort((p, q) => q - p)
  const [bx, by] = [printer.build.x, printer.build.y].sort((p, q) => q - p)
  const scale = Math.min(bx / a, by / b, printer.build.z / height, 1)
  const out: string[] = []
  if (height > printer.build.z) {
    const h = control(input, ['height'])
    out.push(h ? `On the Form step, lower ${h} to ${mm(printer.build.z)} or less.` : reshape(input, `make it at most ${mm(printer.build.z)} tall`))
  }
  if (a > bx || b > by) {
    out.push(reshape(input, `make it narrower, so the widest part fits within ${bx} × ${by} mm`))
  }
  out.push(`Scaling the whole vase to about ${Math.floor(scale * 100)} % would make it fit.`)
  const bigger = PRINTERS.filter((p) => {
    const [px, py] = [p.build.x, p.build.y].sort((m, n) => n - m)
    return p.id !== printer.id && p.materials.includes(material.id) && a <= px && b <= py && height <= p.build.z
  })
  if (bigger.length) out.push(`Or, on the Make step, choose a bigger printer: ${bigger.map((p) => `${p.name} (${p.build.x}×${p.build.y}×${p.build.z} mm)`).join(', ')}.`)
  return out
}

function wallFixes(input: CheckInput): string[] {
  const { mesh, printer, material, design } = input
  const needed = Math.max(material.minWall, printer.nozzle * 2)
  const measured = mesh.stats.minWall
  const out: string[] = []
  // If something (a pattern, a cut) makes the wall thinner than the slider, raise the slider by the difference.
  const loss = measured !== null ? Math.max(0, design.wall.wallThickness - measured) : 0
  out.push(`On the Make step, raise Wall thickness to at least ${mm1(needed + loss)}.`)
  if (loss > 0.2) {
    const pattern = getPattern(design.surface.pattern)
    if (pattern.id !== 'none') out.push(`The ${pattern.name} pattern thins the wall by about ${mm1(loss)}: lower its Depth on the Surface step.`)
    if (design.start === 'carve') out.push('Cuts that only graze the wall leave thin edges: move the cutter so it cuts cleanly through, or not at all.')
  }
  const thinner = MATERIALS.filter((m) => printer.materials.includes(m.id) && Math.max(m.minWall, printer.nozzle * 2) <= (measured ?? design.wall.wallThickness))
  if (thinner.length) out.push(`Or choose a material that is fine with this wall: ${thinner.map((m) => m.name).join(' or ')}.`)
  return out
}

function overhangFixes(input: CheckInput): string[] {
  const { mesh, printer, material, design } = input
  const at = mesh.stats.maxOverhangAt
  const out: string[] = []
  const foot = control(input, ['baseDiameter', 'footDiameter'])
  const widest = control(input, ['bellyDiameter', 'diameter'])
  if (foot && widest) out.push(`On the Form step, make the wall lean less around ${mm(at)} high: a larger ${foot} or a smaller ${widest}.`)
  else if (foot) out.push(`On the Form step, make the wall lean less around ${mm(at)} high, for example with a larger ${foot}.`)
  else out.push(reshape(input, `make the wall lean less around ${mm(at)} high`))
  const pattern = getPattern(design.surface.pattern)
  if (pattern.id !== 'none' && (design.surface.values.depth ?? 0) > 0) out.push(`Deep patterns add their own ledges: lower the ${pattern.name} Depth on the Surface step.`)
  const better = MATERIALS.filter((m) => printer.materials.includes(m.id) && m.maxOverhang >= mesh.stats.maxOverhangDeg && m.id !== material.id)
  if (better.length) out.push(`Or choose a material that holds steeper walls: ${better.map((m) => `${m.name} (up to ${m.maxOverhang}°)`).join(', ')}.`)
  else {
    const elsewhere = MATERIALS.filter((m) => m.maxOverhang >= mesh.stats.maxOverhangDeg && !printer.materials.includes(m.id))
    if (elsewhere.length) out.push(`Or print it on another printer, in a material that holds steeper walls: ${elsewhere.map((m) => `${m.name} (up to ${m.maxOverhang}°)`).join(', ')}.`)
  }
  return out
}

function stabilityFixes(input: CheckInput): string[] {
  const { footprint, height, maxDiameter } = input.mesh.stats
  const neededFoot = Math.max(0.3 * height, 0.45 * maxDiameter)
  const maxHeight = footprint / 0.3
  const out: string[] = []
  const foot = control(input, ['baseDiameter', 'footDiameter', 'width', 'diameter'])
  out.push(foot ? `On the Form step, widen the foot to about ${mm(neededFoot)} (${foot}).` : reshape(input, `give it a foot of about ${mm(neededFoot)}`))
  if (height > maxHeight) {
    const h = control(input, ['height'])
    out.push(h ? `Or lower ${h} to about ${mm(maxHeight)}.` : `Or make it lower: about ${mm(maxHeight)} tall.`)
  }
  if (footprint < 0.45 * maxDiameter) out.push(`Or make the widest part smaller: about ${mm(footprint / 0.45)} across.`)
  return out
}

function detailFixes(input: CheckInput): string[] {
  const { printer, design } = input
  const pattern = getPattern(design.surface.pattern)
  const target = printer.nozzle * 2
  const out = [
    `On the Surface step, make the ${pattern.name} pattern bolder: details need about ${mm1(target)} (twice the ${mm1(printer.nozzle)} nozzle). Raise Depth, or use fewer, larger repeats.`,
  ]
  const finer = PRINTERS.filter((p) => p.nozzle < printer.nozzle && p.materials.includes(input.material.id))
  if (finer.length) out.push(`Or choose a printer with a finer nozzle: ${finer.map((p) => `${p.name} (${mm1(p.nozzle)})`).join(', ')}.`)
  out.push(`Or set the pattern to None for a smooth surface.`)
  return out
}

function colourFixes({ printer }: CheckInput): string[] {
  const multi = PRINTERS.filter((p) => p.multiColor).map((p) => p.name)
  if (printer.technology === 'paste') {
    return ['Glaze the gradient by hand after the first (bisque) firing.', 'Or switch the Finish step to one colour.']
  }
  return [
    ...(multi.length ? [`On the Make step, choose ${multi.join(' or ')}.`] : []),
    'Or switch the Finish step to one colour.',
    'Or print in one colour and paint the gradient afterwards.',
  ]
}

function closedFixes(input: CheckInput): string[] {
  return [
    'Download the file and open it in your slicer: most slicers repair small gaps on their own.',
    ...(input.design.start === 'carve' ? ['Move the cutter so it does not just touch the surface or an edge; clean cuts close better.'] : []),
    'A slightly thicker wall (Make step) often closes the gaps.',
  ]
}

const FIXES: Record<string, (i: CheckInput) => string[]> = {
  material: materialFixes,
  'build-volume': buildVolumeFixes,
  wall: wallFixes,
  overhang: overhangFixes,
  stability: stabilityFixes,
  detail: detailFixes,
  colour: colourFixes,
  closed: closedFixes,
}

/** Suggestions for one result. Empty for a pass. */
export function fixesFor(result: CheckResult, input: CheckInput): string[] {
  if (result.verdict === 'pass') return []
  return FIXES[result.id]?.(input) ?? []
}
