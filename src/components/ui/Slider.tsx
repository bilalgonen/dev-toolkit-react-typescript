import { useId } from 'react'

interface SliderProps {
  label: string
  value: number
  max: number
  onChange: (value: number) => void
  unit?: string
}

export function Slider({ label, value, max, onChange, unit = '' }: SliderProps) {
  const id = useId()
  return (
    <div className="grid grid-cols-[1.5rem_1fr_3.5rem] items-center gap-3 text-sm">
      <label htmlFor={id} className="font-medium text-muted">
        {label}
      </label>
      <input id={id} type="range" min={0} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-accent" />
      <span className="text-right font-mono tabular-nums">
        {value}
        {unit}
      </span>
    </div>
  )
}
