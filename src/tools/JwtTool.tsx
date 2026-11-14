import { useState } from 'react'
import { Badge, type Tone } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import { Panel, Split } from '@/components/ui/Panel'
import { Tooltip } from '@/components/ui/Tooltip'
import { ErrorText, TextArea } from '@/components/ui/TextArea'
import { CLAIM_LABELS, decodeJwt, formatClaimTime, TIME_CLAIMS, tokenStatus, type TokenStatus } from '@/lib/jwt'

const STATUS: Record<TokenStatus, [Tone, string]> = {
  valid: ['success', 'Not expired'],
  expired: ['danger', 'Expired'],
  'not-yet-valid': ['warning', 'Not yet valid'],
  'no-expiry': ['neutral', 'No expiry'],
}

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImFkbWluIjp0cnVlLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMH0.signature-not-verified'

function Claims({ data }: { data: Record<string, unknown> }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="font-mono text-muted">{CLAIM_LABELS[key] ? <Tooltip text={CLAIM_LABELS[key]}>{key}</Tooltip> : key}</dt>
          <dd className="font-mono break-all">
            {JSON.stringify(value)}
            {TIME_CLAIMS.has(key) && typeof value === 'number' && <span className="ml-2 text-xs text-muted">{formatClaimTime(value)}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// The token is kept in memory only (never persisted) because it may be sensitive.
export default function JwtTool() {
  const [token, setToken] = useState('')
  const result = token.trim() ? decodeJwt(token) : null

  return (
    <Split>
      <Panel title="Encoded token">
        <TextArea label="JWT" value={token} onChange={setToken} sample={SAMPLE} placeholder="eyJhbGciOi…" />
        <p className="text-xs text-muted">Decoded locally and never stored. The signature is not verified.</p>
      </Panel>
      <div className="flex flex-col gap-4">
        {result && !result.ok && <ErrorText>{result.error}</ErrorText>}
        {result?.ok && (
          <>
            <Panel
              title="Header"
              actions={<CopyButton text={JSON.stringify(result.value.header, null, 2)} />}
            >
              <Claims data={result.value.header} />
            </Panel>
            <Panel
              title="Payload"
              actions={
                <>
                  <Badge tone={STATUS[tokenStatus(result.value.payload)][0]}>{STATUS[tokenStatus(result.value.payload)][1]}</Badge>
                  <CopyButton text={JSON.stringify(result.value.payload, null, 2)} />
                </>
              }
            >
              <Claims data={result.value.payload} />
            </Panel>
            <Panel title="Signature">
              <code className="font-mono text-sm break-all text-muted">{result.value.signature || '(empty)'}</code>
            </Panel>
          </>
        )}
        {!result && <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">Paste a token to decode it.</p>}
      </div>
    </Split>
  )
}
