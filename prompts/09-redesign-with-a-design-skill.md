# 09 · Redesign with a design skill

## The prompt

```text
Forget the purpose of this website for now and focus on the website itself.
Review it using Anthropic's frontend-design skill and make any updates the
skill requires.
```

## What happened

1. **Review against the skill.** The skill lists what AI-generated design looks like right now. Our site matched almost all of it: a cream background with a serif headline and a terracotta accent, hairline rules with square corners, small uppercase labels above headings, phrases joined with middle dots, a monospace font for small labels, and arrows added to button text.
2. **A plan before code.** As the skill asks, Claude proposed a direction taken from the subject, *the print lab*, and an alternative (*glaze test tiles*), and asked which one to build. We chose the print lab, for the website and the slides.
3. **Brief first.** `DESIGN.md` was rewritten before any component: cool print-bed grey, true black, one filament-yellow accent used as a fill, one typeface (Archivo) at three widths, and one bold element, layer lines on the vase.
4. **Build.** Tokens and fonts changed in one place (`index.css`), so most of the site followed. Then the template habits were removed one by one, the layer lines were added to the 3D view as a small shader, and the slides and PowerPoint export were updated.
5. **Check.** Screenshots of every page in light and dark mode, on desktop and phone, and of every slide; contrast measured for each colour pair; all tests run.

## Lessons

- **A brief with a point of view is not enough.** Ours ("a ceramics studio's catalogue crossed with a technical drawing") sounded specific, but it described a mood, not the subject. The agent filled the mood with the most common look.
- **Take the visual language from the subject.** Print beds, filament, layer lines: things only this project has.
- **Spend boldness in one place.** One memorable element; everything else quiet.
- **Change the brief, then the code.** Because colours and fonts were tokens, most of the redesign was a few lines.
