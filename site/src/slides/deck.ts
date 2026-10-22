import { CHAPTERS } from '@/pages/course'
import { getPreset, newDesign, surfaceFor, type Design } from '@/design/design'
import type { Slide } from './types'

/**
 * THE DECK — one continuous presentation, chapter by chapter.
 * Slides are short on purpose: the chapter text in /course is the "read later" version.
 */
const chapter = (slug: string, notes?: string): Slide => {
  const c = CHAPTERS.find((x) => x.slug === slug)!
  return { kind: 'chapter', number: c.number, title: c.title, part: c.part, summary: c.summary, notes, chapter: slug }
}

const twist = (deg: number): Design => ({ ...newDesign(), name: `Twist ${deg}°`, surface: { ...newDesign().surface, values: { ...newDesign().surface.values, twist: deg } } })

const sections: [string, Slide[]][] = [
  // -------------------------------------------------------------------------
  ['00-welcome', [
    { kind: 'title', title: 'Prompt to Print', subtitle: 'Building a parametric vase configurator with Claude Code', meta: 'A 3-hour workshop · UCL', notes: 'Welcome. Today is not about becoming web developers — it is about learning to think like people who build digital tools with an AI agent.' },
    { kind: 'vase', title: 'Today we build this', caption: 'Shape it · see it · check it · download it — all in the browser', designs: ['amphora', 'hex', 'moon', 'lantern'].map((id) => ({ label: getPreset(id).name, design: getPreset(id) })), notes: 'Click through: a round amphora, a twisted hexagon, a sphere, a carved lantern. Each started in a different way. Drag to orbit if you like.' },
    { kind: 'bullets', title: 'Why a vase?', reveal: true, points: ['Inputs — sliders, a printer, a material', 'A process — an algorithm turns numbers into geometry', 'Rules — “clay can’t overhang more than ~25°”', 'Outputs — a 3D view, a print report, files', 'Small enough for one afternoon, real enough to print'], notes: 'A vase is the smallest project that still has everything a real digital tool has. If you know Grasshopper: parameters, definition, geometry.' },
    { kind: 'statement', text: 'Don’t type “build me a vase configurator”.', sub: 'You would get something. It would look like everything else, and you wouldn’t understand it.', notes: 'The one rule of the workshop. We will come back to it in chapter 05.' },
    { kind: 'visual', title: 'Instead: think, plan, build small, reflect', visual: 'plan-loop', steps: 5, notes: 'This loop is the whole course. The website is the excuse.' },
  ]],
  // -------------------------------------------------------------------------
  ['01-fundamentals', [
    chapter('01-fundamentals'),
    { kind: 'statement', text: 'A language model predicts the next piece of text.', sub: 'No database of facts. No memory between conversations. At scale, that is surprisingly capable.', notes: 'Demystify first. Everything else follows from this.' },
    { kind: 'visual', title: 'Models read and write tokens', visual: 'tokens', steps: 1, notes: 'A token is roughly three quarters of a word. Tokens are also how usage is counted — chapter 03.' },
    { kind: 'visual', title: 'A chat answers. An agent acts.', visual: 'chat-vs-agent', steps: 1, notes: 'An agent is a model in a loop with tools: read files, edit files, run commands. Claude Code is an agent.' },
    { kind: 'visual', title: 'The agent loop', visual: 'agent-loop', steps: 5, notes: 'Click through a real example: think, read a file, look at it, edit, run the tests, answer.' },
    { kind: 'bullets', title: 'Why this matters for you', reveal: true, points: ['It only knows what is in its context — otherwise it guesses', 'It gives the average answer — that is why AI websites look alike', 'It can be wrong with total confidence', 'You are the one who checks'], notes: 'These four points come back in every chapter.' },
    { kind: 'visual', title: 'What happens when you open a website', visual: 'web-request', steps: 3, notes: 'A website is files a browser downloads and runs. Our app is a static site: the server only hands over files; all the vase computing happens on your laptop.' },
    { kind: 'table', title: 'HTML · CSS · JavaScript', head: ['File', 'Job', 'In architecture'], rows: [['HTML', 'Structure and content', 'The plan: which rooms exist'], ['CSS', 'Colour, type, spacing, layout', 'Materials and finishes'], ['JavaScript', 'Behaviour: what happens when you drag', 'Building services — things that move']], reveal: true },
    { kind: 'visual', title: 'A repo is a folder with a history', visual: 'repo-timeline', steps: 4, notes: 'Git keeps the history, GitHub hosts it. Our demo has a tag for every stage — students can jump to any of them.' },
    { kind: 'visual', title: 'The stack is a set of decisions', visual: 'stack-layers', steps: 6, notes: 'We decide the stack. We do not leave it to the agent. Every plan includes the stack card.' },
    { kind: 'bullets', title: 'A word about packages', points: ['Most of the stack is code written by others, downloaded by npm', 'Skills and plugins for Claude Code are the same', 'Look before you install: who made it, who uses it, what licence'] },
  ]],
  // -------------------------------------------------------------------------
  ['02-what-is-claude-code', [
    chapter('02-what-is-claude-code'),
    { kind: 'statement', text: 'Claude Code works inside your project folder.', sub: 'It reads your files, changes them, runs commands and checks the results — while you watch and steer.' },
    { kind: 'visual', title: 'What happens in the background', visual: 'claude-code-steps', steps: 6, notes: 'Read the tool calls, not just the final message. That is “what happens in the background”.' },
    { kind: 'table', title: 'The tools it uses', head: ['Tool', 'Does', 'Why you care'], rows: [['Read · Glob · Grep', 'open and search files', 'it learns your project instead of guessing'], ['Edit · Write', 'change or create files', 'this is where the code changes'], ['Bash', 'run commands: npm test, git', 'powerful — so it asks first'], ['Web search', 'look things up', 'docs it was not trained on'], ['Subagents', 'hand a sub-task to a helper', 'keeps the main conversation focused']] },
    { kind: 'bullets', title: 'Staying in control', reveal: true, points: ['Permissions — it asks before editing or running; “no” is a valid answer', 'Plan mode — it proposes, changes nothing until you approve', 'Esc — stop it mid-way and redirect', 'Rewind + git — mistakes are cheap'] },
    { kind: 'visual', title: 'Giving it lasting knowledge', visual: 'knowledge-files', steps: 4, notes: 'Files beat chat: they survive /clear and they cost tokens only when used.' },
    { kind: 'visual', title: 'Skills load only when relevant', visual: 'skill-loading', steps: 1, notes: 'Progressive disclosure: names and descriptions are always visible, the body is read when a request matches.' },
    { kind: 'table', title: 'Skills worth knowing for this project', head: ['Skill', 'From', 'Use it for'], rows: [['frontend-design', 'Anthropic', 'UI that is not generic'], ['webapp-testing', 'Anthropic', 'Claude opens the site in a browser and checks it'], ['skill-creator', 'Anthropic', 'writing your own skills'], ['printability-review', 'this repo', 'fabrication rules, explained'], ['vase-design-language', 'this repo', 'keeping the UI on DESIGN.md']] },
    { kind: 'statement', text: 'If you explain the same thing twice, write it down.', sub: 'A line in CLAUDE.md, or a skill.' },
  ]],
  // -------------------------------------------------------------------------
  ['03-tokens-usage-cost', [
    chapter('03-tokens-usage-cost'),
    { kind: 'visual', title: 'What fills the context', visual: 'context-window', steps: 5, notes: 'Everything here is re-read on every turn. That is why long conversations get slow and expensive.' },
    { kind: 'bullets', title: 'Why long chats go wrong', reveal: true, points: ['Cost — you hit your usage limit sooner', 'Speed — more to read, slower answers', 'Quality — early decisions get diluted, the agent forgets and contradicts itself', 'Compaction summarises — and summaries lose detail'] },
    { kind: 'visual', title: 'Two ways to the same result', visual: 'token-compare', steps: 1 },
    { kind: 'table', title: 'Working economically', head: ['Habit', 'Why it saves tokens'], rows: [['Plan first', 'a wrong build costs 10× a conversation'], ['Small steps', 'small context, mistakes caught early'], ['One task per chat, then /clear', 'stop re-reading old history'], ['Point to files', 'not “look at everything”'], ['Short CLAUDE.md', 'read on every turn'], ['“Tell me only what failed”', 'summaries, not dumps']], reveal: true },
  ]],
  // -------------------------------------------------------------------------
  ['04-setup-first-conversation', [
    chapter('04-setup-first-conversation'),
    { kind: 'code', title: 'Get the project running', lang: 'shell', code: 'git clone <the repo link>\ncd ucl-workshop/site\nnpm install        # download the packages\nnpm run dev        # open the link it prints\n\n# in another terminal, in ucl-workshop/\nclaude', caption: 'localhost means “this computer”: the site runs only on your laptop.' },
    { kind: 'code', title: 'Your first prompt: ask, don’t order', lang: 'prompt', code: 'I’m an architecture student and new to web development.\nExplain this project to me: what are the main folders, and how\ndoes a slider change end up as a new vase on screen?\nKeep it short and use an analogy from Grasshopper.', caption: 'Nothing changes. Watch which files it reads — that is it building a map.' },
    { kind: 'visual', title: 'The whole loop, once', visual: 'first-loop', steps: 3 },
  ]],
  // -------------------------------------------------------------------------
  ['05-starting-systematically', [
    chapter('05-starting-systematically', 'The most important chapter. Do not skip.'),
    { kind: 'statement', text: 'Every gap you leave, the model fills — with the average.', sub: 'Planning is deciding which gaps you want to fill yourself.' },
    { kind: 'visual', title: 'From idea to plan to small steps', visual: 'plan-loop', steps: 5 },
    { kind: 'visual', title: 'Five ways to start', visual: 'five-starts', steps: 4, notes: 'Students pick the one that matches how they think. Copy-paste prompts are in hands-on/starting-points.' },
    { kind: 'code', title: 'Starting point 1 · Interview me', lang: 'prompt', code: 'I want to build a web app: a configurator for 3D-printable vases.\nBefore writing any code, interview me about what it needs.\nAsk ONE question at a time and wait for my answer.\nCover: who uses it, what they control, what they get at the end,\nconstraints (printers, materials), how it should feel.\nThen write PLAN.md and stop.' },
    { kind: 'statement', text: '“Which printers will students use?”', sub: 'We didn’t know. So printers and materials became editable profiles — and “our lab only has X” became an exercise. A question changed the design.', notes: 'True story from planning this course: prompts/01-interview.md.' },
    { kind: 'code', title: 'The stack card — in every plan', lang: 'prompt', code: 'Tech stack (do not change without asking me):\n- Vite + React + TypeScript\n- Tailwind CSS for styling\n- UI components: shadcn/ui (Radix underneath)\n- 3D: React Three Fiber + drei (three.js)\n- Rhino export: rhino3dm', caption: 'The component library is your choice — but write it down.' },
    { kind: 'bullets', title: 'Approving well', reveal: true, points: ['Read the whole plan. Cross things out.', '“Out of scope” is your friend', 'Approve narrowly: “Implement step 1 only, then stop.”', 'Plans change — update PLAN.md first, then the code'] },
  ]],
  // -------------------------------------------------------------------------
  ['06-parameters', [
    chapter('06-parameters'),
    { kind: 'statement', text: 'Every parameter is a decision you give away.', sub: 'A configurator with 40 sliders is not generous. It is a designer who didn’t decide.' },
    { kind: 'bullets', title: 'Five questions for every parameter', reveal: true, points: ['Does the user care?', 'Can they understand it?', 'Does it make a visible difference?', 'What range keeps it beautiful and printable?', 'What is the default — the design most people will get?'] },
    { kind: 'visual', title: 'The start decides the controls', visual: 'ways-to-start', steps: 4, notes: 'A sphere has no belly position. A box has corners. Each way of starting exposes its own controls.' },
    {
      kind: 'vase', title: 'Same app, different starting points', caption: 'Round · sphere · box · polygon · cone',
      designs: (['round', 'sphere', 'box', 'polygon', 'cone'] as const).map((id) => ({ label: id, design: { ...newDesign(), start: id, name: id, surface: surfaceFor('none') } })),
      notes: 'Click through. Point out how each one is described differently — three diameters, an ellipse with two cuts, a rounded rectangle, a polygon, a power curve.',
    },
    { kind: 'visual', title: 'The system map · 1  what each start exposes', visual: 'system-map', steps: 5, notes: 'Click to highlight Round, Sphere, Box, Draw and Carve. Same app, nine front doors, each with its own controls and its own way of describing the form. The live version is “How it works” in the configurator.' },
    { kind: 'visual', title: 'The system map · 2  one shared pipeline', visual: 'system-map-flow', steps: 4, notes: 'Each start adds its own steps, then all of them join the same pipeline. Carve is the only branch: a boolean cut, then everything is measured from the mesh instead of the profile. That is why its wall thickness cannot be guaranteed.' },
    { kind: 'bullets', title: 'Exercise · map your own configurator', points: ['For each way to start: its inputs, how the form is described, its steps, its outputs', 'Draw it on paper first — then compare with ours', 'Then ask Claude: “Read my code and draw the system map. Where does it differ from what I intended?”'], aside: 'Worksheet: hands-on/system-map-worksheet.md' },
    { kind: 'bullets', title: 'Constraints are profiles, not decoration', points: ['Printers: build volume, nozzle, materials, single or multi-colour', 'Materials: minimum wall, overhang limit, shrinkage, colours', 'Two small files — edit them and the whole app follows'], aside: 'site/src/config/printers.ts · materials.ts' },
  ]],
  // -------------------------------------------------------------------------
  ['07-the-algorithm', [
    chapter('07-the-algorithm'),
    { kind: 'visual', title: 'Inputs → process → outputs', visual: 'ipo', steps: 2 },
    { kind: 'visual', title: 'From numbers to a mesh', visual: 'algorithm', steps: 4, notes: 'The Grasshopper version: draw a profile, revolve, displace, offset, cap. Our code does the same, building triangles directly.' },
    { kind: 'code', title: 'The heart of it, in one line', lang: 'code', code: 'radius(t, θ) = startingPoint.radius(t, θ)      // round, sphere, box, drawn…\n             + pattern(t, θ) × depth           // ribs, honeycomb, knit…\n\ninner = radius − wallThickness', caption: 'Every starting point answers one question: how far is the wall from the axis, at this height and angle?' },
    { kind: 'vase', title: 'Twist is “a bit more angle the higher you go”', caption: 'twist 0° → 60° → 180° → 360°', designs: [0, 60, 180, 360].map((d) => ({ label: `${d}°`, design: twist(d) })) },
    { kind: 'visual', title: 'A real bug: the inside-out vase', visual: 'winding', steps: 3 },
    { kind: 'statement', text: '“It looks right” is not “it is right”.', sub: 'Write the test from what you know must be true. Then trust the green.' },
    { kind: 'visual', title: 'Carve: cutting one solid with another', visual: 'csg', steps: 3 },
  ]],
  // -------------------------------------------------------------------------
  ['08-the-3d-viewer', [
    chapter('08-the-3d-viewer'),
    { kind: 'vase', title: 'A viewport that lives in a web page', caption: 'WebGL · on the graphics card · no installation — drag to orbit', designs: [{ label: 'Honeycomb', design: getPreset('honey') }] },
    { kind: 'visual', title: 'Meshes, not NURBS', visual: 'mesh-resolution', steps: 2 },
    { kind: 'table', title: 'When the viewer is slow', head: ['Symptom', 'Fix'], rows: [['Laggy while dragging', 'draft mesh while dragging, full after 300 ms'], ['Fan spins when idle', 'only redraw when something changes'], ['Slow on sharp screens', 'cap the pixel ratio'], ['Slow everywhere', 'fewer triangles for display'], ['Gets slower over time', 'dispose old geometry'], ['Page freezes', 'move the maths to a web worker']], reveal: true },
    { kind: 'statement', text: 'Measure first. Then fix.', sub: '“Before changing anything: how long does the build take, how many triangles, how many frames per second?”' },
  ]],
  // -------------------------------------------------------------------------
  ['09-is-it-printable', [
    chapter('09-is-it-printable'),
    { kind: 'visual', title: 'Same vase, two printers', visual: 'print-compare', steps: 1, notes: 'Computed live by the same rules the app uses. The default amphora passes in PLA and fails on the clay printer because of the 2 mm wall.' },
    { kind: 'visual', title: 'Overhang: why clay is stricter', visual: 'overhang', steps: 2 },
    { kind: 'bullets', title: 'Say why, not just no', points: ['pass · warn · fail', 'One sentence with numbers: “The wall leans 38° at 62 mm; stoneware manages ~25°.”', 'Rules read the measured mesh — so they work for every way of starting', 'Honest about limits: no slicing, rule-of-thumb stability'] },
  ]],
  // -------------------------------------------------------------------------
  ['10-exports', [
    chapter('10-exports'),
    { kind: 'table', title: 'Three formats, three audiences', head: ['Format', 'What it is', 'Who opens it'], rows: [['STL', 'a list of triangles, no units, no colour', 'every slicer'], ['OBJ', 'readable text: points and faces', 'almost any 3D software'], ['3DM', 'Rhino’s own format, via rhino3dm', 'Rhino, Grasshopper']] },
    { kind: 'visual', title: 'Which way is up?', visual: 'axis-swap', steps: 2 },
    { kind: 'visual', title: 'From screen to object', visual: 'fab-path', steps: 3 },
  ]],
  // -------------------------------------------------------------------------
  ['11-ui-on-the-web', [
    chapter('11-ui-on-the-web'),
    { kind: 'images', title: 'Same functions, different experience', images: [{ src: 'slides/stage-05.png', label: 'stage-05 · function' }, { src: 'slides/stage-08.png', label: 'stage-08 · craft' }], notes: 'Function first, craft later — but craft is not optional.' },
    { kind: 'bullets', title: 'Principles we used', reveal: true, points: ['The object first — the 3D view never gets covered', 'Group and disclose: Start · Form · Surface · Finish · Make', 'Every slider also takes a typed number', 'One accent colour; status colours only for status', 'Every action answers: “refining…”, a verdict, a spinner'] },
    { kind: 'visual', title: 'Typography as a system', visual: 'type-system' },
  ]],
  // -------------------------------------------------------------------------
  ['12-responsiveness', [
    chapter('12-responsiveness'),
    { kind: 'visual', title: 'One site, every screen', visual: 'breakpoints', steps: 2 },
    { kind: 'bullets', title: '3D on a phone', points: ['One finger orbits, two pinch — so the page needs somewhere else to scroll', 'Weaker graphics: the draft mesh matters even more', 'Touch targets of at least ~40 px', 'Test on a real phone: npm run dev -- --host'] },
  ]],
  // -------------------------------------------------------------------------
  ['13-accessibility', [
    chapter('13-accessibility'),
    { kind: 'table', title: 'What we did', head: ['Principle', 'In Vessel'], rows: [['Every control has a label', 'sliders, swatches, editor points'], ['Keyboard works everywhere', 'arrows move sliders and profile points'], ['Focus is visible', 'a clay outline'], ['Colour is never alone', 'icon + word + colour'], ['Contrast passes', 'measured, and fixed once'], ['Changes are announced', 'the print verdict is a live region'], ['Reduced motion respected', 'animations switch off']], reveal: true },
    { kind: 'statement', text: 'How do you describe a 3D object to someone who can’t see it?', sub: '“Amphora: a round vase 180 mm tall and 136 mm at its widest, with a ribs pattern, in one colour PLA.” — generated from the design.' },
  ]],
  // -------------------------------------------------------------------------
  ['14-3d-interactions', [
    chapter('14-3d-interactions'),
    { kind: 'bullets', title: 'Constraints are kindness', reveal: true, points: ['Can’t go below the table', 'Zoom limits scale with the vase', 'Named views: 3/4 · Front · Top', 'Section view — the wall check becomes visible'] },
    { kind: 'bullets', title: 'Worth building', points: ['Colour the overhanging faces red', 'Hover to measure the diameter', 'A scale reference: a hand, an A4 sheet', 'Scrub through the print layer by layer'] },
  ]],
  // -------------------------------------------------------------------------
  ['15-avoiding-ai-slop', [
    chapter('15-avoiding-ai-slop'),
    { kind: 'visual', title: 'Unchosen vs chosen', visual: 'slop-vs-designed', steps: 1, notes: 'None of the slop is wrong. It is unchosen — what you get when nobody decided.' },
    { kind: 'bullets', title: 'How to avoid it', reveal: true, points: ['Decide a direction in one sentence with a point of view', 'Write a DESIGN.md: tokens, principles — and don’ts', 'Bring real references, not “like Apple”', 'Make the agent your critic: build → critique → fix the top 3', 'Restyle the components you copied in'] },
    { kind: 'table', title: 'Repos that help (resources/design-repos.md)', head: ['Family', 'Examples', 'Try on the vase app'], rows: [['DESIGN.md files', 'Awesome DESIGN.md · Google DESIGN.md', 'same app in three borrowed languages'], ['Taste & critique skills', 'Impeccable · Hallmark · Taste Skill · UI/UX Pro Max', 'study a gallery site → DESIGN.md'], ['Motion', 'Emil Kowalski · GSAP · Scroll World', 'scroll “prints” the vase'], ['Effects', 'React Bits · Canvas UI', 'one clay-grain shader'], ['Environment', 'Open Design', 'a local design studio']] },
    { kind: 'code', title: 'The “study” workflow', lang: 'prompt', code: '1. Read resources/references/gallery.png. Write DESIGN.alt.md:\n   layout, type, colour, tone — tokens at the top, then don’ts.\n   Don’t touch code.\n2. (You edit DESIGN.alt.md — your taste goes in here.)\n3. Following DESIGN.alt.md, restyle the configurator. Plan first.\n4. Critique against DESIGN.alt.md. Fix only the top 3.' },
  ]],
  // -------------------------------------------------------------------------
  ['16-testing', [
    chapter('16-testing'),
    { kind: 'visual', title: 'Three levels of checking', visual: 'test-levels', steps: 2 },
    { kind: 'code', title: 'A test is fabrication knowledge a computer can check', lang: 'code', code: "it('a 2 mm wall is fine for PLA but fails for clay', () => {\n  expect(wall(check(design, 'fdm-desktop', 'pla'))).toBe('pass')\n  expect(wall(check(design, 'clay', 'stoneware'))).toBe('fail')\n})" },
    { kind: 'statement', text: 'Did the test change, or the code?', sub: 'Agents sometimes “fix” a red test by weakening it. Put a rule in CLAUDE.md.' },
  ]],
  // -------------------------------------------------------------------------
  ['17-shipping', [
    chapter('17-shipping'),
    { kind: 'visual', title: 'From git push to a public link', visual: 'deploy-flow', steps: 3 },
    { kind: 'bullets', title: 'Before you share the link', points: ['Works on a phone', 'Keyboard-only run-through', 'All tests green', 'No placeholder or fake content', 'You opened an exported file in Rhino or a slicer'] },
  ]],
  // -------------------------------------------------------------------------
  ['18-working-with-an-agent', [
    chapter('18-working-with-an-agent'),
    { kind: 'visual', title: 'Who did what', visual: 'who-does-what', steps: 2 },
    { kind: 'compare', title: 'Agents are…', reveal: true, left: { label: 'good at', points: ['clear description → working code', 'explaining code and errors', 'boilerplate', 'following written rules', 'running tests and fixing'] }, right: { label: 'weak at', points: ['vague goals → average results', 'confident mistakes', 'long sessions → forgetting', 'taste of their own', 'your lab’s real printer'] } },
    { kind: 'bullets', title: 'For discussion', reveal: true, points: ['Authorship — if the agent wrote every line, who designed it?', 'Understanding — how much code do you need to read?', 'Sameness — will every website, and every vase, converge?', 'Responsibility — “ready to print”, and it collapsed in the kiln', 'Skills — what becomes more valuable now?'] },
    { kind: 'statement', text: 'The best prompt you’ll write is the one you thought about before typing.', sub: 'Now go and make one.' },
  ]],
]

export const DECK: Slide[] = sections.flatMap(([slug, slides]) => slides.map((s) => ({ ...s, chapter: s.chapter ?? slug })))

/** Index of the first slide of a chapter (for "Present from here"). */
export const firstSlideOf = (slug: string) => Math.max(0, DECK.findIndex((s) => s.chapter === slug))

