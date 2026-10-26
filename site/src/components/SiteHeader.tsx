import { NavLink, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/configure', label: 'Configure' },
  { to: '/course', label: 'Course' },
  { to: '/files', label: 'Files' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-none">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 md:px-6">
        <Link to="/" className="font-display text-2xl leading-none tracking-tight">
          Vessel
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    cn('px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink', isActive && 'text-ink underline decoration-accent decoration-2 underline-offset-[6px]')
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
