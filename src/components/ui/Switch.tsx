import { useId } from 'react'
import { cn } from '@/lib/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  hint?: string
}

export function Switch({ checked, onChange, label, hint }: SwitchProps) {
  const id = useId()
  return (
    <label htmlFor={id} title={hint} className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition', checked ? 'bg-accent' : 'bg-line')}
      >
        <span
          className={cn('absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')}
        />
      </button>
      {label}
    </label>
  )
}
