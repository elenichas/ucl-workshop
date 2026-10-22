import { HashRouter, Route, Routes } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'
import HomePage from '@/pages/HomePage'
import ConfigurePage from '@/pages/ConfigurePage'
import CoursePage from '@/pages/CoursePage'
import ChapterPage from '@/pages/ChapterPage'

// HashRouter keeps URLs like /#/configure. GitHub Pages only serves files,
// so "real" paths like /configure would 404 on refresh — the # avoids that.
export default function App() {
  return (
    <HashRouter>
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/configure" element={<ConfigurePage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:slug" element={<ChapterPage />} />
        </Routes>
      </main>
    </HashRouter>
  )
}
