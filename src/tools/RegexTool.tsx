import { useDeferredValue, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Panel, Split, Toolbar } from '@/components/ui/Panel'
import { Switch } from '@/components/ui/Switch'
import { ErrorText, TextArea } from '@/components/ui/TextArea'
import { FLAGS, runRegex, segments } from '@/lib/regex'
import { useToolState } from '@/store/useToolStore'

const INITIAL = { pattern: '', flags: 'gi', input: '' }
const SAMPLE = 'Contact: ada@lovelace.dev, grace@hopper.io\nSupport: help@example.com'

export default function RegexTool() {
  const [{ pattern, flags, input }, set] = useToolState('regex', INITIAL)
  const [dPattern, dInput] = [useDeferredValue(pattern), useDeferredValue(input)]
  const result = useMemo(() => (dPattern ? runRegex(dPattern, flags, dInput) : null), [dPattern, flags, dInput])
  const matches = result?.ok ? result.value : []

  return (
    <>
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 font-mono">
        <span className="text-muted">/</span>
        <input
          aria-label="Pattern"
          value={pattern}
          onChange={(e) => set({ pattern: e.target.value })}
          placeholder="(?<user>[\w.]+)@(?<host>[\w.]+)"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent py-1 outline-none"
        />
        <span className="text-muted">/{flags}</span>
      </div>
      <Toolbar>
        {FLAGS.map(({ flag, label }) => (
          <Switch
            key={flag}
            label={flag}
            hint={label}
            checked={flags.includes(flag)}
            onChange={(on) => set({ flags: FLAGS.map((f) => f.flag).filter((f) => (f === flag ? on : flags.includes(f))).join('') })}
          />
        ))}
        {result?.ok && <Badge tone={matches.length ? 'success' : 'warning'}>{matches.length} matches</Badge>}
      </Toolbar>
      {result && !result.ok && <ErrorText>{result.error}</ErrorText>}
      <Split>
        <Panel title="Test string">
          <TextArea label="Text" value={input} onChange={(v) => set({ input: v })} sample={SAMPLE} />
          <div aria-label="Highlighted matches" className="rounded-lg border border-line bg-bg p-3 font-mono text-sm break-words whitespace-pre-wrap">
            {segments(dInput, matches).map((s, i) =>
              s.hit ? (
                <mark key={i} className="rounded bg-accent/30 text-fg">
                  {s.text}
                </mark>
              ) : (
                s.text
              ),
            )}
          </div>
        </Panel>
        <Panel title="Matches">
          {matches.length === 0 && <p className="text-sm text-muted">{pattern ? 'No matches.' : 'Enter a pattern to begin.'}</p>}
          <ol className="flex flex-col gap-2">
            {matches.map((m, i) => (
              <li key={i} className="rounded-lg border border-line p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <code className="font-semibold break-all">{m.text || '(empty)'}</code>
                  <Badge>index {m.index}</Badge>
                </div>
                {(m.groups.length > 0 || Object.keys(m.named).length > 0) && (
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-xs text-muted">
                    {m.groups.map((g, gi) => [`$${gi + 1}`, g] as const).map(([k, v]) => <Group key={k} name={k} value={v} />)}
                    {Object.entries(m.named).map(([k, v]) => <Group key={k} name={k} value={v} />)}
                  </dl>
                )}
              </li>
            ))}
          </ol>
        </Panel>
      </Split>
    </>
  )
}

const Group = ({ name, value }: { name: string; value?: string }) => (
  <>
    <dt>{name}</dt>
    <dd className="text-fg">{value ?? 'undefined'}</dd>
  </>
)
