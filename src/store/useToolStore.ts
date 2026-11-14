import { useCallback, useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ToolStore {
  data: Record<string, object>
  update: (id: string, patch: object) => void
}

const useToolStore = create<ToolStore>()(
  persist(
    (set) => ({
      data: {},
      update: (id, patch) => set((s) => ({ data: { ...s.data, [id]: { ...s.data[id], ...patch } } })),
    }),
    { name: 'devtoolkit-tools' },
  ),
)

/**
 * Like `useState` for an object, but persisted per tool in localStorage.
 * `initial` must be a stable (module-level) constant.
 */
export function useToolState<T extends object>(id: string, initial: T) {
  const stored = useToolStore((s) => s.data[id]) as Partial<T> | undefined
  const state = useMemo(() => ({ ...initial, ...stored }), [initial, stored])
  const patch = useCallback((p: Partial<T>) => useToolStore.getState().update(id, p), [id])
  return [state, patch] as const
}
