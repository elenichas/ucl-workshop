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

What we **deliberately left out** (for now): handles, non-round cross-sections, text/logos, a free-form curve editor, textures in the exported file. Each one is a great hands-on challenge.

## Parameters vs. profiles

Notice two kinds of input:

- **Design parameters** — continuous, playful: sliders.
- **Constraints** — the printer and material. They're not decoration; they **change the rules**. Picking "clay" makes a 2 mm wall *wrong*.

We didn't know which printers the lab has. So instead of hard-coding one, constraints live in **profiles** — two small files anyone can edit:

- [`site/src/config/printers.ts`](../../site/src/config/printers.ts)
- [`site/src/config/materials.ts`](../../site/src/config/materials.ts)

If on the day we learn "the lab only has one clay printer", we edit one file and the app adapts: fewer options, stricter checks. **Real-world limits shaping the app is not a failure — it's the brief.**

## Describing parameters once

In the code, every slider is described once, with its label, unit, range, step and help text ([`config/parameters.ts`](../../site/src/config/parameters.ts)). The UI is *generated* from that list. To add a parameter you add one entry there and use it in the algorithm. One source of truth — the same idea as a well-organised Grasshopper definition with named sliders.

## Presets: defaults with a name

A blank configurator is intimidating. Presets ("Amphora", "Fluted column", "Tulip", "Stacked bowls", "Clay pot") are curated starting points — the designer's voice inside the tool.

## Exercise

Before chapter 07, write down (or ask Claude to interview you about):

- 3 parameters you would **add**
- 1 parameter you would **remove**
- For one of them: unit, range, default, help text, and which printability rule it affects.

---

**Next:** [07 · The algorithm →](../07-the-algorithm/README.md)
