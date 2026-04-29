'use client';

import { useEffect, useState } from 'react';
import { useSearchStore } from '@/store/searchStore';
import Loader from '@/components/ui/Loader';
import Ticker from '@/components/ui/Ticker';
import ThemeToggle from '@/components/ui/ThemeToggle';
import CustomCursor from '@/components/layout/CustomCursor';
import HomeView from '@/components/layout/HomeView';
import ResultsView from '@/components/layout/ResultsView';
import LabsOverlay from '@/components/labs/LabsOverlay';
import LabsFab from '@/components/labs/LabsFab';
import ThemeProvider from '@/providers/ThemeProvider';

export default function PageClient() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const isResultsView = useSearchStore((s) => s.isResultsView);
  const hasHydrated = useSearchStore(state => state._hasHydrated);

  // Jika belum hydrated, tampilkan overlay tanpa Tailwind class
  // agar tidak terjadi bentrokan antara data server vs localStorage
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
    );
  }

  return (
    <ThemeProvider>
      <CustomCursor />
      <Loader onComplete={() => setLoaderDone(true)} />
      <Ticker />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: 30 }}>
        {!isResultsView && <HomeView onCounterReady={loaderDone} />}
        {isResultsView && <ResultsView />}
      </div>
      <ThemeToggle />
      <LabsFab />
      <LabsOverlay />
    </ThemeProvider>
  );
}
