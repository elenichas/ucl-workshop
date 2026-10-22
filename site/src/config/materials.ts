/**
 * MATERIAL PROFILES
 * -----------------
 * Each material brings its own rules (how thin, how steep) and its own colours.
 * Numbers are sensible starting values — the lab technician knows better. Ask them!
 */
export interface Swatch {
  id: string
  name: string
  hex: string
}

export interface MaterialProfile {
  id: string
  name: string
  description: string
  /** Grams per cm³ — for the weight estimate */
  density: number
  /** Thinnest wall that prints reliably, in mm */
  minWall: number
  /** Steepest outward lean (degrees from vertical) that prints without support */
  maxOverhang: number
  /** Clay shrinks while drying and firing. 0.12 = the fired vase is 12 % smaller */
  shrinkage: number
  /** How the surface looks in the viewer */
  look: { roughness: number; metalness: number; clearcoat: number }
  colors: Swatch[]
}

export const MATERIALS: MaterialProfile[] = [
  {
    id: 'pla',
    name: 'PLA',
    description: 'The everyday plastic. Easy to print, plant-based, not for hot water.',
    density: 1.24,
    minWall: 0.8,
    maxOverhang: 45,
    shrinkage: 0,
    look: { roughness: 0.55, metalness: 0, clearcoat: 0.1 },
    colors: [
      { id: 'bone', name: 'Bone', hex: '#E6DFD0' },
      { id: 'terracotta', name: 'Terracotta', hex: '#B5532F' },
      { id: 'sage', name: 'Sage', hex: '#8C9A7E' },
      { id: 'ink', name: 'Ink', hex: '#2A2826' },
      { id: 'cobalt', name: 'Cobalt', hex: '#2D4F8E' },
    ],
  },
  {
    id: 'petg',
    name: 'PETG',
    description: 'Tougher, slightly glossy plastic. Better for holding water.',
    density: 1.27,
    minWall: 1.0,
    maxOverhang: 40,
    shrinkage: 0,
    look: { roughness: 0.3, metalness: 0, clearcoat: 0.5 },
    colors: [
      { id: 'clear-smoke', name: 'Smoke', hex: '#6E6A66' },
      { id: 'amber', name: 'Amber', hex: '#C98A2B' },
      { id: 'white', name: 'White', hex: '#F2F0EB' },
      { id: 'teal', name: 'Teal', hex: '#2E6E6A' },
    ],
  },
  {
    id: 'stoneware',
    name: 'Stoneware clay',
    description: 'Printed soft, then dried and fired in a kiln. Shrinks about 12 %.',
    density: 1.9,
    minWall: 3,
    maxOverhang: 25,
    shrinkage: 0.12,
    look: { roughness: 0.9, metalness: 0, clearcoat: 0 },
    colors: [
      { id: 'raw', name: 'Raw buff', hex: '#C9B79C' },
      { id: 'red', name: 'Red earth', hex: '#A0583A' },
      { id: 'glaze-celadon', name: 'Celadon glaze', hex: '#A9BFA8' },
      { id: 'glaze-tenmoku', name: 'Tenmoku glaze', hex: '#3B2A20' },
    ],
  },
  {
    id: 'porcelain',
    name: 'Porcelain clay',
    description: 'Finer and whiter than stoneware, less forgiving. Shrinks about 14 %.',
    density: 2.0,
    minWall: 2.5,
    maxOverhang: 20,
    shrinkage: 0.14,
    look: { roughness: 0.75, metalness: 0, clearcoat: 0.2 },
    colors: [
      { id: 'white', name: 'Porcelain white', hex: '#F1EFEA' },
      { id: 'glaze-blue', name: 'Blue glaze', hex: '#5D7FA8' },
      { id: 'glaze-ash', name: 'Ash glaze', hex: '#B9B3A3' },
    ],
  },
  {
    id: 'resin',
    name: 'Resin',
    description: 'Smooth and detailed. Needs washing and curing; handle with gloves.',
    density: 1.15,
    minWall: 1.2,
    maxOverhang: 50,
    shrinkage: 0,
    look: { roughness: 0.25, metalness: 0, clearcoat: 0.8 },
    colors: [
      { id: 'grey', name: 'Grey', hex: '#9A9A98' },
      { id: 'black', name: 'Black', hex: '#1F1F1F' },
      { id: 'clear', name: 'Clear', hex: '#D7DEDB' },
    ],
  },
]

export const getMaterial = (id: string) => MATERIALS.find((m) => m.id === id) ?? MATERIALS[0]
