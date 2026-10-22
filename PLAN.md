# PLAN.md — Vessel, a 3D-printable vase configurator

> Status: **approved** (this is the plan the demo was built from).
> It came out of an interview: we described the idea, Claude asked questions, we answered.
> See `prompts/01-interview.md` for that conversation.

## 1. One-sentence goal
A website where anyone can design a vase with a few controls, see it in 3D, know whether it can be printed on *their* printer and material, and download a file for Rhino or a slicer.

## 2. Users
- **Students and visitors** — want to play, get something beautiful, download it.
- **The fabrication lab** — wants files that will actually print on the machines they have.
- **The instructor** — wants the code to be readable and the process visible.

## 3. Inputs → Process → Outputs

```
INPUTS                      PROCESS                         OUTPUTS
──────                      ───────                         ───────
shape parameters   ─┐                                   ┌─> live 3D view
surface parameters ─┼─> geometry algorithm ─> mesh ─────┼─> printability report
printer profile    ─┤          │                        ├─> STL / OBJ / 3DM file
material profile   ─┘          └─> checks (rules) ──────┘─> stats: volume, weight, time
colour (visual only)
```

## 4. Parameters (v1)
| Group | Parameter | Unit | Range |
|---|---|---|---|
| Shape | Height | mm | 60–400 |
| Shape | Base diameter | mm | 40–250 |
| Shape | Belly diameter | mm | 40–300 |
| Shape | Top diameter | mm | 30–250 |
| Shape | Belly position | % of height | 10–90 |
| Surface | Ribs (count) | – | 0–48 |
| Surface | Rib depth | mm | 0–15 |
| Surface | Twist | degrees | -360–360 |
| Surface | Wave (vertical ripples count / depth) | –, mm | 0–12, 0–10 |
| Print | Wall thickness | mm | 0.8–8 |
| Print | Base thickness | mm | 1–10 |
| Look | Material | profile | PLA, PETG, Clay, Porcelain clay, Resin |
| Look | Colour | swatch | depends on material |

## 5. Printers and materials are **profiles**, not hard-coded
We do not yet know which printers the lab has. All machine and material limits live in
`site/src/config/printers.ts` and `site/src/config/materials.ts`. If the lab only has one printer,
we edit one file and the whole app (checks, warnings, colour choices) follows.

## 6. Printability checks (v1)
1. Fits in the build volume of the selected printer
2. Wall thickness ≥ material minimum and ≥ 2 × nozzle
3. Overhang angle ≤ material limit (clay is stricter than PLA)
4. Stable base (base vs. height and vs. widest point)
5. Rib/wave detail not smaller than the nozzle can draw
6. Solid, closed geometry (by construction, verified in tests)

## 7. Exports
- **STL** — for slicers (Cura, PrusaSlicer, Bambu Studio)
- **OBJ** — general 3D exchange
- **3DM** — opens directly in Rhino (mesh object, mm units)

## 8. Stack
Vite · React · TypeScript · Tailwind · Radix/shadcn-style UI · React Three Fiber + drei · rhino3dm · Vitest · Playwright

## 9. Pages
- `/` landing — what this is, two doors: *Configure* and *Course*
- `/configure` — the configurator
- `/course` and `/course/:chapter` — the workshop chapters, rendered from `course/`

## 10. Out of scope (v1)
Accounts, saving to a server, payment, ordering prints, textures in the export.

## 11. Build order (each step = one commit + tag)
1. Scaffold + stack → 2. Algorithm + tests → 3. Viewer → 4. Profiles + checks → 5. Exports → 6. UI craft, responsive, accessibility → 7. Tests, course pages, deploy
