// Shared types for the geometry. Every length is in millimetres.

/**
 * A "field" is how most starting points describe a vase:
 * for any height fraction t (0 = bottom, 1 = top) and angle theta (radians),
 * how far is the outer wall from the vertical axis?
 * Round, sphere, box, polygon, cone, drawn, sketched and image-based vases are all fields.
 * (Carve is different: it starts from a field and then cuts it with a second solid.)
 */
export interface Field {
  height: number
  radius: (t: number, theta: number) => number
}

/** How finely we cut the surface into triangles. More = smoother and slower. */
export interface Resolution {
  /** Points around the circumference */
  radial: number
  /** Rings from bottom to top */
  vertical: number
}

export const DRAFT: Resolution = { radial: 112, vertical: 72 }
export const FULL: Resolution = { radial: 320, vertical: 220 }

/**
 * The output of the algorithm: a triangle mesh.
 * `positions` holds x,y,z for every point (y is up, like in three.js).
 * `indices` holds three point numbers per triangle.
 */
export interface VaseMesh {
  positions: Float32Array
  indices: Uint32Array
  stats: VaseStats
}

/** Facts measured on the result, used by the printability checks and the UI. */
export interface VaseStats {
  height: number
  /** Overall width (x) and depth (z) of the bounding box, in mm */
  width: number
  depth: number
  /** Largest distance from the axis ×2 — the "diameter" of the widest point */
  maxDiameter: number
  /** Smallest distance across the footprint (where the vase touches the table) */
  footprint: number
  /** Steepest outward lean of the outer wall, in degrees from vertical */
  maxOverhangDeg: number
  /** Height (mm) where that steepest lean happens */
  maxOverhangAt: number
  /** Thinnest wall produced, in mm. null when it can't be measured (carved shapes). */
  minWall: number | null
  /** Solid material volume in mm³ */
  volume: number
  triangles: number
  /** Every edge shared by exactly two triangles */
  watertight: boolean
}
