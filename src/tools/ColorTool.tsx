import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import { Panel, Split } from '@/components/ui/Panel'
import { Slider } from '@/components/ui/Slider'
import { contrast, hslToRgb, parseHex, rgbToHsl, toHex, wcagLevel, type RGB } from '@/lib/color'
import { useToolState } from '@/store/useToolStore'

const INITIAL = { hex: '#6366f1' }
const WHITE: RGB = { r: 255, g: 255, b: 255 }
const BLACK: RGB = { r: 0, g: 0, b: 0 }
const HSL_SLIDERS = [
  ['h', 'H', 360, '°'],
  ['s', 'S', 100, '%'],
  ['l', 'L', 100, '%'],
] as const

export default function ColorTool() {
  const [{ hex }, set] = useToolState('color', INITIAL)
  const rgb = parseHex(hex)
  const valid = rgb !== null
  const color = rgb ?? BLACK
  const hsl = rgbToHsl(color)

  const formats = [
    ['HEX', toHex(color)],
    ['RGB', `rgb(${color.r}, ${color.g}, ${color.b})`],
    ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
  ]

  return (
    <Split>
      <Panel title="Pick a color">
        <div className="flex items-center gap-3">
          <input aria-label="Color picker" type="color" value={toHex(color)} onChange={(e) => set({ hex: e.target.value })} className="h-12 w-16 cursor-pointer rounded-lg border border-line bg-transparent" />
          <input
            aria-label="Hex value"
            aria-invalid={!valid}
            value={hex}
            onChange={(e) => set({ hex: e.target.value })}
            spellCheck={false}
            className="w-36 rounded-lg border border-line bg-bg px-3 py-2 font-mono aria-invalid:border-red-500"
          />
          {!valid && <Badge tone="danger">Invalid hex</Badge>}
        </div>
        <div className="flex flex-col gap-2">
          {HSL_SLIDERS.map(([key, label, max, unit]) => (
            <Slider key={key} label={label} max={max} unit={unit} value={hsl[key]} onChange={(v) => set({ hex: toHex(hslToRgb({ ...hsl, [key]: v })) })} />
          ))}
        </div>
        <ul className="divide-y divide-line rounded-lg border border-line">
          {formats.map(([name, value]) => (
            <li key={name} className="flex items-center justify-between gap-2 px-3 py-1">
              <span className="w-10 text-xs font-semibold text-muted">{name}</span>
              <code className="flex-1 font-mono text-sm">{value}</code>
              <CopyButton text={value} />
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Contrast (WCAG)">
        {[
          ['White text', WHITE],
          ['Black text', BLACK],
        ].map(([label, fg]) => {
          const ratio = contrast(color, fg as RGB)
          const level = wcagLevel(ratio)
          return (
            <div key={label as string} className="flex items-center justify-between gap-3 rounded-lg p-4" style={{ background: toHex(color), color: toHex(fg as RGB) }}>
              <span className="font-semibold">{label as string}: The quick brown fox</span>
              <span className="flex shrink-0 items-center gap-2 text-sm">
                {ratio.toFixed(2)}:1
                <Badge tone={level === 'Fail' ? 'danger' : level.startsWith('AA ') ? 'warning' : 'success'}>{level}</Badge>
              </span>
            </div>
          )
        })}
      </Panel>
    </Split>
  )
}
