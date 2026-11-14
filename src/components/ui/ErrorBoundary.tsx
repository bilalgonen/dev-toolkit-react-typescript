import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './Button'

/** Give it a `key` that changes with the route to clear a previous error. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-6">
        <h2 className="font-semibold">Something went wrong</h2>
        <p className="my-2 font-mono text-sm text-muted">{error.message}</p>
        <Button onClick={() => this.setState({ error: null })}>Try again</Button>
      </div>
    )
  }
}
