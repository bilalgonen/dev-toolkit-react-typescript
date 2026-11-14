import { attempt } from './result'

export type Codec = 'base64' | 'base64url' | 'url'
export type Direction = 'encode' | 'decode'

const bytesToBase64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(''))

const base64ToText = (s: string) =>
  new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)))

const toUrlSafe = (s: string) => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const fromUrlSafe = (s: string) => {
  const b = s.replace(/-/g, '+').replace(/_/g, '/')
  return b + '='.repeat((4 - (b.length % 4)) % 4)
}

export const fromBase64Url = (s: string) => base64ToText(fromUrlSafe(s.trim()))

const codecs: Record<Codec, Record<Direction, (s: string) => string>> = {
  base64: { encode: bytesToBase64, decode: (s) => base64ToText(s.trim()) },
  base64url: {
    encode: (s) => toUrlSafe(bytesToBase64(s)),
    decode: fromBase64Url,
  },
  url: { encode: encodeURIComponent, decode: decodeURIComponent },
}

export const convert = (codec: Codec, dir: Direction, input: string) =>
  attempt(() => codecs[codec][dir](input))
