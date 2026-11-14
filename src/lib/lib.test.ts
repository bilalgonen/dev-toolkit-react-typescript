import { contrast, hslToRgb, parseHex, rgbToHsl, toHex, wcagLevel } from './color'
import { convert } from './encode'
import { digest } from './hash'
import { describeJsonError, formatJson } from './json'
import { decodeJwt, tokenStatus } from './jwt'
import { runRegex, segments } from './regex'

describe('json', () => {
  it('formats and sorts', () => {
    const r = formatJson('{"b":1,"a":{"d":1,"c":2}}', { indent: 2, sort: true })
    expect(r.ok && r.value).toBe('{\n  "a": {\n    "c": 2,\n    "d": 1\n  },\n  "b": 1\n}')
  })
  it('minifies', () => {
    const r = formatJson('{ "a" : [1, 2] }', { indent: 'min', sort: false })
    expect(r.ok && r.value).toBe('{"a":[1,2]}')
  })
  it('reports errors with a location', () => {
    expect(describeJsonError('{\n  "a": x', 'Unexpected token x at position 9')).toContain('line 2, column 8')
  })
})

describe('encode', () => {
  it('round-trips unicode', () => {
    const enc = convert('base64', 'encode', 'héllo ✓')
    expect(enc.ok && convert('base64', 'decode', enc.value)).toEqual({ ok: true, value: 'héllo ✓' })
  })
  it('handles base64url without padding', () => {
    expect(convert('base64url', 'encode', '??>>')).toEqual({ ok: true, value: 'Pz8-Pg' })
    expect(convert('base64url', 'decode', 'Pz8-Pg')).toEqual({ ok: true, value: '??>>' })
  })
  it('url-encodes', () => {
    expect(convert('url', 'encode', 'a b&c')).toEqual({ ok: true, value: 'a%20b%26c' })
  })
  it('fails on invalid input', () => {
    expect(convert('base64', 'decode', '***').ok).toBe(false)
  })
})

describe('jwt', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxMDAwfQ.sig'
  it('decodes', () => {
    const r = decodeJwt(token)
    expect(r.ok && r.value.payload.sub).toBe('1234567890')
  })
  it('rejects malformed tokens', () => expect(decodeJwt('abc').ok).toBe(false))
  it('computes status', () => {
    expect(tokenStatus({ exp: 1000 }, 2000)).toBe('expired')
    expect(tokenStatus({ exp: 3000 }, 2000)).toBe('valid')
    expect(tokenStatus({}, 2000)).toBe('no-expiry')
  })
})

describe('color', () => {
  it('converts between formats', () => {
    expect(parseHex('#f80')).toEqual({ r: 255, g: 136, b: 0 })
    expect(toHex({ r: 255, g: 136, b: 0 })).toBe('#ff8800')
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 })
  })
  it('computes WCAG contrast', () => {
    const ratio = contrast({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
    expect(Math.round(ratio)).toBe(21)
    expect(wcagLevel(ratio)).toBe('AAA')
    expect(wcagLevel(2)).toBe('Fail')
  })
})

describe('hash', () => {
  it('computes sha-256', async () => {
    expect(await digest('SHA-256', 'abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })
})

describe('regex', () => {
  it('finds matches with groups', () => {
    const r = runRegex('(?<w>\\w)(\\d)', 'g', 'a1 b2')
    expect(r.ok && r.value.map((m) => [m.text, m.named.w, m.groups[1]])).toEqual([
      ['a1', 'a', '1'],
      ['b2', 'b', '2'],
    ])
  })
  it('reports invalid patterns', () => expect(runRegex('(', '', 'x').ok).toBe(false))
  it('builds highlight segments', () => {
    const r = runRegex('\\d', 'g', 'a1b')
    expect(r.ok && segments('a1b', r.value)).toEqual([
      { text: 'a', hit: false },
      { text: '1', hit: true },
      { text: 'b', hit: false },
    ])
  })
})
