import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { VaseMesh } from '@/geometry/types'
import { Dimensions } from './Dimensions'

export interface ViewerLook {
  color: string
  roughness: number
  metalness: number
  /** 0–1: clearcoat makes glazed ceramic / shiny resin read as glossy */
  clearcoat: number
  /** Second colour: the vase fades from `color` at the bottom to `colorB` at the top */
  colorB?: string
  gradient?: boolean
  /** Dark flecks, like a speckled clay body under glaze */
  speckle?: boolean
  /** Draw print layer lines this far apart (mm). 0 or undefined = smooth. */
  layer?: number
}

export type CameraView = 'front' | 'top' | 'three-quarter'

interface Props {
  mesh: VaseMesh
  height: number
  look: ViewerLook
  showSection?: boolean
  /** Draw height, width, depth and radius / diagonal dimension lines */
  showDimensions?: boolean
  view?: CameraView
  /** changes every time the user asks for a camera preset, so the same view can be re-applied */
  viewNonce?: number
  /** Background colour of the 3D stage */
  stage?: string
  /** Text alternative for screen readers */
  description: string
}

/**
 * The 3D viewer. Like Rhino's viewport, but it runs in the browser on the
 * graphics card (WebGL), so anyone with a link can orbit the vase.
 *
 * Performance choices (see course chapter 08):
 * - frameloop="demand": only redraw when something changes, not 60×/second
 * - dpr capped at 2: very sharp screens would otherwise draw 9× the pixels
 * - geometry is rebuilt only when the mesh changes, and the old one is disposed
 * - ContactShadows rendered once (frames=1) instead of real-time shadows
 */
export function VaseViewer({ mesh, height, look, showSection, showDimensions, view = 'three-quarter', viewNonce = 0, stage = '#DCDFDB', description }: Props) {
  // Frame the camera on whichever is bigger: the height or the width of the vase.
  const size = Math.max(height, mesh.stats.maxDiameter * 1.15)
  return (
    <div className="relative h-full w-full" role="img" aria-label={description}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ fov: 30, near: 1, far: 5000, position: [0, height * 0.9, size * 2.6] }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color key={stage} attach="background" args={[stage]} />
        <hemisphereLight args={['#ffffff', '#a9b0ac', 1.1]} />
        <directionalLight position={[200, 400, 250]} intensity={2.2} />
        <directionalLight position={[-300, 150, -200]} intensity={0.6} />
        <VaseObject mesh={mesh} look={look} showSection={!!showSection} />
        {showDimensions && <Dimensions mesh={mesh} />}
        <ContactShadows position={[0, 0, 0]} scale={height * 2.5} far={height} blur={2.2} opacity={0.45} frames={1} key={mesh.stats.volume} />
        <Controls height={height} size={size} view={view} viewNonce={viewNonce} />
      </Canvas>
    </div>
  )
}

