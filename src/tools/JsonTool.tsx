import { useDeferredValue, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import { Panel, Split, Toolbar } from '@/components/ui/Panel'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { ErrorText, TextArea } from '@/components/ui/TextArea'
import { describeJsonError, formatJson } from '@/lib/json'
import { useToolState } from '@/store/useToolStore'

const INDENTS = { '2': '2 spaces', '4': '4 spaces', tab: 'Tab', min: 'Minified' }
const INITIAL = { input: '', indent: '2' as keyof typeof INDENTS, sort: false }
const SAMPLE = '{"name":"DevToolkit","tags":["react","typescript"],"nested":{"b":2,"a":[1,2,{"deep":true}]},"active":true}'

export default function JsonTool() {
  const [{ input, indent, sort }, set] = useToolState('json', INITIAL)
  const deferred = useDeferredValue(input)

  const result = useMemo(
    () => (deferred.trim() ? formatJson(deferred, { indent: indent === 'tab' || indent === 'min' ? indent : Number(indent), sort }) : null),
    [deferred, indent, sort],
  )

  return (
    <>
      <Toolbar>
        <Select label="Indent" options={INDENTS} value={indent} onChange={(v) => set({ indent: v })} />
        <Switch label="Sort keys" checked={sort} onChange={(v) => set({ sort: v })} />
        {result && <Badge tone={result.ok ? 'success' : 'danger'}>{result.ok ? 'Valid JSON' : 'Invalid JSON'}</Badge>}
      </Toolbar>
      <Split>
        <Panel title="Input">
          <TextArea label="JSON" value={input} onChange={(v) => set({ input: v })} sample={SAMPLE} placeholder='{"paste": "your JSON here"}' />
        </Panel>
        <Panel title="Output" actions={<CopyButton text={result?.ok ? result.value : ''} />}>
          {result && !result.ok && <ErrorText>{describeJsonError(deferred, result.error)}</ErrorText>}
          <TextArea label="Result" value={result?.ok ? result.value : ''} />
        </Panel>
      </Split>
    </>
  )
}
