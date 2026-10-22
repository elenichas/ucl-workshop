# 08 · Ways to start, the system map, slides → `stage-08-ways-to-start`, `stage-09-presentation`

After the first version, the instructor asked for three things.

## The requests (condensed)

> Make the chapters feel like a **presentation** — I'll share my screen. More visual: images, diagrams, animation, less text. And let me **export the course as PowerPoint** from the website.

> In the configurator, think of **other ways to start**: draw a profile, an image for inspiration, a sketch, start from a solid and subtract a shape, simple primitives — and show what each one means for the settings we expose. Colour, patterns and textures should be part of it.

> A **diagram** of inputs → process → outputs that maps each type of vase, the settings it exposes, what changes in the algorithm and in the results. Maybe as an exercise for students too.

Claude proposed a plan, then asked three questions (carve now or later? one deck or many? where does the map live?). Answers: carve now, one continuous deck, map in both the configurator and the course.

## What was built

- **`site/src/starts/`** — nine starting points. Each module *declares* its controls, how it describes the form, its own steps and what changes in the results, plus a `field` function. The UI **and** the system map are generated from these declarations.
- **The shared pipeline** (`geometry/buildVase.ts`) now takes any field. **Carve** builds a field vase and cuts it with `three-bvh-csg`, then measures the result from the mesh (`geometry/analyze.ts`).
- **Patterns** (`geometry/patterns.ts`): ten displacement functions that repeat a whole number of times around the vase, so there is no seam.
- **Image start** (`geometry/imageProfile.ts`): background from the corners → outline per row → 64 samples; plus k-means colours for the palette.
- **Slides** (`site/src/slides/`): the deck is *data*. The same data drives the in-browser presentation (reveals, animated SVG diagrams, live 3D) and the PowerPoint export (PptxGenJS: native text, diagrams rendered offscreen and captured as images, notes in the notes field).

## What the checks caught

1. **A test that every preset prints on its own printer** failed three presets on its first run: the Fluted column was 230 mm tall on a 220 mm printer; Honeycomb's cell walls overhung 54° in PETG; the Lantern's round holes had flat ceilings (90° overhangs). Fixes: 210 mm; softer cell walls; **diamond-shaped windows** (a box cutter spun 45°) — the same trick architects use for openings in 3D-printed concrete and clay.
2. **A sphere's lower half always overhangs.** The first test assumed a default sphere would pass in PLA; it didn't — the wall leans ~58° just above a small foot. The test was wrong, not the code: physics. The test was changed to a wide-footed sphere (passes PLA, fails clay), and the slide on overhangs now calls it "the classic trap".
3. **An infinite loop in the presenter**: syncing the slide number into the URL re-rendered the page, which re-synced the URL… Found by the browser test that jumps between slides. Fixed by only writing the URL when it actually differs.
4. **Black diagrams in PowerPoint**: the offscreen capture lost SVG colours that came from CSS classes. Fixed by copying the computed fill and stroke onto each shape before capturing — found by converting the exported .pptx to images and looking at them.
5. **The full system map didn't fit a slide** at a readable size. It became two slides: "what each start exposes" and "one shared pipeline".

> Look, measure, then fix — for slides as much as for geometry.

## Then: "it's too long"

> The presentation looks like a proper presentation — but it's over 100 slides and I'll never have time. Keep the website course as it is, but cut the deck to 40–45 slides: two per chapter, three at most. Fewer details, fewer technical explanations, and make it obvious when we change part.

The deck went from **102 to 43 slides**:
- No more chapter title slides. Instead, a **dark divider** opens each of the five parts, with the question that part answers and the chapters in it.
- Every content slide carries a small **"Part · chapter" label** and five tick marks showing where you are.
- Technical tables (tools, skills, performance fixes, file formats, accessibility checklist) left the slides — they stay in the chapter pages.
- What stayed: the ideas you'd want students to remember a week later — the agent loop, files over chat, plan before you build, the start decides the controls, "it looks right is not it is right", same vase on two printers, chosen vs unchosen design, did the test change or the code.

A useful habit: **the website is the book, the slides are the talk.** Same source, different jobs.

## And: "focus on what I'm teaching"

> The presentation should emphasise creating the configurator: the logic, the inputs and outputs, how to think about it, and the prompts. AI and front-end are complementary — one slide each is enough.

Down to **35 slides**, with the weight moved:
- **Part 2 · Thinking before building** grew to 11 slides: inputs → process → outputs, "every parameter is a decision you give away", the start decides the controls, the system map, constraints as inputs, and the mapping exercise.
- **Part 3 · Building it, prompt by prompt** now shows the **actual prompts** for each stage (algorithm, printability rules, adding a starting point) next to what they produced.
- **Parts 1 and 4** became context: three slides on agents, the stack and files-over-chat; one table for all of craft and quality, plus the slop comparison.

The lesson for students is the same one this whole log keeps repeating: a short, clear statement of what matters ("this is what I'm actually teaching") changed the result more than any amount of detail.
