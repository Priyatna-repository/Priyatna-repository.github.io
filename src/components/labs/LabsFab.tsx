'use client'
import { useUIStore } from '@/store/uiStore'

export default function LabsFab() {
  const openLabs = useUIStore((s) => s.openLabs)
  return (
    <button className="labs-fab" onClick={openLabs}>
      <span className="lfab-dot"></span>
      <span className="lfab-icon">⬡</span>
      <span className="lfab-text">Addon Labs</span>
    </button>
  )
}
