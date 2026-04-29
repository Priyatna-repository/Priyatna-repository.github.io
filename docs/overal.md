# PRIYATNA REPOSITORY — Master Development Plan
> Personal Platform · Portfolio · Blog · Showcase · Labs
> Last updated: 2026

---

## 🔭 VISI & IDENTITAS PLATFORM

### Konsep Inti
Bukan sekadar portfolio — ini adalah **"Personal OS"**: sebuah ekosistem digital yang mencerminkan cara berpikir, berkarya, dan bereksperimen. Desain referensi kamu (search-engine aesthetic, editorial typography, noise texture, custom cursor) sudah menetapkan DNA visual yang sangat kuat:

```
DNA Visual:
├── Typografi     → Bebas Neue (display) + IBM Plex Mono (body) + DM Serif Display (italic)
├── Palet         → Paper warm (#f5f2ec) × Ink (#0a0a0a) × Aksen 4 warna
├── Texture       → Noise overlay, border minimal, zero border-radius
├── Motion        → Clip-path wipe, slide-up, custom cursor dengan lag-ring
└── Personality   → Editorial · Brutalist-lite · Typographic-first
```

### Tone Platform
**"A designer's mind made navigable"** — setiap halaman terasa seperti membuka lembar kerja kreatif seseorang, bukan brochure perusahaan.

---

## 🏗️ ARSITEKTUR PLATFORM

### 4 Pilar Utama

```
priyatna-repository.github.io/
│
├── 🏠 HOME              → Search-engine hub (sudah ada di referensi)
│   └── Tetap sebagai entry point utama, search = navigasi
│
├── ✍️  BLOG             → Artikel & pemikiran (database-driven)
│   ├── /blog            → List artikel dengan filter tag
│   └── /blog/[slug]     → Full artikel dengan rich content
│
├── 🚀 SHOWCASE          → Project interaktif
│   ├── /showcase        → Grid semua project
│   └── /showcase/[slug] → Detail + demo embed
│
└── 🧪 LABS              → Addon Labs (sudah ada overlay-nya!)
    ├── Tetap sebagai FAB overlay (sudah sempurna)
    └── /labs/[slug]     → Halaman full per lab tool
```

### Status Page System
Setiap halaman/lab bisa punya status:
- **`active`** → tampil normal
- **`maintenance`** → tampilkan maintenance page dengan pesan custom
- **`upcoming`** → coming soon dengan countdown opsional
- **`beta`** → tampil dengan badge beta warning
- **`deprecated`** → redirect atau tampil dengan notice

---

## 🎨 FASE 1 — Refactor & Fondasi
**Estimasi: 1–2 minggu**

### 1A. Perbaikan Struktur (dari analisis sebelumnya)

```
src/
├── app/
│   ├── (public)/                  ← wrapper grup public
│   │   ├── layout.tsx
│   │   ├── page.tsx               ← Home (search hub)
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── showcase/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── labs/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   │
│   ├── (admin)/                   ← wrapper grup admin
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── dashboard/
│   │       └── ... (fase 4)
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── ... (fase 3)
│
├── components/
│   ├── ui/                        ← komponen generik
│   │   ├── Loader.tsx
│   │   ├── Ticker.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── StatusBadge.tsx        ← NEW: live/beta/soon
│   │   └── ImageComparison.tsx
│   ├── layout/                    ← komponen struktural
│   │   ├── HomeView.tsx
│   │   ├── ResultsView.tsx
│   │   └── CustomCursor.tsx
│   ├── labs/                      ← komponen labs
│   │   ├── LabsFab.tsx
│   │   └── LabsOverlay.tsx
│   └── admin/                     ← (akan diisi fase 4)
│
├── providers/
│   └── ThemeProvider.tsx          ← pindah dari components/
│
├── hooks/                         ← isi dengan hooks nyata
│   ├── useSearch.ts
│   ├── useTheme.ts
│   └── useLabsStatus.ts
│
├── lib/
│   ├── auth.ts                    ← NextAuth config
│   ├── db.ts                      ← Prisma client
│   └── validators.ts              ← Zod schemas
│
├── store/
│   └── searchStore.ts             ← sudah ada, pertahankan
│
├── data/
│   └── index.ts                   ← static fallback data
│
├── styles/
│   └── globals.css
│
└── types/
    └── index.ts
```

