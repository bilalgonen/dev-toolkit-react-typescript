import { useDeferredValue, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { Panel, Split, Toolbar } from '@/components/ui/Panel'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { ErrorText, TextArea } from '@/components/ui/TextArea'
import { convert, type Codec, type Direction } from '@/lib/encode'
import { useToolState } from '@/store/useToolStore'

const CODECS: Record<Codec, string> = { base64: 'Base64', base64url: 'Base64URL', url: 'URL (percent)' }
const DIRECTIONS: Record<Direction, string> = { encode: 'Encode', decode: 'Decode' }
const INITIAL = { input: '', codec: 'base64' as Codec, dir: 'encode' as Direction }

export default function EncodeTool() {
  const [{ input, codec, dir }, set] = useToolState('encode', INITIAL)
  const deferred = useDeferredValue(input)
  const result = useMemo(() => convert(codec, dir, deferred), [codec, dir, deferred])
  const output = result.ok ? result.value : ''

  /** Feeds the output back in as input and flips direction. */
  const swap = () => set({ input: output, dir: dir === 'encode' ? 'decode' : 'encode' })

  return (
    <>
      <Toolbar>
        <Tabs label="Direction" options={DIRECTIONS} value={dir} onChange={(v) => set({ dir: v })} />
        <Select label="Format" options={CODECS} value={codec} onChange={(v) => set({ codec: v })} />
        <Button icon="arrows" disabled={!output} onClick={swap}>
          Swap
        </Button>
      </Toolbar>
      <Split>
        <Panel title="Input">
          <TextArea label="Text" value={input} onChange={(v) => set({ input: v })} sample={dir === 'encode' ? 'Héllo, wörld! ✓ ?a=1&b=2' : 'SMOpbGxvLCB3w7ZybGQhIOKckw=='} />
        </Panel>
        <Panel title="Output" actions={<CopyButton text={output} />}>
          {input && !result.ok && <ErrorText>{result.error}</ErrorText>}
          <TextArea label="Result" value={output} />
        </Panel>
      </Split>
    </>
  )
}
