import type { Design, FinishType } from '@/design/design'
import type { MaterialProfile } from '@/config/materials'
import { cn } from '@/lib/utils'

const FINISHES: { id: FinishType; label: string; help: string }[] = [
  { id: 'matte', label: 'Matte', help: 'No shine — raw clay, matte filament.' },
  { id: 'satin', label: 'Satin', help: 'A soft sheen.' },
  { id: 'gloss', label: 'Gloss', help: 'Glazed ceramic, glossy resin.' },
  { id: 'speckle', label: 'Speckled', help: 'Dark flecks, like a speckled stoneware under glaze.' },
]

/** Colour and finish. Colour is visual only — unless you ask for a gradient, which the printer must support. */
export function FinishPanel({ design, material, onChange }: { design: Design; material: MaterialProfile; onChange: (f: Design['finish']) => void }) {
  const f = design.finish
  const set = (patch: Partial<Design['finish']>) => onChange({ ...f, ...patch })
  const palette = design.imageStart?.palette ?? []

  const swatches = (target: 'colorA' | 'colorB') => (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {material.colors.map((c) => (
        <button key={c.id} type="button" title={c.name} aria-label={c.name} aria-pressed={f[target].toLowerCase() === c.hex.toLowerCase()}
          onClick={() => set({ [target]: c.hex })}
          className="size-9 rounded-sm border border-line outline-offset-2 aria-pressed:outline-2 aria-pressed:outline-ink focus-visible:outline-2 focus-visible:outline-accent"
          style={{ backgroundColor: c.hex }} />
      ))}
      {palette.map((hex) => (
        <button key={hex} type="button" title={`From your image ${hex}`} aria-label={`Colour from your image ${hex}`} aria-pressed={f[target].toLowerCase() === hex}
          onClick={() => set({ [target]: hex })}
          className="size-9 rounded-full border border-line outline-offset-2 aria-pressed:outline-2 aria-pressed:outline-ink focus-visible:outline-2 focus-visible:outline-accent"
          style={{ backgroundColor: hex }} />
      ))}
      <label className="relative flex size-9 cursor-pointer items-center justify-center rounded-sm border border-dashed border-ink-muted text-xs text-ink-muted hover:border-ink" title="Any colour">
        <span aria-hidden>+</span>
        <span className="sr-only">Pick any colour</span>
        <input type="color" value={f[target]} onChange={(e) => set({ [target]: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
      </label>
    </div>
  )

  return (
    <div className="grid gap-5 py-4">
      <fieldset>
        <legend className="text-sm font-medium">Colour</legend>
        <div className="mt-2 flex">
          {(['solid', 'gradient'] as const).map((m) => (
            <button key={m} type="button" aria-pressed={f.mode === m} onClick={() => set({ mode: m })}
              className={cn('-ml-px h-8 border border-line px-3 text-sm text-ink-muted first:ml-0 hover:text-ink', f.mode === m && 'border-ink bg-paper-raised text-ink')}>
              {m === 'solid' ? 'One colour' : 'Gradient'}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <p className="text-sm font-medium">{f.mode === 'gradient' ? 'Bottom colour' : 'Colour'} <span className="font-mono text-xs text-ink-muted">{f.colorA}</span></p>
        {swatches('colorA')}
      </div>
      {f.mode === 'gradient' && (
        <div>
          <p className="text-sm font-medium">Top colour <span className="font-mono text-xs text-ink-muted">{f.colorB}</span></p>
          {swatches('colorB')}
          <p className="mt-2 text-xs leading-snug text-ink-muted">A gradient only prints on a multi-colour printer, or as a glaze on clay. The print check will tell you.</p>
        </div>
      )}
      <fieldset>
        <legend className="text-sm font-medium">Finish</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {FINISHES.map((x) => (
            <button key={x.id} type="button" aria-pressed={f.type === x.id} onClick={() => set({ type: x.id })}
              className={cn('rounded-sm border border-line p-2 text-left text-sm text-ink-muted hover:border-ink hover:text-ink', f.type === x.id && 'border-ink bg-paper-raised text-ink')}>
              <span className="block font-medium">{x.label}</span>
              <span className="block text-xs text-ink-muted">{x.help}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <p className="text-xs leading-snug text-ink-muted">
        {material.name} comes in the colours above. Picked colours from elsewhere are a design intention — check with the lab what exists.
      </p>
    </div>
  )
}

export function finishLook(f: Design['finish']) {
  const base = {
    matte: { roughness: 0.92, metalness: 0, clearcoat: 0 },
    satin: { roughness: 0.55, metalness: 0, clearcoat: 0.15 },
    gloss: { roughness: 0.28, metalness: 0, clearcoat: 0.85 },
    speckle: { roughness: 0.6, metalness: 0, clearcoat: 0.5 },
  }[f.type]
  return { ...base, color: f.colorA, colorB: f.colorB, gradient: f.mode === 'gradient', speckle: f.type === 'speckle' }
}
