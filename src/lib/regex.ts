import { attempt } from './result'

export const FLAGS = [
  { flag: 'g', label: 'Global' },
  { flag: 'i', label: 'Ignore case' },
  { flag: 'm', label: 'Multiline' },
  { flag: 's', label: 'Dot matches newline' },
  { flag: 'u', label: 'Unicode' },
] as const

export interface Match {
  text: string
  index: number
  groups: (string | undefined)[]
  named: Record<string, string>
}

export const runRegex = (pattern: string, flags: string, input: string) =>
  attempt(() => {
    const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
    const matches: Match[] = []
    for (const m of input.matchAll(re)) {
      if (m[0] === '' && matches.length > 1000) break
      matches.push({ text: m[0], index: m.index, groups: m.slice(1), named: { ...m.groups } })
    }
    return matches
  })

/** Splits `input` into alternating plain / matched segments for highlighting. */
export function segments(input: string, matches: Match[]) {
  const out: { text: string; hit: boolean }[] = []
  let pos = 0
  for (const m of matches) {
    if (m.text === '') continue
    if (m.index > pos) out.push({ text: input.slice(pos, m.index), hit: false })
    out.push({ text: m.text, hit: true })
    pos = m.index + m.text.length
  }
  if (pos < input.length) out.push({ text: input.slice(pos), hit: false })
  return out
}
