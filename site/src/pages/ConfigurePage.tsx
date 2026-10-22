import { useMemo, useState, type ReactNode } from 'react'
import { Scissors } from 'lucide-react'
import { DEFAULT_PARAMS, PARAMS, PRESETS } from '@/config/parameters'
import { getMaterial, MATERIALS } from '@/config/materials'
import { getPrinter, PRINTERS } from '@/config/printers'
import { estimates, overall, runChecks } from '@/checks/printability'
import type { VaseParams } from '@/geometry/types'
import { useVase } from '@/state/useVase'
import { usePrefersDark } from '@/state/usePrefersDark'
import { VaseViewer, type CameraView } from '@/viewer/VaseViewer'
import { ParamSlider } from '@/components/ParamSlider'
import { ChecksPanel } from '@/components/ChecksPanel'
import { ExportPanel } from '@/components/ExportPanel'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const VIEWS: { id: CameraView; label: string }[] = [
  { id: 'three-quarter', label: '3/4' },
  { id: 'front', label: 'Front' },
  { id: 'top', label: 'Top' },
]

export default function ConfigurePage() {
  // ---- INPUTS ---------------------------------------------------------------
  const [params, setParams] = useState<VaseParams>(DEFAULT_PARAMS)
  const [name, setName] = useState('Amphora')
  const [printerId, setPrinterId] = useState(PRINTERS[0].id)
  const [materialId, setMaterialId] = useState(PRINTERS[0].materials[0])
  const [colorId, setColorId] = useState(getMaterial(PRINTERS[0].materials[0]).colors[0].id)
  const [view, setView] = useState<CameraView>('three-quarter')
  const [viewNonce, setViewNonce] = useState(0)
  const [section, setSection] = useState(false)

  const printer = getPrinter(printerId)
  const material = getMaterial(materialId)
  const color = material.colors.find((c) => c.id === colorId) ?? material.colors[0]
  const set = (key: keyof VaseParams, v: number) => setParams((p) => ({ ...p, [key]: v }))

  // A printer only accepts some materials, and each material has its own colours.
  function choosePrinter(id: string) {
    const next = getPrinter(id)
    setPrinterId(id)
    if (!next.materials.includes(materialId)) chooseMaterial(next.materials[0])
  }
  function chooseMaterial(id: string) {
    setMaterialId(id)
    setColorId(getMaterial(id).colors[0].id)
  }

  // ---- PROCESS --------------------------------------------------------------
  const { mesh, isDraft } = useVase(params)
  const results = useMemo(() => runChecks({ params, mesh, printer, material }), [params, mesh, printer, material])
  const verdict = overall(results)
  const est = estimates({ mesh, printer, material })
  const dark = usePrefersDark()

  // ---- OUTPUTS --------------------------------------------------------------
  const description = `${name}: a vase ${Math.round(params.height)} mm tall and ${Math.round(mesh.stats.maxDiameter)} mm at its widest, ${
    params.ribCount > 0 ? `${params.ribCount} ribs twisted ${params.twist}°` : 'smooth sides'
  }${params.waveCount > 0 ? `, ${params.waveCount} ripples` : ''}, in ${color.name} ${material.name}.`

  const groups = [
    { id: 'shape', label: 'Shape' },
    { id: 'surface', label: 'Surface' },
    { id: 'print', label: 'Make' },
  ] as const

  return (
    <div className="mx-auto grid max-w-[1600px] lg:h-[calc(100dvh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* 3D stage */}
      <section aria-label="3D preview" className="relative h-[52svh] min-h-[320px] border-b border-line lg:h-full lg:border-b-0 lg:border-r">
        <VaseViewer
          mesh={mesh}
          height={params.height}
          look={{ color: color.hex, ...material.look }}
          showSection={section}
          view={view}
          viewNonce={viewNonce}
          stage={dark ? '#26221E' : '#EAE5DB'}
          description={description}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 md:p-6">
          <div className="pointer-events-auto">
            <label htmlFor="vase-name" className="sr-only">Vase name</label>
            <input
              id="vase-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-[14ch] bg-transparent font-display text-4xl leading-none outline-none focus-visible:underline focus-visible:decoration-clay md:text-5xl"
            />
            <p className="mt-2 font-mono text-xs tabular-nums text-ink-muted">
              H {params.height.toFixed(0)} · Ø {mesh.stats.maxDiameter.toFixed(0)} mm · {est.grams.toFixed(0)} g
            </p>
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div role="group" aria-label="Camera view" className="flex">
              {VIEWS.map((v) => (
                <Button key={v.id} size="sm" variant="chip" aria-pressed={view === v.id} className="-ml-px font-mono text-xs"
                  onClick={() => { setView(v.id); setViewNonce((n) => n + 1) }}>
                  {v.label}
                </Button>
              ))}
            </div>
            <Button size="sm" variant="chip" aria-pressed={section} onClick={() => setSection((s) => !s)}>
              <Scissors aria-hidden /> Section
            </Button>
          </div>
        </div>
        <p aria-hidden className={cn('pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] text-ink-muted transition-opacity duration-200 md:left-6', isDraft ? 'opacity-100' : 'opacity-0')}>
          preview · refining…
        </p>
        <p className="pointer-events-none absolute bottom-3 right-4 hidden font-mono text-[11px] text-ink-muted md:block md:right-6">
          drag to orbit · scroll to zoom
        </p>
      </section>

      {/* Control panel */}
      <aside aria-label="Vase controls" className="px-4 pb-16 md:px-6 lg:overflow-y-auto">
        <section aria-labelledby="presets-title" className="pt-5">
          <h2 id="presets-title" className="section-label">Start from</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button key={p.id} size="sm" variant="chip" aria-pressed={name === p.name}
                onClick={() => { setParams(p.params); setName(p.name) }}>
                {p.name}
              </Button>
            ))}
          </div>
        </section>

        <Tabs defaultValue="shape" className="mt-6">
          <TabsList aria-label="Parameter groups">
            {groups.map((g) => <TabsTrigger key={g.id} value={g.id}>{g.label}</TabsTrigger>)}
          </TabsList>
          {groups.map((g) => (
            <TabsContent key={g.id} value={g.id}>
              {g.id === 'print' && (
                <div className="grid gap-4 py-3">
                  <Field label="Printer" hint={printer.description}>
                    <NativeSelect id="printer" value={printerId} onChange={(e) => choosePrinter(e.target.value)}>
                      {PRINTERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </NativeSelect>
                  </Field>
                  <Field label="Material" hint={material.description}>
                    <NativeSelect id="material" value={materialId} onChange={(e) => chooseMaterial(e.target.value)}>
                      {MATERIALS.filter((m) => printer.materials.includes(m.id)).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </NativeSelect>
                  </Field>
                  <fieldset>
                    <legend className="text-sm font-medium">Colour <span className="font-normal text-ink-muted">— {color.name}</span></legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {material.colors.map((c) => (
                        <button key={c.id} type="button" onClick={() => setColorId(c.id)} aria-pressed={c.id === color.id} aria-label={c.name} title={c.name}
                          className="size-9 rounded-sm border border-line outline-offset-2 aria-pressed:outline-2 aria-pressed:outline-ink focus-visible:outline-2 focus-visible:outline-clay"
                          style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
              <div className="divide-y divide-line">
                {PARAMS.filter((d) => d.group === g.id).map((d) => (
                  <ParamSlider key={d.key} def={d} value={params[d.key]} onChange={(v) => set(d.key, v)} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 grid gap-8">
          <ChecksPanel results={results} verdict={verdict} />

          <section aria-labelledby="est-title">
            <h2 id="est-title" className="section-label">Estimate</h2>
            <dl className="mt-3 grid grid-cols-3 gap-px border border-line bg-line text-sm">
              <Stat label="Material" value={`${est.cm3.toFixed(0)} cm³`} />
              <Stat label="Weight" value={`${est.grams.toFixed(0)} g`} />
              <Stat label="Print time" value={`~${est.hours < 1 ? Math.round(est.hours * 60) + ' min' : est.hours.toFixed(1) + ' h'}`} />
            </dl>
            {material.shrinkage > 0 && (
              <p className="mt-2 text-xs leading-snug text-ink-muted">
                Clay shrinks while drying and firing: the finished vase will be about {(params.height * est.firedScale).toFixed(0)} mm tall.
              </p>
            )}
            <p className="mt-2 text-xs leading-snug text-ink-muted">Rough figures for comparing designs, not a quote.</p>
          </section>

          <ExportPanel params={params} name={name || 'vase'}
            disabledReason={verdict === 'fail' ? 'The print check found problems. You can still download the file — but fix them before sending it to the lab.' : undefined} />
        </div>
      </aside>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  const id = label.toLowerCase()
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="mt-1.5">{children}</div>
      <p className="mt-1.5 text-xs leading-snug text-ink-muted">{hint}</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper px-3 py-2.5">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-mono tabular-nums">{value}</dd>
    </div>
  )
}