### 1B. Design Tokens (globals.css → tailwind.config.ts)

Pindahkan semua CSS variables dari referensi ke Tailwind config agar bisa dipakai di semua komponen:

```ts
// tailwind.config.ts
colors: {
  ink:     '#0a0a0a',
  paper:   '#f5f2ec',
  paper2:  '#ede9e0',
  paper3:  '#e4dfd3',
  accent:  '#ff3b00',   // merah — primary action
  accent2: '#0047ff',   // biru — links
  accent3: '#00c853',   // hijau — success/live
  accent4: '#ffd600',   // kuning — warning/beta
  muted:   '#7a7060',
  muted2:  '#b0a898',
}
fontFamily: {
  mono:    ['IBM Plex Mono', 'monospace'],
  display: ['Bebas Neue', 'cursive'],
  serif:   ['DM Serif Display', 'serif'],
}
```

### 1C. Setup Tooling
- ESLint + Prettier dengan config standar Next.js
- Husky + lint-staged (pre-commit check)
- Path alias `@/` di tsconfig.json
- `.gitignore` update: tambahkan `tsconfig.tsbuildinfo`

---

## 📄 FASE 2 — Public Pages (Static Version)
**Estimasi: 2–4 minggu**
> Deploy dulu versi ini ke Vercel sebelum lanjut ke backend.

### 2A. Home Page — Search Hub
Sudah ada di referensi dan sangat kuat. Konversi ke Next.js + pertahankan semua behavior:
- Ticker strip (fixed top)
- Custom cursor dengan lag-ring
- Search box dengan suggestions
- Quick chips navigasi
- Loader screen dengan counter
- Results view (two-column: main + sidebar)
- Labs FAB + Overlay

**Yang perlu ditambahkan:**
- Suggestions chips yang link ke halaman nyata (Blog, Showcase, Labs)
- Filter tabs di results terhubung ke konten real
- Footer links berfungsi sebagai navigasi

### 2B. Blog Page
**List View (`/blog`):**
- Layout editorial: header besar + grid artikel
- Filter by tag (Design, Development, Motion, Thoughts, dll)
- Setiap card: thumbnail opsional, judul (Bebas Neue), excerpt, tag, tanggal
- Search terintegrasi dengan search di home

**Detail View (`/blog/[slug]`):**
- Full-width header dengan judul besar
- Konten artikel dengan typografi yang kuat
- Sidebar: TOC (Table of Contents) + artikel terkait
- Reading progress bar (tipis, warna accent, di top)
- Share button

### 2C. Showcase Page
**Grid View (`/showcase`):**
- Masonry atau grid dengan hover preview
- Filter by tech stack atau kategori
- Setiap card: nama project, deskripsi singkat, tech tags, status badge
- Hover: preview image atau animasi

**Detail View (`/showcase/[slug]`):**
- Hero: nama besar + tagline
- Demo section (iframe embed atau screenshot gallery)
- Tech stack visual
- Link ke repo + live demo
- Metadata: timeline, role, tools

### 2D. Labs Page
> Ini yang paling unik dan perlu brainstorm tersendiri.

**Labs sebagai Overlay (sudah ada):** pertahankan FAB button yang membuka modal grid.

**Labs sebagai Halaman Full (`/labs`):**
- Grid semua lab tools dengan status (Live / Beta / Coming Soon)
- Filter by kategori: Color, Typography, Grid, Motion, Game, dll

**Individual Lab (`/labs/[slug]`):**
- Full-screen tool/playground
- Minimal chrome, maksimal workspace

**Ide Labs Playground (detail di bawah):**

---

## 🧪 BRAINSTORMING LABS PLAYGROUND

Ini bagian paling menarik! Berikut konsep yang sesuai dengan DNA visual kamu:

### Tier 1 — Segera Bisa Dibuat (Simple, High Impact)

**🎨 Color Oracle**
- Input: nama brand/mood/kata kunci
- Output: palette lengkap dengan nama warna, hex, WCAG compliance
- Export: CSS variables, Tailwind config, JSON
- *Status target: Beta*

**📐 Grid Architect**
- Visual builder untuk grid system
- Atur columns, gutter, margin
- Preview langsung di canvas
- Export: CSS Grid code
- *Status target: Beta*

