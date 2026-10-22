import { CHAPTERS } from '@/pages/course'
import { getPreset, newDesign, surfaceFor, type Design } from '@/design/design'
import type { Slide } from './types'

/**
 * THE DECK — one continuous presentation, about 40 slides.
 * Two or three slides per chapter at most; the chapter pages in /course are the
 * long "read later" version. A dark divider slide opens each of the five parts.
 */
const part = (number: number, title: string, question: string, first: number, last: number): Slide => ({
  kind: 'part',
  number,
  title,
  question,
  chapters: CHAPTERS.filter((c) => Number(c.number) >= first && Number(c.number) <= last).map((c) => ({ number: c.number, title: c.title })),
})

const twist = (deg: number): Design => ({ ...newDesign(), name: `Twist ${deg}°`, surface: { ...newDesign().surface, values: { ...newDesign().surface.values, twist: deg } } })

const sections: [string, Slide[]][] = [
  // ============================================================== WELCOME
  ['00-welcome', [
    { kind: 'title', title: 'Prompt to Print', subtitle: 'Building a parametric vase configurator with Claude Code', meta: 'A 3-hour workshop · UCL', notes: 'Today is not about becoming web developers. It is about how to think when you build a digital tool with an AI agent.' },
    { kind: 'vase', title: 'Today we build this', caption: 'Shape a vase, see it in 3D, check it can be printed, download it for Rhino — all in the browser.', designs: ['amphora', 'hex', 'moon', 'lantern'].map((id) => ({ label: getPreset(id).name, design: getPreset(id) })), notes: 'Click through: four vases, each started in a different way. The website is the excuse; the process is the point.' },
    { kind: 'visual', title: 'Don’t type “build me a configurator”', visual: 'plan-loop', steps: 5, notes: 'You would get something average that you don’t understand. Instead: think, write a plan, approve it, build one small step, check, commit. This loop is the whole course.' },
  ]],

  // ============================================================== PART 1
  ['01-fundamentals', [
    part(1, 'Foundations', 'What are we actually working with?', 1, 4),
    { kind: 'visual', title: 'An agent is a model in a loop', visual: 'agent-loop', steps: 5, notes: 'A language model predicts text. An agent is that model in a loop with tools: it reads files, changes them, runs commands, looks at the result, and decides the next step.' },
    { kind: 'visual', title: 'A website is files your browser runs', visual: 'web-request', steps: 3, notes: 'HTML is the plan, CSS the finishes, JavaScript the moving parts. Our app is a static site: all the vase computing happens on your own laptop.' },
    { kind: 'visual', title: 'The stack is a set of decisions — yours', visual: 'stack-layers', steps: 6, notes: 'We choose the stack and write it down. We never leave it to the agent.' },
  ]],
  ['02-what-is-claude-code', [
    { kind: 'visual', title: 'What happens when you ask Claude Code', visual: 'claude-code-steps', steps: 6, notes: 'Read the steps, not just the final answer. That is “what happens in the background”.' },
    { kind: 'visual', title: 'Give it knowledge in files, not in chat', visual: 'knowledge-files', steps: 4, notes: 'CLAUDE.md for rules, PLAN.md for what we agreed, DESIGN.md for the look, skills for know-how, MCP for other tools. If you explain something twice, write it down.' },
  ]],
  ['03-tokens-usage-cost', [
    { kind: 'visual', title: 'Everything it reads costs tokens — every turn', visual: 'context-window', steps: 5, notes: 'The whole context is re-read on every turn. Long chats get slower, more expensive and more forgetful.' },
    { kind: 'visual', title: 'A good process is also the cheap one', visual: 'token-compare', steps: 1, notes: 'Plan first, small steps, one task per chat, decisions in files.' },
  ]],
  ['04-setup-first-conversation', [
    { kind: 'code', title: 'Your first prompt: ask, don’t order', lang: 'prompt', code: 'I’m an architecture student and new to web development.\nExplain this project to me: what are the main folders, and how\ndoes a slider change end up as a new vase on screen?\nUse an analogy from Grasshopper.', caption: 'Nothing changes. Watch which files it reads — that is it building a map.' },
    { kind: 'visual', title: 'The whole loop, once', visual: 'first-loop', steps: 3 },
  ]],

  // ============================================================== PART 2
  ['05-starting-systematically', [
    part(2, 'Thinking before building', 'What exactly are we making?', 5, 6),
    { kind: 'statement', text: 'Every gap you leave, the model fills — with the average.', sub: 'Planning is deciding which gaps you want to fill yourself.', notes: 'The most important idea of the day.' },
    { kind: 'visual', title: 'Five ways to start', visual: 'five-starts', steps: 4, notes: 'Pick the one that matches how you think. All end in a PLAN.md you approve. Copy-paste prompts: hands-on/starting-points. Story: the question “which printers?” turned printers into editable profiles.' },
    { kind: 'code', title: 'For example: let it interview you', lang: 'prompt', code: 'I want to build a configurator for 3D-printable vases.\nBefore writing any code, interview me about what it needs.\nAsk ONE question at a time and wait for my answer.\nThen write PLAN.md and stop.' },
  ]],
  ['06-parameters', [
    {
      kind: 'vase', title: 'The start decides the controls', caption: 'Every parameter is a decision you give away. A sphere has no “belly”; a box has corners.',
      designs: (['round', 'sphere', 'box', 'polygon', 'cone'] as const).map((id) => ({ label: id[0].toUpperCase() + id.slice(1), design: { ...newDesign(), start: id, name: id, surface: surfaceFor('none') } })),
      notes: 'Click through five shapes. Each exposes different sliders because each describes the form differently.',
    },
    { kind: 'visual', title: 'The system map · what each start exposes', visual: 'system-map', steps: 5, notes: 'Nine front doors to the same app. Live version: “How it works” in the configurator. Exercise: draw your own map before you build (hands-on/system-map-worksheet.md).' },
    { kind: 'visual', title: 'The system map · one shared pipeline', visual: 'system-map-flow', steps: 4, notes: 'Each start adds its own steps, then all join one pipeline. Carve is the only branch: it cuts, then measures from the mesh.' },
  ]],

  // ============================================================== PART 3
  ['07-the-algorithm', [
    part(3, 'Building the configurator', 'How do numbers become a printable object?', 7, 10),
    { kind: 'visual', title: 'From numbers to a mesh', visual: 'algorithm', steps: 4, notes: 'Like Grasshopper: a profile, revolve, decorate, offset a wall, close it. The code builds the triangles directly.' },
    { kind: 'vase', title: 'Twist = a bit more angle the higher you go', caption: '0° → 60° → 180° → 360°', designs: [0, 60, 180, 360].map((d) => ({ label: `${d}°`, design: twist(d) })) },
    { kind: 'visual', title: '“It looks right” is not “it is right”', visual: 'winding', steps: 3, notes: 'Our first vase was inside-out: perfect on screen, broken for a printer. Two automatic tests caught it.' },
  ]],
  ['08-the-3d-viewer', [
    { kind: 'vase', title: 'A 3D viewport inside a web page', caption: 'Like Rhino’s viewport, but anyone with the link can use it. Drag to orbit.', designs: [{ label: 'Honeycomb', design: getPreset('honey') }] },
    { kind: 'visual', title: 'The web draws triangles, not NURBS', visual: 'mesh-resolution', steps: 2, notes: 'Smoothness is a resolution choice. When it gets slow: measure first, then fix — fewer triangles while dragging, redraw only when something changes.' },
  ]],
  ['09-is-it-printable', [
    { kind: 'visual', title: 'Same vase, two printers', visual: 'print-compare', steps: 1, notes: 'Computed live by the app’s own rules. The 2 mm wall is fine in PLA, too thin for clay. Every verdict comes with a sentence and numbers.' },
    { kind: 'visual', title: 'Why clay is stricter', visual: 'overhang', steps: 2 },
  ]],
  ['10-exports', [
    { kind: 'visual', title: 'From screen to object', visual: 'fab-path', steps: 3, notes: 'STL for slicers, 3DM for Rhino. Watch out: the web has Y up, Rhino and slicers have Z up.' },
  ]],

  // ============================================================== PART 4
  ['11-ui-on-the-web', [
    part(4, 'Craft and quality', 'Is it good — and does it work for everyone?', 11, 17),
    { kind: 'images', title: 'Same functions, different experience', images: [{ src: 'slides/stage-05.png', label: 'Function first' }, { src: 'slides/stage-08.png', label: 'Then craft' }], notes: 'Hierarchy, grouping, one accent colour, the object first. Craft is not optional.' },
  ]],
  ['12-responsiveness', [
    { kind: 'visual', title: 'One site, every screen', visual: 'breakpoints', steps: 2, notes: 'Most people open your link on a phone first. Reorganise, don’t just shrink.' },
  ]],
  ['13-accessibility', [
    { kind: 'statement', text: 'How do you describe a 3D object to someone who can’t see it?', sub: '“A round vase 180 mm tall and 136 mm at its widest, with ribs, in PLA.” — generated from the design. Plus: labels, keyboard, contrast, never colour alone.' },
  ]],
  ['14-3d-interactions', [
    { kind: 'bullets', title: 'A 3D view is an interface too', reveal: true, points: ['Named views and limits — you can’t get lost', 'A section cut shows the wall', 'Feedback while you drag', 'Next: colour the overhangs red'] },
  ]],
  ['15-avoiding-ai-slop', [
    { kind: 'visual', title: 'Unchosen vs chosen', visual: 'slop-vs-designed', steps: 1, notes: 'AI sites look alike because nobody decided. Write a DESIGN.md with a point of view — and a list of don’ts.' },
    { kind: 'bullets', title: 'Give your agent taste', reveal: true, points: ['Decide a direction in one sentence', 'Bring real references — study them into a DESIGN.md', 'Use design skills to critique, not to decide for you', 'Build → critique → fix the top 3'], aside: 'Repos and skills: resources/design-repos.md' },
  ]],
  ['16-testing', [
    { kind: 'visual', title: 'Tests keep the agent honest', visual: 'test-levels', steps: 2, notes: 'Automatic questions asked every time anything changes. One of ours: every preset must print on its own printer — it caught three that didn’t.' },
    { kind: 'statement', text: 'Did the test change — or the code?', sub: 'Agents sometimes “fix” a red test by weakening it.' },
  ]],
  ['17-shipping', [
    { kind: 'visual', title: 'From git push to a public link', visual: 'deploy-flow', steps: 3 },
  ]],

  // ============================================================== PART 5
  ['18-working-with-an-agent', [
    part(5, 'Reflection', 'What did we do — and what did the agent do?', 18, 18),
    { kind: 'visual', title: 'Who did what', visual: 'who-does-what', steps: 2 },
    { kind: 'bullets', title: 'For discussion', reveal: true, points: ['If the agent wrote every line, who designed it?', 'How much code do you need to understand?', 'Will every website — and every vase — start to look the same?', 'What becomes more valuable now?'] },
    { kind: 'statement', text: 'The best prompt you’ll write is the one you thought about before typing.', sub: 'Now go and make one.' },
  ]],
]

export const DECK: Slide[] = sections.flatMap(([slug, slides]) => slides.map((s) => ({ ...s, chapter: s.chapter ?? slug })))

/** Index of the first slide of a chapter (for "Present this chapter"). Skips the part divider. */
export const firstSlideOf = (slug: string) => {
  const i = DECK.findIndex((s) => s.chapter === slug)
  return Math.max(0, i)
}

/** Which part (1–5) a slide belongs to, for the label on every slide. */
export function partOf(index: number): { number: number; title: string } | null {
  for (let i = index; i >= 0; i--) {
    const s = DECK[i]
    if (s.kind === 'part') return { number: s.number, title: s.title }
  }
  return null
}

/** The small label at the top of each slide: part + chapter. */
export function contextOf(index: number) {
  const s = DECK[index]
  const c = CHAPTERS.find((x) => x.slug === s.chapter)
  return { part: partOf(index), chapter: c ? `${c.number} ${c.title}` : '' }
}
