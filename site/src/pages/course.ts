import { resolveLink } from './files'

// The course chapters live in ../course/<slug>/README.md (outside the site folder),
// and are rendered as pages of the website.
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

export const CHAPTERS: Chapter[] = Object.entries(files)
  .map(([path, body]) => {
    const slug = path.split('/').at(-2)!
    const heading = body.match(/^#\s+(\d+)\s*·\s*(.+)$/m)
    const part = body.match(/^>\s*\*\*(Part \d+ [—·] [^*]+)\*\*/m)?.[1] ?? ''
    const raw = body.match(/^\*\*In one sentence:\*\*\s*(.+)$/m)?.[1] ?? ''
    const plain = raw.replace(/[*_`]/g, '')
    const summary = plain.charAt(0).toUpperCase() + plain.slice(1)
    return { slug, number: heading?.[1] ?? '', title: heading?.[2] ?? slug, part, summary, body }
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))

export const PARTS = [...new Set(CHAPTERS.map((c) => c.part))]

/** Links inside a chapter: see resolveLink in files.ts. */
export function resolveHref(href: string, fromSlug: string): { to?: string; href?: string } {
  return resolveLink(href, `course/${fromSlug}`)
}
