# DevToolkit

Everyday developer utilities that run **100% in your browser** — no backend, no database, nothing uploaded.

| Tool | Highlights |
| --- | --- |
| JSON Formatter | format / minify / sort keys, error line + column |
| Base64 & URL Encoder | Unicode-safe Base64, Base64URL, percent-encoding, one-click swap |
| Regex Tester | live highlighting, flag switches, numbered + named groups |
| JWT Decoder | header / claims / expiry status (token never persisted) |
| Color Converter | HEX ⇄ RGB ⇄ HSL, sliders, WCAG contrast |
| Hash Generator | SHA-1/256/384/512 for text or files (Web Crypto), compare-to-expected |

Also: command palette (`Ctrl/⌘ K`), favorites + recents, light/dark/system theme, responsive layout, per-tool persisted state.

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Zustand · React Router · Vitest + Testing Library

## Design notes

- **Registry-driven** — [`src/tools/registry.ts`](src/tools/registry.ts) is the single source of truth. The sidebar, home grid, routes and command palette are generated from it, and each tool is a lazy-loaded chunk. Adding a tool = one component + one registry entry.
- **Pure logic in `src/lib`** — all tool logic is framework-free, returns a `Result<T>` instead of throwing, and is unit tested.
- **Small reusable UI kit** (`src/components/ui`): generic `Tabs`/`Select` (typed by option keys), `Switch`, `Slider`, `Modal` (native `<dialog>`), `Tooltip`, `Toaster`, `ErrorBoundary`, `TextArea`, `Panel`, …
- **React 19 features** — `use()` + Suspense (hash tool), `useDeferredValue` for responsive typing, `ref` as a prop, native `<dialog>` modal.
- **State** — Zustand stores (`persist` middleware) for app settings and per-tool input via `useToolState`.
- **Accessibility** — labelled controls, `role="tablist"/"switch"/"combobox"/"alert"`, keyboard navigation, visible focus rings.

## Scripts

```bash
npm install
npm run dev        # local dev server
npm test           # unit + component tests
npm run lint       # oxlint
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Deploy to Cloudflare Pages

Connect the repo in the Cloudflare dashboard (Workers & Pages → Create → Pages) and use:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

Or deploy directly: `npm run build && npx wrangler pages deploy dist`.
`public/_redirects` provides SPA fallback so deep links like `/tools/jwt` work on refresh.
