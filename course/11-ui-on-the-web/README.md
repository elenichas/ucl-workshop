# 11 · UI on the web

> **Part 4 · Craft and quality**

**In one sentence:** first make it work, then make it good — build the working core with plain controls, and only then design the interface around it.

---

## First make it work, then make it good

We did **not** start with a beautiful interface. We built it in two moves:

1. **It works.** The algorithm and a 3D view, with plain browser sliders. Ugly, but every number does something — and we can test the logic.
2. **Designed around it.** Once the logic was stable, we designed the app around it: grouped steps, the vase given the most space, one accent colour, clear print verdicts.

Why this order? If you design first, every change to the logic (a new parameter, a new way to start) means redesigning the screen. Design what you know works.

| 1 · It works | 2 · Designed around it |
|---|---|
| Browser default sliders | Sliders with labels, exact values, units, help text |
| Everything in one long column | Grouped into steps: Shape · Surface · Make |
| "FAIL Wall thickness —" | Icon + verdict + one sentence with numbers |
| No hierarchy | The vase is the hero; controls are the workbench |

When you get to step 2, a good prompt is:

```text
The configurator works. Now let's design the interface around it.
Before changing anything: what should people see first, what can be
grouped, and what can be hidden until it's needed?
```

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
