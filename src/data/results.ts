import type { ResultCard, ResultTab, FooterNavColumn } from '@/types'
import type { SearchResultType } from '@/lib/search'

export const RESULT_CARDS: ResultCard[] = [
  {
    id: 'verdant',
    iconLetter: 'V',
    iconColorClass: 'rci-b',
    source: 'priyatna.design › ',
    sourceBold: 'verdant-dashboard',
    title: 'VERDANT — ANALYTICS DASHBOARD',
    desc: 'Complex data visualization made intuitive. Custom charting library built from scratch with motion design principles baked in. 40+ component types, WCAG AA compliant.',
    tags: [
      { label: 'Dashboard', colorClass: 'rft-b' },
      { label: 'Data Viz', colorClass: 'rft-y' },
      { label: 'Open Source', colorClass: 'rft-g' },
    ],
    date: 'Mar 2024',
    categories: ['projects'],
  },
  {
    id: 'motion-studio',
    iconLetter: 'M',
    iconColorClass: 'rci-r',
    source: 'labs.priyatna.design › ',
    sourceBold: 'motion-studio',
    title: 'MOTION STUDIO — LAB TOOL',
    desc: 'Browser-based animation timeline editor. Craft micro-interactions with spring physics, easing curves, and keyframe sequences. Export as Lottie, CSS, or GSAP.',
    tags: [
      { label: 'Lab Tool', colorClass: 'rft-r' },
      { label: 'Live', colorClass: 'rft-g' },
    ],
    date: 'Jun 2024',
    categories: ['labs', 'motion'],
  },
  {
    id: 'gilded',
    iconLetter: 'P',
    iconColorClass: 'rci-g',
    source: 'priyatna.design › projects › ',
    sourceBold: 'gilded-ecommerce',
    title: 'GILDED — LUXURY E-COMMERCE',
    desc: 'Headless Shopify storefront with bespoke 3D product renders. Custom WebGL shader for product configurator. 210% conversion rate improvement post-launch.',
    tags: [
      { label: 'E-Commerce', colorClass: 'rft-y' },
      { label: '3D / WebGL', colorClass: 'rft-b' },
      { label: 'Shopify', colorClass: 'rft-r' },
    ],
    date: 'Jan 2024',
    categories: ['projects'],
  },
  {
    id: 'type-foundry',
    iconLetter: 'S',
    iconColorClass: 'rci-a',
    source: 'priyatna.design › ',
    sourceBold: 'type-foundry',
    title: 'PRIYATNA TYPE FOUNDRY',
    desc: 'Custom variable typeface family with 6 weights and 3 optical sizes. Designed for screen legibility with advanced OpenType features and language support for 40+ scripts.',
    tags: [
      { label: 'Typography', colorClass: 'rft-r' },
      { label: 'Variable Font', colorClass: 'rft-b' },
    ],
    date: 'Nov 2023',
    categories: ['projects', 'branding'],
  },
  {
    id: 'color-oracle',
    iconLetter: 'A',
    iconColorClass: 'rci-b',
    source: 'priyatna.design › labs › ',
    sourceBold: 'color-oracle',
    title: 'COLOR ORACLE — AI PALETTE ENGINE',
    desc: 'AI-powered color system generator. Input a brief, image, or emotion — receive a semantic color architecture with WCAG ratios, dark mode variants, and brand personality mapping.',
    tags: [
      { label: 'AI Lab', colorClass: 'rft-g' },
      { label: 'Beta', colorClass: 'rft-r' },
    ],
    date: 'Q2 2024',
    categories: ['labs'],
  },
]

// ─── Result card display config ───────────────────────────────────────────────
export const TYPE_LABEL: Record<SearchResultType, string> = {
  blog: 'BLOG',
  project: 'SHOWCASE',
  lab: 'LAB',
}

export const TYPE_COLOR: Record<SearchResultType, string> = {
  blog: 'rci-r',
  project: 'rci-b',
  lab: 'rci-g',
}

export const TAG_COLOR: Record<SearchResultType, string> = {
  blog: 'rft-r',
  project: 'rft-b',
  lab: 'rft-g',
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
export const RESULT_TABS: ResultTab[] = [
  { value: 'all', label: 'ALL' },
  { value: 'blog', label: 'BLOG' },
  { value: 'project', label: 'PROJECTS' },
  { value: 'lab', label: 'LABS' },
]

// ─── Results footer navigation ────────────────────────────────────────────────
export const FOOTER_NAV: FooterNavColumn[] = [
  {
    label: 'EXPLORE',
    links: [
      { name: 'Blog', href: '/blog', external: false },
      { name: 'Showcase', href: '/showcase', external: false },
      { name: 'Labs', href: '/labs', external: false },
    ],
  },
  {
    label: 'CONNECT',
    links: [
      { name: 'LinkedIn', href: 'https://linkedin.com/in/priyatna', external: true },
      { name: 'GitHub', href: 'https://github.com/Priyatna-repository', external: true },
    ],
  },
]
