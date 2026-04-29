"use client"
import { useSearchStore } from '@/store/searchStore';

export default function LabsOverlay() {
  const { isLabsOpen, closeLabs } = useSearchStore();

  if (!isLabsOpen) return null;

  return (
    <div id="labs-overlay" className="show" onClick={(e) => e.target === e.currentTarget && closeLabs()}>
      <div className="labs-modal">
        <button className="lm-close" onClick={closeLabs}>✕</button>
        <div className="lm-header">
           <div className="lm-title">ADDON LABS</div>
        </div>
        {/* ... isi modal ... */}
      </div>
    </div>
  );
}