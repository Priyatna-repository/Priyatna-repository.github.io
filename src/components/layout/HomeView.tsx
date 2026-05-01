'use client'
import '@/styles/pages/home.css'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useSearchStore } from '@/store/searchStore'
import { QUICK_CHIPS } from '@/data'
import { usePixelFont } from '@/hooks/usePixelFont'
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions'
import { useKeyboardNav } from '@/hooks/useKeyboardNav'
import { useHistorySelection } from '@/hooks/useHistorySelection'

export default function HomeView() {
  const [localInput, setLocalInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [hoveredHistIdx, setHoveredHistIdx] = useState<number | null>(null)
  const { runSearch, history, removeFromHistory } = useSearchStore()
  const wrapRef = useRef<HTMLDivElement>(null)

  usePixelFont('palette-row', 'interactive-word', 'bg-canvas')

  const { historyItems, defaultItems, slashItems, allItems, isSlashMode } =
    useSearchSuggestions(localInput, history)

  const { activeIndex, setActiveIndex, handleKeyDown: navKeyDown, reset: resetNav } =
    useKeyboardNav({
      itemCount: allItems.length,
      onSelect: (i) => handleSelect(allItems[i].query),
      onEscape: () => { setIsFocused(false); clearSelection() },
    })

  const {
    isSelectionMode,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    deleteSelected,
  } = useHistorySelection()

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsFocused(false)
        resetNav()
        clearSelection()
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [resetNav, clearSelection])

  function handleSelect(query: string) {
    setLocalInput(query)
    setIsFocused(false)
    resetNav()
    clearSelection()
    runSearch(query)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && activeIndex < 0) {
      runSearch(localInput)
      setIsFocused(false)
      return
    }
    navKeyDown(e)
  }

  const allHistoryQueries = historyItems.map((i) => i.query)
  const showSuggestions = isFocused && allItems.length > 0

  return (
    <div id="home">
      <div className="home-bg-container">
        <Image
          src="/assets/images/hero-background.jpg"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="home-overlay" />
      </div>

      <canvas id="bg-canvas" />

      <div className="home-hero">
        <div className="explore-tag">
          <div className="palette-row" id="palette-row" />
          <span className="et-word">EXPLORE</span>
          <span className="et-word et-italic">The</span>
          <span className="et-word">ARCHIVE</span>
        </div>

        <div className="home-logo-row">
          <div className="word" id="interactive-word" />
          <span className="hl-dot">.</span>
        </div>

        <div className="search-center-wrap" ref={wrapRef}>
          <div className="search-input-anchor">
            <div className="search-box">
              <input
                className="search-input"
                placeholder={isSlashMode ? 'Type a command...' : 'Explore the Archive...'}
                value={localInput}
                onChange={(e) => { setLocalInput(e.target.value); resetNav() }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
              />
              <button className="search-submit" onClick={() => runSearch(localInput)}>
                SEARCH
              </button>
            </div>

            <div className={`suggestions${showSuggestions ? ' show' : ''}`}>
              {isSlashMode ? (
                <>
                  <div className="sug-group-label">Commands</div>
                  {slashItems.map((item, idx) => (
                    <div
                      key={`slash-${idx}`}
                      className={`sug-row${activeIndex === idx ? ' sug-selected' : ''}`}
                      onClick={() => handleSelect(item.query)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <span className="sug-arrow">/</span>
                      <span className="sug-text">{item.label}</span>
                      <span className={`sug-tag ${item.tagClass}`}>{item.tagText}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {historyItems.length > 0 && (
                    <>
                      <div className="sug-group-label sug-group-history">
                        <span>Recent Searches</span>
                        {isSelectionMode && (
                          <div className="sug-bulk-bar">
                            <button
                              className="sug-bulk-btn"
                              onClick={() => selectAll(allHistoryQueries)}
                            >Select All</button>
                            <button
                              className="sug-bulk-btn sug-bulk-delete"
                              onClick={() => deleteSelected(removeFromHistory)}
                            >Delete Selected</button>
                            <button
                              className="sug-bulk-btn"
                              onClick={clearSelection}
                            >✕ Cancel</button>
                          </div>
                        )}
                      </div>
                      {historyItems.map((item, idx) => (
                        <div
                          key={`hist-${idx}`}
                          className={[
                            'sug-row sug-row-history',
                            activeIndex === idx ? 'sug-selected' : '',
                            isSelected(item.query) ? 'sug-row-checked' : '',
                          ].filter(Boolean).join(' ')}
                          onClick={() => isSelectionMode ? toggleSelect(item.query) : handleSelect(item.query)}
                          onMouseEnter={() => { setActiveIndex(idx); setHoveredHistIdx(idx) }}
                          onMouseLeave={() => setHoveredHistIdx(null)}
                        >
                          <span className="sug-arrow">
                            {isSelectionMode
                              ? (isSelected(item.query) ? '☑' : '☐')
                              : '↻'}
                          </span>
                          <span className="sug-text">{item.label}</span>
                          {!isSelectionMode && (
                            <div className={`sug-actions${hoveredHistIdx === idx ? ' visible' : ''}`}>
                              <button
                                className="sug-act-btn sug-act-delete"
                                title="Delete"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFromHistory(item.query)
                                  setHoveredHistIdx(null)
                                }}
                              >✕</button>
                              <button
                                className="sug-act-btn sug-act-select"
                                title="Select"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSelect(item.query)
                                }}
                              >☐</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                  {defaultItems.length > 0 && (
                    <>
                      <div className="sug-group-label">Suggestions</div>
                      {defaultItems.map((item, idx) => {
                        const globalIdx = historyItems.length + idx
                        return (
                          <div
                            key={`def-${idx}`}
                            className={`sug-row${activeIndex === globalIdx ? ' sug-selected' : ''}`}
                            onClick={() => handleSelect(item.query)}
                            onMouseEnter={() => setActiveIndex(globalIdx)}
                          >
                            <span className="sug-arrow">→</span>
                            <span className="sug-text">{item.label}</span>
                            <span className={`sug-tag ${item.tagClass}`}>{item.tagText}</span>
                          </div>
                        )
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="quick-chips">
            {QUICK_CHIPS.map((chip) => (
              <button key={chip.label} className="qchip" onClick={() => runSearch(chip.query)}>
                <span className="qchip-dot" style={{ background: chip.color }} />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
