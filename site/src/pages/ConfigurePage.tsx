import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ImageUp, Network, Scissors, Sparkles, X } from 'lucide-react'
import { getMaterial, MATERIALS } from '@/config/materials'
import { getPrinter, PRINTERS } from '@/config/printers'
import { estimates, overall, runChecks } from '@/checks/printability'
import { SECTION_CONTROLS, type ControlDef } from '@/design/controls'
import { newDesign, surfaceFor, withStartValues, type Design } from '@/design/design'
import { getPattern, PATTERNS, SHARED_PATTERN_CONTROLS } from '@/geometry/patterns'
import { fileToPixels, toRelief } from '@/geometry/imageProfile'
import { getStart } from '@/starts'
import type { StartId } from '@/starts/types'
import { useVase } from '@/state/useVase'
import { usePrefersDark } from '@/state/usePrefersDark'
import { VaseViewer, type CameraView } from '@/viewer/VaseViewer'
import { ControlField } from '@/components/ControlField'
import { ChecksPanel } from '@/components/ChecksPanel'
import { ExportPanel } from '@/components/ExportPanel'
import { StartPicker, StartIcon } from '@/components/StartPicker'
import { FinishPanel, finishLook } from '@/components/FinishPanel'
import { PatternThumb } from '@/components/PatternThumb'
import { SystemMap } from '@/components/SystemMap'
import { ProfileEditor } from '@/components/editors/ProfileEditor'
import { SketchPad } from '@/components/editors/SketchPad'
import { ImageStart } from '@/components/editors/ImageStart'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const VIEWS: { id: CameraView; label: string }[] = [
  { id: 'three-quarter', label: '3/4' },
  { id: 'front', label: 'Front' },
  { id: 'top', label: 'Top' },
]

const VERDICT_STYLE = { pass: 'text-ok', warn: 'text-warn', fail: 'text-fail' } as const
const VERDICT_WORD = { pass: 'Ready to print', warn: 'Printable — check warnings', fail: 'Will not print as designed' } as const

