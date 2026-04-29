import CustomCursor from '@/components/layout/CustomCursor'
import Ticker from '@/components/ui/Ticker'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LabsFab from '@/components/labs/LabsFab'
import LabsOverlay from '@/components/labs/LabsOverlay'
import ThemeProvider from '@/providers/ThemeProvider'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CustomCursor />
      <Ticker />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: 30 }}>
        {children}
      </div>
      <ThemeToggle />
      <LabsFab />
      <LabsOverlay />
    </ThemeProvider>
  )
}
