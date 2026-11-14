import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  actions?: ReactNode
  children: ReactNode
}

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="flex min-w-0 flex-col rounded-xl border border-line bg-surface">
      <header className="flex min-h-12 items-center justify-between gap-2 border-b border-line px-4 py-1.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <div className="flex items-center gap-1">{actions}</div>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-4">{children}</div>
    </section>
  )
}

/** Two-column grid on large screens, stacked below. */
export const Split = ({ children }: { children: ReactNode }) => <div className="grid items-start gap-4 lg:grid-cols-2">{children}</div>

export const Toolbar = ({ children }: { children: ReactNode }) => (
  <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">{children}</div>
)
