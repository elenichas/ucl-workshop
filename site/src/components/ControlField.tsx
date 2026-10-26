import { useId } from 'react'
import type { ChoiceControl, ControlDef, NumberControl } from '@/design/controls'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface Props {
  def: ControlDef
  value: number
  onChange: (v: number) => void
}

/** One control row, generated from its definition: a slider + exact number, or a set of choices. */
export function ControlField({ def, value, onChange }: Props) {
  return def.kind === 'choice' ? <ChoiceField def={def} value={value} onChange={onChange} /> : <NumberField def={def} value={value} onChange={onChange} />
}

/**
 * Label + exact value you can type + slider.
 * Typing matters: architects often know the exact number they want (e.g. 180 mm).
 */
function NumberField({ def, value, onChange }: { def: NumberControl; value: number; onChange: (v: number) => void }) {
  const id = useId()
  const pct = !!def.percent
  const shown = pct ? Math.round(value * 100) : Number(value.toFixed(2))
  const clamp = (v: number) => Math.min(def.max, Math.max(def.min, v))
  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">{def.label}</label>
        <div className="flex items-baseline gap-1 font-mono text-sm tabular-nums">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            className="w-16 border-b border-transparent bg-transparent text-right hover:border-line focus:border-accent focus:outline-none"
            min={pct ? def.min * 100 : def.min}
            max={pct ? def.max * 100 : def.max}
            step={pct ? 1 : def.step}
            value={shown}
            aria-describedby={`${id}-help`}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (!Number.isNaN(n)) onChange(clamp(pct ? n / 100 : n))
            }}
          />
          <span className="w-6 text-ink-muted">{def.unit}</span>
        </div>
      </div>
      <Slider className="mt-2" aria-label={def.label} min={def.min} max={def.max} step={def.step} value={[value]} onValueChange={([v]) => onChange(v)} />
      <p id={`${id}-help`} className="mt-1.5 text-xs leading-snug text-ink-muted">{def.help}</p>
    </div>
  )
}

function ChoiceField({ def, value, onChange }: { def: ChoiceControl; value: number; onChange: (v: number) => void }) {
  const id = useId()
  return (
    <fieldset className="py-3" aria-describedby={`${id}-help`}>
      <legend className="text-sm font-medium">{def.label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {def.options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'h-8 rounded-sm border border-line px-3 text-sm text-ink-muted hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-accent',
              value === o.value && 'border-ink bg-paper-raised text-ink',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p id={`${id}-help`} className="mt-1.5 text-xs leading-snug text-ink-muted">{def.help}</p>
    </fieldset>
  )
}
