# 14 · 3D interactions

> **Part 4 — Craft and quality** · ~8 min

**In one sentence:** a 3D viewer is an interface too — how you move around the object, and how the object responds to you, decides whether it feels like a tool or a toy.

---

## The basics people expect

| Interaction | Mouse | Touch | Ours |
|---|---|---|---|
| Orbit | drag | one finger | ✓ |
| Zoom | scroll | pinch | ✓, with limits so you can't fly inside the vase or lose it |
| Pan | right-drag | two fingers | kept, but the target re-centres on the vase when the height changes |
| Reset / named views | — | — | **3/4 · Front · Top** buttons — like Rhino's named views |

## Constraints are kindness

We limit the camera on purpose:

- **Can't go below the table** (`maxPolarAngle`) — looking up through the floor is disorienting.
- **Min/max distance** scale with the vase size — you can't zoom into nothing or out to a dot.
- **Target follows the vase** — change the height and the camera keeps it centred.

## Feedback while configuring

- **Live update:** the vase changes as you drag, at draft quality, then refines. The UI says "refining…" in small type, so a brief blockiness is understood, not alarming.
- **Section:** a clipping plane cuts the vase so you see the wall thickness — the check becomes visible.
- **Material response:** clay is matte, PETG has a slight gloss, resin is glossy (roughness and clearcoat from the material profile).

## Ideas worth building (challenge cards)

| Idea | Why it's good |
|---|---|
| **Highlight problems on the model** — colour the faces that overhang too much in red | Turns a sentence ("38° at 62 mm") into something you *see* |
| **Measure mode** — hover to see diameter at that height | Architects love dimensions |
| **Turntable** — slow auto-rotation on the landing page, stops on touch | Shows the object; must respect reduced-motion |
| **Scale reference** — a ghosted hand, A4 sheet or 1€ coin next to the vase | Size is meaningless without a reference |
| **Layer preview** — scrub through the print layer by layer | Connects screen to machine |
| **Compare** — two vases side by side | Design is choosing |

## Motion: subtle, short, optional

UI animation should be under ~250 ms and never block the user. Big movement (camera fly-throughs, scroll-driven stories) is for the landing page, not the tool. And always: respect `prefers-reduced-motion`.

For motion inspiration, see the GSAP and Emil Kowalski skills in [`resources/design-repos.md`](../../resources/design-repos.md) — e.g. a landing page where the vase is "printed" layer by layer as you scroll.

## Try it

```text
Add an overhang heat-map toggle: when on, colour each part of the vase
by how much the wall leans outward (neutral below the material's limit,
amber near it, red above it). Keep it fast: compute colours per vertex
when the mesh is built, not every frame. Plan first.
```

---

**Next:** [15 · Avoiding AI slop →](../15-avoiding-ai-slop/README.md)