export default function ConfigurePage() {
  // ---- INPUTS ---------------------------------------------------------------
  const [design, setDesign] = useState<Design>(newDesign)
  const [tab, setTab] = useState('start')
  const [view, setView] = useState<CameraView>('three-quarter')
  const [viewNonce, setViewNonce] = useState(0)
  const [section, setSection] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const start = getStart(design.start)
  const values = design.starts[design.start]
  const printer = getPrinter(design.printerId)
  const material = getMaterial(design.materialId)
  const patch = (p: Partial<Design>) => setDesign((d) => ({ ...d, ...p }))
  const setValue = (key: string, v: number) => setDesign((d) => withStartValues(d, d.start, { [key]: v }))

  function chooseStart(id: StartId) {
    setDesign((d) => ({ ...d, start: id, name: id === d.start ? d.name : getStart(id).name }))
  }
  function choosePrinter(id: string) {
    const next = getPrinter(id)
    setDesign((d) => {
      const materialId = next.materials.includes(d.materialId) ? d.materialId : next.materials[0]
      return { ...d, printerId: id, materialId, finish: fitFinish(d.finish, materialId) }
    })
  }
  function chooseMaterial(id: string) {
    setDesign((d) => ({ ...d, materialId: id, finish: fitFinish(d.finish, id) }))
  }

  // ---- PROCESS --------------------------------------------------------------
  const { mesh, isDraft } = useVase(design)
  const results = useMemo(() => runChecks({ design, mesh, printer, material }), [design, mesh, printer, material])
  const verdict = overall(results)
  const est = estimates({ mesh, printer, material })
  const dark = usePrefersDark()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowMap(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ---- OUTPUTS --------------------------------------------------------------
  const pattern = getPattern(design.surface.pattern)
  const description = `${design.name}: a ${start.name.toLowerCase()} vase ${Math.round(mesh.stats.height)} mm tall and ${Math.round(mesh.stats.maxDiameter)} mm at its widest, ${
    pattern.id === 'none' ? 'smooth' : `with a ${pattern.name.toLowerCase()} pattern`
  }, in ${design.finish.mode === 'gradient' ? 'a two-colour gradient' : 'one colour'} ${material.name}.`

  // On desktop the stage and the panel share one screen with the footer; the panel scrolls on its own.
  return (
    <div className="mx-auto grid max-w-[1600px] lg:h-[calc(100dvh-3.5rem-var(--footer-h,0px)-1px)] lg:min-h-[480px] lg:grid-cols-[minmax(0,1fr)_420px]">
      {/* 3D stage */}
      <section aria-label="3D preview" className="relative h-[52svh] min-h-[320px] border-b border-line lg:h-full lg:border-b-0 lg:border-r">
        <VaseViewer
          mesh={mesh}
          height={mesh.stats.height}
          look={{ ...finishLook(design.finish), metalness: 0 }}
          showSection={section}
          view={view}
          viewNonce={viewNonce}
          stage={dark ? '#26221E' : '#EAE5DB'}
          description={description}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 md:p-6">
          <div className="pointer-events-auto min-w-0">
            <label htmlFor="vase-name" className="sr-only">Vase name</label>
            <input id="vase-name" value={design.name} onChange={(e) => patch({ name: e.target.value })}
              className="w-full max-w-[14ch] bg-transparent font-display text-4xl leading-none outline-none focus-visible:underline focus-visible:decoration-clay md:text-5xl" />
            <p className="mt-2 font-mono text-xs tabular-nums text-ink-muted">
              {start.name} · H {mesh.stats.height.toFixed(0)} · W {mesh.stats.width.toFixed(0)} · D {mesh.stats.depth.toFixed(0)} mm · {est.grams.toFixed(0)} g
            </p>
            <button type="button" onClick={() => setTab('make')} className={cn('pointer-events-auto mt-2 text-xs font-medium underline-offset-4 hover:underline', VERDICT_STYLE[verdict])}>
              ● {VERDICT_WORD[verdict]}
            </button>
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div role="group" aria-label="Camera view" className="flex">
              {VIEWS.map((v) => (
                <Button key={v.id} size="sm" variant="chip" aria-pressed={view === v.id} className="-ml-px font-mono text-xs"
                  onClick={() => { setView(v.id); setViewNonce((n) => n + 1) }}>{v.label}</Button>
              ))}
            </div>
            <Button size="sm" variant="chip" aria-pressed={section} onClick={() => setSection((s) => !s)}>
              <Scissors aria-hidden /> Section
            </Button>
            <Button size="sm" variant="chip" onClick={() => setShowMap(true)}>
              <Network aria-hidden /> How it works
            </Button>
          </div>
        </div>
        <p aria-hidden className={cn('pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] text-ink-muted transition-opacity duration-200 md:left-6', isDraft ? 'opacity-100' : 'opacity-0')}>
          preview · refining…
        </p>
        <p className="pointer-events-none absolute bottom-3 right-4 hidden font-mono text-[11px] text-ink-muted md:block md:right-6">drag to orbit · scroll to zoom</p>
      </section>

      {/* Control panel */}
      <aside aria-label="Vase controls" className="px-4 pb-16 md:px-6 lg:overflow-y-auto">
        <Tabs value={tab} onValueChange={setTab} className="sticky top-0 z-10">
          <TabsList aria-label="Steps" className="bg-paper">
            {[['start', '1 Start'], ['form', '2 Form'], ['surface', '3 Surface'], ['finish', '4 Finish'], ['make', '5 Make']].map(([id, label]) => (
              <TabsTrigger key={id} value={id} className="px-1 text-[13px]">{label}</TabsTrigger>
            ))}
          </TabsList>

          {/* 1 — how to start */}
          <TabsContent value="start">
            <StartPicker design={design} onStart={(id) => { chooseStart(id); setTab('form') }} onPreset={(d) => { setDesign(d); setTab('form') }} />
          </TabsContent>

          {/* 2 — the controls of the chosen start */}
          <TabsContent value="form">
            <div className="flex items-start gap-3 border-b border-line py-4">
              <StartIcon id={start.id} className="text-clay" />
              <div>
                <h2 className="font-display text-2xl leading-none">{start.name}</h2>
                <p className="mt-1 text-xs leading-snug text-ink-muted">{start.blurb}</p>
                <p className="mt-1 text-xs leading-snug"><span className="text-ink-muted">Described as:</span> {start.representation}</p>
              </div>
            </div>
            {start.id === 'draw' && (
              <div className="py-4"><ProfileEditor points={design.profilePoints} height={values.height} onChange={(profilePoints) => patch({ profilePoints })} /></div>
            )}
            {start.id === 'sketch' && (
              <div className="py-4"><SketchPad samples={design.sketch} onChange={(sketch) => patch({ sketch })} /></div>
            )}
            {start.id === 'image' && (
              <div className="py-4">
                <ImageStart design={design} threshold={values.threshold} onChange={(imageStart) => patch({ imageStart })}
                  onUseColours={(p) => patch({ finish: { ...design.finish, colorA: p[0], colorB: p[1] ?? p[0] } })} />
              </div>
            )}
            {start.id === 'sphere' && (
              <p className="mt-3 border border-line bg-paper-raised p-2.5 text-xs leading-snug">
                <span className="font-medium">Height is derived:</span> <span className="font-mono">{mesh.stats.height.toFixed(0)} mm</span>. It follows from the diameter, the squash and where the two cuts are — you don't set it directly.
              </p>
            )}
            <ControlList controls={start.controls} values={values} onChange={setValue} />
            {start.usesSection && (
              <details className="mt-2 border-t border-line pt-3">
                <summary className="cursor-pointer text-sm font-medium">Cross-section <span className="font-normal text-ink-muted">— make it polygonal or star-shaped</span></summary>
                <ControlList controls={SECTION_CONTROLS} values={values} onChange={setValue} />
              </details>
            )}
          </TabsContent>

          {/* 3 — surface pattern */}
          <TabsContent value="surface">
            <div className="grid grid-cols-3 gap-2 py-4" role="group" aria-label="Pattern">
              {PATTERNS.map((p) => (
                <button key={p.id} type="button" aria-pressed={design.surface.pattern === p.id}
                  onClick={() => patch({ surface: surfaceFor(p.id, design.surface.values) })}
                  className={cn('rounded-sm border border-line p-1.5 text-left text-xs text-ink-muted hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-clay',
                    design.surface.pattern === p.id && 'border-ink bg-paper-raised text-ink')}>
                  <PatternThumb id={p.id} />
                  <span className="mt-1 block font-medium">{p.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs leading-snug text-ink-muted">{pattern.blurb} Patterns change the geometry, so they print.</p>
            {pattern.id === 'image' && <ReliefUpload design={design} onChange={(relief) => patch({ relief })} />}
            {pattern.id !== 'none' && (
              <ControlList
                controls={[...pattern.controls, ...SHARED_PATTERN_CONTROLS]}
                values={design.surface.values}
                onChange={(k, v) => patch({ surface: { ...design.surface, values: { ...design.surface.values, [k]: v } } })}
              />
            )}
          </TabsContent>

          {/* 4 — colour and finish */}
          <TabsContent value="finish">
            <FinishPanel design={design} material={material} onChange={(finish) => patch({ finish })} />
          </TabsContent>

          {/* 5 — make it */}
          <TabsContent value="make">
            <div className="grid gap-4 py-4">
              <Field id="printer" label="Printer" hint={printer.description}>
                <NativeSelect id="printer" value={design.printerId} onChange={(e) => choosePrinter(e.target.value)}>
                  {PRINTERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </NativeSelect>
              </Field>
              <Field id="material" label="Material" hint={material.description}>
                <NativeSelect id="material" value={design.materialId} onChange={(e) => chooseMaterial(e.target.value)}>
                  {MATERIALS.filter((m) => printer.materials.includes(m.id)).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </NativeSelect>
              </Field>
            </div>
            <ControlList
              controls={[
                { key: 'wallThickness', label: 'Wall thickness', unit: 'mm', min: 0.8, max: 8, step: 0.1, help: 'Thickness of the side wall. Clay needs much more than plastic.' },
                { key: 'baseThickness', label: 'Floor thickness', unit: 'mm', min: 1, max: 10, step: 0.1, help: 'Thickness of the bottom.' },
              ]}
              values={design.wall}
              onChange={(k, v) => patch({ wall: { ...design.wall, [k]: v } })}
            />
            <div className="mt-6 grid gap-8">
              <ChecksPanel results={results} verdict={verdict} />
              <section aria-labelledby="est-title">
                <h2 id="est-title" className="section-label">Estimate</h2>
                <dl className="mt-3 grid grid-cols-3 gap-px border border-line bg-line text-sm">
                  <Stat label="Material" value={`${est.cm3.toFixed(0)} cm³`} />
                  <Stat label="Weight" value={`${est.grams.toFixed(0)} g`} />
                  <Stat label="Print time" value={`~${est.hours < 1 ? Math.round(est.hours * 60) + ' min' : est.hours.toFixed(1) + ' h'}`} />
                </dl>
                {material.shrinkage > 0 && (
                  <p className="mt-2 text-xs leading-snug text-ink-muted">Clay shrinks while drying and firing: the finished vase will be about {(mesh.stats.height * est.firedScale).toFixed(0)} mm tall.</p>
                )}
                <p className="mt-2 text-xs leading-snug text-ink-muted">Rough figures for comparing designs, not a quote.</p>
              </section>
              <ExportPanel design={design} name={design.name || 'vase'}
                disabledReason={verdict === 'fail' ? 'The print check found problems. You can still download the file — but fix them before sending it to the lab.' : undefined} />
            </div>
          </TabsContent>
        </Tabs>
      </aside>

      {showMap && (
        <div role="dialog" aria-modal="true" aria-labelledby="map-title" className="fixed inset-0 z-50 overflow-y-auto bg-paper p-4 md:p-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">How it works</p>
                <h2 id="map-title" className="mt-2 font-display text-5xl leading-none">The system behind the configurator</h2>
                <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink-muted">
                  Every starting point exposes its own controls and describes the form in its own way. Then they all join one shared pipeline.
                  Your current start, <strong className="text-ink">{start.name}</strong>, is highlighted — click another row to switch.
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowMap(false)} aria-label="Close" autoFocus><X aria-hidden /></Button>
            </div>
            <SystemMap active={design.start} onSelect={chooseStart} className="mt-8" />
          </div>
        </div>
      )}
    </div>
  )
}

/** When the material changes, keep the colour if the new material has it; otherwise use its first colour. */
function fitFinish(f: Design['finish'], materialId: string): Design['finish'] {
  const m = getMaterial(materialId)
  const has = (hex: string) => m.colors.some((c) => c.hex.toLowerCase() === hex.toLowerCase())
  return has(f.colorA) ? f : { ...f, colorA: m.colors[0].hex, colorB: m.colors[1]?.hex ?? m.colors[0].hex }
}

function ControlList({ controls, values, onChange }: { controls: ControlDef[]; values: Record<string, number>; onChange: (key: string, v: number) => void }) {
  return (
    <div className="divide-y divide-line">
      {controls.map((c) => <ControlField key={c.key} def={c} value={values[c.key] ?? 0} onChange={(v) => onChange(c.key, v)} />)}
    </div>
  )
}

function ReliefUpload({ design, onChange }: { design: Design; onChange: (r: Design['relief']) => void }) {
  async function load(file: Blob) {
    const { pixels, preview } = await fileToPixels(file, 512)
    onChange({ ...toRelief(pixels), preview })
  }
  return (
    <div className="mt-4 border border-line p-3">
      <p className="text-sm font-medium">Relief image</p>
      <p className="text-xs text-ink-muted">Light areas stand out, dark areas stay flat. Wide images wrap best.</p>
      {design.relief && <img src={design.relief.preview} alt="Your relief image" className="mt-2 h-16 w-full object-cover" />}
      <div className="mt-2 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild>
          <label className="cursor-pointer"><ImageUp aria-hidden /> Upload image
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
          </label>
        </Button>
        <Button size="sm" variant="outline" onClick={async () => load(await (await fetch(`${import.meta.env.BASE_URL}samples/relief-waves.png`)).blob())}>
          <Sparkles aria-hidden /> Try a sample
        </Button>
      </div>
    </div>
  )
}

function Field({ id, label, hint, children }: { id: string; label: string; hint: string; children: ReactNode }) {
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
