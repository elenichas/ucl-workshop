import { Download, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { buildVase } from '@/geometry/buildVase'
import { FULL, type VaseParams } from '@/geometry/types'
import { download, to3DM, toOBJ, toSTL } from '@/export/formats'

const FORMATS = [
  { id: 'stl', label: 'STL', note: 'for slicers — Cura, PrusaSlicer, Bambu Studio' },
  { id: 'obj', label: 'OBJ', note: 'general 3D exchange' },
  { id: '3dm', label: '3DM', note: 'opens in Rhino, millimetres' },
] as const

export function ExportPanel({ params, name, disabledReason }: { params: VaseParams; name: string; disabledReason?: string }) {
  const [busy, setBusy] = useState<string | null>(null)
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  async function run(format: (typeof FORMATS)[number]['id']) {
    setBusy(format)
    try {
      // Always export at full resolution, whatever the viewer is showing.
      const mesh = buildVase(params, FULL)
      if (format === 'stl') download(toSTL(mesh), `${slug}.stl`)
      if (format === 'obj') download(toOBJ(mesh), `${slug}.obj`)
      if (format === '3dm') download(await to3DM(mesh, name), `${slug}.3dm`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <section aria-labelledby="export-title">
      <h2 id="export-title" className="section-label">Download</h2>
      {disabledReason && <p className="mt-3 text-xs text-ink-muted">{disabledReason}</p>}
      <ul className="mt-3 grid gap-2">
        {FORMATS.map((f) => (
          <li key={f.id}>
            <Button variant="outline" className="h-auto w-full justify-between py-2.5" onClick={() => run(f.id)} disabled={!!busy}>
              <span className="flex items-baseline gap-3">
                <span className="font-mono">{f.label}</span>
                <span className="text-xs font-normal text-ink-muted">{f.note}</span>
              </span>
              {busy === f.id ? <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-label="Preparing file" /> : <Download aria-hidden />}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
