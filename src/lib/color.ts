export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n))

export function parseHex(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  if (!/^[0-9a-f]{6}$/i.test(h)) return null
  const n = parseInt(h, 16)
  return { r: n >> 16, g: (n >> 8) & 255, b: n & 255 }
}

export const toHex = ({ r, g, b }: RGB) =>
  '#' + [r, g, b].map((v) => clamp(Math.round(v), 255).toString(16).padStart(2, '0')).join('')

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const [R, G, B] = [r, g, b].map((v) => v / 255)
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const d = max - min
  const l = (max + min) / 2
  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) }
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4
  return { h: Math.round((h * 60 + 360) % 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const [S, L] = [s / 100, l / 100]
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (L - S * Math.min(L, 1 - L) * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
  }
  return { r: f(0), g: f(8), b: f(4) }
}

const luminance = ({ r, g, b }: RGB) => {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/** WCAG 2.x contrast ratio between two colors (1–21). */
export function contrast(a: RGB, b: RGB) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export const wcagLevel = (ratio: number) =>
  ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'
