# 07 · Craft, then shipping → `stage-06-craft`, `stage-07-shipped`

## Craft — the request

```text
Step 6: make it a real interface, following DESIGN.md exactly.
shadcn/ui-style components (button, slider, tabs) in components/ui,
restyled to our tokens. Configure page: 3D stage on the left, controls on
the right on desktop; stacked on phones. Presets, tabs (Shape / Surface /
Make), a number field on every slider, print check with icon + words,
estimates, downloads. Landing page that is NOT a hero + three cards.
Accessibility: labels, keyboard, focus, skip link, aria-live verdict,
a generated text description of the 3D view, reduced motion. Dark mode.
```

## Shipping — the request

```text
Step 7: render the course chapters inside the site (read ../course at build
time, turn chapter links into routes, other links into GitHub links).
Playwright tests on desktop and phone. A GitHub Action that tests, builds
and deploys to Pages. Set Vite's base path for the /ucl-workshop/ sub-folder.
```

## What the checks found

- **14 browser tests** written: landing → configurator; default is printable; clay flags the thin wall and the Clay pot preset fixes it; keyboard moves a slider; STL and 3DM download; chapters render. On desktop **and** phone.
- **The 3DM bug** (see 06) was found here.
- **Contrast:** a script measured every text colour against its background. The clay accent was **4.32 : 1** — just under the 4.5 minimum for small text. Darkened to `#A6482A` (5.1 : 1) in both `index.css` and `DESIGN.md`.
- **Screenshot review** found two small things: chapter summaries showing raw `*asterisks*`, and a double rule above the first heading. Fixed.

> Look (screenshots), measure (contrast, tests), then fix. Taste and numbers together.
