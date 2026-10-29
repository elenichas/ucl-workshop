import { CHAPTERS } from '@/pages/course'
import { newDesign, surfaceFor, type Design } from '@/design/design'
import type { Slide } from './types'

/**
 * THE DECK — about 35 slides.
 * The core of the workshop is HOW TO THINK ABOUT A CONFIGURATOR (inputs, process,
 * outputs, starting points, constraints) and HOW TO BUILD IT PROMPT BY PROMPT.
 * AI, web and front-end craft are context: a few slides each. The chapter pages
 * on the site keep the full detail.
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
    { kind: 'title', title: 'Prompt to Print', subtitle: 'Eleni Chasioti', notes: 'Today is about how to think when you build a digital tool with an AI agent. The vase configurator is our case study — open it for 30 seconds before the next slide.' },
    {
      kind: 'table', title: 'Plan for today, 17:30–20:00', head: ['Time', 'What we do', 'Length'],
      rows: [
        ['17:30', 'Welcome: who I am, and a walk around the course website', '15 min'],
        ['17:45', 'Presentation: how to think about and build a configurator', '45 min'],
        ['18:30', 'Break', '10 min'],
        ['18:40', 'Demo and discussion: the configurator prototype', '30 min'],
        ['19:10', 'Claude Code walk-through, then choose a way to work and start building your configurator', '30 min'],
        ['19:40', 'Open floor for questions', '20 min'],
      ],
      notes: 'Introduce yourself, then open the course website: Course, the chapters, Files, the configurator and the style switch at the top. Point out that everything stays online after today.',
    },
    { kind: 'visual', title: 'Don’t type “build me a configurator”', visual: 'plan-loop', steps: 5, notes: 'You would get something average that you might not fully understand. Think, write a plan, approve it, build one small step, check it, note what changed. This loop is the whole workshop.' },
  ]],

  // ============================================================== PART 1 · context
  ['01-fundamentals', [
    part(1, 'Foundations', 'Just enough context: AI, agents and the web', 1, 4),
    { kind: 'visual', title: 'You chat — the agent writes the code', visual: 'agent-loop', steps: 5, notes: 'Even if you have never written code: every time you ask for a change, the agent is writing code into the files in your project folder. It works in a loop — think, act, look, repeat — until the job is done. You can always ask it to explain what it changed in plain words.' },
    { kind: 'visual', title: 'A website is files — and a stack you choose', visual: 'stack-layers', steps: 6, notes: 'Context only. The browser downloads HTML, CSS and JavaScript and runs them; our app computes the vase on your own laptop. The stack is a decision — write it in the plan. More: chapter 01.' },
  ]],
  ['02-what-is-claude-code', [
    { kind: 'visual', title: 'Decisions live in files, not in the chat', visual: 'knowledge-files', steps: 4, caption: 'All of ours are on the website, under Files — copy them as a starting point for your own folder.', notes: 'Context only. Your project is just a folder on your laptop. CLAUDE.md, PLAN.md, DESIGN.md, skills live in it. Files survive a fresh chat and cost fewer tokens than repeating yourself. All of ours are on the website under Files — students can copy them as a start.' },
  ]],
  ['04-setup-first-conversation', [
    { kind: 'code', title: 'Your first prompt: ask, don’t order', lang: 'prompt', code: 'I want to make a website where people can design their own\n3D-printable vase. I have never built a website.\nBefore we build anything: how should I think about it?\nWhat are the inputs, the process and the outputs?\nExplain it with an analogy from architecture or Grasshopper.\nDon’t write any code yet.', caption: 'You start from an empty folder. The first conversation is about thinking, not building.', notes: 'Most of you start from a blank folder. Ask questions first — it costs nothing, changes nothing, and you learn the shape of the problem.' },
    { kind: 'visual', title: 'The whole loop, once', visual: 'first-loop', steps: 3, notes: 'Ask, act, check, note it. No Git needed today: your project is a folder, and the chat (or a PROGRESS.md) is your log.' },
    { kind: 'visual', title: 'Your site lives at localhost', visual: 'localhost', steps: 3, notes: 'The classic beginner moment: sharing a localhost link. localhost is your own computer — the link only works on your laptop while the dev server is running. Making a shareable link (building and hosting the site) is a next step, not for today.' },
  ]],

  // ============================================================== PART 2 · CORE
  ['05-starting-systematically', [
    part(2, 'Thinking before building', 'What exactly are we making — and how do we decide?', 5, 6),
    { kind: 'statement', text: 'Every gap you leave, the model fills — with the average.', sub: 'Planning is deciding which gaps you want to fill yourself.', notes: 'The most important idea of the day.' },
    { kind: 'visual', title: 'Five ways to start the conversation', visual: 'five-starts', steps: 4, notes: 'Pick the one that matches how you think. All end in a PLAN.md you read, edit and approve. Copy-paste prompts on the website: Files → Hands-on.' },
  ]],
  ['06-parameters', [
    { kind: 'visual', title: 'Every configurator: inputs → process → outputs', visual: 'ipo', steps: 2, notes: 'The frame for everything that follows. Inputs are decisions you hand to the user. The process is the algorithm plus the rules. Outputs are what leaves the screen.' },
    { kind: 'bullets', title: 'Every parameter is a decision', reveal: true, points: ['Does the user care?', 'Can they understand it?', 'Does it make a visible difference?', 'What range keeps it beautiful and printable?', 'What is the default — the design most people will get?'], notes: 'A configurator with 40 sliders is a designer who didn’t decide.' },
    {
      kind: 'vase', id: 'starts', title: 'The starting point decides the controls', caption: 'A sphere has no “belly”. A box has corners. Each start describes the form differently — so it asks different questions.',
      designs: (['round', 'sphere', 'box', 'polygon', 'cone'] as const).map((id) => ({ label: id[0].toUpperCase() + id.slice(1), design: { ...newDesign(), start: id, name: id, surface: surfaceFor('none') } })),
      notes: 'Click through five shapes, then mention the other ways in: draw a profile, sketch, from an image, carve.',
    },
    { kind: 'visual', title: 'The system map', visual: 'system-map', steps: 5, notes: 'Start from → the controls it exposes → how it describes the form. Live version: “How it works” in the configurator.' },
    { kind: 'visual', title: 'The system map: one shared pipeline', visual: 'system-map-flow', steps: 4, notes: 'Each start adds its own steps, then all join the same pipeline and the same outputs. Carve is the only branch.' },
    { kind: 'bullets', title: 'Constraints are inputs too', reveal: true, points: ['The printer: build volume, nozzle, one colour or many', 'The material: thinnest wall, steepest overhang, shrinkage', 'Kept in two small editable files — “profiles”', 'When the lab says “we only have X”, the app changes'], notes: 'Real-world limits shaping the app are not a failure — they are the brief.' },
    { kind: 'bullets', title: 'Exercise: map your vase configurator', points: ['Choose your ways to start — round, box, a drawn profile, an image…', 'For each start: which controls does it give the user?', 'Write the steps every vase shares, and what comes out at the end', 'Then ask Claude: “Read my code and draw the system map. Where does it differ from my plan?”'], aside: 'Worksheet on the website: Files → Hands-on', notes: 'Everyone builds a vase configurator — the exercise is to decide what YOUR configurator offers. Ten minutes on paper before any prompt.' },
  ]],

  // ============================================================== PART 3 · CORE
  ['07-the-algorithm', [
    part(3, 'Building it, prompt by prompt', 'How do numbers become a printable object?', 7, 10),
    { kind: 'visual', title: 'One step at a time, one prompt per step', visual: 'build-steps', steps: 4, notes: 'The demo was built in these stages, in this order. You don’t need Git today: your project is a local folder, and your log can be the chat itself — or ask Claude to keep a PROGRESS.md as you go.' },
    { kind: 'code', title: 'Prompt: the algorithm, before any 3D', lang: 'prompt', code: 'Implement step 2 of PLAN.md: the vase algorithm, as plain\nfunctions — no 3D yet. Parameters in, a closed triangle mesh out,\nplus measurements: widest point, steepest overhang, thinnest wall.\nUnits mm. Write tests first: every preset is watertight, a plain\ncylinder has the volume a hand calculation gives.', caption: 'Prove it works with numbers before you make it pretty.' },
    { kind: 'visual', title: 'From numbers to a mesh', visual: 'algorithm', steps: 4, notes: 'Like Grasshopper: a profile, revolve, decorate, offset a wall, close it.' },
    { kind: 'vase', id: 'twist', title: 'A parameter: twist', caption: '“A bit more angle the higher you go.” One number — 0°, 60°, 180°, 360° — changes the whole character.', designs: [0, 60, 180, 360].map((d) => ({ label: `${d}°`, design: twist(d) })) },
    { kind: 'visual', title: '“It looks right” is not “it is right”', visual: 'winding', steps: 2, notes: 'No maths needed: every surface of a 3D model has an outside and an inside. Our first vase had its walls flipped — inside-out. It looked perfect on screen, but the printer software read a broken file. You can’t see that by eye, so ask the agent for automatic checks of what you can’t see. They caught it instantly.' },
  ]],
  ['09-is-it-printable', [
    { kind: 'code', title: 'Prompt: is it printable?', lang: 'prompt', code: 'Research how people check whether a 3D model can be printed —\nfor a desktop plastic printer and for a clay printer.\nPropose a few basic checks (for example: wall too thin, too steep\nan overhang, too big for the printer), each with where the rule\ncomes from — link the sources. Wait for my OK.\nThen build them: each check says pass, warn or fail, in one\nsentence with the numbers. Keep the sources in CHECKS.md.', caption: 'You don’t need to know the rules — ask for research, with sources, and decide which checks you keep.', notes: 'Students don’t need to know fabrication rules up front. Ask the agent to research them, cite where each rule comes from, then decide together. Check the sources: a rule without a source is a guess.' },
    { kind: 'visual', title: 'Same vase, two printers', visual: 'print-compare', steps: 1, notes: 'Computed live by the app’s own rules. Say why, not just no.' },
  ]],
  ['10-exports', [
    { kind: 'visual', title: 'Outputs: from screen to object', visual: 'fab-path', steps: 3, notes: 'STL: the shape as a skin of triangles, the file every printer software reads. Slicer: software (PrusaSlicer, Cura, Bambu Studio) that cuts the shape into layers and plans the nozzle path — you choose layer height, speed and supports there — and saves G-code. The printer follows the G-code layer by layer. 3DM if you want to keep editing in Rhino.' },
    { kind: 'code', title: 'Prompt: add another way to start', lang: 'prompt', code: 'My configurator starts every vase from a round profile.\nAdd a second way to start: from a box with rounded corners.\nWhich controls should it have that the round one doesn’t?\nPropose them first, wait for my OK, then build it.\nThe 3D view and the print check must still work.', caption: 'Each way to start asks different questions — let the agent propose them, you decide.' },
  ]],

  // ============================================================== PART 4 · context
  ['11-ui-on-the-web', [
    part(4, 'Craft and quality', 'Context: making it good — briefly', 11, 17),
    { kind: 'images', title: 'First make it work, then make it good', images: [{ src: 'slides/stage-05.png', label: '1 · It works: plain sliders and a 3D view' }, { src: 'slides/stage-08.png', label: '2 · Designed around it: grouped steps, the vase first' }], caption: 'Same functions in both. We built the logic first, then designed the interface around it.', notes: 'Build the working core first — the algorithm and a 3D view with plain browser sliders. Only then design the app around it: group the controls, give the vase the most space, one accent colour. Designing first means redesigning everything when the logic changes.' },
  ]],
  ['13-accessibility', [
    { kind: 'visual', title: 'Readable for everyone: the basics', visual: 'a11y-basics', steps: 3, notes: 'Not a full accessibility course — just the basics everyone should check: enough contrast (WCAG asks 4.5 : 1 for text), no tiny text, usable without a mouse. Component libraries like shadcn/ui handle much of this. And you can ask the agent to check.' },
  ]],
  ['15-avoiding-ai-slop', [
    { kind: 'visual', title: 'Unchosen vs chosen', visual: 'slop-vs-designed', steps: 1, notes: 'AI sites look alike because nobody decided. Write a DESIGN.md with a direction and a list of don’ts. Design repos and skills: on the website, Files → Resources.' },
  ]],
  ['16-testing', [
    { kind: 'visual', title: 'Three ways to test a website', visual: 'test-ways', steps: 2, notes: 'You can always test as a person and report back in plain words. The agent can also open the site in a browser and try it, once it has a browser tool connected (Playwright or the webapp-testing skill). And it can write small automatic checks that run after every change — optional, your choice.' },
  ]],
  ['17-shipping', [
    { kind: 'visual', title: 'From localhost to a shareable link', visual: 'hosting', steps: 2, notes: 'Another option, if you use the Claude app: ask Claude to publish it as an artifact — a claude.ai link, private until you share it. That is how the demo preview was shared. Not something we do today — just so you know it exists. Building the site and putting it on a host gives you a link anyone can open. Several services have free plans for small sites.' },
  ]],

  // ============================================================== PART 5
  ['18-working-with-an-agent', [
    part(5, 'Reflection', 'What did we do — and what did the agent do?', 18, 18),
    { kind: 'visual', title: 'Who did what', visual: 'who-does-what', steps: 2, notes: 'The agent also thinks, plans and checks — it works at every step. The difference is who decides: it proposes, drafts and runs checks; you decide what it’s for, approve the plan, judge whether it’s right and good, and update the plan. The agent writes the code; you stay responsible for what it means.' },
    {
      kind: 'compare', title: 'What agents are good at — and where they fail', reveal: true,
      left: { label: 'Good at', points: ['A clear description → working code, fast', 'Explaining code and error messages', 'Boilerplate: the hundredth slider', 'Following written rules: CLAUDE.md, DESIGN.md, skills', 'Running checks and fixing what they find'] },
      right: { label: 'Where they fail', points: ['Vague goals → average results', 'Confident mistakes: our inside-out vase', 'Long chats → forgotten decisions', 'Taste: only the taste you give them', 'The physical world: your lab’s printer', 'Over-building: things nobody asked for'] },
      notes: 'Chapter 18. Each failure links back to something we did today: the plan (vague goals), the checks (confident mistakes), files instead of long chats, DESIGN.md (taste), the printer and material profiles (physical world).',
    },
    {
      kind: 'table', title: 'Habits worth keeping', head: ['Habit', 'In practice'],
      rows: [
        ['Plan first, in a file', 'PLAN.md — approve narrowly'],
        ['Small steps; keep track', 'PROGRESS.md, rewind and a copy of the folder make mistakes cheap'],
        ['Read the steps', 'not just the final message'],
        ['Ask for explanations', '“Explain what you changed, as if to a first-year student”'],
        ['Check what’s expensive to get wrong', 'printability, closed shapes, file orientation'],
        ['Write repeated instructions down', 'CLAUDE.md, a skill'],
        ['Fresh chat per task', 'decisions live in files'],
        ['Say no', 'refusing and explaining why is part of the loop'],
      ],
      notes: 'The eight habits from chapter 18. If short on time, point at three: plan in a file, small steps, say no.',
    },
    {
      kind: 'table', title: 'For discussion', head: ['Theme', 'Question'], reveal: true,
      rows: [
        ['Authorship', 'If the agent wrote every line, who designed the configurator? What did you contribute?'],
        ['Understanding', 'How much code do you need to understand? Do you need to calculate the beam yourself?'],
        ['Taste and sameness', 'If everyone uses the same models, will every website — and every vase — converge?'],
        ['Responsibility', 'The checks said “ready to print” and it collapsed in the kiln. Whose fault is it?'],
        ['Skills and labour', 'What should an architecture student learn now? What becomes more valuable?'],
        ['Cost', 'Tokens are energy and money. When is it worth it?'],
      ],
      notes: 'Pick two or three themes and let the room talk. The architecture analogy for understanding: you don’t calculate the beam, but you must know when the engineer’s answer is wrong.',
    },
    { kind: 'statement', text: 'The best prompt you’ll write is the one you thought about before typing.', sub: 'Where next: a challenge card at home · another configurator — a chair, a brick, a lamp · the real prompts on the Files page.' },
  ]],
]

export const DECK: Slide[] = sections.flatMap(([slug, slides]) => slides.map((s) => ({ ...s, chapter: s.chapter ?? slug })))

/** Index of the first slide of a chapter (for "Present this chapter"); falls back to the nearest earlier chapter. */
export const firstSlideOf = (slug: string) => {
  const i = DECK.findIndex((s) => s.chapter === slug)
  if (i >= 0) return i
  const n = Number(slug.slice(0, 2))
  for (let k = n - 1; k >= 0; k--) {
    const j = DECK.findIndex((s) => s.chapter?.startsWith(String(k).padStart(2, '0')))
    if (j >= 0) return j
  }
  return 0
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
