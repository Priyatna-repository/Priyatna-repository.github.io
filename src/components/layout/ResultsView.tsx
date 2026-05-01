'use client'
import '@/styles/pages/results.css'
import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchStore } from '@/store/searchStore'
import { useUIStore } from '@/store/uiStore'
import { getAllPosts } from '@/data/posts'
import { getAllProjects } from '@/data/projects'
import { getActiveLabs } from '@/data/labs'
import { RESULT_TABS, TYPE_LABEL, TYPE_COLOR, TAG_COLOR } from '@/data/results'
import { runSearch } from '@/lib/search'
import type { SearchResult, SearchResultType } from '@/lib/search'
import SiteFooter from '@/components/ui/SiteFooter'
import AdminAvatar from '@/components/ui/AdminAvatar'

const all_posts = getAllPosts()
const all_projects = getAllProjects()
const active_labs = getActiveLabs()

// Credentials are checked client-side only — cosmetic admin indicator for a static site.
const ADMIN_USER = 'priyatna'
const ADMIN_PASS = 'sudo#2026'
const LOGIN_TRIGGER = 'sudo login priyatna'

function ResultCardItem({ result }: { result: SearchResult }) {
  return (
    <Link href={result.url} className="r-card" style={{ textDecoration: 'none' }}>
      <div className="rc-crumb">
        <div className={`rc-icon ${TYPE_COLOR[result.type]}`}>
          {result.title[0].toUpperCase()}
        </div>
        <div className="rc-source">
          {TYPE_LABEL[result.type]}
        </div>
      </div>
      <div className="rc-title">{result.title.toUpperCase()}</div>
      <div className="rc-desc">{result.description}</div>
      <div className="rc-foot">
        {result.tags.map((tag) => (
          <span key={tag} className={`rc-tag ${TAG_COLOR[result.type]}`}>{tag}</span>
        ))}
        <span className="rc-date">{result.meta}</span>
        <span className="rc-arrow">↗</span>
      </div>
    </Link>
  )
}

