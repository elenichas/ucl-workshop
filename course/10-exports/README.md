# 10 · Exports: from screen to printer

> **Part 3 — Building the configurator** · ~8 min · code at tag `stage-05-exports`

**In one sentence:** a configurator is only useful if its output leaves the browser — as files that Rhino, slicers and fabrication labs understand.

---

## Three formats, three audiences

| Format | What it is | Who opens it |
|---|---|---|
| **STL** | A plain list of triangles. No units, no colour, nothing else. The universal printing format. | Slicers: Cura, PrusaSlicer, Bambu Studio, clay printer software |
| **OBJ** | Text: `v x y z` lines for points, `f a b c` for triangles. Human-readable. | Almost any 3D software, Blender, game engines |
| **3DM** | Rhino's native format, written with **rhino3dm** (Rhino's geometry library compiled to WebAssembly so it runs in the browser). Units set to millimetres. | Rhino, Grasshopper |

Code: [`site/src/export/formats.ts`](../../site/src/export/formats.ts).

## Details that matter (and that agents get wrong)

- **Which way is up?** three.js uses **Y-up**. Rhino and slicers use **Z-up**. Export without rotating and your vase arrives lying on its side. We rotate `(x, y, z) → (x, −z, y)` and there's a test for it.
- **Units.** STL has none — slicers assume millimetres. We work in mm everywhere, write "units: mm" in the headers, and set Rhino's unit system explicitly.
- **Resolution.** We always export at full resolution, even if the viewer is showing a draft.
- **Watertight.** Thanks to chapter 07, the mesh is closed, so slicers don't complain.
- **Heavy libraries load late.** rhino3dm is several megabytes; we only download it when someone clicks *3DM*.

## The whole fabrication path

```
Vessel (browser) ──STL──> slicer ──G-code──> printer ──> object
                 └─3DM──> Rhino ──(add a stand, a logo, an array of 20 vases…)──> STL ──> slicer
```

For **clay**: export STL, slice in the clay printer's software (often "vase mode" — a single continuous spiral wall), print, dry slowly, bisque fire, glaze, glaze fire. Remember the ~12% shrinkage.

## Try it

- Export your vase as 3DM and open it in Rhino. Check: is it upright? Is it in mm? Run `Check` on the mesh — is it closed?
- Open the STL in a slicer. How long does it say it takes? Compare with our estimate.

```text
Add a fourth export: a PNG "product shot" of the current 3D view at
2000 × 2000 px with the vase name and dimensions printed underneath.
```

---

**Next:** [11 · UI on the web →](../11-ui-on-the-web/README.md)
