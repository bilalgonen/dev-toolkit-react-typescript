import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import ToolPage from '@/pages/ToolPage'
import JsonTool from './JsonTool'
import RegexTool from './RegexTool'
import { tools } from './registry'

afterEach(cleanup)

const type = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('tools', () => {
  it('JsonTool formats input and reports errors', async () => {
    render(<JsonTool />)
    type('JSON', '{"b":1,"a":2}')
    await waitFor(() => expect(screen.getByLabelText('Result')).toHaveValue('{\n  "b": 1,\n  "a": 2\n}'))
    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    type('JSON', '{oops')
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('RegexTool highlights matches', async () => {
    render(<RegexTool />)
    type('Pattern', '\\d+')
    type('Text', 'a12 b345')
    expect(await screen.findByText('2 matches')).toBeInTheDocument()
    expect(screen.getByLabelText('Highlighted matches').querySelectorAll('mark')).toHaveLength(2)
  })
})

describe('app', () => {
  const renderAt = (path: string) =>
    render(
      <RouterProvider
        router={createMemoryRouter([{ element: <Layout />, children: [{ index: true, element: <Home /> }, { path: 'tools/:id', element: <ToolPage /> }] }], { initialEntries: [path] })}
      />,
    )

  it('lists every registered tool on the home page', () => {
    renderAt('/')
    for (const t of tools) expect(screen.getAllByText(t.name).length).toBeGreaterThan(0)
  })

  it.each(tools)('lazy-loads the $name route', async (t) => {
    renderAt(`/tools/${t.id}`)
    expect(await screen.findByRole('heading', { level: 1, name: t.name })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByLabelText('Loading tool')).not.toBeInTheDocument())
  })

  it('opens the command palette with Ctrl+K', async () => {
    renderAt('/')
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(await screen.findByRole('combobox', { name: 'Search tools' })).toBeInTheDocument()
  })
})
