'use client'
import '@/styles/components/cursor.css'
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 })
  const rafRef = useRef<number>(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Do not render on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    setVisible(true)

    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      if (curRef.current) {
        curRef.current.style.left = e.clientX + 'px'
        curRef.current.style.top = e.clientY + 'px'
      }
    }

    const animRing = () => {
      const p = pos.current
      p.rx += (p.mx - p.rx) * 0.12
      p.ry += (p.my - p.ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = p.rx + 'px'
        ringRef.current.style.top = p.ry + 'px'
      }
      rafRef.current = requestAnimationFrame(animRing)
    }

    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animRing)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <div
        ref={curRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          width: 12,
          height: 12,
          background: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'width .2s, height .2s, background .2s',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          width: 40,
          height: 40,
          border: '1px solid var(--ink)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'width .3s, height .3s, opacity .3s',
          opacity: 0.4,
        }}
      />
    </>
  )
}
