# 11 · UI on the web

> **Part 4 — Craft and quality** · ~10 min · code at tag `stage-06-craft`

**In one sentence:** the interface is architecture for attention — hierarchy, proportion and material apply on a screen just as they do in a building.

---

## Compare two stages

Check out `stage-05-exports` and then `stage-06-craft`. Same functionality. Completely different experience.

| Stage 5 (function) | Stage 6 (craft) |
|---|---|
| Browser default sliders | Sliders with labels, exact values, units, help text |
| Everything in one long column | Grouped: Shape · Surface · Make |
| "FAIL Wall thickness —" | Icon + verdict + one sentence with numbers |
| No hierarchy | The vase is the hero; controls are the workbench |

## Principles we used

### Hierarchy
The **object first**. On desktop the 3D view takes the most space and the controls never cover it. Then: presets → parameters → print check → download — the order of a real workflow.

### Grouping and progressive disclosure
Twelve sliders at once is a wall. Tabs split them into **Shape / Surface / Make**. Help text sits under each control, small and muted: available, not shouting.

### Typography as a system
- **Serif** (Instrument Serif) for big moments only: the vase name, page titles.
- **Sans** (Instrument Sans) for the interface.
- **Mono** (JetBrains Mono) for numbers — equal-width digits so values don't jiggle as they change.

### Colour with meaning
Paper, ink, and **one** accent (clay). Green/amber/red only for print status — and always with a word and an icon (chapter 13).

### Controls that respect expertise
Architects often know the exact number. Every slider also has a **number field**: drag to explore, type to be precise.

### Feedback
Every action answers: the vase updates live; a small "refining…" appears while the draft is shown; the print verdict updates; download buttons show a spinner.

## Components: why shadcn/ui

Our buttons, sliders and tabs follow the **shadcn/ui** approach: instead of installing a sealed library, the component code is **copied into our project** ([`site/src/components/ui/`](../../site/src/components/ui/)). They are built on **Radix**, which handles the hard, invisible part (keyboard support, focus, screen readers). Because the code is ours, we restyled them to DESIGN.md — which is how you avoid the "every shadcn site looks the same" problem.

Alternatives students may pick: Radix alone (maximum freedom), Mantine or HeroUI (ready-styled, fastest start, harder to make distinctive), or none (Tailwind only).

## DESIGN.md: the design brief, in a file

Visual decisions live in [`DESIGN.md`](../../DESIGN.md): colours, type, spacing, principles and **don'ts**. Claude reads it before touching UI. It's the visual sibling of PLAN.md. More in chapter 15.

## Try it

```text
Read DESIGN.md. Then review the configurator panel as a senior product
designer: list the 5 biggest hierarchy or clarity problems, most important
first. Don't change code yet.
```

---

**Next:** [12 · Responsiveness →](../12-responsiveness/README.md)
