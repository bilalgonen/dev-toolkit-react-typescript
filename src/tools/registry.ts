import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { IconName } from '@/components/ui/Icon'

export interface Tool {
  id: string
  name: string
  description: string
  icon: IconName
  keywords: string
  component: LazyExoticComponent<ComponentType>
}

type ToolMeta = Omit<Tool, 'component'>

const define = (meta: ToolMeta, load: () => Promise<{ default: ComponentType }>): Tool => ({ ...meta, component: lazy(load) })

/** Single source of truth: sidebar, home grid, routes and command palette are all generated from this list. */
export const tools: Tool[] = [
  define(
    { id: 'json', name: 'JSON Formatter', icon: 'braces', description: 'Format, minify, sort and validate JSON with precise error locations.', keywords: 'pretty print validate lint minify' },
    () => import('./JsonTool'),
  ),
  define(
    { id: 'encode', name: 'Base64 & URL Encoder', icon: 'arrows', description: 'Unicode-safe Base64, Base64URL and URL encoding and decoding.', keywords: 'base64 url percent escape decode' },
    () => import('./EncodeTool'),
  ),
  define(
    { id: 'regex', name: 'Regex Tester', icon: 'search', description: 'Test patterns live with match highlighting and capture groups.', keywords: 'regular expression match groups' },
    () => import('./RegexTool'),
  ),
  define(
    { id: 'jwt', name: 'JWT Decoder', icon: 'key', description: 'Inspect JSON Web Token headers, claims and expiry. Nothing leaves your browser.', keywords: 'json web token auth bearer claims' },
    () => import('./JwtTool'),
  ),
  define(
    { id: 'color', name: 'Color Converter', icon: 'palette', description: 'Convert HEX, RGB and HSL and check WCAG contrast ratios.', keywords: 'hex rgb hsl contrast accessibility wcag' },
    () => import('./ColorTool'),
  ),
  define(
    { id: 'hash', name: 'Hash Generator', icon: 'hash', description: 'SHA-1/256/384/512 digests for text or files using the Web Crypto API.', keywords: 'sha checksum digest crypto file' },
    () => import('./HashTool'),
  ),
]

export const findTool = (id?: string) => tools.find((t) => t.id === id)
