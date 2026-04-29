"use client"
import { useSearchStore } from '@/store/searchStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useSearchStore();

  return (
    <div className="theme-toggle-wrap">
      <button className="theme-btn" onClick={toggleTheme}>
        <span className="theme-icon">{theme === 'light' ? '☼' : '☾'}</span>
        <span className="theme-text">
            {theme === 'light' ? 'SWITCH_DARK' : 'SWITCH_LIGHT'}
        </span>
      </button>
      
      <style jsx>{`
        .theme-toggle-wrap {
          position: fixed;
          bottom: 32px;
          left: 32px;
          z-index: 1000;
        }
        .theme-btn {
          background: var(--ink);
          color: var(--paper);
          border: 1px solid var(--border-light);
          padding: 8px 16px;
          font-family: var(--f-mono);
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: none; /* Agar tetap pakai custom cursor */
          transition: all 0.3s var(--transition);
        }
        .theme-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
        }
        .theme-icon {
  font-size: 14px;
  transition: transform 0.4s ease;
}

.theme-btn:active .theme-icon {
  transform: rotate(180deg);
}
        @media (max-width: 600px) {
          .theme-text {
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.theme-btn:hover .theme-text {
  opacity: 1;
  transform: translateX(0);
}
          .theme-toggle-wrap { bottom: 20px; left: 20px; }
        }
      `}</style>
    </div>
  );
}