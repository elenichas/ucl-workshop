# 04 · The 3D viewer → `stage-03-viewer`

## The request

```text
Step 3 of PLAN.md: a 3D viewer with React Three Fiber + drei.
Orbit controls, soft lighting, a contact shadow. Turn the mesh from
buildVase into a three.js geometry. Use plain browser sliders for now —
craft comes later. Keep it fast while dragging.
```

## Decisions made up front (not after it got slow)

| Decision | Why |
|---|---|
| `frameloop="demand"` | Only redraw when something changes — idle page uses ~0 GPU |
| `dpr={[1, 2]}` | Cap pixel density on very sharp screens |
| Draft mesh while dragging, full mesh 250 ms after you stop (`state/useVase.ts`) | Rebuilding ~100k triangles on every pixel of slider movement would stutter |
| `geometry.dispose()` when replaced | Otherwise GPU memory grows with every change |
| Contact shadow rendered once | Real-time shadows are expensive and unnecessary for a still object |
| Double-sided material | So the inside of the vase is visible from above |

## Checked with a screenshot
Claude built the site and took a headless-browser screenshot to *look* at the result before committing — the vase rendered correctly, with ribs and twist visible.

## Later refinement
On the landing page the wide "Tulip" preset was cropped: the camera distance was based on height only. Fix: frame on `max(height, widest diameter)`.