function VaseObject({ mesh, look, showSection }: { mesh: VaseMesh; look: ViewerLook; showSection: boolean }) {
  const invalidate = useThree((s) => s.invalidate)
  const gl = useThree((s) => s.gl)

  // Turn our plain arrays into a three.js geometry. Rebuilt only when the mesh changes.
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(mesh.positions, 3))
    g.setIndex(new THREE.BufferAttribute(mesh.indices, 1))
    g.computeVertexNormals()
    g.computeBoundingSphere()
    return g
  }, [mesh])

  // Per-point colours for gradients and speckle (otherwise one colour for the whole mesh).
  const useVertexColors = !!(look.gradient || look.speckle)
  useEffect(() => {
    if (!useVertexColors) {
      geometry.deleteAttribute('color')
      return
    }
    const pos = geometry.getAttribute('position')
    const a = new THREE.Color(look.color), b = new THREE.Color(look.gradient ? look.colorB ?? look.color : look.color)
    let minY = Infinity, maxY = -Infinity
    for (let i = 0; i < pos.count; i++) { minY = Math.min(minY, pos.getY(i)); maxY = Math.max(maxY, pos.getY(i)) }
    const colors = new Float32Array(pos.count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) - minY) / (maxY - minY || 1)
      c.copy(a).lerp(b, t * t * (3 - 2 * t))
      if (look.speckle) {
        const h = Math.sin(pos.getX(i) * 12.9898 + pos.getY(i) * 78.233 + pos.getZ(i) * 37.719) * 43758.5453
        const f = h - Math.floor(h)
        if (f > 0.93) c.multiplyScalar(0.45)
      }
      colors.set([c.r, c.g, c.b], i * 3)
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    invalidate()
  }, [geometry, useVertexColors, look.color, look.colorB, look.gradient, look.speckle, invalidate])

  // Layer lines: a 3D print is a stack of thin layers. We darken a narrow groove at every layer
  // boundary in the shader (by height), so the vase reads as printed rather than moulded.
  const layer = look.layer ?? 0
  const addLayers = useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uLayer = { value: layer }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vLayerY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLayerY = position.y;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vLayerY;\nuniform float uLayer;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if (uLayer > 0.0) {
          float t = vLayerY / uLayer;
          float w = max(fwidth(t), 0.001);
          float d = abs(fract(t) - 0.5) * 2.0;           // 0 in the middle of a layer, 1 at the seam
          float seam = smoothstep(1.0 - 0.35 - w, 1.0 - w * 0.5, d);
          float fade = clamp(2.2 - w * 3.0, 0.0, 1.0);   // fade out when layers are too small to draw
          diffuseColor.rgb *= 1.0 - 0.32 * seam * fade;
        }`,
      )
  }, [layer])

  // Free GPU memory of the previous geometry — otherwise memory grows with every slider move.
  useEffect(() => () => geometry.dispose(), [geometry])

  // A clipping plane cuts the vase in half to reveal the wall thickness.
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), [])
  useEffect(() => {
    gl.localClippingEnabled = true
    invalidate()
  }, [gl, invalidate, showSection, look, geometry])

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        key={`${useVertexColors ? 'vc' : 'plain'}-${layer}`}
        onBeforeCompile={addLayers}
        customProgramCacheKey={() => `layers-${layer}`}
        vertexColors={useVertexColors}
        color={useVertexColors ? '#ffffff' : look.color}
        roughness={look.roughness}
        metalness={look.metalness}
        clearcoat={look.clearcoat}
        clearcoatRoughness={0.25}
        side={THREE.DoubleSide}
        clippingPlanes={showSection ? [plane] : []}
      />
    </mesh>
  )
}

function Controls({ height, size, view, viewNonce }: { height: number; size: number; view: CameraView; viewNonce: number }) {
  const ref = useRef<OrbitControlsImpl>(null)
  const camera = useThree((s) => s.camera)
  const invalidate = useThree((s) => s.invalidate)

  // Move the camera to a preset view when asked.
  useEffect(() => {
    const target = new THREE.Vector3(0, height / 2, 0)
    const d = size * 2.7
    const positions: Record<CameraView, THREE.Vector3> = {
      front: new THREE.Vector3(0, height / 2, d),
      top: new THREE.Vector3(0, d + height / 2, 0.001),
      'three-quarter': new THREE.Vector3(d * 0.62, height * 1.1, d * 0.78),
    }
    camera.position.copy(positions[view])
    ref.current?.target.copy(target)
    ref.current?.update()
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, viewNonce])

  // Keep the target in the middle of the vase when its height changes.
  useEffect(() => {
    ref.current?.target.set(0, height / 2, 0)
    ref.current?.update()
    invalidate()
  }, [height, invalidate])

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enableDamping={false}
      minDistance={size * 0.6}
      maxDistance={size * 6}
      maxPolarAngle={Math.PI * 0.55}
    />
  )
}
