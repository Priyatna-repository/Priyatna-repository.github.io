'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UIStore {
  isLabsOpen: boolean
  theme: 'light' | 'dark'
  openLabs: () => void
  closeLabs: () => void
  toggleLabs: () => void
  toggleTheme: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isLabsOpen: false,
      theme: 'light',
      openLabs: () => set({ isLabsOpen: true }),
      closeLabs: () => set({ isLabsOpen: false }),
      toggleLabs: () => set((state) => ({ isLabsOpen: !state.isLabsOpen })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'priyatna-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
