# FASE 2 — Public Pages (Static Version)
## Priyatna Repository · Technical Documentation

> **Status:** Planned  
> **Durasi:** 2–4 minggu  
> **Tujuan:** Membangun semua halaman publik dengan data statis (`src/data/`), siap untuk di-deploy ke Vercel sebelum backend ada.  
> **Prasyarat:** Fase 1 selesai 100%, semua checklist tercentang.

---

## DAFTAR ISI

1. [Aturan Global Fase 2](#1-aturan-global-fase-2)
2. [Arsitektur Halaman](#2-arsitektur-halaman)
3. [2A — Home Page (Search Hub)](#3-2a--home-page-search-hub)
4. [2B — Blog Pages](#4-2b--blog-pages)
5. [2C — Showcase Pages](#5-2c--showcase-pages)
6. [2D — Labs Pages](#6-2d--labs-pages)
7. [Shared Components](#7-shared-components)
8. [Responsive Breakpoints](#8-responsive-breakpoints)
9. [Page Status System (Maintenance/Upcoming)](#9-page-status-system)
10. [Deploy ke Vercel](#10-deploy-ke-vercel)
11. [Langkah-Langkah Eksekusi](#11-langkah-langkah-eksekusi)
12. [Checklist Penyelesaian Fase 2](#12-checklist-penyelesaian-fase-2)

---

## 1. Aturan Global Fase 2

### 1.1 Prinsip "Static First"

Semua data pada Fase 2 berasal dari `src/data/`. Tidak ada fetch ke API eksternal. Tidak ada database. Tujuannya adalah:
- Website bisa langsung di-deploy dan diakses
- Konten bisa ditambah/edit dengan mengubah file data
- Ketika Fase 3 (backend) selesai, hanya perlu mengganti sumber data — bukan mengubah komponen

**Interface data HARUS konsisten.** Apa yang dikembalikan fungsi `getLabsData()` dari `src/data/labs.ts` harus identik dengan apa yang akan dikembalikan API `/api/labs` di Fase 3.

### 1.2 Server Component vs Client Component

Next.js App Router menggunakan Server Component secara default. Gunakan aturan berikut:

```
Server Component (default, tidak perlu deklarasi):
├── page.tsx → selalu server component
├── layout.tsx → selalu server component
├── Komponen yang hanya merender data statis
└── Komponen yang perlu fetch data (di Fase 3)

Client Component ('use client' di baris pertama):
├── Komponen dengan useState / useEffect
├── Komponen dengan event listener (onClick, onMouseMove, dll)
├── Komponen yang akses browser API (window, document, localStorage)
└── Komponen dengan animasi yang bergantung pada interaksi user
```

**Aturan:** Jadikan komponen sebagai Server Component selama mungkin. Tambahkan `'use client'` hanya jika benar-benar diperlukan. Gunakan pola "push client boundary down" — jika hanya sebagian kecil yang butuh interaktivitas, pisah jadi komponen client kecil.

### 1.3 Metadata per Halaman

Setiap `page.tsx` harus mengekspor metadata:

```tsx
// Untuk halaman statis
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artikel dan tulisan dari Priyatna.',
}

// Untuk halaman dinamis
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage ?? '/assets/images/og-default.jpg'],
    },
  }
}
```

### 1.4 Loading State

Setiap halaman yang punya data dinamis harus punya `loading.tsx`:

```
app/(public)/blog/loading.tsx    ← skeleton saat blog list dimuat
app/(public)/showcase/loading.tsx
```

---

## 2. Arsitektur Halaman

### 2.1 Route Map Lengkap

```
URL                          Component File                      Deskripsi
─────────────────────────────────────────────────────────────────────────────
/                            app/(public)/page.tsx               Home: search hub
/blog                        app/(public)/blog/page.tsx          Daftar artikel
/blog/[slug]                 app/(public)/blog/[slug]/page.tsx   Detail artikel
/showcase                    app/(public)/showcase/page.tsx      Grid projects
/showcase/[slug]             app/(public)/showcase/[slug]/page.tsx Detail project
/labs                        app/(public)/labs/page.tsx          Grid labs
/labs/[slug]                 app/(public)/labs/[slug]/page.tsx   Lab full workspace
```

### 2.2 Public Layout

Semua halaman publik berbagi layout yang sama:

```tsx
// src/app/(public)/layout.tsx
import CustomCursor from '@/components/layout/CustomCursor'
import Ticker from '@/components/ui/Ticker'
import LabsFab from '@/components/labs/LabsFab'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <Ticker />
      <div className="app relative z-[1] min-h-screen pt-[30px]">
        {children}
      </div>
      <LabsFab />
    </>
  )
}
```

**Yang ADA di public layout:**
- CustomCursor (fixed, pointer-events: none)
- Ticker (fixed top, z-100)
- LabsFab (fixed bottom-right)

**Yang TIDAK ADA di public layout:**
- Navigation bar tradisional — navigasi melalui search hub
- Footer kompleks — hanya footer link minimal di Home

---

## 3. 2A — Home Page (Search Hub)

### 3.1 Spesifikasi Halaman

Home adalah halaman utama yang berfungsi sebagai "search engine" untuk seluruh konten. Ini sudah ada di referensi HTML dan harus dikonversi ke Next.js.

**Dua State Utama:**
- **Home State** (`#home`) — tampilan awal dengan logo besar + search box
- **Results State** (`#results-view`) — dua kolom hasil pencarian

**Perubahan dari referensi:**
- State management dipindah ke Zustand (`searchStore.ts`)
- Data suggestions dari `src/data/suggestions.ts`
- Data shortcuts dari `src/data/shortcuts.ts`
- Counter stats dari `src/data/index.ts`
- Setiap result card bisa link ke halaman real (`/blog/[slug]`, `/showcase/[slug]`, dll)

### 3.2 Struktur Komponen Home

```
HomeView.tsx (client)               ← container, manage state
├── HomeState.tsx (client)          ← tampilan awal
│   ├── LogoRow.tsx (server)        ← "PRI·YATNA."
│   ├── SubRow.tsx (server)         ← tagline + counter
│   ├── SearchBox.tsx (client)      ← input + suggestions
│   ├── QuickChips.tsx (server)     ← chip buttons
│   ├── ShortcutGrid.tsx (server)   ← grid icon shortcuts
│   └── HomeFooterLinks.tsx (server)← link bawah
│
└── ResultsView.tsx (client)        ← tampilan hasil
    ├── ResultsTopbar.tsx (client)  ← logo + search bar inline
    ├── FilterStrip.tsx (client)    ← tab filter
    └── ResultsLayout.tsx (server)  ← two-column layout
        ├── ResultsMain.tsx         ← kolom kiri: hasil
        └── ResultsSidebar.tsx      ← kolom kanan: knowledge card + labs
```

### 3.3 `searchStore.ts` — Update

```ts
// src/store/searchStore.ts
import { create } from 'zustand'
import type { SearchSuggestion } from '@/types'

interface SearchStore {
  // State
  query:       string
  isResults:   boolean
  activeFilter: string
  
  // Actions
  setQuery:       (query: string) => void
  runSearch:      (query: string) => void
  goHome:         () => void
  setFilter:      (filter: string) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  query:        '',
  isResults:    false,
  activeFilter: 'all',
  
  setQuery: (query) => set({ query }),
  
  runSearch: (query) => {
    if (!query.trim()) return
    set({ query: query.trim(), isResults: true, activeFilter: 'all' })
    window.scrollTo(0, 0)
  },
  
  goHome: () => set({ isResults: false, query: '' }),
  
  setFilter: (filter) => set({ activeFilter: filter }),
}))
```

### 3.4 `uiStore.ts` — Baru

```ts
// src/store/uiStore.ts
import { create } from 'zustand'

interface UIStore {
  isLabsOpen: boolean
  openLabs:   () => void
  closeLabs:  () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isLabsOpen: false,
  openLabs:  () => set({ isLabsOpen: true }),
  closeLabs: () => set({ isLabsOpen: false }),
}))
```

### 3.5 `data/suggestions.ts`

```ts
// src/data/suggestions.ts
import type { SearchSuggestion } from '@/types'

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { text: 'brand identity systems',   category: 'design',  query: 'brand identity systems' },
  { text: 'motion design principles', category: 'motion',  query: 'motion design principles' },
  { text: 'design system components', category: 'design',  query: 'design system components' },
  { text: 'pattern forge lab tool',   category: 'lab',     query: 'pattern forge lab tool' },
  { text: 'visual branding portfolio',category: 'brand',   query: 'visual branding portfolio' },
  { text: 'priyatna color oracle AI', category: 'lab',     query: 'priyatna color oracle AI' },
]

export const QUICK_CHIPS = [
  { label: 'Brand Identity',  color: '#ff3b00', query: 'brand identity' },
  { label: 'Motion Design',   color: '#0047ff', query: 'motion design' },
  { label: 'Design Systems',  color: '#00c853', query: 'design systems' },
  { label: 'Lab Tools',       color: '#ffd600', query: 'lab tools' },
  { label: 'Typography',      color: '#a855f7', query: 'typography' },
]

export const FILTER_TABS = [
  { label: 'ALL',        value: 'all',        count: 247 },
  { label: 'PROJECTS',   value: 'projects',   count: 84 },
  { label: 'LAB TOOLS',  value: 'labs',       count: 6 },
  { label: 'MOTION',     value: 'motion',     count: 41 },
  { label: 'BRANDING',   value: 'branding',   count: 63 },
  { label: 'TYPOGRAPHY', value: 'typography', count: 33 },
  { label: 'ARCHIVE',    value: 'archive',    count: 20 },
]
```

### 3.6 `data/shortcuts.ts`

```ts
// src/data/shortcuts.ts
import type { ShortcutItem } from '@/types'

export const SHORTCUT_ITEMS: ShortcutItem[] = [
  { label: 'Projects', icon: '◆', action: 'search', value: 'selected projects' },
  { label: 'Labs',     icon: '⬡', action: 'labs',   value: '' },
  { label: 'Blog',     icon: '✍', action: 'link',   value: '/blog' },
  { label: 'System',   icon: '⊞', action: 'search', value: 'design system' },
  { label: 'Contact',  icon: '✉', action: 'search', value: 'contact priyatna' },
]
```

### 3.7 Aturan SearchBox Component

```tsx
// src/components/layout/SearchBox.tsx
'use client'
// Aturan SearchBox:
// 1. Suggestions muncul saat input value.length > 0
// 2. Suggestions hilang saat click di luar area search box
// 3. Enter di input = submit search
// 4. Click suggestion = jalankan search dengan query suggestion tersebut
// 5. Escape = tutup suggestions
// 6. Keyboard navigation (↑↓) untuk navigasi antar suggestions
```

---

## 4. 2B — Blog Pages

### 4.1 Spesifikasi Blog List (`/blog`)

**Tujuan halaman:** Menampilkan semua artikel yang sudah published dalam format yang konsisten dengan DNA visual.

**Layout:**
```
/blog
├── Header section
│   ├── Judul "BLOG." dengan tipografi Bebas Neue (besar)
│   ├── Sub-text: jumlah artikel + deskripsi singkat
│   └── Filter tags (horizontal scroll)
│
└── Content grid
    ├── Featured post (jika ada) — card besar, full-width
    └── Post grid — 2 kolom di desktop, 1 kolom di mobile
        └── PostCard (judul, excerpt, tags, tanggal, read time)
```

**Filter:**
- Semua tag dari semua post dikumpulkan secara dinamis
- Filter aktif = highlight dengan warna accent
- Filter menggunakan URL query: `/blog?tag=design`
- Tanpa page reload — bisa menggunakan URL state atau Zustand

**Aturan `PostCard`:**
- Judul menggunakan font display (Bebas Neue)
- Excerpt maksimal 2 baris (CSS line-clamp)
- Tag ditampilkan sebagai badge kecil dengan warna sesuai kategori
- Hover: padding-left increase + accent left border (seperti `.r-card` di referensi)
- Arrow `↗` di pojok kanan muncul saat hover

### 4.2 Spesifikasi Blog Detail (`/blog/[slug]`)

**Layout:**
```
/blog/[slug]
├── Reading progress bar (fixed top, setelah ticker)
├── Article header
│   ├── Breadcrumb: Blog → [Tag utama]
│   ├── Judul (Bebas Neue, clamp besar)
│   ├── Meta: tanggal, read time, tags
│   └── Cover image (jika ada) — full width dengan aspect ratio 16:9
│
├── Article body (two-column)
│   ├── Content area (kiri, 2/3 width di desktop)
│   │   └── Rich text content
│   └── Sidebar (kanan, 1/3 width di desktop)
│       ├── Table of Contents (sticky)
│       └── Related articles
│
└── Article footer
    ├── Tags
    ├── Share buttons (copy link, Twitter/X)
    └── Back to blog link
```

**Typografi artikel:**
- Heading (h1): Bebas Neue
- Heading (h2, h3): IBM Plex Mono, font-bold
- Paragraf: IBM Plex Mono, text-md, line-height 1.8
- Quote/Blockquote: DM Serif Display, italic, border-left accent
- Code inline: IBM Plex Mono, bg-paper3, border border-light
- Code block: IBM Plex Mono, bg-ink, text-paper, padding

**Reading Progress Bar:**
```tsx
// src/components/ui/ReadingProgress.tsx
'use client'
// Progress bar tipis (2px) fixed di bawah ticker (top: 30px)
// Warna: bg-accent
// Width: calculated dari scroll position vs document height
// Hanya muncul di /blog/[slug] — diimport langsung di page tersebut
```

### 4.3 Data Statis Blog

```ts
// src/data/posts.ts
import type { Post } from '@/types'

export const POSTS_DATA: Post[] = [
  {
    id:          'post-1',
    title:       'Membangun Design System yang Scalable',
    slug:        'membangun-design-system-scalable',
    excerpt:     'Design system bukan sekadar komponen library. Ini tentang membangun bahasa visual yang konsisten dan evolving bersama tim.',
    content:     `
      <h2>Apa itu Design System?</h2>
      <p>Design system adalah kumpulan aturan, komponen, dan guideline...</p>
    `,
    coverImage:  '/assets/images/posts/design-system.jpg',
    tags:        ['Design System', 'UI/UX', 'Figma'],
    status:      'published',
    publishedAt: '2026-01-15T00:00:00Z',
    createdAt:   '2026-01-10T00:00:00Z',
  },
  // ... tambah post lainnya
]

// Helper functions — interface ini harus SAMA dengan API nanti
export function getAllPosts(): Post[] {
  return POSTS_DATA.filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS_DATA.find((p) => p.slug === slug && p.status === 'published')
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getAllTags(): string[] {
  const tags = POSTS_DATA.flatMap((p) => p.tags)
  return [...new Set(tags)]
}

export function getReadTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.ceil(words / 200) // asumsi 200 kata/menit
}
```

### 4.4 `app/(public)/blog/page.tsx`

```tsx
// src/app/(public)/blog/page.tsx
import type { Metadata } from 'next'
import { getAllPosts, getAllTags } from '@/data/posts'
import BlogListView from '@/components/layout/BlogListView'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artikel tentang design, development, dan pemikiran dari Priyatna.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags  = getAllTags()

  return <BlogListView posts={posts} tags={tags} />
}
```

---

## 5. 2C — Showcase Pages

### 5.1 Spesifikasi Showcase List (`/showcase`)

**Layout:**
```
/showcase
├── Header
│   ├── Judul "SHOWCASE."
│   ├── Jumlah project + deskripsi
│   └── Filter by category (tabs) + filter by tech (dropdown opsional)
│
└── Project grid
    ├── Featured projects (atas, 2 kolom, card lebih besar)
    └── Other projects (grid 3 kolom di desktop)
        └── ProjectCard
            ├── Thumbnail (dengan fallback placeholder berwarna)
            ├── Nama project (Bebas Neue)
            ├── Deskripsi singkat (1 baris, ellipsis)
            ├── Tech stack tags
            ├── Status badge (jika ada)
            └── Hover: overlay dengan link demo + repo
```

**ProjectCard hover behavior:**
```
Default state:
  - Thumbnail terlihat
  - Nama + deskripsi singkat + tech tags

Hover state:
  - Overlay gelap semi-transparan muncul
  - Dua tombol muncul: "View Demo →" dan "GitHub ↗"
  - Transition: fade in 0.25s
```

### 5.2 Spesifikasi Showcase Detail (`/showcase/[slug]`)

```
/showcase/[slug]
├── Hero
│   ├── Breadcrumb + back button
│   ├── Project name (Bebas Neue, besar)
│   ├── Tagline / short description
│   └── Action buttons: "Live Demo ↗" | "GitHub ↗"
│
├── Preview area
│   ├── Screenshot/thumbnail besar, atau
│   └── Iframe embed demo (jika tersedia URL)
│
├── Detail section (two-column)
│   ├── Kiri: deskripsi lengkap + challenges + learnings
│   └── Kanan: metadata
│       ├── Tech Stack (icon + nama)
│       ├── Category
│       ├── Timeline
│       ├── Role
│       └── Status
│
└── Related projects (3 card horizontal)
```

### 5.3 Data Statis Showcase

```ts
// src/data/projects.ts
import type { Project } from '@/types'

export const PROJECTS_DATA: Project[] = [
  {
    id:          'proj-1',
    title:       'Priyatna Design System',
    slug:        'priyatna-design-system',
    description: 'Sistem desain komprehensif dengan komponen, token, dan guideline untuk produk digital.',
    thumbnail:   '/assets/images/projects/design-system-thumb.jpg',
    demoUrl:     'https://design.priyatna.com',
    repoUrl:     'https://github.com/priyatna/design-system',
    techStack:   ['Figma', 'React', 'TypeScript', 'Storybook'],
    category:    'Design System',
    featured:    true,
    order:       1,
    status:      'active',
  },
]

export function getAllProjects(): Project[] {
  return PROJECTS_DATA
    .filter((p) => p.status === 'active')
    .sort((a, b) => a.order - b.order)
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS_DATA.find((p) => p.slug === slug)
}

export function getAllCategories(): string[] {
  return [...new Set(PROJECTS_DATA.map((p) => p.category))]
}
```

---

## 6. 2D — Labs Pages

### 6.1 Filosofi Labs

Labs adalah playground eksperimental. Tampilan berbeda dari Blog dan Showcase — lebih playful, lebih gelap (bg-ink), dan terasa seperti membuka "creative toolkit".

**Dua entry point:**
1. **FAB Overlay** (sudah ada di Home dan semua halaman publik) — quick preview grid
2. **Halaman `/labs`** — versi penuh dengan lebih banyak detail

### 6.2 Spesifikasi Labs Grid (`/labs`)

```
/labs
├── Header (bg-ink)
│   ├── Eyebrow: "Priyatna · Creative Toolkit"
│   ├── Judul "ADDON LABS" (Bebas Neue, besar)
│   └── Sub: "Browser-native tools for designers who think in systems."
│
└── Labs grid (bg-paper)
    ├── Filter tabs: ALL | LIVE | BETA | COMING SOON
    └── Grid 3 kolom → 2 kolom tablet → 1 kolom mobile
        └── LabCard
            ├── Top accent line (warna sesuai colorTheme)
            ├── Icon (besar)
            ├── Nama (Bebas Neue)
            ├── Deskripsi
            ├── Status badge (Live/Beta/Soon)
            ├── Version (pojok kanan bawah, muted)
            └── Hover: translateY(-2px) + box-shadow
```

**Status behavior:**
- `live` → card bisa diklik, link ke `/labs/[slug]`
- `beta` → card bisa diklik, ada banner "Beta — mungkin ada bug"
- `upcoming` → card tidak bisa diklik, cursor default (bukan custom), ada tooltip "Coming Soon"
- `soon` → card disabled, opacity sedikit berkurang

### 6.3 Spesifikasi Labs Detail (`/labs/[slug]`)

Ini adalah halaman full-workspace untuk setiap lab tool. Layout berbeda dengan halaman lain — minimal chrome, maksimal workspace.

```
/labs/[slug]
├── Minimal header bar (fixed, 44px)
│   ├── Logo kecil "PRI." (link ke home)
│   ├── Nama lab + status badge
│   └── Exit button (×) — kembali ke /labs
│
└── Workspace area (full screen - 44px)
    └── Konten lab di sini (tergantung lab-nya)
```

**Untuk fase 2 (static):** Halaman lab menampilkan "upcoming" placeholder yang elegant, bukan halaman kosong.

### 6.4 Labs Upcoming Placeholder

Setiap lab yang belum live menampilkan halaman ini:

```
┌─────────────────────────────────────────────┐
│  ⬡  [Nama Lab]                    UPCOMING  │
│                                             │
│  [Icon Besar]                               │
│                                             │
│  [NAMA LAB BESAR - BEBAS NEUE]              │
│                                             │
│  [Deskripsi lebih panjang dari versi card]  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Fitur yang akan tersedia:          │    │
│  │  • Feature 1                        │    │
│  │  • Feature 2                        │    │
│  │  • Feature 3                        │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Version target: [v0.x.x]                  │
│  Status: In Development                     │
│                                             │
│  [← Back to Labs]                          │
└─────────────────────────────────────────────┘
```

### 6.5 Data Labs yang Perlu Ditambahkan

Update `src/data/labs.ts` dengan menambahkan field `features` untuk upcoming labs:

```ts
// Tambahan field untuk tipe LabItem di src/types/index.ts
export interface LabItem {
  // ... field yang sudah ada
  features?: string[]           // fitur yang akan tersedia (untuk upcoming)
  estimatedRelease?: string     // "Q3 2026", "Coming Soon", dll
}
```

### 6.6 `LabsOverlay.tsx` — Update

Komponen overlay yang sudah ada harus diupdate agar:
- Data dari `src/data/labs.ts` (bukan hardcoded HTML)
- Status badge sesuai tipe LabStatus
- Card yang `live` atau `beta` bisa diklik ke `/labs/[slug]`
- Card yang `upcoming` atau `soon` tidak bisa diklik
- ESC key menutup overlay

```tsx
// src/components/labs/LabsOverlay.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/store/uiStore'
import { LABS_DATA } from '@/data/labs'
import LabStatusBadge from '@/components/ui/LabStatusBadge'
import { cn } from '@/lib/utils'

const COLOR_MAP = {
  red:    'before:bg-accent',
  blue:   'before:bg-accent2',
  green:  'before:bg-accent3',
  yellow: 'before:bg-accent4',
  purple: 'before:bg-[#a855f7]',
  orange: 'before:bg-[#f97316]',
}

export default function LabsOverlay() {
  const { isLabsOpen, closeLabs } = useUIStore()

  // Close on ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLabs()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeLabs])

  if (!isLabsOpen) return null

  return (
    <div
      className="fixed inset-0 z-[500] bg-ink/85 backdrop-blur-[8px] flex items-center justify-center animate-[fadeIn_0.25s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget) closeLabs() }}
    >
      <div className="bg-paper w-[min(90vw,900px)] max-h-[85vh] overflow-y-auto relative animate-modal-in">
        
        {/* Close button */}
        <button
          onClick={closeLabs}
          className="absolute top-5 right-5 w-8 h-8 bg-ink text-paper flex items-center justify-center hover:bg-accent transition-colors cursor-custom"
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-ink px-10 py-8 border-b border-white/[0.06]">
          <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-accent3 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent3 animate-pulse" />
            Priyatna · Creative Toolkit
          </div>
          <div className="font-display text-paper leading-none" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            ADDON LABS
          </div>
          <div className="font-serif italic text-muted2 mt-2 text-md">
            Browser-native tools for designers who think in systems.
          </div>
        </div>

        {/* Grid */}
        <div className="p-10">
          <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {LABS_DATA.map((lab) => {
              const isClickable = lab.status === 'live' || lab.status === 'beta'
              const CardWrapper = isClickable ? Link : 'div'

              return (
                <CardWrapper
                  key={lab.id}
                  href={isClickable ? `/labs/${lab.slug}` : '#'}
                  onClick={isClickable ? closeLabs : undefined}
                  className={cn(
                    'bg-paper2 border border-border-light p-6 relative overflow-hidden',
                    'before:content-[""] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:opacity-0',
                    'transition-all duration-[0.25s]',
                    COLOR_MAP[lab.colorTheme],
                    isClickable
                      ? 'cursor-custom hover:bg-paper3 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:before:opacity-100'
                      : 'cursor-default opacity-75',
                  )}
                >
                  <span className="text-[28px] mb-4 block">{lab.icon}</span>
                  <div className="font-display text-[22px] tracking-[0.03em] mb-1.5">
                    {lab.name}
                  </div>
                  <div className="text-[11px] text-muted leading-[1.7] mb-4">
                    {lab.description}
                  </div>
                  <LabStatusBadge status={lab.status} />
                  <div className="absolute bottom-3 right-4 font-mono text-[9px] text-muted2 opacity-50">
                    {lab.version}
                  </div>
                </CardWrapper>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 6.7 `LabStatusBadge.tsx`

```tsx
// src/components/ui/LabStatusBadge.tsx
import { cn } from '@/lib/utils'
import type { LabStatus } from '@/types'

interface LabStatusBadgeProps {
  status: LabStatus
  className?: string
}

const STATUS_CONFIG: Record<LabStatus, { label: string; className: string; pulse: boolean }> = {
  live:       { label: 'Live',       className: 'bg-accent3/10 text-accent3 border-accent3/20',          pulse: true },
  beta:       { label: 'Beta',       className: 'bg-accent4/10 text-[#b38f00] border-accent4/20',        pulse: false },
  upcoming:   { label: 'Upcoming',   className: 'bg-ink/[0.08] text-muted2 border-transparent',          pulse: false },
  soon:       { label: 'Coming Soon',className: 'bg-ink/[0.08] text-muted2 border-transparent',          pulse: false },
  deprecated: { label: 'Deprecated', className: 'bg-accent/10 text-accent/60 border-accent/10',          pulse: false },
}

export default function LabStatusBadge({ status, className }: LabStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 border',
        config.className,
        className,
      )}
    >
      {config.pulse && (
        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
      )}
      {config.label}
    </span>
  )
}
```

---

## 7. Shared Components

### 7.1 `StatusPage.tsx` — Maintenance & Upcoming

Komponen generik yang digunakan ketika sebuah halaman dalam status non-aktif:

```tsx
// src/components/ui/StatusPage.tsx
import Link from 'next/link'
import type { PageStatus } from '@/types'

interface StatusPageProps {
  status:    Exclude<PageStatus, 'active'>
  title:     string
  message?:  string
  estimate?: string  // "Q3 2026", "Soon", dll
}

export default function StatusPage({ status, title, message, estimate }: StatusPageProps) {
  const isUpcoming    = status === 'upcoming'
  const isMaintenance = status === 'maintenance'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
      {/* Status indicator */}
      <div className="text-[9px] font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2"
           style={{ color: isMaintenance ? 'var(--accent)' : 'var(--accent2)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {isMaintenance ? 'Under Maintenance' : 'Coming Soon'}
      </div>

      {/* Judul besar */}
      <h1 className="font-display text-ink leading-none text-center mb-6"
          style={{ fontSize: 'clamp(60px, 12vw, 140px)' }}>
        {title.toUpperCase()}
      </h1>

      {/* Pesan */}
      {message && (
        <p className="font-mono text-md text-muted text-center max-w-[480px] leading-[1.8] mb-8">
          {message}
        </p>
      )}

      {/* Estimasi (hanya untuk upcoming) */}
      {isUpcoming && estimate && (
        <div className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-muted2 mb-8">
          Expected: {estimate}
        </div>
      )}

      {/* Back to home */}
      <Link
        href="/"
        className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase text-muted hover:text-ink transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  )
}
```

### 7.2 Penggunaan StatusPage di page.tsx

```tsx
// src/app/(public)/blog/page.tsx
import StatusPage from '@/components/ui/StatusPage'
import { PAGE_STATUSES } from '@/data/pageStatuses'

export default function BlogPage() {
  const status = PAGE_STATUSES.blog

  // Jika halaman bukan active, tampilkan status page
  if (status !== 'active') {
    return (
      <StatusPage
        status={status}
        title="Blog"
        message="Artikel dan tulisan sedang dalam persiapan. Akan segera hadir."
        estimate="Q2 2026"
      />
    )
  }

  // ... render normal
}
```

### 7.3 `data/pageStatuses.ts`

```ts
// src/data/pageStatuses.ts
// File ini adalah "admin sementara" untuk mengontrol status halaman
// sebelum dashboard admin tersedia di Fase 4.
// Cukup ubah nilai di sini dan deploy untuk mengaktifkan/menonaktifkan halaman.

import type { PageStatus } from '@/types'

export const PAGE_STATUSES: Record<string, PageStatus> = {
  home:     'active',
  blog:     'active',
  showcase: 'active',
  labs:     'active',
}

export const PAGE_MESSAGES: Record<string, string> = {
  blog:     'Konten blog sedang dalam persiapan.',
  showcase: 'Project showcase sedang diperbaharui.',
  labs:     'Labs playground akan segera hadir.',
}

export const PAGE_ESTIMATES: Record<string, string> = {
  blog:     'Q2 2026',
  showcase: 'Q2 2026',
  labs:     'Q3 2026',
}
```

---

## 8. Responsive Breakpoints

### 8.1 Breakpoint System

Mengikuti breakpoint dari referensi HTML dan standar Tailwind:

```
Breakpoint   Min Width   Tailwind Prefix   Penggunaan
─────────────────────────────────────────────────────────────────
mobile       0px         (default)         1 kolom, padding kecil
tablet       600px       sm:               2 kolom beberapa grid
desktop-sm   960px       md:               2 kolom layout penuh
desktop      1280px      lg:               3 kolom, sidebar muncul
desktop-xl   1400px      xl:               max-width container
```

### 8.2 Aturan Responsive per Komponen

**Results Layout (referensi: `@media(max-width:960px)`):**
```
Desktop (md+): grid-cols-[1fr_360px] — dua kolom
Mobile (<md):  grid-cols-1 — satu kolom, sidebar di bawah content
```

**Labs Grid (referensi: 960px → 2 col, 600px → 1 col):**
```
Desktop (md+): grid-cols-3
Tablet (sm-md): grid-cols-2
Mobile (<sm):  grid-cols-1
```

**Home Shortcuts (referensi: 600px → 3 col):**
```
Desktop:  grid-cols-5
Mobile:   grid-cols-3
```

**Results Topbar (referensi: 600px → flex-wrap):**
```
Desktop: flex row, semua elemen terlihat
Mobile:  flex-wrap, rtb-count hidden
```

### 8.3 Custom Cursor pada Mobile

Custom cursor HARUS disabled di touch devices. Tambahkan di `CustomCursor.tsx`:

```tsx
// Di dalam useEffect CustomCursor
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  // Touch device — jangan tampilkan cursor, set body cursor ke auto
  document.body.style.cursor = 'auto'
  return
}
```

---

## 9. Page Status System

### 9.1 Cara Kerja

Setiap halaman publik mengecek status-nya dari `data/pageStatuses.ts`. Ini adalah "admin sementara" sebelum dashboard admin (Fase 4) tersedia.

**Flow:**
```
User akses /blog
    ↓
page.tsx membaca PAGE_STATUSES.blog
    ↓
'active'   → render normal BlogListView
'maintenance' → render StatusPage dengan pesan maintenance
'upcoming'    → render StatusPage dengan pesan coming soon
```

### 9.2 Cara Menggunakan (Sebelum Admin Ada)

Untuk mengaktifkan/menonaktifkan halaman sebelum admin dashboard selesai, cukup edit `src/data/pageStatuses.ts` dan push ke GitHub:

```ts
// Untuk set blog jadi maintenance:
export const PAGE_STATUSES = {
  blog: 'maintenance',  // ← ubah di sini
  // ...
}
```

Setelah Fase 4 selesai, nilai ini akan dibaca dari database dan bisa diubah tanpa deploy ulang.

### 9.3 Labs Individual Status

Setiap lab juga punya status individual. Logika:
- Lab dengan `status: 'upcoming'` atau `'soon'` → halaman `/labs/[slug]` menampilkan upcoming placeholder, bukan error 404
- Lab dengan `status: 'live'` atau `'beta'` → menampilkan workspace penuh

```tsx
// src/app/(public)/labs/[slug]/page.tsx
import { getLabBySlug } from '@/data/labs'
import LabWorkspace from '@/components/labs/LabWorkspace'
import LabUpcomingView from '@/components/labs/LabUpcomingView'
import { notFound } from 'next/navigation'

export default function LabPage({ params }: { params: { slug: string } }) {
  const lab = getLabBySlug(params.slug)
  if (!lab) notFound()

  const isActive = lab.status === 'live' || lab.status === 'beta'

  if (!isActive) {
    return <LabUpcomingView lab={lab} />
  }

  return <LabWorkspace lab={lab} />
}
```

---

## 10. Deploy ke Vercel

### 10.1 Prasyarat Sebelum Deploy

Sebelum deploy, pastikan:
```bash
npm run build       ← harus berhasil tanpa error
npm run type-check  ← harus 0 error
npm run lint        ← harus 0 error
```

### 10.2 Langkah Deploy

**1. Push ke GitHub:**
```bash
git add .
git commit -m "feat: fase 2 public pages static version"
git push origin main
```

**2. Connect ke Vercel:**
- Buka vercel.com → New Project
- Import repository dari GitHub
- Framework: Next.js (otomatis terdeteksi)
- Root directory: `.` (root)
- Build command: `npm run build` (default)
- Output directory: `.next` (default)
- Environment variables: belum ada di Fase 2

**3. Custom Domain (opsional):**
- Di Vercel dashboard → Settings → Domains
- Tambahkan domain GitHub Pages atau domain custom

### 10.3 Konfigurasi `next.config.ts` untuk GitHub Pages

Jika deploy ke GitHub Pages (bukan Vercel):

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',       // static export
  trailingSlash: true,
  images: {
    unoptimized: true,    // GitHub Pages tidak support next/image optimization
  },
}

export default nextConfig
```

> **Rekomendasi:** Gunakan Vercel — lebih mudah, gratis untuk proyek personal, dan mendukung semua fitur Next.js termasuk ISR dan API Routes yang akan dibutuhkan di Fase 3.

---

## 11. Langkah-Langkah Eksekusi

### STEP 1 — Setup Data Layer
```bash
# Buat semua file data
touch src/data/posts.ts
touch src/data/projects.ts
touch src/data/suggestions.ts
touch src/data/shortcuts.ts
touch src/data/pageStatuses.ts
# Update src/data/index.ts untuk re-export semua
```

### STEP 2 — Update Types
Update `src/types/index.ts` dengan menambahkan semua tipe yang dibutuhkan (Post, Project, SearchSuggestion, ShortcutItem, dll).

### STEP 3 — Buat Stores
```bash
touch src/store/uiStore.ts
# Update src/store/searchStore.ts
```

### STEP 4 — Konversi Home Page

Urutan pengerjaan Home:
1. Buat `uiStore.ts` + update `searchStore.ts`
2. Konversi `HomeView.tsx` dengan state dari store
3. Konversi `ResultsView.tsx`
4. Update `LabsFab.tsx` menggunakan `uiStore`
5. Update `LabsOverlay.tsx` dengan data dari `data/labs.ts`
6. Update `app/(public)/page.tsx`

### STEP 5 — Buat Blog Pages

1. Buat `src/data/posts.ts` dengan minimal 2-3 contoh post
2. Buat `src/components/layout/BlogListView.tsx`
3. Buat `src/components/ui/PostCard.tsx`
4. Buat `src/app/(public)/blog/page.tsx`
5. Buat `src/components/layout/BlogDetailView.tsx`
6. Buat `src/components/ui/ReadingProgress.tsx`
7. Buat `src/app/(public)/blog/[slug]/page.tsx`
8. Buat `src/app/(public)/blog/loading.tsx`

### STEP 6 — Buat Showcase Pages

1. Buat `src/data/projects.ts` dengan minimal 3-4 contoh project
2. Buat `src/components/layout/ShowcaseListView.tsx`
3. Buat `src/components/ui/ProjectCard.tsx`
4. Buat `src/app/(public)/showcase/page.tsx`
5. Buat `src/components/layout/ShowcaseDetailView.tsx`
6. Buat `src/app/(public)/showcase/[slug]/page.tsx`

### STEP 7 — Buat Labs Pages

1. Update `src/data/labs.ts` dengan field `features` dan `estimatedRelease`
2. Buat `src/components/ui/LabStatusBadge.tsx`
3. Buat `src/components/layout/LabsListView.tsx`
4. Buat `src/app/(public)/labs/page.tsx`
5. Buat `src/components/labs/LabUpcomingView.tsx`
6. Buat `src/app/(public)/labs/[slug]/page.tsx`

### STEP 8 — Buat Shared Components

1. Buat `src/components/ui/StatusPage.tsx`
2. Tambahkan status check di semua page.tsx
3. Buat `src/app/(public)/not-found.tsx` (404)

### STEP 9 — Responsive QA

Test di semua breakpoint:
- Mobile: 375px (iPhone SE)
- Mobile: 430px (iPhone 15 Pro Max)
- Tablet: 768px
- Desktop: 1280px
- Large: 1440px

### STEP 10 — Deploy

```bash
npm run build && git push origin main
```

---

## 12. Checklist Penyelesaian Fase 2

### Data Layer
- [ ] `src/types/index.ts` sudah berisi: Post, Project, LabItem (update), SearchSuggestion, ShortcutItem, PageStatus
- [ ] `src/data/posts.ts` ada dengan minimal 3 post + semua helper functions
- [ ] `src/data/projects.ts` ada dengan minimal 3 project + helper functions
- [ ] `src/data/labs.ts` sudah update dengan field `features` dan `estimatedRelease`
- [ ] `src/data/suggestions.ts` ada
- [ ] `src/data/shortcuts.ts` ada
- [ ] `src/data/pageStatuses.ts` ada
- [ ] `src/data/index.ts` re-export semua

### Stores
- [ ] `src/store/searchStore.ts` sudah update dengan interface yang benar
- [ ] `src/store/uiStore.ts` sudah ada dengan `isLabsOpen`, `openLabs`, `closeLabs`

### Home Page
- [ ] Home state tampil benar dengan logo, search, chips, shortcuts
- [ ] Search menampilkan results view
- [ ] Results view ada dua kolom (desktop) dan satu kolom (mobile)
- [ ] Labs FAB buka overlay
- [ ] Labs overlay bisa ditutup dengan ESC dan klik backdrop
- [ ] Labs overlay data dari `data/labs.ts`

### Blog Pages
- [ ] `/blog` menampilkan list artikel
- [ ] `/blog` filter by tag berfungsi
- [ ] `/blog/[slug]` menampilkan artikel dengan konten lengkap
- [ ] Reading progress bar berfungsi
- [ ] Table of contents di sidebar berfungsi
- [ ] 404 jika slug tidak ditemukan

### Showcase Pages
- [ ] `/showcase` menampilkan grid project
- [ ] Featured projects tampil di atas
- [ ] `/showcase/[slug]` menampilkan detail project
- [ ] Hover overlay pada ProjectCard berfungsi

### Labs Pages
- [ ] `/labs` menampilkan grid semua lab
- [ ] Filter status berfungsi (ALL/LIVE/BETA/COMING SOON)
- [ ] `/labs/[slug]` untuk lab active menampilkan workspace (atau placeholder yang benar)
- [ ] `/labs/[slug]` untuk lab upcoming menampilkan LabUpcomingView
- [ ] LabStatusBadge tampil benar untuk semua status

### Status System
- [ ] Halaman yang status-nya `maintenance` menampilkan StatusPage yang benar
- [ ] Halaman yang status-nya `upcoming` menampilkan StatusPage yang benar
- [ ] `src/data/pageStatuses.ts` bisa diubah untuk toggle status

### Quality & Deploy
- [ ] Semua halaman responsive di mobile (375px - 430px)
- [ ] Semua halaman responsive di tablet (768px)
- [ ] Custom cursor disabled di touch device
- [ ] `npm run build` berhasil tanpa error
- [ ] Deployed ke Vercel, bisa diakses secara publik

---

**Fase 2 selesai → Milestone 1: Website live dengan static content → Lanjut ke [FASE 3 — Backend Infrastructure]**

---

*Dokumen ini adalah source of truth untuk Fase 2. Update jika ada perubahan keputusan selama development.*