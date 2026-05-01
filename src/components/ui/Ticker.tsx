'use client'
import '@/styles/components/ticker.css'
import { TICKER_ITEMS } from '@/data/ticker'
import { useUIStore } from '@/store/uiStore'
import { useSearchStore } from '@/store/searchStore'

export default function Ticker() {
  const { theme, toggleTheme } = useUIStore()
  const isLoaderDone = useUIStore((s) => s.isLoaderDone)
  const isResultsView = useSearchStore((s) => s.isResultsView)
  const displayItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  const pauseTrack = (wrap: EventTarget & HTMLDivElement) => {
    const track = wrap.querySelector('.ticker-track') as HTMLElement | null
    if (track) track.style.animationPlayState = 'paused'
  }
  const resumeTrack = (wrap: EventTarget & HTMLDivElement) => {
    const track = wrap.querySelector('.ticker-track') as HTMLElement | null
    if (track) track.style.animationPlayState = 'running'
  }

  return (
    <div className={`ticker-wrap${(isLoaderDone && !isResultsView) ? ' ticker-home' : ''}`}>
      {/* Scrolling area — overflow is clipped on this inner div */}
      <div
        className="ticker-scroll"
        onMouseEnter={(e) => pauseTrack(e.currentTarget.closest('.ticker-wrap') as EventTarget & HTMLDivElement)}
        onMouseLeave={(e) => resumeTrack(e.currentTarget.closest('.ticker-wrap') as EventTarget & HTMLDivElement)}
      >
        <div className="ticker-track">
          {displayItems.map((item, i) => (
            <div key={`${item.text}-${i}`} className="ticker-item">
              <span className={`ticker-dot ${item.dotClass}`} />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <button
        className="ticker-theme-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        data-tooltip={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      >
        {theme === 'light' ? '☼' : '☾'}
      </button>
    </div>
  )
}
