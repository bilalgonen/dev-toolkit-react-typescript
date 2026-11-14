import { useCallback, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { useHotkey } from '@/hooks/useHotkey'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import { useAppStore, type Theme } from '@/store/useAppStore'
import { tools } from '@/tools/registry'
import { CommandPalette } from './CommandPalette'
import { Button } from './ui/Button'
import { Icon, type IconName } from './ui/Icon'
import { Modal } from './ui/Modal'
import { Tabs } from './ui/Tabs'
import { Toaster } from './ui/Toaster'

const THEME_ICONS: Record<Theme, IconName> = { system: 'monitor', light: 'sun', dark: 'moon' }
const THEMES: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' }
const SHORTCUTS = [
  ['Ctrl / ⌘ + K', 'Open the command palette'],
  ['↑ ↓ Enter', 'Navigate and run a command'],
  ['Esc', 'Close dialogs'],
]

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-line/60 hover:text-fg',
  )

export default function Layout() {
  useTheme()
  const { theme, setTheme, favorites } = useAppStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const togglePalette = useCallback(() => setPaletteOpen((o) => !o), [])
  useHotkey('k', togglePalette)

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      {menuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMenuOpen(false)} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-1 border-r border-line bg-surface p-4 transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Link to="/" className="mb-4 flex items-center gap-2 text-lg font-bold" onClick={() => setMenuOpen(false)}>
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">{'</>'}</span>
          DevToolkit
        </Link>
        <nav aria-label="Tools" className="flex flex-col gap-1" onClick={() => setMenuOpen(false)}>
          <NavLink to="/" end className={navClass}>
            <Icon name="home" /> Home
          </NavLink>
          {tools.map((t) => (
            <NavLink key={t.id} to={`/tools/${t.id}`} className={navClass}>
              <Icon name={t.icon} /> {t.name}
              {favorites.includes(t.id) && <Icon name="star" filled size={12} className="ml-auto text-amber-500" />}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto text-xs text-muted">100% client-side. Your data never leaves the browser.</p>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur">
          <Button variant="ghost" icon="menu" className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)} />
          <button
            type="button"
            onClick={togglePalette}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-left text-sm text-muted sm:max-w-sm"
          >
            <Icon name="search" size={16} /> <span className="truncate">Search tools…</span>
            <kbd className="ml-auto hidden rounded border border-line px-1.5 text-xs sm:block">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" icon="info" aria-label="Help and shortcuts" onClick={() => setHelpOpen(true)} />
            <Button variant="ghost" icon={THEME_ICONS[theme]} aria-label={`Theme: ${theme}. Click to change`} onClick={() => setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help and shortcuts">
        <div className="flex flex-col gap-4 p-6">
          <h2 className="text-lg font-bold">About DevToolkit</h2>
          <p className="text-sm text-muted">
            A set of everyday developer utilities built with React 19, TypeScript, Vite, Tailwind, Zustand and React Router. There is no backend: everything runs in your browser.
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {SHORTCUTS.map(([keys, text]) => (
              <div key={keys} className="contents">
                <dt>
                  <kbd className="rounded border border-line px-1.5 font-mono text-xs">{keys}</kbd>
                </dt>
                <dd className="text-muted">{text}</dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between">
            <Tabs label="Theme" options={THEMES} value={theme} onChange={setTheme} />
            <Button variant="primary" onClick={() => setHelpOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
      <Toaster />
    </div>
  )
}
