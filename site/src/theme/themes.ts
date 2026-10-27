/**
 * The three site styles. Colours, fonts and corners live in index.css (per html[data-theme]);
 * this file holds what CSS can't reach: the 3D stage colour, whether the vase shows print
 * layer lines, dimension-line colours, the dark part slides and the PowerPoint palette.
 */
export type ThemeId = 'original' | 'printlab' | 'apple'

export interface Theme {
  id: ThemeId
  /** Name on the switch */
  label: string
  /** One line for screen readers and tooltips */
  description: string
  /** Design brief behind it (shown on the Files page) */
  brief: string
  stage: { light: string; dark: string }
  layerLines: boolean
  dims: { light: Dims; dark: Dims }
  partSlide: { bg: string; text: string; muted: string; accent: string; line: string }
  pptx: { paper: string; raised: string; ink: string; muted: string; line: string; accent: string; fill: string; onFill: string; display: string; body: string; numbers: string; code: string; displayBold: boolean }
}
export interface Dims { ink: string; accent: string; axis: string; halo: string }

export const THEMES: Record<ThemeId, Theme> = {
  original: {
    id: 'original',
    label: 'Original',
    description: 'The first look: warm paper, a serif headline and a terracotta accent',
    brief: 'DESIGN.original.md',
    stage: { light: '#EAE5DB', dark: '#26221E' },
    layerLines: false,
    dims: {
      light: { ink: '#2a2622', accent: '#A6482A', axis: '#6f675e', halo: '#F3EFE7' },
      dark: { ink: '#F1EADF', accent: '#F0A07C', axis: '#B8AEA2', halo: '#1C1A17' },
    },
    partSlide: { bg: '#1C1A17', text: '#F3EFE7', muted: '#A79F92', accent: '#D2714B', line: '#3A352E' },
    pptx: { paper: 'F3EFE7', raised: 'FBF9F4', ink: '1C1A17', muted: '5E5850', line: 'D9D2C5', accent: 'A6482A', fill: '1C1A17', onFill: 'F3EFE7', display: 'Georgia', body: 'Arial', numbers: 'Courier New', code: 'Courier New', displayBold: false },
  },
  printlab: {
    id: 'printlab',
    label: 'Design skill',
    description: 'After the frontend-design review: print-bed grey, black, filament yellow and layer lines',
    brief: 'DESIGN.md',
    stage: { light: '#DCDFDB', dark: '#2B302E' },
    layerLines: true,
    dims: {
      light: { ink: '#000000', accent: '#7A5300', axis: '#4F5652', halo: '#F7F8F6' },
      dark: { ink: '#F2F3F1', accent: '#FFC21A', axis: '#A3AAA6', halo: '#1A1D1C' },
    },
    partSlide: { bg: '#000000', text: '#F2F3F1', muted: '#A3AAA6', accent: '#FFC21A', line: '#343936' },
    pptx: { paper: 'E9EBE8', raised: 'F7F8F6', ink: '000000', muted: '4F5652', line: 'C9CDC9', accent: '7A5300', fill: 'FFC21A', onFill: '000000', display: 'Arial Black', body: 'Arial', numbers: 'Arial Narrow', code: 'Courier New', displayBold: false },
  },
  apple: {
    id: 'apple',
    label: 'Apple HIG',
    description: "Following Apple's Human Interface Guidelines: system font, grouped backgrounds and a blue accent",
    brief: 'DESIGN.apple.md',
    stage: { light: '#FFFFFF', dark: '#1C1C1E' },
    layerLines: false,
    dims: {
      light: { ink: '#000000', accent: '#0066CC', axis: '#6C6C70', halo: '#FFFFFF' },
      dark: { ink: '#FFFFFF', accent: '#409CFF', axis: '#98989F', halo: '#000000' },
    },
    partSlide: { bg: '#000000', text: '#FFFFFF', muted: '#98989F', accent: '#409CFF', line: '#38383A' },
    pptx: { paper: 'F2F2F7', raised: 'FFFFFF', ink: '000000', muted: '6C6C70', line: 'C6C6C8', accent: '0066CC', fill: '0071E3', onFill: 'FFFFFF', display: 'Helvetica Neue', body: 'Helvetica Neue', numbers: 'Helvetica Neue', code: 'Menlo', displayBold: true },
  },
}

export const THEME_ORDER: ThemeId[] = ['original', 'printlab', 'apple']
export const DEFAULT_THEME: ThemeId = 'printlab'
const KEY = 'vessel-theme'

/** The saved choice (per browser). Storage can be unavailable, so every access is guarded. */
export function readTheme(): ThemeId {
  try {
    const v = localStorage.getItem(KEY)
    if (v && v in THEMES) return v as ThemeId
  } catch { /* private mode, blocked storage */ }
  return DEFAULT_THEME
}

export function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id
  try { localStorage.setItem(KEY, id) } catch { /* not saved, still applied */ }
}

/** The theme currently on the page (also works outside React, e.g. in the PowerPoint export). */
export function currentTheme(): Theme {
  const id = (typeof document !== 'undefined' && document.documentElement.dataset.theme) as ThemeId | undefined
  return THEMES[id && id in THEMES ? id : DEFAULT_THEME]
}