function ResultsSidebar({
  topTags,
  onRelatedSearch,
  relatedSearches,
}: {
  topTags: string[]
  relatedSearches: string[]
  onRelatedSearch: (q: string) => void
}) {
  return (
    <aside className="results-sidebar">
      <div className="rsb-block">
        <div className="rsb-label">Archive</div>
        <div className="rsb-stats">
          <div className="rsb-stat">
            <span className="rsb-stat-num">{all_posts.length}</span>
            <span className="rsb-stat-key">Posts</span>
          </div>
          <div className="rsb-stat">
            <span className="rsb-stat-num">{all_projects.length}</span>
            <span className="rsb-stat-key">Projects</span>
          </div>
          <div className="rsb-stat">
            <span className="rsb-stat-num">{active_labs.length}</span>
            <span className="rsb-stat-key">Labs</span>
          </div>
        </div>
      </div>

      {topTags.length > 0 && (
        <div className="rsb-block">
          <div className="rsb-label">Top Tags</div>
          <div className="rsb-tags">
            {topTags.map((tag) => (
              <button
                key={tag}
                className="rsb-tag-chip"
                onClick={() => onRelatedSearch(tag)}
              >{tag}</button>
            ))}
          </div>
        </div>
      )}

      {relatedSearches.length > 0 && (
        <div className="rsb-block">
          <div className="rsb-label">People Also Search</div>
          <div className="rsb-related">
            {relatedSearches.map((q) => (
              <button
                key={q}
                className="rsb-related-item"
                onClick={() => onRelatedSearch(q)}
              >
                <span className="rsb-related-arrow">↗</span>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rsb-block rsb-profile">
        <div className="rsb-profile-name">PRIYATNA</div>
        <div className="rsb-profile-role">Designer & Developer</div>
        <div className="rsb-profile-links">
          <a href="https://github.com/Priyatna-repository" target="_blank" rel="noreferrer" className="rsb-profile-link">GitHub ↗</a>
          <a href="mailto:priyatna.info@gmail.com" className="rsb-profile-link">Email ↗</a>
        </div>
      </div>
    </aside>
  )
}

export default function ResultsView() {
  const { query, goHome, runSearch: storeSearch } = useSearchStore()
  const theme = useUIStore((s) => s.theme)
  const isLoggedIn = useUIStore((s) => s.isLoggedIn)
  const login = useUIStore((s) => s.login)

  const [activeTab, setActiveTab] = useState<'all' | SearchResultType>('all')
  const [localInput, setLocalInput] = useState(query)

  const [loginMode, setLoginMode] = useState(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const userRef = useRef<HTMLInputElement>(null)

  const results = useMemo(
    () => runSearch(query, all_posts, all_projects, active_labs),
    [query]
  )

  const filtered = useMemo(
    () => activeTab === 'all' ? results : results.filter((r) => r.type === activeTab),
    [results, activeTab]
  )

  const counts = useMemo(() => ({
    all: results.length,
    blog: results.filter((r) => r.type === 'blog').length,
    project: results.filter((r) => r.type === 'project').length,
    lab: results.filter((r) => r.type === 'lab').length,
  }), [results])

  const topTags = useMemo(() => {
    const freq: Record<string, number> = {}
    results.forEach((r) => r.tags.forEach((t) => { freq[t] = (freq[t] ?? 0) + 1 }))
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag)
  }, [results])

  const relatedSearches = useMemo(() => {
    const q = query.toLowerCase()
    const pool = ['design system', 'motion', 'branding', 'UI/UX', 'typography', 'color theory', 'web design', 'showcase', 'blog', 'labs']
    return pool.filter((s) => !s.toLowerCase().includes(q) && !q.includes(s.toLowerCase())).slice(0, 5)
  }, [query])

  function enterLoginMode() {
    setLoginMode(true)
    setLocalInput('')
    setLoginUser('')
    setLoginPass('')
    setLoginError('')
    setTimeout(() => userRef.current?.focus(), 50)
  }

  function exitLoginMode() {
    setLoginMode(false)
    setLoginError('')
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { exitLoginMode(); return }
    if (e.key === 'Enter') {
      if (localInput.trim().toLowerCase() === LOGIN_TRIGGER) {
        enterLoginMode()
        return
      }
      storeSearch(localInput)
      setActiveTab('all')
    }
  }

  function handleLoginSubmit() {
    if (loginUser.trim().toLowerCase() === ADMIN_USER && loginPass === ADMIN_PASS) {
      login()
      exitLoginMode()
      setLocalInput('')
    } else {
      setLoginError('Invalid credentials')
      setLoginPass('')
    }
  }

  function handleLoginKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { exitLoginMode(); return }
    if (e.key === 'Enter') handleLoginSubmit()
  }

  function handleRelatedSearch(q: string) {
    setLocalInput(q)
    storeSearch(q)
    setActiveTab('all')
  }

  return (
    <div id="results-view" className={`show rv-${theme}`}>

      {/* Sticky header */}
      <div className="rv-sticky-header">
        <div className="results-topbar">
          <div className="rtb-logo" onClick={goHome} style={{ cursor: 'none' }}>
            PRI<span>.</span>
          </div>

          {loginMode ? (
            <div className="search-bar-inline login-mode">
              <span className="sbi-prompt">$</span>
              <input
                ref={userRef}
                className="sbi-input"
                placeholder="username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                onKeyDown={handleLoginKeyDown}
                autoComplete="username"
              />
              <input
                className="sbi-input sbi-pass"
                placeholder="password"
                type="password"
                value={loginPass}
                onChange={(e) => { setLoginPass(e.target.value); setLoginError('') }}
                onKeyDown={handleLoginKeyDown}
                autoComplete="current-password"
              />
              {loginError && <span className="sbi-error">{loginError}</span>}
              <button className="sbi-btn" onClick={handleLoginSubmit}>→</button>
              <button className="sbi-cancel" onClick={exitLoginMode}>✕</button>
            </div>
          ) : (
            <div className="search-bar-inline">
              <input
                className="sbi-input"
                placeholder="Search the archive..."
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                className="sbi-btn"
                onClick={() => { storeSearch(localInput); setActiveTab('all') }}
              >
                ↗
              </button>
            </div>
          )}

          {isLoggedIn && <AdminAvatar />}
        </div>

        <div className="results-tabs">
          {RESULT_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`rtab-btn${activeTab === tab.value ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.value as typeof activeTab)}
            >
              {tab.label}
              <span className="rtab-count">
                {counts[tab.value as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-column body */}
      <div className="results-body">
        <div className="results-main">
          <div className="results-meta">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </div>

          {filtered.length > 0 ? (
            filtered.map((result) => <ResultCardItem key={result.id} result={result} />)
          ) : (
            <div className="results-empty">NO RESULTS FOUND</div>
          )}
        </div>

        <ResultsSidebar
          topTags={topTags}
          relatedSearches={relatedSearches}
          onRelatedSearch={handleRelatedSearch}
        />
      </div>

      <SiteFooter />

    </div>
  )
}