**✂️ Slice Playground**
- Upload gambar → slice otomatis jadi grid
- Adjust jumlah slice, gap, efek
- Export sebagai ZIP gambar
- *Status target: Upcoming*

**🎮 Color Guessing Game**
- Tampilkan satu warna hex → user tebak namanya
- Atau tampilkan nama warna → tebak hex-nya
- Score system, leaderboard lokal
- *Status target: Soon*

### Tier 2 — Medium Complexity

**⟐ Type Foundry**
- Generate type scale (Major Third, Perfect Fourth, dll)
- Preview dengan teks kustom
- Export: CSS custom properties
- *Status target: Upcoming*

**◈ Pattern Forge**
- Generator pola SVG (truchet, grid, dots, lines)
- Slider untuk parameter (frekuensi, rotasi, warna)
- Export: SVG, PNG, CSS background
- *Status target: Upcoming*

**⬡ Motion Studio** (ambisious)
- Timeline animation editor
- Spring physics preview
- Export: CSS keyframes
- *Status target: Coming Q4*

### Tier 3 — Placeholder/Tease

Untuk labs yang belum siap, tampilkan card dengan:
- Status: "Coming Soon" dengan estimasi kuartal
- Brief deskripsi apa yang akan bisa dilakukan
- Tombol "Notify Me" (bisa hanya kirim ke email kamu)

### Status Badge System untuk Labs
```
🟢 Live      → bisa dipakai sekarang
🟡 Beta      → bisa dipakai, mungkin ada bug
🔵 Upcoming  → dalam development
⚪ Soon      → belum mulai, tapi direncanakan
🔴 Deprecated → tidak lagi diupdate
```

---

## 🛢️ FASE 3 — Backend Infrastructure
**Estimasi: 1–2 minggu**

### Database Schema (Supabase + Prisma)

```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?
  content     String   // Rich text HTML dari Tiptap
  coverImage  String?
  tags        String[]
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  seoTitle    String?
  seoDesc     String?
  ogImage     String?
}

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  thumbnail   String?
  demoUrl     String?
  repoUrl     String?
  techStack   String[]
  category    String
  featured    Boolean  @default(false)
  order       Int      @default(0)
  status      PageStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
}

model Lab {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  icon        String
  colorTheme  String   // 'red' | 'blue' | 'green' | 'yellow' | 'purple'
  version     String   @default("v0.1.0")
  status      LabStatus @default(UPCOMING)
  iframeUrl   String?  // untuk embed external tool
  isInternal  Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model SiteConfig {
  id          String   @id @default("main")
  // Appearance
  accentColor String   @default("#ff3b00")
  darkModeDefault Boolean @default(false)
  // Ticker content
  tickerItems Json     // array of {text, color}
  // Page statuses
  pageStatuses Json    // {blog: 'active', labs: 'upcoming', ...}
  // Profile
  ownerName   String   @default("Priyatna")
  tagline     String?
  bio         String?
  avatarUrl   String?
  // Social
  githubUrl   String?
  linkedinUrl String?
  twitterUrl  String?
  updatedAt   DateTime @updatedAt
}

model Asset {
  id        String   @id @default(cuid())
  filename  String
  url       String
  size      Int
  mimeType  String
  createdAt DateTime @default(now())
}

enum PostStatus   { DRAFT PUBLISHED ARCHIVED SCHEDULED }
enum PageStatus   { ACTIVE MAINTENANCE UPCOMING DEPRECATED }
enum LabStatus    { LIVE BETA UPCOMING SOON DEPRECATED }
```

### API Routes

```
/api/
├── auth/[...nextauth]/      ← Auth.js handler
├── posts/
│   ├── GET    /api/posts              ← list (public, filter by status=published)
│   ├── POST   /api/posts              ← create (admin only)
│   ├── GET    /api/posts/[slug]       ← detail (public)
│   ├── PATCH  /api/posts/[id]         ← update (admin only)
│   └── DELETE /api/posts/[id]         ← delete (admin only)
├── projects/    (sama seperti posts)
├── labs/        (sama seperti posts)
├── config/
│   ├── GET    /api/config             ← baca site config (public)
│   └── PATCH  /api/config             ← update (admin only)
└── uploads/
    ├── POST   /api/uploads            ← upload file (admin only)
    └── DELETE /api/uploads/[id]       ← hapus file (admin only)
```

---

