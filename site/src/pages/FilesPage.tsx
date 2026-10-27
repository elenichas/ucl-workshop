import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Copy, Download, FileCode2, FileText } from 'lucide-react'
import { MarkdownDoc } from '@/components/MarkdownDoc'
import { CODE_FILES, GROUPS, MD_FILES, fileTitle, filesIn, resolveLink } from './files'

/**
 * /files            — every .md file of the project, grouped
 * /files/<path>     — one file (Markdown rendered, code shown as text)
 * /files/<folder>/  — the files inside a folder
 */
export default function FilesPage() {
  const path = useParams()['*'] ?? ''
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${path ? path.split('/').filter(Boolean).at(-1) : 'Project files'} — Prompt to Print`
  }, [path])

  if (!path) return <FilesIndex />
  if (path in MD_FILES) return <MdFile path={path} />
  if (path in CODE_FILES) return <CodeFile path={path} />
  const inside = filesIn(path)
  if (inside.length) return <FolderView folder={path.replace(/\/$/, '')} paths={inside} />
  return (
    <Page>
      <p>File not found. <Link className="underline" to="/files">All project files</Link></p>
    </Page>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[760px] px-4 py-12 md:px-6 md:py-16">{children}</div>
}

function FilesIndex() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-20">
      <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">Everything we wrote down</h1>
      <div className="mt-6 grid max-w-[62ch] gap-4 text-lg leading-relaxed text-ink-muted">
        <p>
          Building with an agent works best when decisions live in files, not only in the chat. These are the <span className="font-code text-base">.md</span> files
          behind the demo — the plan, the design brief, the skills, the worksheets and the real prompts.
        </p>
        <p>
          <span className="text-ink">For your own project:</span> keep the same kind of files in your project folder — a <span className="font-code text-base">PLAN.md</span>, a{' '}
          <span className="font-code text-base">DESIGN.md</span>, a <span className="font-code text-base">PROGRESS.md</span> — so Claude stays consistent from one chat to the next. Copy or
          download any file here as a starting point. No GitHub needed.
        </p>
      </div>
      <div className="mt-14 grid gap-12">
        {GROUPS.filter((g) => g.paths.length).map((g) => (
          <section key={g.title} aria-labelledby={g.title}>
            <h2 id={g.title} className="section-label border-b border-line pb-3">{g.title}</h2>
            <p className="mt-3 text-sm text-ink-muted">{g.intro}</p>
            <ul className="mt-2">
              {g.paths.map((p) => (
                <li key={p} className="border-b border-line">
                  <Link to={`/files/${p}`} className="group grid gap-x-8 py-4 md:grid-cols-[minmax(0,22rem)_1fr]">
                    <span className="font-code text-[13px] text-ink-muted">{p}</span>
                    <span className="text-lg leading-snug group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">{fileTitle(p)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

function Breadcrumb({ path }: { path: string }) {
  const parts = path.split('/').filter(Boolean)
  return (
    <nav aria-label="Where this file lives" className="flex flex-wrap items-center gap-1 font-code text-sm text-ink-muted">
      <Link to="/files" className="hover:text-ink">files</Link>
      {parts.map((p, i) => {
        const last = i === parts.length - 1
        const to = `/files/${parts.slice(0, i + 1).join('/')}/`
        return (
          <span key={i} className="flex items-center gap-1">
            <span aria-hidden>/</span>
            {last ? <span className="text-ink">{p}</span> : <Link to={to} className="hover:text-ink">{p}</Link>}
          </span>
        )
      })}
    </nav>
  )
}

function FileActions({ path, text }: { path: string; text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard not available: the download button still works */
    }
  }
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = path.split('/').at(-1)!
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copy} className="flex items-center gap-2 rounded-sm border border-ink px-3 py-1.5 text-sm font-medium hover:bg-ink hover:text-paper">
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />} {copied ? 'Copied' : 'Copy text'}
      </button>
      <button type="button" onClick={download} className="flex items-center gap-2 rounded-sm border border-ink px-3 py-1.5 text-sm font-medium hover:bg-ink hover:text-paper">
        <Download className="size-4" aria-hidden /> Download
      </button>
    </div>
  )
}

function MdFile({ path }: { path: string }) {
  const text = MD_FILES[path]
  const dir = path.split('/').slice(0, -1).join('/')
  // A block between --- lines at the very top is "front matter": settings, not prose.
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  const body = fm ? text.slice(fm[0].length) : text
  const isSkill = path.endsWith('SKILL.md')
  return (
    <article className="mx-auto max-w-[760px] px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb path={path} />
        <FileActions path={path} text={text} />
      </div>
      {fm && (
        <div className="mt-8 border border-line bg-paper-raised p-5">
          <p className="section-label">{isSkill ? 'Header: Claude always sees this, and reads the rest only when it’s relevant' : 'Header: settings at the top of the file'}</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-code text-[13px] leading-relaxed">{fm[1]}</pre>
        </div>
      )}
      <div className="mt-8">
        <MarkdownDoc body={body} resolve={(href) => resolveLink(href, dir)} />
      </div>
    </article>
  )
}

function CodeFile({ path }: { path: string }) {
  const [text, setText] = useState<string | null>(null)
  useEffect(() => {
    let live = true
    setText(null)
    CODE_FILES[path]().then((t) => live && setText(t))
    return () => { live = false }
  }, [path])
  return (
    <article className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb path={path} />
        {text !== null && <FileActions path={path} text={text} />}
      </div>
      <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
        This is code the agent wrote for the demo. You don’t need to read it — but you can, and you can always ask Claude to explain a file in plain words.
      </p>
      <pre className="mt-6 overflow-x-auto border border-line bg-paper-raised p-5 font-code text-[13px] leading-relaxed">
        <code>{text ?? 'Loading…'}</code>
      </pre>
    </article>
  )
}

function FolderView({ folder, paths }: { folder: string; paths: string[] }) {
  return (
    <Page>
      <Breadcrumb path={`${folder}/`} />
      <h1 className="mt-6 font-display text-5xl tracking-tight">{folder.split('/').at(-1)}</h1>
      <ul className="mt-8">
        {paths.map((p) => {
          const isMd = p in MD_FILES
          const Icon = isMd ? FileText : FileCode2
          return (
            <li key={p} className="border-b border-line">
              <Link to={`/files/${p}`} className="flex items-center gap-3 py-3 hover:text-accent">
                <Icon className="size-4 shrink-0 text-ink-muted" aria-hidden />
                <span className="font-code text-sm">{p.slice(folder.length + 1)}</span>
                {isMd && <span className="ml-auto hidden text-sm text-ink-muted sm:block">{fileTitle(p)}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}
