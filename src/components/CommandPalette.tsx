import { useDeferredValue, useState } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/cn'
import { tools } from '@/tools/registry'
import { Icon, type IconName } from './ui/Icon'
import { Modal } from './ui/Modal'

interface Command {
  id: string
  label: string
  hint: string
  icon: IconName
  run: () => void
}

/** True when every character of `query` appears in `text` in order. */
const fuzzy = (query: string, text: string) => {
  let i = 0
  for (const ch of text.toLowerCase()) if (ch === query[i]) i++
  return i === query.length
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Command palette" className="mt-[12vh] overflow-hidden">
      <Palette onClose={onClose} />
    </Modal>
  )
}

/** Mounted only while open, so its query/selection state resets every time. */
function Palette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const q = useDeferredValue(query.trim().toLowerCase())

  const commands: Command[] = [
    { id: 'home', label: 'Home', hint: 'All tools', icon: 'home', run: () => navigate('/') },
    ...tools.map((t) => ({ id: t.id, label: t.name, hint: t.keywords, icon: t.icon, run: () => navigate(`/tools/${t.id}`) })),
  ]
  const results = commands.filter((c) => fuzzy(q, `${c.label} ${c.hint}`))

  const execute = (c?: Command) => {
    if (!c) return
    onClose()
    c.run()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') execute(results[active])
  }

  return (
    <div onKeyDown={onKeyDown}>
      <div className="flex items-center gap-2 border-b border-line px-4">
        <Icon name="search" className="text-muted" />
        <input
          autoFocus
          role="combobox"
          aria-expanded
          aria-controls="palette-list"
          aria-label="Search tools"
          value={query}
          onChange={(e) => (setQuery(e.target.value), setActive(0))}
          placeholder="Search tools…"
          className="w-full bg-transparent py-3.5 outline-none"
        />
        <kbd className="rounded border border-line px-1.5 text-xs text-muted">Esc</kbd>
      </div>
      <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && <li className="p-4 text-center text-sm text-muted">No results</li>}
        {results.map((c, i) => (
          <li
            key={c.id}
            role="option"
            aria-selected={i === active}
            onMouseMove={() => setActive(i)}
            onClick={() => execute(c)}
            className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2', i === active && 'bg-accent/15')}
          >
            <Icon name={c.icon} className="text-accent" />
            <span className="font-medium">{c.label}</span>
            <span className="ml-auto hidden truncate text-xs text-muted sm:block">{c.hint}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
