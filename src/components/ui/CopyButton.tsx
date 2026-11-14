import { useClipboard } from '@/hooks/useClipboard'
import { Button } from './Button'

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const { copy, copied } = useClipboard()
  return (
    <Button variant="ghost" icon={copied ? 'check' : 'copy'} disabled={!text} onClick={() => copy(text)} aria-label={label}>
      {copied ? 'Copied' : label}
    </Button>
  )
}
