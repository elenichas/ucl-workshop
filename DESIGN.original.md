---
name: Vessel
colors:
  paper: "#F3EFE7"
  paper-raised: "#FBF9F4"
  ink: "#1C1A17"
  ink-muted: "#5E5850"
  line: "#D9D2C5"
  clay: "#A6482A"
  clay-ink: "#8E3C1E"
  ok: "#2F6B45"
  warn: "#8A5F00"
  fail: "#A3291B"
  night: "#171512"
  night-raised: "#221F1B"
  night-ink: "#EEE8DD"
  night-muted: "#A79F92"
  night-line: "#3A352E"
  night-clay: "#D2714B"
typography:
  display:
    family: "Instrument Serif"
    weights: [400]
    use: "Headlines, the vase name, chapter titles. Large, never bold."
  body:
    family: "Instrument Sans"
    weights: [400, 500, 600]
    use: "Everything else."
  data:
    family: "JetBrains Mono"
    weights: [400]
    use: "Numbers: millimetres, degrees, grams. Tabular figures."
  scale: [12, 14, 16, 20, 28, 40, 64, 96]
spacing:
  unit: 4
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]
radius:
  none: 0
  sm: 2
  md: 4
---

# Vessel — original design language

> The first look of the site, kept for comparison. Choose **Original** in the style switch at the top of the website to see it. It is the brief the frontend-design review replaced: see `DESIGN.md` and chapter 15.

## Mood
A ceramics studio's catalogue crossed with a technical drawing. Calm, warm, precise.
The vase is the hero; the interface is the workbench around it. Think exhibition plinth, not app store.

## Principles
1. **The object first.** The 3D view takes the most space. Controls never cover it on desktop.
2. **Numbers are honest.** Every value shows its unit (mm, °, g). Data uses the mono font.
3. **Paper, ink, clay.** A warm off-white ground, near-black ink, one terracotta accent used sparingly
   (the primary action, the active state, the slider fill). No second accent colour.
4. **Lines, not shadows.** Separate areas with 1px rules in `line`, like a drawing sheet. No drop shadows on cards, no glass blur.
5. **Square-ish.** Radius 0–4px. No pill-shaped everything.
6. **Status colours mean something.** Green = prints, amber = check this, red = won't print. Always paired with a word and an icon, never colour alone.

## Typography
- Display serif for big moments only: page titles, the vase name, the hero line.
- Sans for UI. Labels are sentence case, 14px, weight 500.
- Mono for all values. Right-aligned in control rows.

## Components
- **Slider row:** label left, value + unit right (mono), slider below. Track `line`, fill `clay`.
- **Section:** small uppercase label with letter spacing (12px, `ink-muted`), a 1px rule above.
- **Primary button:** `ink` background, `paper` text, square corners. Hover: `clay`.
- **Check list item:** icon + one-line verdict + one-line reason in muted text.

## Don'ts
- No purple/blue gradients, no gradient text, no glowing blobs.
- No emoji as icons. Use one line-icon set (Lucide), 1.5px stroke.
- No "hero with three feature cards" template.
- No fake testimonials, fake stats or lorem ipsum.
- No motion longer than 250 ms for UI; respect reduced-motion.

## Dark mode
`night` ground, `night-ink` text, same clay accent. The 3D stage stays slightly lighter than the page so the vase reads.
