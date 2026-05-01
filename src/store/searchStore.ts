import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SearchStore {
  query: string
  isResultsView: boolean
  history: string[]
  _hasHydrated: boolean

  setQuery: (q: string) => void
  runSearch: (q: string) => void
  goHome: () => void
  setHasHydrated: (state: boolean) => void
  addToHistory: (q: string) => void
  removeFromHistory: (q: string) => void
  clearHistory: () => void
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: '',
      isResultsView: false,
      history: [],
      _hasHydrated: false,

      setQuery: (q) => set({ query: q }),

      runSearch: (q) => {
        const trimmed = q.trim()
        if (!trimmed) return
        set({ query: trimmed, isResultsView: true })
        get().addToHistory(trimmed)
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },

      goHome: () => {
        set({ query: '', isResultsView: false })
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addToHistory: (q) =>
        set((state) => {
          const trimmed = q.trim()
          if (!trimmed) return state
          const newHistory = [trimmed, ...state.history.filter((h) => h !== trimmed)].slice(0, 10)
          return { history: newHistory }
        }),

      removeFromHistory: (q) =>
        set((state) => ({ history: state.history.filter((h) => h !== q) })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'priyatna-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
)
