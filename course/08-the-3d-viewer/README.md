# 08 · The 3D viewer

> **Part 3 — Building it, prompt by prompt** · ~12 min · demo stage `stage-03-viewer`

**In one sentence:** a browser can draw 3D almost like Rhino's viewport — on the graphics card, with no installation — but it works with meshes, and you have to be careful with performance.

---

## A viewport that lives in a web page

When you orbit a model in Rhino, your graphics card (GPU) redraws thousands of triangles many times a second. Browsers can talk to the same GPU through **WebGL** (and its successor **WebGPU**). So a web page can be a 3D viewport:

- Anyone with the link can see the vase — phone, tablet, laptop.
- Nothing to install, no licence.
- It's the same idea as Rhino's viewport, Sketchfab, or a car configurator.

### One big difference for architects: meshes, not NURBS

Rhino models smooth NURBS surfaces and *meshes them for display*. The web only draws **triangles**. Our vase *is* a mesh from the start (chapter 07). Consequences:

- Smoothness depends on resolution — more triangles = smoother, slower.
- The `.3dm` we export contains a **mesh**, not a NURBS surface. Great for printing and visualising; if you want to keep modelling it as a surface in Rhino you'd rebuild it (or use the parameters in Grasshopper).

## The tools: three.js and React Three Fiber

- **three.js** — the most widely used 3D library on the web: scenes, cameras, lights, materials, meshes.
- **React Three Fiber (R3F)** — lets us write three.js as React components:

```tsx
<Canvas>
  <directionalLight position={[200, 400, 250]} />
  <mesh geometry={vaseGeometry}>
    <meshPhysicalMaterial color="#B5532F" roughness={0.8} />
  </mesh>
  <OrbitControls />
</Canvas>
```

- **drei** — a toolbox for R3F: orbit controls, soft contact shadows, environment lights, and more.

Our viewer: [`site/src/viewer/VaseViewer.tsx`](../../site/src/viewer/VaseViewer.tsx).

### The parts of any 3D scene

| Part | In our viewer |
|---|---|
| **Scene** | The world: vase, lights, shadow |
| **Camera** | Perspective, 30° field of view (a "long lens" — less distortion, more like an elevation) |
| **Lights** | A soft sky light + a key light + a fill light |
| **Material** | Physical material: roughness, metalness, clearcoat (glossy glaze or resin) — from the material profile |
| **Controls** | Orbit (drag), zoom (scroll/pinch), camera presets |
| **Renderer** | WebGL, on the GPU |

## When the viewer is slow — and how to fix it

Slowness on the web usually has a small number of causes. **Measure first** (ask Claude to add an FPS counter like `r3f-perf`, or use the browser's Performance panel), then fix:

| Symptom | Cause | Fix we used / you could use |
|---|---|---|
| Laggy while dragging a slider | Rebuilding a 100k-triangle mesh on every pixel of movement | **Draft while dragging, full when you stop** (debounce, 250 ms) — see `state/useVase.ts` |
| Laptop fan spins when idle | Redrawing 60×/s even when nothing changes | `frameloop="demand"`: only redraw when something changes |
| Slow on sharp screens | Drawing 3× the pixels on "retina" displays | Cap pixel ratio: `dpr={[1, 2]}` |
| Slow everywhere | Too many triangles | Lower resolution for display; full only for export |
| Shadows are expensive | Real-time shadow maps | Soft **contact shadow** rendered once (`frames={1}`) |
| Gets slower over time | Old geometries left in GPU memory | `geometry.dispose()` when replaced |
| Page freezes during big calculations | JavaScript runs on the same thread as the UI | Move geometry into a **web worker** (a background thread) — a good challenge |
| Slow first load | Large libraries downloaded up front | Load heavy things only when needed (we load rhino3dm only when you click "3DM") |

> **Prompt pattern:** *"The viewer feels slow when I drag the height slider. Before changing anything, measure: how long does buildVase take, how many triangles are we drawing, and how many frames per second do we get? Then propose the smallest fix."*

## Section view

The **Section** button uses a clipping plane — the same idea as a section box in Rhino — to cut the vase in half so you can see the wall and floor thickness. It's a tiny feature that makes the printability checks *visible*.

## Try it

```text
Add a "Wireframe" toggle next to the Section button that shows the mesh
triangles, so students can see how resolution changes the mesh.
Follow DESIGN.md for the button style.
```

---

**Next:** [09 · Is it printable? →](../09-is-it-printable/README.md)
