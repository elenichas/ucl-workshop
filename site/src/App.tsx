import { useState } from 'react'
import { DEFAULT_PARAMS, PARAMS } from '@/config/parameters'
import { useVase } from '@/state/useVase'
import { VaseViewer } from '@/viewer/VaseViewer'

// Stage 3: a 3D viewer and plain browser sliders. Ugly on purpose — function first, craft later.
export default function App() {
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const { mesh } = useVase(params)
  return (
    <main className="grid min-h-dvh grid-cols-[1fr_320px] bg-paper text-ink">
      <div className="h-dvh">
        <VaseViewer mesh={mesh} height={params.height} look={{ color: '#C9BFAE', roughness: 0.6, metalness: 0, clearcoat: 0 }} description="3D view of the vase" />
      </div>
      <aside className="overflow-auto p-4 text-sm">
        {PARAMS.map((d) => (
          <label key={d.key} className="block py-1">
            {d.label}: {params[d.key]} {d.unit}
            <input type="range" className="w-full" min={d.min} max={d.max} step={d.step} value={params[d.key]}
              onChange={(e) => setParams({ ...params, [d.key]: Number(e.target.value) })} />
          </label>
        ))}
        <pre className="mt-4 font-mono text-xs">{JSON.stringify(mesh.stats, null, 1)}</pre>
      </aside>
    </main>
  )
}
