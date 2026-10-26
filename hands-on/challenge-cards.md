# Challenge cards

Pick one. Each has a suggested starting stage, a goal, and a first prompt. Use plan mode, build in small steps, and ask the agent to note each working step in PROGRESS.md.

**Levels:** easy · medium · hard

---

## Easy

### G1 · A new preset
**Stage:** `main` · **Touches:** `design/design.ts` (PRESETS)
Design a preset you love and give it a name.
```text
Add a preset called "<name>" to PRESETS in site/src/design/design.ts,
starting from <round / sphere / box…> with these values: …
Then tell me which check, if any, it fails on the clay printer.
```

### G2 · A new colour palette
**Stage:** `main` · **Touches:** `config/materials.ts`
Add three colours to a material — maybe from a real filament brand or glaze catalogue.

### G3 · Our lab only has X
**Stage:** `main` · **Touches:** `config/printers.ts`, `config/materials.ts`
The real-world constraint card. Pretend the lab only has one clay printer (300 × 300 × 400 mm, 3 mm nozzle) and stoneware.
```text
Our lab only has one clay printer: 300×300×400 mm build, 3 mm nozzle,
stoneware only. Update the profiles so the app only offers what exists.
Then tell me which presets now fail, and propose changes to the presets
so they all print.
```

### G4 · Explain it back
**Stage:** any · **Touches:** nothing
```text
Explain how a change to the "Twist" slider travels through the code until
the vase on screen changes. Draw it as a simple ASCII diagram.
```

---

## Medium

### Y1 · A new printability rule
**Stage:** `stage-04-printability` or later · **Touches:** `checks/printability.ts` + its test
"Opening big enough", "Too heavy for the printer bed", "Print longer than 8 hours" — invent your own.
```text
Add a printability rule "<name>": <what it checks, with numbers>.
Write the test first and show me it failing, then implement the rule.
Follow the style of the existing rules.
```

### Y2 · A new parameter
**Stage:** `stage-08-ways-to-start` · **Touches:** one start in `starts/shapes.ts` (its controls + field), tests
"Lean" (the top shifts sideways), "Polygon" (an n-sided cross-section instead of a circle), "Foot" (a small step at the base).
```text
Add a parameter "<name>" that <does what>. Plan first: which files change,
what the range and default are, and which printability rule it affects.
After implementing, add a test that the vase is still watertight.
```

### Y3 · Wireframe toggle
**Stage:** `stage-03-viewer` or later · **Touches:** `viewer/VaseViewer.tsx`, `pages/ConfigurePage.tsx`
Show the triangles. Then add a "Resolution" control and watch the mesh change.

### Y4 · Share link
**Stage:** `main` · Save all parameters in the URL so you can send someone your exact vase.

### Y5 · Restyle it
**Stage:** `main` · **Touches:** `DESIGN.md`, `index.css`, components
```text
1. Read resources/references/<your-image>. Write DESIGN.alt.md capturing
   its layout, type, colour and tone (tokens in YAML at the top, then
   principles, then don'ts). No code.
2. [You edit DESIGN.alt.md]
3. In a copy of your folder, apply DESIGN.alt.md to the landing page and
   configurator. Keep all features working. Plan first.
4. Critique the result against DESIGN.alt.md: 5 biggest gaps; fix the top 3.
```

### Y6 · Accessibility audit
**Stage:** `main` · Keyboard-only, screen reader, contrast. Produce a table of problems, fix the worst two, add a Playwright test for one.

---

### Y7 · A new pattern
**Stage:** `stage-08-ways-to-start` or later · **Touches:** `site/src/geometry/patterns.ts` + its test
Waves, dots, a woven basket, Japanese seigaiha… Every pattern is one small function that returns 0–1 for a point on the wall.
```text
Add a surface pattern called "<name>" to geometry/patterns.ts: <describe it>.
Make it repeat a whole number of times around so there is no seam.
The existing test "every pattern stays closed" must still pass. Plan first.
```

### Y8 · Map your system
**Stage:** your own project · Fill in [`system-map-worksheet.md`](system-map-worksheet.md), then ask Claude to draw the map from your code and compare.

---

## Hard

### R0 · Add your own starting point
**Stage:** `stage-08-ways-to-start` · **Touches:** a new file in `site/src/starts/`, `starts/index.ts`
A teardrop, a gourd, a "stacked pebbles" start, a start from two drawn curves (front and side)… One module declares its controls, how it describes the form, its steps, its results — and a field function. It then appears in the UI **and** the system map automatically.
```text
Read site/src/starts/shapes.ts and starts/types.ts. Add a new starting
point "<name>" that <describe it>. Declare its controls, representation,
steps and results like the others. Add it to STARTS. Then check it appears
in the configurator and in "How it works", and that the watertight test
covers it. Plan first.
```


### R1 · Overhang heat-map
Colour the vase by how far the wall leans outward vs. the material's limit. Compute colours per vertex when the mesh is built, not every frame.

### R2 · Web worker
Move `buildVase` to a background thread so the page never freezes at high resolution. Measure before and after.

### R3 · Layer preview
A slider that "prints" the vase layer by layer (a clipping plane moving up), with the layer count from the printer's layer height.

### R4 · A different object
Fork the whole idea: a lamp shade, a planter with drainage, a brick, a façade tile, a chair leg. Start from a starting point and a fresh PLAN.md.

### R5 · Scroll story landing page
A landing page where scrolling "prints" the vase from bottom to top, then reveals the configurator. Respect reduced motion. (See GSAP skills in `resources/design-repos.md`.)

---

## For every card

- [ ] Plan first (plan mode or PLAN.md)
- [ ] Small steps — note each working step in PROGRESS.md
- [ ] Still works in the browser? (and `npm test`, if you have tests)
- [ ] Did a test change, or the code? (agents sometimes "fix" tests)
- [ ] Can you explain what changed, in your own words?
