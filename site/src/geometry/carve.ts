import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { ADDITION, Brush, Evaluator, INTERSECTION, SUBTRACTION } from 'three-bvh-csg'
import type { Values } from '@/design/controls'
import { box, round, sphere } from '@/starts/shapes'
import { analyzeMesh } from './analyze'
import { buildFromField, type BuildOptions } from './buildVase'
import type { Field, Resolution, VaseMesh } from './types'

/** The starting solid of a carve, as a field (so it gets walls and patterns like any vase). */
export function carveBaseField(v: Values): Field {
  const size = v.size, h = v.height
  if (v.base === 1) {
    return box.field!({ width: size, depth: size, height: h, rounding: 0.2, taper: 1, bulge: 0, twist: 0 }, null as never)
  }
  if (v.base === 2) {
    return round.field!({ height: h, baseDiameter: size, bellyDiameter: size, topDiameter: size, bellyPosition: 0.5, sides: 0 }, null as never)
  }
  return sphere.field!({ diameter: size, squash: h / size, footDiameter: size * 0.55, openingDiameter: size * 0.45 }, null as never)
}

function cutterGeometry(v: Values, height: number): THREE.BufferGeometry {
  const s = v.cutterSize
  const long = Math.max(v.size, height) * 1.6
  let g: THREE.BufferGeometry
  if (v.cutter === 0) g = new THREE.SphereGeometry(s / 2, 40, 28)
  else if (v.cutter === 1) g = new THREE.CylinderGeometry(s / 2, s / 2, long, 40, 1)
  else g = new THREE.BoxGeometry(s, long, s)
  // Keep only positions + normals, as the evaluator expects the same attributes on both sides.
  g.deleteAttribute('uv')
  return g
}

/**
 * CARVE: hollow base solid  −  cutter(s)      (or keep only the overlap: ∩)
 * Uses three-bvh-csg, which splits triangles where the two solids intersect
 * and keeps the pieces that belong to the result.
 */
export function buildCarve(v: Values, opts: BuildOptions, res: Resolution): VaseMesh {
  const field = carveBaseField(v)
  const base = buildFromField(field, opts, res)

  const baseGeo = new THREE.BufferGeometry()
  baseGeo.setAttribute('position', new THREE.BufferAttribute(base.positions, 3))
  baseGeo.setIndex(new THREE.BufferAttribute(base.indices, 1))
  baseGeo.computeVertexNormals()

  const evaluator = new Evaluator()
  evaluator.attributes = ['position', 'normal']
  evaluator.useGroups = false

  const a = new Brush(baseGeo)
  a.updateMatrixWorld()

  // Build the cutter(s) and join copies arranged around the vase.
  const count = Math.max(1, Math.round(v.cutterCount))
  let cutter: Brush | null = null
  for (let i = 0; i < count; i++) {
    const b = new Brush(cutterGeometry(v, field.height))
    b.position.set(v.cutterX, v.cutterY * field.height, 0)
    // spin around the cutter's own long axis first, then tilt it over
    b.rotation.set(0, ((v.cutterSpin ?? 0) * Math.PI) / 180, (v.cutterTilt * Math.PI) / 180, 'ZYX')
    // rotate the whole copy around the vertical axis
    const pivot = new THREE.Matrix4().makeRotationY((i / count) * Math.PI * 2)
    b.updateMatrix()
    b.matrix.premultiply(pivot)
    b.matrix.decompose(b.position, b.quaternion, b.scale)
    b.updateMatrixWorld()
    cutter = cutter ? evaluator.evaluate(cutter, b, ADDITION) : b
    cutter.updateMatrixWorld()
  }

  const result = evaluator.evaluate(a, cutter!, v.operation === 1 ? INTERSECTION : SUBTRACTION)
  const g = result.geometry
  g.deleteAttribute('normal')
  const merged = mergeVertices(g, 1e-4)
  const positions = new Float32Array(merged.getAttribute('position').array as ArrayLike<number>)
  const indices = new Uint32Array(merged.getIndex()!.array as ArrayLike<number>)

  baseGeo.dispose(); g.dispose(); merged.dispose()
  return { positions, indices, stats: analyzeMesh(positions, indices, null) }
}
