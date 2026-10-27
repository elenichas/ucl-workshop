---
name: Vessel
colors:
  paper: "#E9EBE8"        # page ground: the grey of a print bed
  paper-raised: "#F7F8F6" # panels, cards, code
  stage: "#DCDFDB"        # behind the 3D vase
  ink: "#000000"          # true black, not a tinted near-black
  ink-muted: "#4F5652"
  line: "#C9CDC9"
  filament: "#FFC21A"     # the one accent, used as a FILL with black text on it
  accent: "#7A5300"       # the same accent when it must be text or a thin stroke
  ok: "#2F6B45"
  warn: "#A84A00"
  fail: "#B3261E"
  night-paper: "#1A1D1C"
  night-raised: "#242827"
  night-stage: "#2B302E"
  night-ink: "#F2F3F1"
  night-muted: "#A3AAA6"
  night-line: "#343936"
  night-accent: "#FFC21A"
typography:
  family: "Archivo (variable: width 62–125, weight 100–900)"
  wide:
    stretch: 125%
    weight: 700
    use: "Headlines, the vase name, chapter titles. Tight tracking."
  normal:
    stretch: 100%
    weights: [400, 500, 600]
    use: "Everything else."
  narrow:
    stretch: 75%
    features: "tabular-nums"
    use: "Numbers and their units: millimetres, degrees, grams, slide numbers."
  code:
    family: "JetBrains Mono"
    use: "Only for real code and prompts you type. Never for labels."
radius:
  sm: 6
---

# Vessel — design language

> The site's main style, **Design skill** in the style switch at the top of the website. It replaced the first look (`DESIGN.original.md`) after a review with Anthropic's frontend-design skill. A third style follows Apple's guidelines (`DESIGN.apple.md`).

## Subject
A tool for designing an object that a machine will build **layer by layer**. The vernacular is the print lab, not the gallery: the grey of a print bed, the bright spool of filament, the stack of layer lines on every printed part, numbers with units on the machine's screen.

## Principles
1. **The object first.** The 3D view takes the most space. Controls never cover it on desktop.
2. **One bold thing: layer lines.** The vase is drawn with visible print layers. Everything around it stays quiet.
3. **Grey, black, filament.** A cool grey ground, true black ink, one filament-yellow accent. Yellow is a *fill* (primary button, active step, slider fill, highlight) with black text on it — never yellow text on grey. When the accent must be text or a thin line, use `accent` (dark amber).
4. **One typeface, three widths.** Archivo wide for headlines, normal for text, narrow with tabular figures for numbers. A monospace face only appears where something is real code or a prompt to type.
5. **Numbers are honest.** Every value shows its unit (mm, °, g).
6. **Structure carries information.** Borders, numbers and labels only where they say something: a numbered marker only for a real sequence (the five steps); a label only when the content needs a name.
7. **Status colours mean something.** Green = prints, orange = check this, red = won't print. Always with a word and an icon.

## Typography
- Headlines in Archivo wide, bold, sentence case, tight tracking. No single-word colour or italic accents.
- Section headings are sentence case, normal width, weight 600. **No uppercase tracked eyebrow labels.**
- Body text 16px, line length under 80 characters.

## Components
- **Primary button:** filament fill, black text, 6px radius. Hover: black fill, white text.
- **Secondary button:** 1px `line` border, ink text. Hover: border ink.
- **Active state (tab, choice, chip):** filament marker (a filled badge or bar), not a colour change of the text.
- **Slider row:** label left, value + unit right in narrow figures, slider below. Track `line`, fill `filament`.
- **Check list item:** icon + one-line verdict + one-line reason in muted text.

## Don'ts
- No cream background, no serif display with a terracotta accent, no broadsheet hairline-and-columns look.
- No uppercase eyebrow labels, no "A · B · C" meta strings, no "→" appended to button or link text.
- No monospace for labels; no second accent colour; no gradients as decoration; no drop shadows on cards.
- No emoji as icons. One line-icon set (Lucide).
- No motion longer than 250 ms for UI; respect reduced motion.

## Dark mode
`night-paper` ground, `night-ink` text. The filament yellow works directly as text and lines on the dark ground. The 3D stage stays a little lighter than the page so the vase reads.
