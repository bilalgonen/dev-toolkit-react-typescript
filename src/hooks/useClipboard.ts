import { useCallback, useEffect, useRef, useState } from 'react'
import { useToastStore } from '@/store/useToastStore'

/** Copies text to the clipboard, toasts the outcome, and exposes a short-lived `copied` flag. */
export function useClipboard() {
  const push = useToastStore((s) => s.push)
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        push('Copied to clipboard')
        clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1500)
      } catch {
        push('Could not access the clipboard', 'error')
      }
    },
    [push],
  )
  return { copy, copied }
}
