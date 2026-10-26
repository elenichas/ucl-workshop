import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled with the site (no Google Fonts request): Archivo with its width axis, and a monospace for code.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
