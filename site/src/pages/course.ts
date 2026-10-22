// The course chapters live in ../course/<slug>/README.md (outside the site folder),
// so the same Markdown is readable on GitHub AND inside the website.
// Vite reads them at build time as plain text.
const files = import.meta.glob('../../../course/*/README.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export interface Chapter {
  slug: string
  number: string
  title: string
  part: string
  summary: string
  body: string
}

export const REPO_URL = 'https://github.com/elenichas/ucl-workshop'

export const CHAPTERS: Chapter[] = Object.entries(files)
  .map(([path, body]) => {
    const slug = path.split('/').at(-2)!
    const heading = body.match(/^#\s+(\d+)\s*·\s*(.+)$/m)
    const part = body.match(/^>\s*\*\*(Part \d+ — [^*]+)\*\*/m)?.[1] ?? ''
    const raw = body.match(/^\*\*In one sentence:\*\*\s*(.+)$/m)?.[1] ?? ''
    const plain = raw.replace(/[*_`]/g, '')
    const summary = plain.charAt(0).toUpperCase() + plain.slice(1)
    return { slug, number: heading?.[1] ?? '', title: heading?.[2] ?? slug, part, summary, body }
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))

export const PARTS = [...new Set(CHAPTERS.map((c) => c.part))]

/**
 * Links inside the Markdown are written for GitHub (../07-the-algorithm/README.md).
 * Inside the website we turn chapter links into site routes, and other repo files
 * into links to GitHub.
 */
export function resolveHref(href: string, fromSlug: string): { to?: string; href?: string } {
  if (/^(https?:|mailto:|#)/.test(href)) return { href }
  const chapter = href.match(/^\.\.\/(\d\d-[a-z0-9-]+)\/README\.md(#.*)?$/)
  if (chapter) return { to: `/course/${chapter[1]}` }
  // resolve relative to course/<slug>/ and point at GitHub
  const parts = ['course', fromSlug, ...href.split('/')]
  const out: string[] = []
  for (const p of parts) {
    if (p === '..') out.pop()
    else if (p !== '.' && p !== '') out.push(p)
  }
  const isFolder = href.endsWith('/')
  return { href: `${REPO_URL}/${isFolder ? 'tree' : 'blob'}/main/${out.join('/')}` }
}
