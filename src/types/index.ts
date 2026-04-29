// ─── Status enums ──────────────────────────────────────────────────────────
export type LabStatus = 'live' | 'beta' | 'upcoming' | 'soon' | 'deprecated'
export type PageStatus = 'active' | 'maintenance' | 'upcoming'
export type PostStatus = 'draft' | 'published' | 'archived'
export type LabColorTheme = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'

// ─── Lab / Addon ────────────────────────────────────────────────────────────
export interface LabItem {
  id: string
  name: string
  slug: string
  description: string
  fullDescription?: string
  icon: string
  colorTheme: LabColorTheme
  version: string
  status: LabStatus
  url?: string
  features?: string[]
  estimatedRelease?: string
  order: number
}

// ─── Ticker ─────────────────────────────────────────────────────────────────
export interface TickerItem {
  text: string
  dotClass: string
}

// ─── Search ─────────────────────────────────────────────────────────────────
export interface SearchSuggestion {
  query: string
  label: string
  tagClass: string
  tagText: string
}

export type FilterTab = {
  label: string
  count: number
}

// ─── Shortcuts ───────────────────────────────────────────────────────────────
export interface ShortcutItem {
  icon: string
  label: string
  query: string | null
}

// ─── Result cards ────────────────────────────────────────────────────────────
export interface ResultTag {
  label: string
  colorClass: string
}

export interface ResultCard {
  id: string
  iconLetter: string
  iconColorClass: string
  source: string
  sourceBold: string
  title: string
  desc: string
  tags: ResultTag[]
  date: string
}

// ─── Content ─────────────────────────────────────────────────────────────────
export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  status: PostStatus
  tags: string[]
  readTime?: number
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  url?: string
  imageUrl?: string
  featured?: boolean
}

// ─── Page config ──────────────────────────────────────────────────────────────
export interface PageStatusConfig {
  status: PageStatus
  message?: string
  estimate?: string
}

export type SitePageStatuses = Record<string, PageStatusConfig>

// ─── People Also Ask ──────────────────────────────────────────────────────────
export interface PAA {
  question: string
  answer: string
}

// ─── Quick chips ─────────────────────────────────────────────────────────────
export interface QuickChip {
  label: string
  query: string
  color: string
}
