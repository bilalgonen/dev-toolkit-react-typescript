import { fromBase64Url } from './encode'
import { attempt } from './result'

export interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

export const decodeJwt = (token: string) =>
  attempt<DecodedJwt>(() => {
    const parts = token.trim().split('.')
    if (parts.length !== 3) throw new Error('A JWT must have 3 dot-separated parts')
    const [header, payload] = parts.slice(0, 2).map((p) => JSON.parse(fromBase64Url(p)))
    return { header, payload, signature: parts[2] }
  })

export type TokenStatus = 'valid' | 'expired' | 'not-yet-valid' | 'no-expiry'

export function tokenStatus({ exp, nbf }: Record<string, unknown>, now = Date.now() / 1000): TokenStatus {
  if (typeof exp === 'number' && exp < now) return 'expired'
  if (typeof nbf === 'number' && nbf > now) return 'not-yet-valid'
  return typeof exp === 'number' ? 'valid' : 'no-expiry'
}

export const CLAIM_LABELS: Record<string, string> = {
  iss: 'Issuer',
  sub: 'Subject',
  aud: 'Audience',
  exp: 'Expiration time',
  nbf: 'Not before',
  iat: 'Issued at',
  jti: 'JWT ID',
}

export const TIME_CLAIMS = new Set(['exp', 'nbf', 'iat'])
export const formatClaimTime = (s: number) => new Date(s * 1000).toLocaleString()
