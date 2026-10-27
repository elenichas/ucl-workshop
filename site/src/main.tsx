import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled with the site (no Google Fonts request). A browser only downloads the ones
// the current style uses: Archivo (Design skill), Instrument Serif + Sans (Original),
// JetBrains Mono (code, and numbers in Original). The Apple style uses the system font.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource-variable/instrument-sans/index.css'
import './index.css'
import App from './App'
import { ThemeProvider } from './theme/ThemeProvider'
import { applyTheme, readTheme } from './theme/themes'

// Set the saved style before the first paint, so the page doesn't flash in the default one.
applyTheme(readTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
