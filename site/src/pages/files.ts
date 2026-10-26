// Every Markdown file of the project (plans, design brief, skills, worksheets, prompts…)
// is readable inside the website, so nobody needs GitHub to see them.
// Vite reads them at build time as plain text. Paths are relative to the project root.

const md = import.meta.glob(
  [
    '../../../CLAUDE.md',
    '../../../PLAN.md',
    '../../../DESIGN.md',
    '../../../.claude/skills/*/SKILL.md',
    '../../../hands-on/**/*.md',
    '../../../prompts/*.md',
    '../../../resources/**/*.md',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

// The demo's code is loaded only when someone opens a file (one small download per file).
const code = import.meta.glob(['../**/*.ts', '../**/*.tsx', '../**/*.css', '!../**/*.test.ts'], { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

const fromRoot = (p: string) => p.replace(/^\.\.\/\.\.\/\.\.\//, '')
const fromSrc = (p: string) => `site/src/${p.replace(/^\.\.\//, '')}`

export const MD_FILES: Record<string, string> = Object.fromEntries(Object.entries(md).map(([p, body]) => [fromRoot(p), body]))
export const CODE_FILES: Record<string, () => Promise<string>> = Object.fromEntries(Object.entries(code).map(([p, load]) => [fromSrc(p), load]))

export interface FileGroup {
  title: string
  intro: string
  paths: string[]
}

const sorted = (prefix: string) => Object.keys(MD_FILES).filter((p) => p.startsWith(prefix)).sort()

/** How the files are grouped on the Files page. */
export const GROUPS: FileGroup[] = [
  {
    title: 'The files Claude reads',
    intro: 'Decisions written down so they survive a fresh chat. Make your own versions of these in your project folder.',
    paths: ['CLAUDE.md', 'PLAN.md', 'DESIGN.md'].filter((p) => p in MD_FILES),
  },
  { title: 'Hands-on', intro: 'Starting prompts, the system-map worksheet, challenge cards and a template for your progress log.', paths: sorted('hands-on/') },
  { title: 'Skills', intro: 'Know-how packaged for Claude. Each one is just a folder with a SKILL.md.', paths: sorted('.claude/skills/') },
  { title: 'The real prompts', intro: 'The conversation behind each step of the demo, mistakes included.', paths: sorted('prompts/') },
  { title: 'Resources', intro: 'Links, design repos and references.', paths: sorted('resources/') },
]

/** A readable name for a file: its first heading, or its file name. */
export function fileTitle(path: string): string {
  const body = MD_FILES[path]
  const h = body?.match(/^#\s+(.+)$/m)?.[1]
  return h ? h.replace(/[*_`]/g, '') : path.split('/').at(-1)!
}

/** Files directly or indirectly inside a folder path ("hands-on/starting-points/"). */
export function filesIn(folder: string): string[] {
  const f = folder.endsWith('/') ? folder : `${folder}/`
  return [...Object.keys(MD_FILES), ...Object.keys(CODE_FILES)].filter((p) => p.startsWith(f)).sort()
}

/**
 * Links inside the Markdown are written as relative file paths (../07-the-algorithm/README.md,
 * ../../DESIGN.md). Inside the website, chapters become chapter pages and every other project
 * file opens on the Files page. Anything we can't show stays plain text — never a GitHub link.
 */
export function resolveLink(href: string, fromDir: string): { to?: string; href?: string } {
  if (/^(https?:|mailto:|#)/.test(href)) return { href }
  const [pathPart, hash = ''] = href.split('#')
  const out: string[] = []
  for (const p of [...fromDir.split('/'), ...pathPart.split('/')]) {
    if (p === '..') out.pop()
    else if (p !== '.' && p !== '') out.push(p)
  }
  const path = out.join('/')
  const chapter = path.match(/^course\/(\d\d-[a-z0-9-]+)(\/README\.md)?$/)
  if (chapter) return { to: `/course/${chapter[1]}${hash ? `#${hash}` : ''}` }
  if (path in MD_FILES || path in CODE_FILES) return { to: `/files/${path}` }
  if (filesIn(path).length) return { to: `/files/${path}/` }
  return {}
}
