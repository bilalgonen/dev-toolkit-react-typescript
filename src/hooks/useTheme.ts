import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

/** Syncs the `dark` class on <html> with the stored theme (and the OS setting for "system"). */
export function useTheme() {
  const theme = useAppStore((s) => s.theme)
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches))
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])
}
