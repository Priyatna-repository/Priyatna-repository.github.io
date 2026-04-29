'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UIStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'priyatna-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
