// The inputs of the algorithm. Every length is in millimetres.
export interface VaseParams {
  /** Total height of the vase */
  height: number
  /** Outer diameter at the very bottom */
  baseDiameter: number
  /** Outer diameter at the widest point ("belly") */
  bellyDiameter: number
  /** Outer diameter at the rim */
  topDiameter: number
  /** Where the belly sits, as a fraction of the height (0.1 – 0.9) */
  bellyPosition: number
  /** Number of vertical ribs around the vase (0 = smooth) */
  ribCount: number
  /** How far each rib sticks out */
  ribDepth: number
  /** How much the ribs rotate from bottom to top, in degrees */
  twist: number
  /** Number of horizontal ripples from bottom to top */
  waveCount: number
  /** How far each ripple sticks out */
  waveDepth: number
  /** Thickness of the side wall */
  wallThickness: number
  /** Thickness of the floor */
  baseThickness: number
}

/** How finely we cut the surface into triangles. More = smoother and slower. */
export interface Resolution {
  /** Points around the circumference */
  radial: number
  /** Rings from bottom to top */
  vertical: number
}

export const DRAFT: Resolution = { radial: 96, vertical: 64 }
export const FULL: Resolution = { radial: 256, vertical: 192 }

/**
 * The output of the algorithm: a triangle mesh.
 * `positions` holds x,y,z for every point (y is up, like in three.js).
 * `indices` holds three point numbers per triangle.
 */
export interface VaseMesh {
  positions: Float32Array
  indices: Uint32Array
  /** Facts measured while building, used by the printability checks */
  stats: VaseStats
}

export interface VaseStats {
  /** Largest outer diameter anywhere on the vase, in mm */
  maxDiameter: number
  /** Smallest outer diameter anywhere above the base, in mm */
  minDiameter: number
  /** Steepest outward lean of the outer wall, in degrees from vertical */
  maxOverhangDeg: number
  /** Height (mm) where that steepest lean happens */
  maxOverhangAt: number
  /** Smallest wall thickness actually produced (ribs can thin the wall), in mm */
  minWall: number
  /** Solid material volume in mm³ */
  volume: number
  /** Number of triangles */
  triangles: number
}
