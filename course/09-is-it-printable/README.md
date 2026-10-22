# 09 · Is it printable?

> **Part 3 — Building the configurator** · ~10 min · code at tag `stage-04-printability`

**In one sentence:** printability is a set of small, explainable rules that compare the vase with the printer and the material — and the app should say *why*, not just *no*.

---

## From fabrication knowledge to code

Ask a fabrication technician "will this print?" and they will look at a few things. We turned each into a rule in [`site/src/checks/printability.ts`](../../site/src/checks/printability.ts):

| Rule | Compares | Typical limit |
|---|---|---|
| **Material ↔ printer** | Can this machine print this material at all? | Clay printer can't print PLA |
| **Fits the printer** | Widest diameter and height vs. build volume | e.g. 250 × 210 × 220 mm |
| **Wall thickness** | Thinnest wall vs. material minimum and 2 × nozzle | PLA 0.8 mm · clay 3 mm |
| **Overhangs** | Steepest outward lean of the wall vs. material limit | PLA ~45° · stoneware ~25° · porcelain ~20° |
| **Stands steady** | Base vs. height and vs. widest point | Small foot + tall body = tips over |
| **Surface detail** | Rib/ripple depth vs. nozzle size | Details smaller than the nozzle vanish |

The numbers come from **profiles** (chapter 06), so the same vase can pass in PLA and fail in clay. That's the point.

## Three verdicts, not two

- **pass** — fine
- **warn** — probably prints, worth a look
- **fail** — won't print as designed

And every result has **one sentence with numbers**: *"The wall leans 38° outward at 62 mm high; Stoneware clay manages about 25°. It may sag or collapse."* A designer can act on that. A red cross alone teaches nothing.

## Rules are small on purpose

Each rule is a little function: input → verdict + sentence. That makes them:

- easy to **read** (by you and by Claude)
- easy to **test** (`printability.test.ts`: "a 2 mm wall passes in PLA but fails in clay")
- easy to **add** — a perfect hands-on task

```ts
export const wallThickness: Rule = ({ mesh, printer, material }) => {
  const needed = Math.max(material.minWall, printer.nozzle * 2)
  const actual = mesh.stats.minWall
  const verdict = actual >= needed ? 'pass' : actual >= needed * 0.75 ? 'warn' : 'fail'
  return { id: 'wall', title: 'Wall thickness', verdict,
    detail: `Thinnest wall is ${actual} mm; ${material.name} needs at least ${needed} mm.` }
}
```

## Estimates

From the mesh volume and the material density we estimate **weight**, from the printer's flow rate a rough **print time**, and for clay the **fired size** (clay shrinks ~12–14% when dried and fired). These are rough numbers for comparing designs — and the UI says so.

## What our checks don't know

Be honest about the limits — this is a teaching tool, not a slicer:

- No real slicing (layer paths, seams, supports).
- Overhang is measured on the outer wall only.
- Stability is a rule of thumb, not physics.
- The lab's real machines will have their own quirks. **Ask the technician** and update the profiles.

## The custom skill

[`.claude/skills/printability-review/`](../../.claude/skills/printability-review/SKILL.md) packages this knowledge for Claude: when you ask *"will this vase print in porcelain?"*, it knows to read the profiles and rules, explain in fabrication terms, and suggest the smallest change that fixes it.

## Try it

```text
Add a printability rule "Opening big enough": warn if the top diameter is
smaller than 25 mm (you can't clean it or put flowers in), fail below 12 mm.
Add a test for it. Follow the style of the existing rules.
```

---

**Next:** [10 · Exports →](../10-exports/README.md)
