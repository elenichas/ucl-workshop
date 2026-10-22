# 07 · The algorithm

> **Part 3 — Building the configurator** · ~12 min · code at tag `stage-02-algorithm`

**In one sentence:** the heart of the app is a pure function — numbers go in, a closed mesh of triangles comes out — and you can test it without ever looking at a screen.

---

## Inputs → process → output

```
VaseParams                      buildVase()                          VaseMesh
──────────                      ───────────                          ────────
height: 180          ┐   1. silhouette curve  r(t)               positions: [x,y,z, x,y,z, …]
baseDiameter: 80     │   2. decorate: ribs, twist, ripples       indices:   [a,b,c, a,b,c, …]
bellyDiameter: 130   ├─► 3. sample outer + inner surface    ─►   stats:     maxDiameter, overhang,
ribCount: 18         │   4. stitch into triangles                            minWall, volume…
twist: 60            │   5. close: rim, floor, bottom
wallThickness: 2     ┘
```

## Step by step (the Grasshopper version)

If you built this in Grasshopper you'd probably do:

1. **Draw a profile curve** — base → belly → top.
2. **Revolve** it around the vertical axis.
3. **Displace** the surface: ribs around, ripples up.
4. **Offset** inwards for the wall thickness.
5. **Cap** the bottom, **join** at the rim.
6. **Mesh** it for printing.

Our code does exactly that, but builds the mesh directly. Files in [`site/src/geometry/`](../../site/src/geometry/):

### 1 · The silhouette — `profile.ts → profileRadius(t)`

`t` goes from 0 (bottom) to 1 (top). The radius eases from base to belly, then from belly to top, using *smoothstep* — a curve that starts and ends flat, so the shape never has a kink.

### 2 · Decoration — `outerRadius(t, θ)`

At any height `t` and angle `θ` around the vase:

```
radius = silhouette(t)
       + ribDepth   × ½(1 + cos(ribCount × (θ + twist × t)))     ← ribs, rotating as we go up
       + rippleDepth × ½(1 − cos(2π × rippleCount × t))          ← horizontal bands
```

The twist is just "add a bit more angle the higher you go". That's the whole spiral.

### 3 · Sampling — a grid of points

We walk up the vase in `vertical` rings and around it in `radial` steps, computing a point at each. 256 × 192 ≈ 50,000 points per surface. Then the same for the inner surface, moved inwards by the wall thickness.

### 4 · Stitching — triangles

Each little square of the grid becomes **two triangles**. A triangle has a **front** and a **back**, decided by the order of its corners. Outer triangles must face out, inner ones face in.

### 5 · Closing — watertight

Rim (outer top ring → inner top ring), floor (inside), bottom (outside). The result is **watertight**: every edge is shared by exactly two triangles. Slicers need this to know what is "inside" the material.

## The output also measures itself

While building, the algorithm records facts the checks need (chapter 09):

- `maxDiameter` — does it fit the printer?
- `maxOverhangDeg` — how far does the wall lean outwards?
- `minWall` — thinnest wall actually produced
- `volume` — for weight and print-time estimates

## Why "pure" matters

`buildVase` has no buttons, no 3D, no React. Same input → same output, always. That means:

- We can **test it** automatically (`npm test`).
- The viewer, the checks and the exports all use the same function — **one source of truth**.
- An agent can change the UI without touching the geometry, and vice versa.

## A real story from building it

The first version failed two tests: "is it watertight?" and "is the volume right?" (off by 12%). The tests had caught that **the side walls were facing the wrong way** — inside-out — while the bottom faced correctly, so the surfaces didn't agree. On screen it looked perfect (we render both sides of every triangle). A slicer would have choked. Claude flipped the winding order, tests went green. See [`prompts/03-algorithm.md`](../../prompts/03-algorithm.md).

> **Lesson:** "it looks right" is not "it is right". Write the test first, then trust the green.

## Try it

```text
Explain the twist in site/src/geometry/profile.ts with a small diagram.
Then add a new parameter "lean" that tilts the top of the vase sideways
by up to 20 mm. Add it to config/parameters.ts, use it in profile.ts,
and add a test that a vase with lean is still watertight. Plan first.
```

---

**Next:** [08 · The 3D viewer →](../08-the-3d-viewer/README.md)