## 🔐 FASE 4 — Admin Dashboard
**Estimasi: 3–5 minggu**

### Auth Strategy
Karena hanya kamu sendiri yang akses:
- **Auth.js v5** dengan provider **Credentials** (email + password)
- Password di-hash dengan bcrypt
- Session strategy: JWT
- Middleware protect semua route `/dashboard/*`
- Tambahkan IP allowlist opsional (extra security)

```ts
// src/middleware.ts
export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard')
  if (isAdminRoute && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})
```

### Layout Admin Dashboard

```
/dashboard
├── Sidebar kiri (fixed, collapsible)
│   ├── Logo + nama
│   ├── Overview
│   ├── ── CONTENT ──
│   ├── Blog
│   ├── Showcase
│   ├── Labs
│   ├── ── SITE ──
│   ├── Appearance
│   ├── Pages
│   ├── Assets
│   └── Settings
│
└── Main content area (scrollable)
    └── Header: breadcrumb + action button
```

### Menu per Halaman Admin

**📊 Overview Dashboard**
- Stats card: total posts, projects, labs
- Quick draft post baru
- Recent activity log
- Preview link ke public site

**✍️ Blog Manager**
- Tabel artikel: judul, status, tanggal, tag
- Filter: status (draft/published/archived)
- Actions: edit, preview, duplicate, delete
- Sort: tanggal, views
- Tombol "+ New Post"

**✍️ Blog Editor**
- Tiptap rich text editor (support markdown input)
- Toolbar: bold, italic, heading, code block, quote, image, link
- Sidebar kanan: metadata (slug, tags, SEO, status, jadwal publish)
- Auto-save ke localStorage setiap 30 detik
- Preview mode (tampil seperti public)
- Publish / Save Draft / Schedule

**🚀 Showcase Manager**
- Grid view semua project dengan thumbnail
- Drag & drop untuk reorder
- Quick-edit inline untuk status
- Modal edit: semua field project

**🧪 Labs Manager**
- Grid semua lab dengan status badge
- Toggle status dengan satu klik (Live ↔ Upcoming ↔ Beta)
- Edit: nama, deskripsi, icon, warna, version, URL
- Reorder via drag & drop

**🎨 Appearance Panel**
- **Color Scheme:** pilih preset (Warm Paper saat ini) atau custom hex untuk accent
- **Dark Mode:** toggle default theme
- **Ticker:** add/edit/remove/reorder ticker items
- **Preview:** iframe preview real-time public site di sebelah kanan
- **Save & Apply:** langsung update SiteConfig di database

**📄 Pages Manager**
- List semua halaman publik:
  - Home, Blog, Showcase, Labs
- Per halaman bisa set:
  - Status: Active / Maintenance / Upcoming
  - Pesan custom (ditampilkan di halaman status)
  - Estimasi waktu (untuk upcoming, opsional)

**📁 Asset Manager**
- Grid/list semua file yang diupload
- Upload drag & drop (multiple files)
- Preview gambar langsung
- Copy URL ke clipboard dengan satu klik
- Filter: semua / gambar / dokumen
- Hapus aset yang tidak dipakai

**⚙️ Settings**
- Edit profile: nama, tagline, bio, foto
- Social links
- SEO default (site title, description, OG image default)
- Backup: export semua data sebagai JSON

---

## ✨ FASE 5 — Enhancement & Polish
**Estimasi: Ongoing**

### Performance
- ISR untuk blog & showcase (revalidate setiap 60 detik)
- `next/image` untuk semua gambar
- Lazy load komponen Labs yang berat
- Bundle analysis dengan `@next/bundle-analyzer`

### SEO
- Dynamic `metadata` per halaman via Next.js App Router
- Sitemap otomatis: `/sitemap.xml` (Next.js built-in)
- Robots.txt
- OG Image dinamis untuk setiap post dengan `@vercel/og`
  - Template: nama post (Bebas Neue) di background paper + accent

### Analytics (Privacy-First)
- **Umami** (self-host di Vercel atau Railway) atau **Plausible**
- Di dashboard admin tampilkan:
  - Page views per halaman
  - Artikel paling banyak dibaca
  - Labs paling banyak diakses
  - Sumber traffic (referrer)

### PWA (Opsional)
- Service worker untuk offline reading (blog articles)
- Add to homescreen support
- Web app manifest

---

