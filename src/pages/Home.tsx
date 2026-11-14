import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { useAppStore } from '@/store/useAppStore'
import { findTool, tools, type Tool } from '@/tools/registry'

function Section({ title, items }: { title: string; items: Tool[] }) {
  const favorites = useAppStore((s) => s.favorites)
  if (items.length === 0) return null
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => (
          <Link key={t.id} to={`/tools/${t.id}`} className="group rounded-xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-lg bg-accent/15 text-accent">
                <Icon name={t.icon} size={20} />
              </span>
              {favorites.includes(t.id) && <Icon name="star" filled size={14} className="text-amber-500" />}
            </div>
            <h3 className="font-semibold group-hover:text-accent">{t.name}</h3>
            <p className="mt-1 text-sm text-muted">{t.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

const LINKS = [
  { label: 'Live demo', href: 'https://devtoolkit.bilalgonen.workers.dev' },
  { label: 'Source', href: 'https://github.com/bilalgonen/dev-toolkit-react-typescript' },
  { label: 'bilalgonen.com', href: 'https://bilalgonen.com' },
]

function About() {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">About</h2>
      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          <strong className="text-fg">DevToolkit</strong> is a browser-based suite of six everyday developer utilities: a JSON formatter, a Base64/URL encoder, a regex tester, a JWT decoder, a color
          converter with WCAG contrast checks, and a SHA hash generator. Everything runs 100% client-side, so no data is ever uploaded. Built with React 19, strict TypeScript, Vite, Tailwind CSS v4,
          Zustand and React Router, it uses a registry-driven architecture with lazy-loaded tools, a reusable accessible UI kit, a command palette and light/dark themes. Core logic is
          framework-free and covered by Vitest unit and component tests. Deployed on Cloudflare Workers.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Home() {
  const { favorites, recents } = useAppStore()
  const pick = (ids: string[]) => ids.map(findTool).filter((t): t is Tool => !!t)

  return (
    <>
      <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Everyday developer tools, right in your browser.</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Format JSON, decode tokens, test regexes and more. Fast, private and offline-friendly: nothing is ever uploaded. Press{' '}
          <kbd className="rounded border border-line px-1.5 font-mono text-xs">Ctrl/⌘ K</kbd> to jump anywhere.
        </p>
      </div>
      <Section title="Favorites" items={pick(favorites)} />
      <Section title="Recently used" items={pick(recents)} />
      <Section title="All tools" items={tools} />
      <About />
    </>
  )
}
