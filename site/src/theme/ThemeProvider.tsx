import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { applyTheme, readTheme, THEMES, type Theme, type ThemeId } from './themes'

const Ctx = createContext<{ theme: Theme; setTheme: (id: ThemeId) => void }>({ theme: THEMES.printlab, setTheme: () => {} })

/** Holds the chosen site style and writes it to <html data-theme>, where the CSS picks it up. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<ThemeId>(() => readTheme())
  const setTheme = useCallback((next: ThemeId) => { applyTheme(next); setId(next) }, [])
  return <Ctx.Provider value={{ theme: THEMES[id], setTheme }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
