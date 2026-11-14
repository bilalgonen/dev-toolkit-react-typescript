import { Suspense, use, useDeferredValue, useMemo, useState, type DragEvent } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { Icon } from '@/components/ui/Icon'
import { Panel, Split } from '@/components/ui/Panel'
import { Switch } from '@/components/ui/Switch'
import { TextArea } from '@/components/ui/TextArea'
import { ALGORITHMS, digest } from '@/lib/hash'
import { useToolState } from '@/store/useToolStore'

const INITIAL = { text: '', upper: false }

/** Reads a promise with React 19's `use()`; Suspense shows the fallback while hashing. */
function Hashes({ promise, upper, expected }: { promise: Promise<string[]>; upper: boolean; expected: string }) {
  const hashes = use(promise)
  const target = expected.trim().toLowerCase()
  return (
    <ul className="flex flex-col gap-3">
      {ALGORITHMS.map((algo, i) => {
        const value = upper ? hashes[i].toUpperCase() : hashes[i]
        return (
          <li key={algo} className="rounded-lg border border-line p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">{algo}</span>
              <span className="flex items-center gap-1">
                {target && hashes[i] === target && <Badge tone="success">Match</Badge>}
                <CopyButton text={value} />
              </span>
            </div>
            <code className="block font-mono text-xs break-all">{value}</code>
          </li>
        )
      })}
    </ul>
  )
}

export default function HashTool() {
  const [{ text, upper }, set] = useToolState('hash', INITIAL)
  const [file, setFile] = useState<File | null>(null)
  const [expected, setExpected] = useState('')
  const [dragging, setDragging] = useState(false)
  const deferred = useDeferredValue(text)

  const promise = useMemo(
    () => (file ? file.arrayBuffer() : Promise.resolve(deferred)).then((data) => Promise.all(ALGORITHMS.map((a) => digest(a, data)))),
    [file, deferred],
  )

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setFile(e.dataTransfer.files[0] ?? null)
  }

  return (
    <Split>
      <Panel title="Input">
        {file ? (
          <div className="flex items-center justify-between rounded-lg border border-line bg-bg p-3 text-sm">
            <span className="truncate font-medium">
              {file.name} <span className="text-muted">({(file.size / 1024).toFixed(1)} KB)</span>
            </span>
            <Button variant="ghost" icon="x" onClick={() => setFile(null)}>
              Remove
            </Button>
          </div>
        ) : (
          <TextArea label="Text" value={text} onChange={(v) => set({ text: v })} sample="The quick brown fox jumps over the lazy dog" />
        )}
        <label
          onDragOver={(e) => (e.preventDefault(), setDragging(true))}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed p-5 text-sm text-muted transition ${dragging ? 'border-accent bg-accent/10' : 'border-line hover:border-accent'}`}
        >
          <Icon name="upload" />
          Drop a file here or click to hash it instead
          <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expected" className="text-xs font-medium text-muted">
            Compare with expected hash (optional)
          </label>
          <input id="expected" value={expected} onChange={(e) => setExpected(e.target.value)} spellCheck={false} className="rounded-lg border border-line bg-bg px-3 py-2 font-mono text-xs" />
        </div>
      </Panel>
      <Panel title="Digests" actions={<Switch label="Uppercase" checked={upper} onChange={(v) => set({ upper: v })} />}>
        <Suspense fallback={<p className="text-sm text-muted">Hashing…</p>}>
          <Hashes promise={promise} upper={upper} expected={expected} />
        </Suspense>
      </Panel>
    </Split>
  )
}
