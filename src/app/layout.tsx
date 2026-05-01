import type { Metadata } from 'next'
import { IBM_Plex_Mono, Bebas_Neue, DM_Serif_Display } from 'next/font/google'
import '@/styles/globals.css'

// next/font: self-hosted, no external Google request, no layout shift
// Variable names match existing CSS vars in globals.css (--f-mono, --f-display, --f-serif)
const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--f-mono',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--f-display',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--f-serif',
  display: 'swap',
})

const SITE_URL = 'https://priyatna-repository.github.io'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PRIYATNA — Welcome to my world',
    template: '%s · PRIYATNA',
  },
  description:
    'Design Search Engine — a curated portfolio of brand identity, motion, and design systems by Priyatna.',
  keywords: ['design', 'portfolio', 'brand identity', 'motion design', 'design system', 'UI', 'Priyatna'],
  authors: [{ name: 'Priyatna', url: SITE_URL }],
  creator: 'Priyatna',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'PRIYATNA',
    title: 'PRIYATNA — Welcome to my world',
    description: 'Design Search Engine — a curated portfolio of brand identity, motion, and design systems.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PRIYATNA Welcome to my world' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRIYATNA — Welcome to my world',
    description: 'Design Search Engine — a curated portfolio of brand identity, motion, and design systems.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexMono.variable} ${bebasNeue.variable} ${dmSerifDisplay.variable}`}
    >
      <head>
        {/*
          Inline script: set data-theme BEFORE React hydrates.
          Prevents "flash of wrong theme" (FOWT) when user has dark mode saved.
          Must stay inline — cannot be an external file.
          Reads from 'priyatna-ui' (uiStore persist key).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var d = localStorage.getItem('priyatna-ui');
                var t = d ? JSON.parse(d)?.state?.theme : null;
                document.documentElement.setAttribute('data-theme', t || 'light');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
