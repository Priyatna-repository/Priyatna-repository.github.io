import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SearchStore {
  // State
  query: string;
  isResultsView: boolean;
  isLabsOpen: boolean;
  theme: 'light' | 'dark';
  history: string[];
  _hasHydrated: boolean; // Flag penting untuk Next.js

  // Actions
  setQuery: (q: string) => void;
  runSearch: (q: string) => void;
  goHome: () => void;
  openLabs: () => void;
  closeLabs: () => void;
  toggleTheme: () => void;
  setHasHydrated: (state: boolean) => void;
  addToHistory: (q: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: '',
      isResultsView: false,
      isLabsOpen: false,
      theme: 'light',
      history: [],
      _hasHydrated: false,

      setQuery: (q) => set({ query: q }),

      runSearch: (q) => {
        const trimmed = q.trim();
        if (!trimmed) return;
        set({ query: trimmed, isResultsView: true });
        
        // Add to history
        get().addToHistory(trimmed);
        
        // Scroll ke atas dengan halus saat mencari
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      goHome: () => {
        set({ query: '', isResultsView: false });
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      openLabs: () => set({ isLabsOpen: true }),
      closeLabs: () => set({ isLabsOpen: false }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addToHistory: (q) =>
        set((state) => {
          const trimmed = q.trim();
          if (!trimmed) return state;
          const newHistory = [trimmed, ...state.history.filter((h) => h !== trimmed)].slice(0, 10);
          return { history: newHistory };
        }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'priyatna-storage',
      storage: createJSONStorage(() => localStorage),
      
      // Sinkronisasi dengan hydration Next.js
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },

      // Simpan theme dan history
      partialize: (state) => ({ 
        theme: state.theme,
        history: state.history,
      }),
    }
  )
);
