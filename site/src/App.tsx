import { useState } from 'react'
import { DEFAULT_PARAMS, PARAMS } from '@/config/parameters'
import { getMaterial, MATERIALS } from '@/config/materials'
import { getPrinter, PRINTERS } from '@/config/printers'
import { runChecks } from '@/checks/printability'
import { useVase } from '@/state/useVase'
import { VaseViewer } from '@/viewer/VaseViewer'
import { buildVase } from '@/geometry/buildVase'
import { download, to3DM, toOBJ, toSTL } from '@/export/formats'

// Stage 5: exports — STL for slicers, OBJ for anything, 3DM for Rhino.
export default function App() {
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const [printerId, setPrinterId] = useState('fdm-desktop')
  const [materialId, setMaterialId] = useState('pla')
  const printer = getPrinter(printerId)
  const material = getMaterial(materialId)
  const { mesh } = useVase(params)
  const results = runChecks({ params, mesh, printer, material })
  return (
    <main className="grid min-h-dvh grid-cols-[1fr_340px] bg-paper text-ink">
      <div className="h-dvh">
        <VaseViewer mesh={mesh} height={params.height} look={{ color: material.colors[0].hex, ...material.look }} description="3D view of the vase" />
      </div>
      <aside className="overflow-auto p-4 text-sm">
        <select value={printerId} onChange={(e) => setPrinterId(e.target.value)}>
          {PRINTERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
          {MATERIALS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        {PARAMS.map((d) => (
          <label key={d.key} className="block py-1">
            {d.label}: {params[d.key]} {d.unit}
            <input type="range" className="w-full" min={d.min} max={d.max} step={d.step} value={params[d.key]}
              onChange={(e) => setParams({ ...params, [d.key]: Number(e.target.value) })} />
          </label>
        ))}
        <div className="mt-4 flex gap-2">
          <button onClick={() => download(toSTL(buildVase(params)), 'vase.stl')}>STL</button>
          <button onClick={() => download(toOBJ(buildVase(params)), 'vase.obj')}>OBJ</button>
          <button onClick={async () => download(await to3DM(buildVase(params), 'vase'), 'vase.3dm')}>3DM</button>
        </div>
        <ul className="mt-4">
          {results.map((r) => <li key={r.id}><b>{r.verdict.toUpperCase()}</b> {r.title} — {r.detail}</li>)}
        </ul>
      </aside>
    </main>
  )
}
