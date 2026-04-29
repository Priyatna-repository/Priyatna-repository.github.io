import { ShortcutItem, FilterTab, PAA } from '@/types'

export const SHORTCUTS: ShortcutItem[] = [
  { icon: '◆', label: 'Projects', query: 'selected projects' },
  { icon: '⬡', label: 'Labs', query: null },
  { icon: '▶', label: 'Motion', query: 'motion studio' },
  { icon: '⊞', label: 'System', query: 'design system' },
  { icon: '✉', label: 'Contact', query: 'contact priyatna' },
]

export const FILTER_TABS: FilterTab[] = [
  { label: 'ALL', count: 247 },
  { label: 'PROJECTS', count: 84 },
  { label: 'LAB TOOLS', count: 6 },
  { label: 'MOTION', count: 41 },
  { label: 'BRANDING', count: 63 },
  { label: 'TYPOGRAPHY', count: 33 },
  { label: 'ARCHIVE', count: 20 },
]

export const PAA_ITEMS: PAA[] = [
  {
    question: 'What is the Priyatna Design System?',
    answer:
      'A comprehensive, token-based design system covering typography, color, spacing, motion, and component architecture. Fully documented, Figma-first, and open for licensed teams.',
  },
  {
    question: 'How do the Addon Labs work?',
    answer:
      'Labs are browser-based creative tools built on top of the Priyatna core. Each addon is standalone — no install required. Open a tool, create, and export to your format of choice.',
  },
  {
    question: 'Can I use Motion Studio for production?',
    answer:
      'Yes. Motion Studio exports to Lottie JSON, CSS keyframes, and GSAP timelines. Production-ready output with easing presets tuned for real interfaces.',
  },
  {
    question: 'Is Color Oracle AI-powered?',
    answer:
      'Yes — Color Oracle uses a fine-tuned model trained on design systems, brand psychology, and WCAG compliance data to generate semantic color architectures from natural language briefs.',
  },
]
