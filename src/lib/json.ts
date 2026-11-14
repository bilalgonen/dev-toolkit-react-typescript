import { attempt } from './result'

const sortKeys = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(sortKeys)
    : v && typeof v === 'object'
      ? Object.fromEntries(
          Object.entries(v)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, val]) => [k, sortKeys(val)]),
        )
      : v

export interface JsonOptions {
  indent: number | 'tab' | 'min'
  sort: boolean
}

export function formatJson(input: string, { indent, sort }: JsonOptions) {
  return attempt(() => {
    const parsed: unknown = JSON.parse(input)
    const data = sort ? sortKeys(parsed) : parsed
    return JSON.stringify(data, null, indent === 'min' ? 0 : indent === 'tab' ? '\t' : indent)
  })
}

/** Converts a character offset into a 1-based line/column pair. */
export function locate(input: string, pos: number) {
  const before = input.slice(0, pos).split('\n')
  return { line: before.length, column: before[before.length - 1].length + 1 }
}

/** Adds "(line X, column Y)" to V8-style "at position N" JSON errors. */
export function describeJsonError(input: string, message: string) {
  const pos = /position (\d+)/.exec(message)?.[1]
  if (pos === undefined) return message
  const { line, column } = locate(input, Number(pos))
  return `${message} → line ${line}, column ${column}`
}