## 🗺️ ROADMAP & TIMELINE

```
BULAN 1
├── Week 1-2: FASE 1 — Refactor & Design Tokens
└── Week 3-4: FASE 2A-B — Home + Blog (static)

BULAN 2
├── Week 1-2: FASE 2C-D — Showcase + Labs (static)
├── Week 3:   Deploy versi statis ke Vercel ← MILESTONE 1
└── Week 4:   FASE 3 — Setup Supabase + Prisma + API

BULAN 3
├── Week 1:   FASE 4A — Auth + Admin Layout
├── Week 2:   FASE 4B — Blog Admin + Editor
├── Week 3:   FASE 4C — Showcase + Labs Admin
└── Week 4:   FASE 4D — Appearance + Pages Manager

BULAN 4
├── Week 1:   FASE 4E — Assets + Settings
├── Week 2:   Koneksi Admin → Public (ISR revalidation)
├── Week 3:   Deploy full version ← MILESTONE 2
└── Week 4:   FASE 5 — SEO, Analytics, Polish

BULAN 5+
└── FASE 5 ongoing: Labs tools build satu per satu
    ├── Color Oracle (bulan 5)
    ├── Grid Architect (bulan 6)
    └── ... dst
```

---

## 📦 FINAL TECH STACK

| Layer              | Teknologi                        | Alasan                                    |
|--------------------|----------------------------------|-------------------------------------------|
| Framework          | Next.js 14+ (App Router)         | SSR, ISR, API Routes, built-in image opt  |
| Language           | TypeScript                       | Type safety di seluruh codebase           |
| Styling            | Tailwind CSS + CSS Variables     | Utility-first + design tokens dari ref    |
| UI Components      | shadcn/ui (admin only)           | Headless, accessible, customizable        |
| Auth               | Auth.js v5 (NextAuth)            | Native Next.js, session management        |
| Database           | Supabase (PostgreSQL)            | All-in-one: DB + storage + realtime       |
| ORM                | Prisma                           | Type-safe queries, migration management   |
| Validasi           | Zod                              | Runtime validation + TypeScript inference |
| Rich Text Editor   | Tiptap                           | Extensible, React-native, headless        |
| File Upload        | Supabase Storage                 | Terintegrasi dengan DB yang sama          |
| Analytics          | Umami (self-hosted)              | Privacy-first, no cookies                 |
| Deploy             | Vercel                           | Best-in-class Next.js hosting             |
| CI/CD              | GitHub Actions                   | Auto deploy on push                       |

---

## ❓ KEPUTUSAN YANG PERLU DIBUAT

Sebelum mulai coding, finalkan keputusan berikut:

1. **Labs pertama yang akan dibuat:** Color Oracle atau Grid Architect?
   - Color Oracle lebih impactful dan bisa pakai AI API
   - Grid Architect lebih teknikal tapi berguna harian

2. **Labs overlay vs halaman penuh:**
   - Overlay (modal) untuk quick access tetap dipertahankan
   - Halaman `/labs/[slug]` untuk full workspace
   - Keduanya bisa koeksisten

3. **Blog editor format:**
   - Tiptap (WYSIWYG) → lebih mudah, HTML output
   - MDX → lebih powerful untuk developer content, tapi tidak bisa live-edit di admin
   - **Rekomendasi: Tiptap** karena kamu ingin edit dari admin

4. **Kapan mulai Labs:**
   - Option A: Langsung buat 1 lab simple (Color Oracle) di fase 2 untuk validasi konsep
   - Option B: Tunggu sampai infrastruktur backend selesai
   - **Rekomendasi: Option A** — 1 lab static dulu untuk lihat feel-nya

---

## 🎯 NEXT ACTIONS (Minggu Ini)

```
□ 1. Refactor folder structure sesuai arsitektur baru
□ 2. Setup tailwind.config.ts dengan design tokens dari referensi HTML
□ 3. Konversi CustomCursor.tsx mengikuti referensi (cursor + cursor-ring)
□ 4. Konversi Ticker.tsx dengan data dari data/index.ts
□ 5. Setup Supabase project (gratis tier cukup untuk mulai)
□ 6. Init Prisma + schema awal (Post, Project, Lab, SiteConfig)
□ 7. Deploy ke Vercel dengan versi statis dulu
```

---

*Document ini adalah living document — update seiring progress development.*