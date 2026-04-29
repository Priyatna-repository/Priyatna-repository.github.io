'use client'
import { useState } from 'react'
import { useSearchStore } from '@/store/searchStore'
import Loader from '@/components/ui/Loader'
import HomeView from '@/components/layout/HomeView'
import ResultsView from '@/components/layout/ResultsView'

export default function PageClient() {
  const [loaderDone, setLoaderDone] = useState(false)
  const isResultsView = useSearchStore((s) => s.isResultsView)
  const hasHydrated = useSearchStore((s) => s._hasHydrated)

  // Blank overlay until store hydrates — prevents flash of wrong state
  if (!hasHydrated) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--paper)',
          zIndex: 9999,
        }}
      />
    )
  }

  return (
    <>
      <Loader onComplete={() => setLoaderDone(true)} />
      {!isResultsView && <HomeView onCounterReady={loaderDone} />}
      {isResultsView && <ResultsView />}
    </>
  )
}
