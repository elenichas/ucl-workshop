# 13 · Accessibility

> **Part 4 — Craft and quality** · ~8 min

**In one sentence:** accessibility is the web's equivalent of step-free access — designed in from the start, it helps everyone; bolted on later, it's expensive and ugly.

---

## Who we're designing for

- People who **can't use a mouse** (keyboard, switch devices)
- People using a **screen reader** (blind or low-vision)
- People with **colour blindness** (~1 in 12 men)
- People with **motion sensitivity**
- Everyone, on a sunny day, on a cracked phone screen, holding a coffee

## The checklist we applied

| Principle | In Vessel |
|---|---|
| **Every control has a label** | Each slider is linked to its label and has an `aria-label`; colour swatches are named ("Celadon glaze") |
| **Keyboard works everywhere** | Tab to any control; sliders move with arrow keys, Page Up/Down, Home/End (Radix gives us this) |
| **Focus is visible** | A clay-coloured outline shows where you are |
| **Skip link** | First Tab press offers "Skip to content" |
| **Colour is never the only signal** | Print status = icon + word + colour |
| **Contrast** | Text and background colours chosen to pass WCAG AA (≥ 4.5 : 1 for body text) |
| **Status changes are announced** | The print verdict uses `aria-live`, so a screen reader says "Will not print as designed" when it changes |
| **Reduced motion** | If the OS says "reduce motion", animations are switched off |
| **Real HTML elements** | Buttons are `<button>`, selects are `<select>` — they come with accessibility built in |

## The hard one: describing a 3D object

A screen reader can't "see" a WebGL canvas. So the 3D view carries a **text description, generated from the parameters**:

> "Amphora: a vase 180 mm tall and 136 mm at its widest, 18 ribs twisted 60°, in Bone PLA."

And all the important information — dimensions, weight, print verdict — is also in **text** elsewhere on the page. A blind user can design a vase, check it, and download it.

This is a nice design question to discuss: *what is the essential information in a 3D model, if you can't see it?*

## How to check

- **Keyboard only:** unplug the mouse. Can you change the height, pick clay, and download an STL?
- **Screen reader:** VoiceOver (Mac: `Cmd + F5`) or NVDA (Windows, free).
- **Automated:** Lighthouse in Chrome dev tools → Accessibility. Or ask Claude to run `axe` via Playwright.
- **Contrast:** any contrast checker, or Google's DESIGN.md linter checks it from the tokens.

## Try it

```text
Do an accessibility review of the configurator page. Check keyboard
navigation order, labels, contrast of every text colour against its
background (light and dark mode), and what a screen reader would announce.
Report problems as a table with severity. Don't fix yet.
```

---

**Next:** [14 · 3D interactions →](../14-3d-interactions/README.md)
