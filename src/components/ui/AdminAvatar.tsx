'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useUIStore } from '@/store/uiStore'

const MENU_ITEMS: { label: string; icon: string; action?: string }[] = [
  { label: 'Profile',  icon: '◈' },
  { label: 'Settings', icon: '◎' },
  { label: 'Logout',   icon: '⇥', action: 'logout' },
]

export default function AdminAvatar() {
  const logout = useUIStore((s) => s.logout)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleItem(action?: string) {
    if (action === 'logout') logout()
    setOpen(false)
  }

  return (
    <div className="aa-wrap" ref={ref}>
      <button
        className="aa-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Admin menu"
        aria-expanded={open}
      >
        <Image
          src="/assets/icons/logo-main.png"
          alt="Admin"
          width={32}
          height={32}
          className="aa-img"
          unoptimized
        />
        <span className="aa-dot" />
      </button>

      {open && (
        <div className="aa-dropdown" role="menu">
          <div className="aa-header">
            <div className="aa-header-name">PRIYATNA</div>
            <div className="aa-header-role">Administrator</div>
          </div>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`aa-item${item.action === 'logout' ? ' aa-item-logout' : ''}`}
              role="menuitem"
              onClick={() => handleItem(item.action)}
            >
              <span className="aa-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
