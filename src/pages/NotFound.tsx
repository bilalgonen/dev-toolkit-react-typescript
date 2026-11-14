import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <p className="mt-2 text-muted">We couldn't find that page or tool.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg">
        Back to all tools
      </Link>
    </div>
  )
}
