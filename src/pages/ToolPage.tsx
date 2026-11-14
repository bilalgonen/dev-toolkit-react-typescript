import { Suspense, useEffect } from 'react'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useAppStore } from '@/store/useAppStore'
import { findTool } from '@/tools/registry'
import NotFound from './NotFound'

const Skeleton = () => <div className="h-72 animate-pulse rounded-xl bg-line/60" aria-label="Loading tool" />

/** Generic shell for every tool: heading, favorite toggle, error boundary and lazy loading. */
export default function ToolPage() {
  const tool = findTool(useParams().id)
  const { favorites, toggleFavorite, addRecent } = useAppStore()

  useEffect(() => {
    if (tool) {
      addRecent(tool.id)
      document.title = `${tool.name} · DevToolkit`
    }
    return () => void (document.title = 'DevToolkit – free in-browser developer utilities')
  }, [tool, addRecent])

  if (!tool) return <NotFound />
  const Tool = tool.component
  const starred = favorites.includes(tool.id)

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="mt-1 text-sm text-muted">{tool.description}</p>
        </div>
        <Button
          variant="ghost"
          icon="star"
          aria-pressed={starred}
          aria-label={starred ? 'Remove from favorites' : 'Add to favorites'}
          className={starred ? 'text-amber-500' : ''}
          onClick={() => toggleFavorite(tool.id)}
        />
      </div>
      <ErrorBoundary key={tool.id}>
        <Suspense fallback={<Skeleton />}>
          <Tool />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
