import type { Metadata } from 'next'
import '@/styles/globals.css'

const SITE_URL = 'https://priyatna-repository.github.io'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PRIYATNA — Design Search Engine',
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
    title: 'PRIYATNA — Design Search Engine',
    description:
      'Design Search Engine — a curated portfolio of brand identity, motion, and design systems.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PRIYATNA Design Search Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRIYATNA — Design Search Engine',
    description:
      'Design Search Engine — a curated portfolio of brand identity, motion, and design systems.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
