import type { ReactNode } from 'react'

/** CSS-only tooltip: shows on hover and keyboard focus of its (focusable) wrapper. */
export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="group relative inline-block" tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 hidden w-max max-w-60 rounded-md bg-fg px-2 py-1 text-xs text-bg shadow group-hover:block group-focus-visible:block"
      >
        {text}
      </span>
    </span>
  )
}
