import { useState, useCallback } from 'react'

interface UseKeyboardNavOptions {
  itemCount: number
  onSelect: (index: number) => void
  onEscape?: () => void
}

interface UseKeyboardNavResult {
  activeIndex: number
  setActiveIndex: (i: number) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  reset: () => void
}

export function useKeyboardNav({ itemCount, onSelect, onEscape }: UseKeyboardNavOptions): UseKeyboardNavResult {
  const [activeIndex, setActiveIndex] = useState(-1)

  const reset = useCallback(() => setActiveIndex(-1), [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % itemCount)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount)
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0) onSelect(activeIndex)
        break
      case 'Escape':
        e.preventDefault()
        reset()
        onEscape?.()
        break
    }
  }, [activeIndex, itemCount, onSelect, onEscape, reset])

  return { activeIndex, setActiveIndex, handleKeyDown, reset }
}
