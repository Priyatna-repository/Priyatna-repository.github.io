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
  categories: string[]
}

// ─── Content ─────────────────────────────────────────────────────────────────
export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  tags: string[]
  status: PostStatus
  publishedAt: string
  createdAt: string
  readTimeMin?: number
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  fullDescription?: string
  thumbnail?: string
  demoUrl?: string
  repoUrl?: string
  techStack: string[]
  category: string
  featured: boolean
  order: number
  status: 'active' | 'archived'
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

// ─── Results view ─────────────────────────────────────────────────────────────
export interface ResultTab {
  value: string
  label: string
}

export interface FooterNavLink {
  name: string
  href: string
  external: boolean
}

export interface FooterNavColumn {
  label: string
  links: FooterNavLink[]
}
