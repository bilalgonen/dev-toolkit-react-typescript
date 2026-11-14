import { cn } from '@/lib/cn'

interface TabsProps<T extends string> {
  options: Record<T, string>
  value: T
  onChange: (value: T) => void
  label: string
}

/** Segmented control with tab semantics. `options` maps value → label. */
export function Tabs<T extends string>({ options, value, onChange, label }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-lg border border-line bg-bg p-0.5">
      {(Object.entries(options) as [T, string][]).map(([key, text]) => (
        <button
          key={key}
          role="tab"
          type="button"
          aria-selected={key === value}
          onClick={() => onChange(key)}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition',
            key === value ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg',
          )}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
