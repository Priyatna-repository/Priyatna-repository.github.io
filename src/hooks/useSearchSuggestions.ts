import { useMemo } from 'react'
import { SUGGESTIONS } from '@/data'
import type { SearchSuggestion } from '@/types'

// ─── Slash commands ────────────────────────────────────────────────────────────
const SLASH_COMMANDS: SearchSuggestion[] = [
  { query: 'who am I',  label: '/whoami — About Priyatna',  tagClass: 'st-design', tagText: 'CMD' },
  { query: 'projects',  label: '/projects — All Showcase',  tagClass: 'st-brand',  tagText: 'CMD' },
  { query: 'blog',      label: '/blog — All Posts',         tagClass: 'st-design', tagText: 'CMD' },
  { query: 'labs',      label: '/labs — Experiments',       tagClass: 'st-lab',    tagText: 'CMD' },
  { query: 'motion',    label: '/motion — Motion Design',   tagClass: 'st-motion', tagText: 'CMD' },
]

interface HistoryItem {
  query: string
  label: string
  tagClass: string
  tagText: string
}

interface SuggestionResult {
  historyItems: HistoryItem[]
  defaultItems: SearchSuggestion[]
  slashItems: SearchSuggestion[]
  allItems: (HistoryItem | SearchSuggestion)[]
  isSlashMode: boolean
}

export function useSearchSuggestions(input: string, history: string[]): SuggestionResult {
  const isSlashMode = input === '/' || input.startsWith('/')

  const historyItems = useMemo<HistoryItem[]>(() => {
    if (isSlashMode) return []
    const term = input.trim().toLowerCase()
    const filtered = term
      ? history.filter((h) => h.toLowerCase().includes(term))
      : history.slice(0, 5)
    return filtered.map((h) => ({ query: h, label: h, tagClass: 'st-brand', tagText: 'History' }))
  }, [input, history, isSlashMode])

  const slashItems = useMemo<SearchSuggestion[]>(() => {
    if (!isSlashMode) return []
    const term = input.slice(1).toLowerCase()
    return term
      ? SLASH_COMMANDS.filter((c) => c.label.toLowerCase().includes(term))
      : SLASH_COMMANDS
  }, [input, isSlashMode])

  const defaultItems = useMemo<SearchSuggestion[]>(() => {
    if (isSlashMode) return []
    const term = input.trim().toLowerCase()
    return term
      ? SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(term))
      : SUGGESTIONS.slice(0, 6)
  }, [input, isSlashMode])

  const allItems = useMemo(
    () => [...historyItems, ...slashItems, ...defaultItems],
    [historyItems, slashItems, defaultItems]
  )

  return { historyItems, defaultItems, slashItems, allItems, isSlashMode }
}
