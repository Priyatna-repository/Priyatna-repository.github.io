import { SearchSuggestion, QuickChip } from '@/types'

export const SUGGESTIONS: SearchSuggestion[] = [
  { query: 'brand identity systems', label: 'brand identity systems', tagClass: 'st-design', tagText: 'Design' },
  { query: 'motion design principles', label: 'motion design principles', tagClass: 'st-motion', tagText: 'Motion' },
  { query: 'design system components', label: 'design system components', tagClass: 'st-design', tagText: 'Design' },
  { query: 'pattern forge lab tool', label: 'pattern forge lab tool', tagClass: 'st-lab', tagText: 'Lab' },
  { query: 'visual branding portfolio', label: 'visual branding portfolio', tagClass: 'st-brand', tagText: 'Brand' },
  { query: 'priyatna color oracle ai', label: 'priyatna color oracle AI', tagClass: 'st-lab', tagText: 'Lab' },
]

export const RELATED_SEARCHES: string[] = [
  'brand identity design 2024',
  'design system tokens figma',
  'motion design principles ui',
  'gsap animation tools 2024',
  'generative pattern design tools',
  'ai color palette generator',
  'variable font design system',
]

export const QUICK_CHIPS: QuickChip[] = [
  { label: 'Brand Identity', query: 'brand identity', color: 'var(--accent)' },
  { label: 'Motion Design', query: 'motion design', color: 'var(--accent2)' },
  { label: 'Design Systems', query: 'design systems', color: 'var(--accent3)' },
  { label: 'Lab Tools', query: 'lab tools', color: 'var(--accent4)' },
  { label: 'Typography', query: 'typography', color: '#a855f7' },
]
