import { useMemo } from 'react'
import { Html, Line } from '@react-three/drei'
import type { VaseMesh } from '@/geometry/types'
import { usePrefersDark } from '@/state/usePrefersDark'

type V3 = [number, number, number]

/**
 * Dimension lines drawn in the 3D view, like dimensions in a Rhino viewport.
 * Height, width and depth always; then either the radius (round plan) or the
 * plan diagonal (boxes, polygons, stars). All values in millimetres.
 */
export function Dimensions({ mesh }: { mesh: VaseMesh }) {
  const pal = usePrefersDark() ? DARK : LIGHT
  const m = useMemo(() => measure(mesh.positions), [mesh])
  const size = Math.max(m.maxY - m.minY, m.maxX - m.minX, m.maxZ - m.minZ)
  const gap = size * 0.08 // distance between the object and its dimension lines
  const tick = size * 0.025
  const width = m.maxX - m.minX
  const depth = m.maxZ - m.minZ
  const height = m.maxY - m.minY
  // A round plan reaches the same distance from the axis in every direction; a box reaches further at its corners.
  const round = m.rMax * 2 <= Math.max(width, depth) * 1.03
  const diagonal = Math.hypot(width, depth)

  const xR = m.maxX + gap
  const zF = m.maxZ + gap
  const y0 = m.minY

  return (
    <group>
      {/* height: a vertical line at the back-right corner, so it stands beside the vase rather than in front of it */}
      <Dim from={[xR, m.minY, m.minZ]} to={[xR, m.maxY, m.minZ]} tickDir={[1, 0, 0]} tick={tick} label={`H ${fmt(height)}`}  pal={pal} />
      {/* width: along x, on the floor in front */}
      <Dim from={[m.minX, y0, zF]} to={[m.maxX, y0, zF]} tickDir={[0, 0, 1]} tick={tick} label={`W ${fmt(width)}`}  pal={pal} />
      {/* depth: along z, on the floor to the right */}
      <Dim from={[xR, y0, m.minZ]} to={[xR, y0, m.maxZ]} tickDir={[1, 0, 0]} tick={tick} label={`D ${fmt(depth)}`}  pal={pal} />
      {round ? (
        <>
          {/* radius at the widest point, from the axis outwards */}
          <Line points={[[0, m.minY, 0], [0, m.maxY, 0]]} color={pal.axis} lineWidth={1.2} dashed dashSize={tick} gapSize={tick * 0.8} depthTest={false} renderOrder={10} />
          <Dim from={[0, m.yAtRMax, 0]} to={[m.rMax * Math.cos(m.aAtRMax), m.yAtRMax, m.rMax * Math.sin(m.aAtRMax)]} tick={0} label={`R ${fmt(m.rMax)}`} accent  pal={pal} />
        </>
      ) : (
        <Dim from={[m.minX, y0, m.minZ]} to={[m.maxX, y0, m.maxZ]} tick={0} label={`Diagonal ${fmt(diagonal)}`} accent  pal={pal} />
      )}
    </group>
  )
}

// Each line gets a thin halo in the opposite tone, so it reads over the background and over a dark or light vase.
type Palette = { ink: string; accent: string; axis: string; halo: string }
const LIGHT: Palette = { ink: '#000000', accent: '#7A5300', axis: '#4F5652', halo: '#F7F8F6' }
const DARK: Palette = { ink: '#F2F3F1', accent: '#FFC21A', axis: '#A3AAA6', halo: '#1A1D1C' }
const fmt = (mm: number) => `${mm.toFixed(0)} mm`

function Dim({ from, to, tick, tickDir = [0, 0, 1], label, accent, pal }: { from: V3; to: V3; tick: number; tickDir?: V3; label: string; accent?: boolean; pal: Palette }) {
  const color = accent ? pal.accent : pal.ink
  const mid: V3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]
  const t = (p: V3): [V3, V3] => [
    [p[0] - tickDir[0] * tick, p[1] - tickDir[1] * tick, p[2] - tickDir[2] * tick],
    [p[0] + tickDir[0] * tick, p[1] + tickDir[1] * tick, p[2] + tickDir[2] * tick],
  ]
  return (
    <group>
      {[[from, to] as [V3, V3], ...(tick > 0 ? [t(from), t(to)] : [])].map((pts, i) => (
        <group key={i}>
          <Line points={pts} color={pal.halo} lineWidth={4.5} depthTest={false} renderOrder={10} />
          <Line points={pts} color={color} lineWidth={1.8} depthTest={false} renderOrder={11} />
        </group>
      ))}
      <Html position={mid} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <span
          className="whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[11px] leading-none tabular-nums"
          style={{ borderColor: color, color, background: pal.halo }}
        >
          {label}
        </span>
      </Html>
    </group>
  )
}

/** Bounding box, plus the widest distance from the vertical axis and where it happens. */
function measure(p: Float32Array) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity
  let rMax = 0, yAtRMax = 0
  for (let i = 0; i < p.length; i += 3) {
    const x = p[i], y = p[i + 1], z = p[i + 2]
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
    const r = Math.hypot(x, z)
    if (r > rMax) { rMax = r; yAtRMax = y }
  }
  // Draw the radius towards the front-right, the side the camera looks from, so it is easy to read.
  const aAtRMax = Math.PI / 4
  return { minX, maxX, minY, maxY, minZ, maxZ, rMax, yAtRMax, aAtRMax }
}
