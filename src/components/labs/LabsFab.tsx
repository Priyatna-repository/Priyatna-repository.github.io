"use client"
import { useSearchStore } from '@/store/searchStore';

export default function LabsFab() {
  const openLabs = useSearchStore(s => s.openLabs);
  return (
    <button className="labs-fab" onClick={openLabs}>
      <span className="lfab-dot"></span>
      <span className="lfab-icon">⬡</span>
      <span className="lfab-text">Addon Labs</span>
    </button>
  );
}