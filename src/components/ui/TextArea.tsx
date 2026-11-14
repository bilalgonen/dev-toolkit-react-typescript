import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

interface TextAreaProps extends Omit<ComponentProps<'textarea'>, 'onChange' | 'value'> {
  label: string
  value: string
  onChange?: (value: string) => void
  /** When set, shows a "Sample" button that fills the field. */
  sample?: string
}

/** Monospace textarea with label, line/char counter and Sample / Clear shortcuts (read-only when no `onChange`). */
export function TextArea({ label, value, onChange, sample, className, id, ...props }: TextAreaProps) {
  const fieldId = id ?? `ta-${label.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={fieldId} className="text-xs font-medium text-muted">
          {label}
        </label>
        {onChange && (
          <div className="flex gap-1">
            {sample && (
              <Button variant="ghost" className="px-2 py-0.5 text-xs" onClick={() => onChange(sample)}>
                Sample
              </Button>
            )}
            <Button variant="ghost" className="px-2 py-0.5 text-xs" disabled={!value} onClick={() => onChange('')}>
              Clear
            </Button>
          </div>
        )}
      </div>
      <textarea
        id={fieldId}
        value={value}
        readOnly={!onChange}
        onChange={(e) => onChange?.(e.target.value)}
        spellCheck={false}
        className={cn(
          'min-h-48 w-full resize-y rounded-lg border border-line bg-bg p-3 font-mono text-sm leading-relaxed',
          !onChange && 'text-muted',
          className,
        )}
        {...props}
      />
      <span className="text-right text-xs text-muted">
        {value ? `${value.split('\n').length} lines · ${value.length} chars` : ' '}
      </span>
    </div>
  )
}

export const ErrorText = ({ children }: { children: string }) => (
  <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 font-mono text-xs break-words text-red-700 dark:text-red-400">
    {children}
  </p>
)
