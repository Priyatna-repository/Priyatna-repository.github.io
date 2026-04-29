'use client';

import { useEffect } from 'react';
import { useSearchStore } from '@/store/searchStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSearchStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}

