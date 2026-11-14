import { useId } from 'react'

interface SelectProps<T extends string> {
  options: Record<T, string>
  value: T
  onChange: (value: T) => void
  label: string
}

export function Select<T extends string>({ options, value, onChange, label }: SelectProps<T>) {
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <label htmlFor={id} className="text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="cursor-pointer rounded-lg border border-line bg-surface px-2 py-1.5"
      >
        {(Object.entries(options) as [T, string][]).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </div>
  )
}
