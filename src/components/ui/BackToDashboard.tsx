'use client'
import { useSearchStore } from '@/store/searchStore'

export default function BackToDashboard() {
  const goHome = useSearchStore((s) => s.goHome)

  return (
    <button className="back-to-dashboard" onClick={goHome} aria-label="Back to dashboard">
      <span className="btd-arrow">←</span>
      <span className="btd-label">PRI.</span>
    </button>
  )
}
