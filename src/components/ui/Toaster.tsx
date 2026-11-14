import { cn } from '@/lib/cn'
import { useToastStore } from '@/store/useToastStore'

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium shadow-lg',
            t.tone === 'error' ? 'bg-red-600 text-white' : 'bg-fg text-bg',
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
