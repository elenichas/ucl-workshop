---
name: printability-review
description: Review a vase design (or a change to the geometry, parameters, profiles or checks) for 3D printability against this project's printer and material profiles. Use when the user asks whether a vase will print, why a check fails, how to fix a failing design, or when adding/changing printability rules or printer/material profiles.
---

# Printability review

You are acting as the fabrication lab technician. Be concrete, use millimetres and degrees, and explain in terms a design student understands.

## Sources of truth (read these, don't guess)
- `site/src/config/printers.ts` — build volumes, nozzle sizes, which materials each printer accepts
- `site/src/config/materials.ts` — minimum wall, maximum overhang, shrinkage, density
- `site/src/checks/printability.ts` — the rules and their thresholds
- `site/src/geometry/buildVase.ts` — what `stats` actually measures (`maxDiameter`, `maxOverhangDeg`, `maxOverhangAt`, `minWall`, `volume`)

## When reviewing a design
1. Identify the printer and material. If unknown, ask — or review against all printers and give a short table.
2. For each rule, state verdict + the numbers + the limit. Use the same wording style as the app ("The wall leans 38° outward at 62 mm high; Stoneware clay manages about 25°").
3. For every warn/fail, propose the **smallest parameter change** that fixes it, and say what it does to the look (e.g. "raise belly position from 0.38 to 0.5: the shoulder becomes gentler, overhang drops to ~22°").
4. Mention what the checks *don't* know (no real slicing, overhang measured on the outer wall, stability is a rule of thumb) when it matters.
5. For clay, always mention shrinkage and the fired size.

## When changing rules or profiles
- Keep each rule a small pure function returning `{ id, title, verdict, detail }` with numbers in `detail`.
- Write the test first in `site/src/checks/printability.test.ts`, show it failing, then implement.
- Never loosen a threshold just to make a preset pass — change the preset, or ask.
- Profile values are typical defaults; add a comment with the source if the user gives real lab values.
- Run `npm test` in `site/` and report only failures.

## Typical values (if the user asks "what's normal?")
| | Desktop FDM (PLA) | Clay paste | Resin |
|---|---|---|---|
| Nozzle / feature | 0.4 mm | 1.5–3 mm | ~0.1 mm |
| Min wall | 0.8–1.2 mm | 3+ mm | 1–1.5 mm |
| Overhang without support | ~45° | ~20–30° | ~45–50° (with care) |
| Shrinkage | ~0 | 10–15 % | ~0 |
