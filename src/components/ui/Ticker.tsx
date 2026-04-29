'use client'
import { TICKER_ITEMS } from '@/data/ticker'
import { useUIStore } from '@/store/uiStore'

export default function Ticker() {
  const { theme, toggleTheme } = useUIStore()
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
    <div className="ticker-wrap">
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

      {/* Theme toggle embedded in the ticker bar — z-index stays at ticker level (100),
          never floats above the global loader (10000) */}
      <button className="ticker-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '☼' : '☾'}
      </button>
    </div>
  )
}
