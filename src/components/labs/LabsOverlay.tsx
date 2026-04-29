'use client'
import { useUIStore } from '@/store/uiStore'
import { LAB_ITEMS } from '@/data'

export default function LabsOverlay() {
  const { isLabsOpen, closeLabs } = useUIStore()

  if (!isLabsOpen) return null

  return (
    <div id="labs-overlay" className="show" onClick={(e) => e.target === e.currentTarget && closeLabs()}>
      <div className="labs-modal">
        <button className="lm-close" onClick={closeLabs}>✕</button>
        <div className="lm-header">
          <div className="lm-title">ADDON LABS</div>
        </div>
        <div className="lm-grid">
          {LAB_ITEMS.map((item) => (
            <div key={item.id} className={`lm-card lc-${item.colorTheme}`}>
              <div className="lmc-icon">{item.icon}</div>
              <div className="lmc-name">{item.name}</div>
              <div className="lmc-desc">{item.description}</div>
              <div className="lmc-meta">
                <span className="lmc-version">{item.version}</span>
                <span className={`lmc-status lcs-${item.status}`}>{item.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
