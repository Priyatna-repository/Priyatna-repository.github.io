import { useState, useCallback } from 'react'

interface UseHistorySelectionResult {
  selected: Set<string>
  isSelectionMode: boolean
  isSelected: (q: string) => boolean
  toggleSelect: (q: string) => void
  selectAll: (queries: string[]) => void
  clearSelection: () => void
  deleteSelected: (remove: (q: string) => void) => void
}

export function useHistorySelection(): UseHistorySelectionResult {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const isSelectionMode = selected.size > 0

  const isSelected = useCallback((q: string) => selected.has(q), [selected])

  const toggleSelect = useCallback((q: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(q)) next.delete(q)
      else next.add(q)
      return next
    })
  }, [])

  const selectAll = useCallback((queries: string[]) => {
    setSelected(new Set(queries))
  }, [])

  const clearSelection = useCallback(() => setSelected(new Set()), [])

  const deleteSelected = useCallback((remove: (q: string) => void) => {
    selected.forEach((q) => remove(q))
    setSelected(new Set())
  }, [selected])

  return { selected, isSelectionMode, isSelected, toggleSelect, selectAll, clearSelection, deleteSelected }
}
