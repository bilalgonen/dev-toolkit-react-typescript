import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'system' | 'light' | 'dark'

interface AppState {
  theme: Theme
  favorites: string[]
  recents: string[]
  setTheme: (theme: Theme) => void
  toggleFavorite: (id: string) => void
  addRecent: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      favorites: [],
      recents: [],
      setTheme: (theme) => set({ theme }),
      toggleFavorite: (id) =>
        set(({ favorites }) => ({
          favorites: favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id],
        })),
      addRecent: (id) => set(({ recents }) => ({ recents: [id, ...recents.filter((r) => r !== id)].slice(0, 4) })),
    }),
    { name: 'devtoolkit-app' },
  ),
)
