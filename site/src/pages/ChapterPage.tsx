import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Presentation } from 'lucide-react'
import { firstSlideOf } from '@/slides/deck'
import { MarkdownDoc } from '@/components/MarkdownDoc'
import { CHAPTERS, resolveHref } from './course'

export default function ChapterPage() {
  const { slug } = useParams()
  const index = CHAPTERS.findIndex((c) => c.slug === slug)
  const chapter = CHAPTERS[index]
  const prev = CHAPTERS[index - 1]
  const next = CHAPTERS[index + 1]

  useEffect(() => {
    window.scrollTo(0, 0)
    if (chapter) document.title = `${chapter.number} · ${chapter.title} — Prompt to Print`
  }, [chapter])

  if (!chapter) {
    return (
      <div className="mx-auto max-w-[760px] px-4 py-20">
        <p>Chapter not found. <Link className="underline" to="/course">Back to the course</Link></p>
      </div>
    )
  }

  // The chapter's own footer ("Next: …") is replaced by the navigation below.
  const body = chapter.body.replace(/\n---\n\n\*\*(Next|Back to):\*\*[\s\S]*$/, '\n')

  return (
    <article className="mx-auto max-w-[760px] px-4 py-12 md:px-6 md:py-16">
      <div className="flex items-center justify-between gap-4">
        <Link to="/course" className="text-sm font-semibold text-ink-muted underline decoration-line underline-offset-4 hover:text-ink">All chapters</Link>
        <Link to={`/present?s=${firstSlideOf(chapter.slug)}`} className="flex items-center gap-2 border border-ink px-3 py-1.5 text-sm font-medium hover:bg-ink hover:text-paper">
          <Presentation className="size-4" aria-hidden /> Present this chapter
        </Link>
      </div>
      <div className="mt-8">
        <MarkdownDoc body={body} resolve={(href) => resolveHref(href, chapter.slug)} />
      </div>
      <nav aria-label="Chapters" className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2">
        {prev ? (
          <Link to={`/course/${prev.slug}`} className="bg-paper p-5 hover:bg-paper-raised">
            <span className="text-xs text-ink-muted">Previous</span>
            <span className="mt-1 block text-2xl font-semibold leading-tight"><span className="mr-2 font-mono text-ink-muted">{prev.number}</span>{prev.title}</span>
          </Link>
        ) : <span className="hidden bg-paper sm:block" />}
        {next ? (
          <Link to={`/course/${next.slug}`} className="bg-paper p-5 text-right hover:bg-paper-raised">
            <span className="text-xs text-ink-muted">Next</span>
            <span className="mt-1 block text-2xl font-semibold leading-tight"><span className="mr-2 font-mono text-ink-muted">{next.number}</span>{next.title}</span>
          </Link>
        ) : (
          <Link to="/configure" className="bg-paper p-5 text-right hover:bg-paper-raised">
            <span className="text-xs text-ink-muted">Now go and make one</span>
            <span className="mt-1 block text-2xl font-semibold leading-tight">Open the configurator</span>
          </Link>
        )}
      </nav>
    </article>
  )
}
