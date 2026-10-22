# 06 · Parameters: what do we control?

> **Part 2 — Thinking before building** · ~10 min

**In one sentence:** a configurator is a set of decisions you hand over to the user — choosing *which* decisions, with what ranges and defaults, is the real design work.

---

## The designer's question

Every parameter is a decision you give away. Every decision you keep is your design. A configurator with 40 sliders isn't generous — it's a designer who didn't decide.

Ask, for each candidate parameter:

1. **Does the user care?** (Height: yes. Number of triangles: no — that's our job.)
2. **Can they understand it?** ("Belly position": with a help line, yes. "Bézier tangent weight": no.)
3. **Does it make a visible difference?**
4. **What range keeps it beautiful *and* printable?**
5. **What is the default?** The default is the design most people will get.

## Our parameters

| Group | Parameter | Unit | Range | Why it's there |
|---|---|---|---|---|
| **Shape** | Height | mm | 60–400 | The first thing anyone wants to set |
| | Base diameter | mm | 40–250 | Stability and character |
| | Belly diameter | mm | 40–300 | The main gesture of the silhouette |
| | Top diameter | mm | 30–250 | Open bowl vs. narrow neck |
| | Belly position | % of height | 10–90 | Low belly = heavy, grounded; high = tulip |
| **Surface** | Ribs | count | 0–48 | Texture, grip, catches light |
| | Rib depth | mm | 0–15 | |
| | Twist | ° | −360–360 | Turns ribs into a spiral |
| | Ripples | count | 0–12 | Horizontal rhythm |
| | Ripple depth | mm | 0–10 | |
| **Make** | Printer | profile | — | Sets build volume and nozzle |
| | Material | profile | — | Sets minimum wall, overhang limit, colours |
| | Colour | swatch | per material | Visual only — clay can't be "cobalt PLA" |
| | Wall thickness | mm | 0.8–8 | Strength vs. weight; material-dependent |
| | Floor thickness | mm | 1–10 | |

What we **deliberately left out**: handles, text/logos, colour in the exported files. (Non-round sections and a curve editor were left out of version 1 — and added in version 2, see below.)

## Different starts, different controls

The first version had one way to start: a round profile with three diameters. Version 2 has **nine** — and each one exposes its *own* controls, because each one describes the form differently.

| Start from | Controls it exposes | How the form is described |
|---|---|---|
| **Round** | height, base / belly / top diameter, belly position | three diameters eased into one curve, revolved |
| **Sphere** | diameter, squash, foot diameter, opening | an ellipse cut by two planes — **height is derived**, not set |
| **Box** | width, depth, height, corner rounding, top size, bulge, twist | a rounded rectangle (superellipse) scaled along the height |
| **Polygon** | sides, diameter, height, star depth, softness, top size, twist | a polygon or star outline, scaled and rotated |
| **Cone** | base / top diameter, height, curve | two circles joined by a power curve |
| **Draw a profile** | your points + height | a smooth spline through the points you drag |
| **Sketch** | your stroke + height, widest diameter, smoothing | a freehand line, resampled into 64 rows |
| **From an image** | the image + height, width, outline sensitivity, smoothing | the outline found in a photo or drawing — plus its colours |
| **Carve** | start solid, cutter, operation, size, position, tilt, spin, repeats | solid A − solid B (or A ∩ B): a boolean |

Profile-based starts (round, cone, draw, sketch, image) also get **cross-section** controls: turn every slice into a polygon or a star.

After the start, everyone shares the same next steps: **Surface** (ribs, ripples, knurl, honeycomb, scales, bricks, knit, organic noise, cells, or an image pressed in as relief), **Finish** (colour, two-colour gradient, matte / satin / gloss / speckled), and **Make** (printer, material, walls).

Notice what this teaches: *the starting point decides which questions make sense*. Asking a sphere for its "belly position" is meaningless. Asking a box for its "corner rounding" is the most important question.

## The system map

In the configurator, **How it works** opens a map of the whole system:

```
START FROM → CONTROLS IT EXPOSES → HOW THE FORM IS DESCRIBED → ITS OWN STEPS → SHARED PIPELINE → RESULTS
```

The active start is highlighted; click another row to switch. The map is generated from the same definitions that build the controls ([`site/src/starts/`](../../site/src/starts/)), so it can never drift from what the app does.

### Exercise — map your own configurator

Before you build, draw your system map on paper: for each way to start, its inputs, how the form is described, its steps, its outputs. Use the [worksheet](../../hands-on/system-map-worksheet.md). Then compare with ours — and afterwards ask Claude:

```text
Read my code and draw the system map of my configurator as a table:
start → controls → representation → steps → shared pipeline → results.
Where does it differ from what I intended in PLAN.md?
```

## Parameters vs. profiles

Notice two kinds of input:

- **Design parameters** — continuous, playful: sliders.
- **Constraints** — the printer and material. They're not decoration; they **change the rules**. Picking "clay" makes a 2 mm wall *wrong*.

We didn't know which printers the lab has. So instead of hard-coding one, constraints live in **profiles** — two small files anyone can edit:

- [`site/src/config/printers.ts`](../../site/src/config/printers.ts)
- [`site/src/config/materials.ts`](../../site/src/config/materials.ts)

If on the day we learn "the lab only has one clay printer", we edit one file and the app adapts: fewer options, stricter checks. **Real-world limits shaping the app is not a failure — it's the brief.**

## Describing parameters once

In the code, every control is described once, with its label, unit, range, step and help text — inside the starting point it belongs to ([`site/src/starts/`](../../site/src/starts/)). The UI *and* the system map are generated from those lists. To add a parameter you add one entry there and use it in that start's field function. One source of truth — the same idea as a well-organised Grasshopper definition with named sliders.

## Presets: defaults with a name

A blank configurator is intimidating. Presets ("Amphora", "Fluted column", "Tulip", "Stacked bowls", "Clay pot") are curated starting points — the designer's voice inside the tool.

## Exercise

Before chapter 07, write down (or ask Claude to interview you about):

- 3 parameters you would **add**
- 1 parameter you would **remove**
- For one of them: unit, range, default, help text, and which printability rule it affects.

---

**Next:** [07 · The algorithm →](../07-the-algorithm/README.md)
