import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import HomePage from '@/pages/HomePage'
import ConfigurePage from '@/pages/ConfigurePage'
import CoursePage from '@/pages/CoursePage'
import ChapterPage from '@/pages/ChapterPage'
import PresentPage from '@/pages/PresentPage'
import NotesPage from '@/pages/NotesPage'
import FilesPage from '@/pages/FilesPage'

// HashRouter keeps URLs like /#/configure. GitHub Pages only serves files,
// so "real" paths like /configure would 404 on refresh — the # avoids that.
export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}

function Shell() {
  // The presentation and the notes window take the whole screen, without the site header.
  const bare = /^\/(present|notes)/.test(useLocation().pathname)
  return (
    <>
      {!bare && <SiteHeader />}
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/configure" element={<ConfigurePage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:slug" element={<ChapterPage />} />
          <Route path="/files/*" element={<FilesPage />} />
          <Route path="/present" element={<PresentPage />} />
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </main>
      {!bare && <SiteFooter />}
    </>
  )
}
