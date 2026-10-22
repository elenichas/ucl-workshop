import { useId } from 'react'
import type { ParamDef } from '@/config/parameters'
import { Slider } from '@/components/ui/slider'

interface Props {
  def: ParamDef
  value: number
  onChange: (v: number) => void
}

/**
 * One control row: label + exact value you can type + slider.
 * Typing matters: architects often know the exact number they want (e.g. 180 mm).
 */
export function ParamSlider({ def, value, onChange }: Props) {
  const id = useId()
  const isPercent = def.unit === '%'
  const shown = isPercent ? Math.round(value * 100) : value
  const clamp = (v: number) => Math.min(def.max, Math.max(def.min, v))

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {def.label}
        </label>
        <div className="flex items-baseline gap-1 font-mono text-sm tabular-nums">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            className="w-16 border-b border-transparent bg-transparent text-right hover:border-line focus:border-clay focus:outline-none"
            min={isPercent ? def.min * 100 : def.min}
            max={isPercent ? def.max * 100 : def.max}
            step={isPercent ? 1 : def.step}
            value={shown}
            aria-describedby={`${id}-help`}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (!Number.isNaN(n)) onChange(clamp(isPercent ? n / 100 : n))
            }}
          />
          <span className="w-6 text-ink-muted">{def.unit}</span>
        </div>
      </div>
      <Slider
        className="mt-2"
        aria-label={def.label}
        min={def.min}
        max={def.max}
        step={def.step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
      <p id={`${id}-help`} className="mt-1.5 text-xs leading-snug text-ink-muted">
        {def.help}
      </p>
    </div>
  )
}
