# 03 · The algorithm → `stage-02-algorithm`

## The request (as a student could write it)

```text
Implement step 2 of PLAN.md: the vase algorithm, as pure TypeScript
functions in site/src/geometry/ — no React, no 3D yet.
Parameters in, a closed triangle mesh out (positions + indices), plus
measured stats: max diameter, steepest overhang, thinnest wall, volume.
Units mm, y up. Write tests: every preset is watertight, the height is
exact, the volume of a plain cylinder matches a hand calculation, a
straight cylinder has no overhang and a flared bowl does.
```

## What happened

Claude wrote `types.ts`, `profile.ts` (silhouette + ribs + twist + ripples), `buildVase.ts` (sampling, stitching, closing), `config/parameters.ts` and the tests.

**First test run: 2 of 7 failed.**

```
✗ produces a closed (watertight) mesh for every preset
✗ has a positive volume close to a hand calculation   (off by 12.7 %)
```

### The diagnosis
The side-wall triangles were wound the wrong way: their "front" faced inward, while the bottom and floor faced correctly. So:
- the edges where wall meets bottom were used twice *in the same direction* → not watertight;
- the volume formula (which adds outward-facing triangles and subtracts inward ones) gave the wrong total.

Claude worked out the direction of each triangle's normal by hand (a cross product), flipped the outer wall, inner wall and rim, and re-ran: **7 of 7 passed**.

### Why this is the most important story in the course
On screen, the inside-out vase looked **perfect** — the viewer draws both sides of every triangle. Only a slicer would have complained, after a student had already queued the print. The tests caught it in half a second, before any 3D existed.

> Write the test from what you *know* must be true (a cylinder's volume, a closed surface) — not from what the code currently does.

## The temporary page
Stage 2's page just prints the stats as text. Ugly on purpose: **prove it works before you make it pretty.**
