'use client'
import { useState } from 'react'
import { useSearchStore } from '@/store/searchStore'
import { useUIStore } from '@/store/uiStore'
import { RESULT_CARDS } from '@/data'
import type { ResultCard } from '@/types'

const TABS = [
  { value: 'all', label: 'ALL' },
  { value: 'projects', label: 'PROJECTS' },
  { value: 'labs', label: 'LAB TOOLS' },
  { value: 'motion', label: 'MOTION' },
  { value: 'branding', label: 'BRANDING' },
]

function ResultCardItem({ card }: { card: ResultCard }) {
  return (
    <div className="r-card">
      <div className="rc-crumb">
        <div className={`rc-icon ${card.iconColorClass}`}>{card.iconLetter}</div>
        <div className="rc-source">
          {card.source}<b>{card.sourceBold}</b>
        </div>
      </div>
      <div className="rc-title">{card.title}</div>
      <div className="rc-desc">{card.desc}</div>
      <div className="rc-foot">
        {card.tags.map((tag) => (
          <span key={tag.label} className={`rc-tag ${tag.colorClass}`}>
            {tag.label}
          </span>
        ))}
        <span className="rc-date">{card.date}</span>
        <span className="rc-arrow">↗</span>
      </div>
    </div>
  )
}

export default function ResultsView() {
  const { query, goHome, runSearch } = useSearchStore()
  const theme = useUIStore((s) => s.theme)
  const [activeTab, setActiveTab] = useState('all')
  const [localInput, setLocalInput] = useState(query)

  const filtered =
    activeTab === 'all'
      ? RESULT_CARDS
      : RESULT_CARDS.filter((c) => c.categories.includes(activeTab))

  return (
    <div id="results-view" className={`show rv-${theme}`}>
      {/* Top bar */}
      <div className="results-topbar">
        <div className="rtb-logo" onClick={goHome} style={{ cursor: 'none' }}>
          PRI<span>.</span>
        </div>
        <div className="search-bar-inline">
          <input
            className="sbi-input"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(localInput)}
          />
          <button className="sbi-btn" onClick={() => runSearch(localInput)}>↗</button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="tabs-wrapper">
        <div className="tabs-list-line">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`tabs-trigger-line${activeTab === tab.value ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="results-layout">
        <div className="results-main">
          <div className="results-meta">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </div>
          {filtered.length > 0 ? (
            filtered.map((card) => <ResultCardItem key={card.id} card={card} />)
          ) : (
            <div style={{ padding: '48px 0', color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--f-mono)' }}>
              NO RESULTS IN THIS CATEGORY
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
