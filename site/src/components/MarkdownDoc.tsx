import { Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders one of the project's Markdown files with the site's typography.
 * `resolve` turns relative file links into pages of this website.
 */
export function MarkdownDoc({ body, resolve }: { body: string; resolve: (href: string) => { to?: string; href?: string } }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Chapter titles are written "05 · Title": show the number on its own instead of a dot-joined string.
          h1: ({ children }) => {
            const text = typeof children === 'string' ? children : ''
            const m = text.match(/^(\d+)\s*·\s*(.+)$/)
            return m ? <h1><span className="mr-3 font-mono font-medium text-ink-muted">{m[1]}</span>{m[2]}</h1> : <h1>{children}</h1>
          },
          a: ({ href = '', children }) => {
            const r = resolve(href)
            if (r.to) return <Link to={r.to}>{children}</Link>
            if (r.href?.startsWith('#')) return <a href={r.href}>{children}</a>
            if (r.href) return <a href={r.href} target="_blank" rel="noreferrer">{children}</a>
            return <span>{children}</span>
          },
          table: ({ children }) => (
            <div className="table-wrap" tabIndex={0} role="region" aria-label="Table">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {body}
      </Markdown>
    </div>
  )
}
