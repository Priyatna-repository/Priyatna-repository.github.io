'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UIStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  isLoaderDone: boolean
  setLoaderDone: () => void
  resetLoader: () => void
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      isLoaderDone: false,
      setLoaderDone: () => set({ isLoaderDone: true }),
      resetLoader: () => set({ isLoaderDone: false }),
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: 'priyatna-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, isLoggedIn: state.isLoggedIn }),
    }
  )
)
