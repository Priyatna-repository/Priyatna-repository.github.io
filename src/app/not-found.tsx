'use client'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        fontFamily: 'var(--font-mono, monospace)',
        background: 'var(--paper, #f5f2ec)',
        color: 'var(--ink, #0a0a0a)',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '6rem', fontFamily: 'var(--font-display, sans-serif)', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', opacity: 0.5 }}>PAGE NOT FOUND</div>
      <p style={{ fontSize: '0.875rem', opacity: 0.7, maxWidth: '320px', lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          background: 'var(--ink, #0a0a0a)',
          color: 'var(--paper, #f5f2ec)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textDecoration: 'none',
        }}
      >
        BACK TO HOME
      </Link>
    </div>
  )
}
