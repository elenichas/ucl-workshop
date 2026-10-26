---
name: vase-design-language
description: Apply and protect the Vessel visual language (DESIGN.md) when creating or changing any UI in site/ — pages, components, colours, typography, layout, icons, motion. Use whenever the task touches how something looks, or when the user asks for a design critique of the site.
---

# Vessel design language

Read `DESIGN.md` at the repo root first. It is the brief. This skill is how to apply it.

## Before writing UI
1. Read `DESIGN.md` (tokens + principles + don'ts) and `site/src/index.css` (the same tokens as CSS variables).
2. Reuse what exists: `components/ui/` (button, slider, tabs, native-select), `.section-label`, `ControlField`, `StartPicker`, `ChecksPanel`. Extend a component rather than creating a near-duplicate.
3. State in one line how the change serves "The object first" and which principle it follows.

## Rules of thumb
- Colours only via tokens: `bg-paper`, `text-ink`, `text-ink-muted`, `border-line`, `bg-filament` (fill, black text on it), `text-accent` (when the accent must be text or a thin line), `text-ok|warn|fail`. Never raw hex in components (the 3D stage colour is the one exception).
- Filament yellow is the **only** accent: primary button, active step or choice, slider fill, focus ring. Never yellow text on the light ground.
- Type: one family, Archivo. `font-display` (wide, bold) only for big moments; `font-mono` gives the narrow, tabular figures for every number with a unit; `font-code` (a real monospace) only for code and prompts. Sentence case everywhere — no uppercase eyebrow labels.
- No "A · B · C" meta strings and no "→" added to button or link text. Labels and numbered markers only when they carry information.
- Separation by 1px `border-line` rules, not shadows. Radius `rounded-sm` (6px).
- The vase is drawn with layer lines: that is the one bold element. Keep everything around it quiet.
- Icons: lucide-react only, decorative ones `aria-hidden`.
- Every interactive element: visible label (or `aria-label`), keyboard reachable, `focus-visible` outline in the accent.
- Status = icon + word + colour, never colour alone.
- Motion ≤ 250 ms, and must be disabled by `prefers-reduced-motion` (already global in index.css).
- Check both light and dark mode; text contrast ≥ 4.5 : 1.

## Never
Purple/blue gradients, gradient text, glassmorphism, glowing blobs, emoji icons, a hero followed by three feature cards, fake testimonials or stats, lorem ipsum, pill-shaped everything, a second accent colour, cream backgrounds with a serif headline and terracotta accent.

## Critique mode
When asked to critique: list the 5 most important issues, each with *where*, *which DESIGN.md principle it breaks*, and *the smallest fix*. Don't change code until asked. If possible, take a screenshot (Playwright) and look at it before judging.
