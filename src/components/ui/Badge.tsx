import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const TONES = {
  neutral: 'bg-line text-muted',
  success: 'bg-green-500/15 text-green-700 dark:text-green-400',
  danger: 'bg-red-500/15 text-red-700 dark:text-red-400',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

export type Tone = keyof typeof TONES

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', TONES[tone])}>{children}</span>
}
