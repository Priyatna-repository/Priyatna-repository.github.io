# FASE 1 — Refactor & Fondasi
## Priyatna Repository · Technical Implementation Plan

> **Status:** 🔄 In Progress
> **Durasi target:** 1–2 minggu
> **Branch kerja:** `develop`
> **Tujuan:** Merapikan codebase yang ada, menetapkan standar coding,
> membangun fondasi yang kuat, dan memastikan build + deploy berjalan sempurna.

---

## DAFTAR ISI

1. [Current State Audit — Inventaris Kode Saat Ini](#1-current-state-audit)
2. [Gap Analysis — Apa yang Hilang](#2-gap-analysis)
3. [Prinsip & Aturan Dasar](#3-prinsip--aturan-dasar)
4. [TASK 1.1 — Fix .gitignore & File Konfigurasi Dasar](#4-task-11--fix-gitignore--file-konfigurasi-dasar)
5. [TASK 1.2 — next.config.ts untuk GitHub Pages](#5-task-12--nextconfigts-untuk-github-pages)
6. [TASK 1.3 — Install Tailwind CSS v4](#6-task-13--install-tailwind-css-v4)
7. [TASK 1.4 — Refactor globals.css ke Design System Hybrid](#7-task-14--refactor-globalscss-ke-design-system-hybrid)
8. [TASK 1.5 — Refactor src/types/index.ts](#8-task-15--refactor-srctypesindexts)
9. [TASK 1.6 — Refactor src/data/ — Split & Strukturisasi](#9-task-16--refactor-srcdata--split--strukturisasi)
10. [TASK 1.7 — Refactor src/store/ — Split Store](#10-task-17--refactor-srcstore--split-store)
11. [TASK 1.8 — Buat src/lib/utils.ts](#11-task-18--buat-srclibutils-ts)
12. [TASK 1.9 — Refactor src/app/layout.tsx](#12-task-19--refactor-srcapplayouttsx)
13. [TASK 1.10 — Buat src/app/(public)/layout.tsx](#13-task-110--buat-srcapppubliclayouttsx)
14. [TASK 1.11 — Refactor Komponen Existing](#14-task-111--refactor-komponen-existing)
15. [TASK 1.12 — Verifikasi Build & Deploy](#15-task-112--verifikasi-build--deploy)
16. [Checklist Penyelesaian Fase 1](#16-checklist-penyelesaian-fase-1)
17. [Ringkasan Perubahan File](#17-ringkasan-perubahan-file)

---

## 1. Current State Audit

Inventaris lengkap kondisi codebase **saat ini** sebelum refactor.

### 1.1 File & Folder yang Sudah Ada

```
STATUS LEGENDA:
  ✅ Ada dan sudah benar
  ⚠️ Ada tapi perlu refactor/perbaikan
  ❌ Belum ada, perlu dibuat
```

#### Root Config Files
```
✅  .gitignore             ← Sudah diperbaiki (docs/ tidak lagi di-ignore)
✅  next.config.ts         ← Sudah dibuat (static export untuk GitHub Pages)
✅  .prettierrc            ← Sudah dibuat
✅  tsconfig.json          ← Ada, path alias @/ sudah benar
✅  package.json           ← Ada, dependencies lengkap
✅  package-lock.json      ← Ada, ter-commit
✅  CLAUDE.md              ← Sudah dibuat
❌  tailwind.config.ts     ← Belum ada (Tailwind belum diinstall)
❌  .eslintrc.json         ← Belum ada
❌  .husky/                ← Belum ada (Husky + lint-staged belum setup)
```

#### CI/CD
```
✅  .github/workflows/deploy.yml  ← Sudah dibuat, siap deploy
```

#### Public Assets
```
✅  public/assets/images/hero-background.jpg
✅  public/assets/icons/logo-main.png
✅  public/assets/icons/tit-logo.png
❌  public/assets/images/og-default.jpg   ← Butuh untuk Open Graph
❌  public/favicon.ico                    ← Belum ada
```

#### src/app/
```
⚠️  src/app/layout.tsx    ← Ada tapi perlu refactor:
                              - Fonts masih via Google Fonts CDN (bukan next/font)
                              - Metadata belum lengkap (og, twitter)
                              - ThemeProvider belum ada di sini
✅  src/app/page.tsx       ← Ada dan sudah benar (delegasi ke PageClient)
❌  src/app/(public)/      ← Route group belum dibuat
❌  src/app/not-found.tsx  ← Halaman 404 belum ada
```

#### src/components/
```
⚠️  src/components/labs/LabsFab.tsx        ← Ada, tapi LabsFab dikomentari di PageClient!
✅  src/components/labs/LabsOverlay.tsx    ← Ada dan fungsional
⚠️  src/components/layout/CustomCursor.tsx ← Ada, perlu review touch device handling
⚠️  src/components/layout/HomeView.tsx    ← Ada, fungsional, perlu refactor styling
⚠️  src/components/layout/PageClient.tsx  ← Ada, ada komentar LabsFab (`{/* <LabsFab /> */}`)
⚠️  src/components/layout/ResultsView.tsx ← Ada, fungsional, perlu review
✅  src/components/ui/ImageComparison.tsx  ← Ada
✅  src/components/ui/Loader.tsx           ← Ada dan fungsional
✅  src/components/ui/Tabs.tsx             ← Ada (pakai Radix UI)
✅  src/components/ui/ThemeToggle.tsx      ← Ada dan fungsional
✅  src/components/ui/Ticker.tsx           ← Ada dan fungsional
❌  src/components/ui/StatusBadge.tsx      ← Belum ada
❌  src/components/ui/LabStatusBadge.tsx   ← Belum ada
❌  src/components/ui/StatusPage.tsx       ← Belum ada
```

#### src/data/, src/types/, src/store/, src/lib/, src/hooks/
```
⚠️  src/data/index.ts      ← Ada, semua data dalam SATU file besar (perlu split)
⚠️  src/types/index.ts     ← Ada tapi interface tidak lengkap/konsisten
                              Tidak match dengan planning di overal.md/pashe2.md
⚠️  src/store/searchStore.ts ← Ada dan fungsional, tapi terlalu banyak responsibility:
                              - Search state (OK)
                              - Labs open/close state (seharusnya di uiStore)
                              - Theme state (seharusnya di uiStore atau terpisah)
                              - Search history (OK)
❌  src/store/uiStore.ts   ← Belum ada
❌  src/lib/utils.ts       ← Belum ada (cn, formatDate, slugify)
❌  src/lib/auth.ts        ← Belum ada (untuk Fase 4)
❌  src/lib/db.ts          ← Belum ada (untuk Fase 3)
❌  src/hooks/             ← Folder belum ada
```

#### src/styles/, src/providers/
```
⚠️  src/styles/globals.css    ← Ada dan lengkap (CSS variables, dark mode, animasi)
                                 Perlu update saat Tailwind diinstall (tambah @tailwind directives)
✅  src/providers/ThemeProvider.tsx  ← Ada dan fungsional
```

### 1.2 Dependencies — Status

```
INSTALLED (dari package.json):
  Production:
  ✅ next@16.2.4
  ✅ react@19.2.5 + react-dom@19.2.5
  ✅ zustand@5.0.12 (state management)
  ✅ framer-motion@12.38.0 (animasi)
  ✅ clsx@2.1.1 (class utility)
  ✅ tailwind-merge@3.5.0 (Tailwind class merging)
  ✅ @radix-ui/react-tabs@1.1.13 (accessible tabs)
  ✅ class-variance-authority@0.7.1 (component variants)
  ✅ lucide-react@1.11.0 (icons)

  Dev:
  ✅ typescript@6.0.3
  ✅ @types/react + @types/node + @types/react-dom
  ✅ husky@9.1.7 (git hooks - installed but not configured)
  ✅ lint-staged@16.4.0 (staged files linting - installed but not configured)
  ✅ prettier@3.8.3
  ✅ prettier-plugin-tailwindcss@0.8.0

YANG BELUM DIINSTALL:
  ❌ tailwindcss (TIDAK ADA di node_modules! Perlu diinstall)
  ❌ eslint + eslint-config-next (untuk .eslintrc.json)
  ❌ clsx (ada di package.json, perlu verify)
```

### 1.3 Teknologi Styling Saat Ini

**Project TIDAK menggunakan Tailwind CSS saat ini.**

Semua styling menggunakan:
- CSS Custom Properties (CSS variables di `globals.css`)
- Inline styles di JSX (`style={{ ... }}`)
- CSS class names langsung dari `globals.css`

Tailwind direncanakan tapi belum diimplementasikan. Komponen yang ada menggunakan pola seperti:
```tsx
// Contoh dari PageClient.tsx — menggunakan inline style, bukan Tailwind
<div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: 30 }}>
```

---

## 2. Gap Analysis

Perbedaan antara kondisi saat ini dan kondisi target Fase 1.

| Area | Sekarang | Target Fase 1 | Prioritas |
|---|---|---|---|
| Tailwind CSS | ❌ Tidak ada | ✅ Terinstall + config | HIGH |
| Type definitions | ⚠️ Tidak lengkap | ✅ Lengkap & konsisten | HIGH |
| Data layer | ⚠️ 1 file besar | ✅ Split per domain | MEDIUM |
| Store | ⚠️ 1 store semua | ✅ searchStore + uiStore | MEDIUM |
| utils.ts | ❌ Tidak ada | ✅ cn, formatDate, dll | MEDIUM |
| ESLint config | ❌ Tidak ada | ✅ .eslintrc.json | MEDIUM |
| Husky hooks | ❌ Tidak ada | ✅ Pre-commit check | LOW |
| layout.tsx | ⚠️ Perlu update | ✅ next/font, metadata | MEDIUM |
| not-found.tsx | ❌ Tidak ada | ✅ Custom 404 | LOW |
| LabsFab | ⚠️ Dikomentari | ✅ Aktif dengan uiStore | HIGH |
| Build berhasil | ⚠️ Belum diverifikasi | ✅ `npm run build` OK | CRITICAL |

---

## 3. Prinsip & Aturan Dasar

Aturan ini berlaku untuk seluruh codebase, tidak boleh dilanggar:

### 3.1 TypeScript
```
✅ Selalu: import type { ... } untuk type-only imports
✅ Selalu: definisikan tipe untuk semua props komponen
✅ Selalu: gunakan interface bukan type untuk object shapes
❌ Jangan: gunakan `any` — pakai `unknown` jika tidak yakin
❌ Jangan: `// @ts-ignore` tanpa penjelasan
```

### 3.2 Import Order (diatur Prettier otomatis)
```typescript
// Urutan yang benar:
import { useState } from 'react'                    // 1. React
import Link from 'next/link'                         // 2. Next.js
import { motion } from 'framer-motion'               // 3. External packages
import { cn } from '@/lib/utils'                     // 4. Internal @/ alias
import type { LabItem } from '@/types'               // 5. Type imports
```

### 3.3 Komponen React
```
✅ Nama file: PascalCase.tsx (LabsFab.tsx, HomeView.tsx)
✅ Export default untuk komponen utama
✅ Named export untuk utility, types, constants
✅ 'use client' hanya jika benar-benar butuh browser APIs
❌ Jangan: taruh komponen di folder app/ (hanya routing files)
❌ Jangan: inline logic yang kompleks — extract ke hooks/
```

### 3.4 CSS & Styling
```
✅ Gunakan CSS variables (var(--ink), var(--paper), dll)
✅ Tailwind classes setelah Tailwind diinstall
❌ Jangan: hardcode warna hex di JSX/TSX
❌ Jangan: inline style untuk nilai yang tidak dinamis
```

### 3.5 File & Folder Naming
```
Components:  PascalCase.tsx    → LabsFab.tsx
Hooks:       camelCase.ts      → useSearch.ts
Utilities:   camelCase.ts      → utils.ts
Stores:      camelCase.ts      → searchStore.ts
Data files:  camelCase.ts      → labs.ts, ticker.ts
CSS:         camelCase.css     → globals.css
```

---

## 4. TASK 1.1 — Fix .gitignore & File Konfigurasi Dasar

**Status: ✅ SELESAI**

Yang sudah dilakukan:
- ✅ Hapus `docs/` dari `.gitignore` (docs sebelumnya tidak ter-track git!)
- ✅ Fix komentar `← TAMBAHKAN INI` yang tidak valid di `.gitignore`
- ✅ Tambahkan `.prettierrc`
- ✅ Tambahkan `CLAUDE.md`
- ✅ Tambahkan `.github/workflows/deploy.yml`

---

## 5. TASK 1.2 — next.config.ts untuk GitHub Pages

**Status: ✅ SELESAI**

Yang sudah dilakukan:
- ✅ Buat `next.config.ts` dengan `output: 'export'` untuk static export
- ✅ Tambahkan `trailingSlash: true` untuk konsistensi URL
- ✅ Tambahkan `images: { unoptimized: true }` (diperlukan untuk static export)
- ✅ Tambahkan komentar detail untuk future migration ke VPS

---

## 6. TASK 1.3 — Install Tailwind CSS v4

**Status: ❌ BELUM DILAKUKAN**

### 6.1 Konteks

Next.js 16 menggunakan **Tailwind CSS v4** yang memiliki cara setup berbeda dari v3:
- **v3:** Membutuhkan `tailwind.config.ts` (JavaScript config)
- **v4:** Dikonfigurasi via CSS (`@import "tailwindcss"` dan `@theme {}` directive)

### 6.2 Langkah-Langkah Install

```bash
# Step 1: Install Tailwind CSS v4 (package baru di v4)
npm install tailwindcss @tailwindcss/postcss

# Step 2: Install PostCSS (dibutuhkan Tailwind v4)
# Biasanya sudah included dengan Next.js, tapi pastikan ada
npm install -D postcss
```

### 6.3 Buat postcss.config.mjs

```bash
# Buat file konfigurasi PostCSS
touch postcss.config.mjs
```

**Isi `postcss.config.mjs`:**
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

### 6.4 Update globals.css

Tambahkan `@import "tailwindcss"` di PALING ATAS `globals.css`, **sebelum** semua CSS lain:

```css
/* src/styles/globals.css — SETELAH update */

@import "tailwindcss";

/* ─── DESIGN TOKENS via @theme ─────────────────────────────────── */
/* Tailwind v4 menggunakan @theme untuk custom tokens */
@theme {
  /* Colors */
  --color-ink:        #0a0a0a;
  --color-paper:      #f5f2ec;
  --color-paper-2:    #ede9e0;
  --color-paper-3:    #e4dfd3;
  --color-accent:     #ff3b00;
  --color-accent-2:   #0047ff;
  --color-accent-3:   #00c853;
  --color-accent-4:   #ffd600;
  --color-muted:      #7a7060;
  --color-muted-2:    #b0a898;
  
  /* Fonts */
  --font-mono:    'IBM Plex Mono', monospace;
  --font-display: 'Bebas Neue', cursive;
  --font-serif:   'DM Serif Display', serif;
  
  /* Border radius */
  --radius:  2px;
  
  /* Animations */
  --animate-ticker:   ticker-run 30s linear infinite;
  --animate-slide-up: slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
  --animate-wipe-in:  wipe-in 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
  --animate-fab-in:   fab-in 0.8s 1.5s cubic-bezier(0.23, 1, 0.32, 1) both;
  --animate-modal-in: modal-in 0.35s cubic-bezier(0.23, 1, 0.32, 1) both;
  --animate-card-in:  card-in 0.4s cubic-bezier(0.23, 1, 0.32, 1) both;
}

/* Sisanya tetap sama seperti sebelumnya... */
```

**Catatan penting Tailwind v4:**
- Class `text-ink` → `text-[var(--ink)]` atau Tailwind akan generate dari `--color-ink` token
- Class `bg-paper` → `bg-[var(--paper)]` atau dari `--color-paper` token
- Tailwind v4 secara otomatis scan semua file `src/**/*.{tsx,ts}` tanpa perlu config

### 6.5 Verifikasi Install

```bash
# Build untuk verifikasi Tailwind bekerja
npm run build

# Cek output CSS — harus ada Tailwind utilities
grep -r "tailwindcss" .next/ --include="*.css" | head -5
```

### 6.6 Catatan: Pendekatan Hybrid

Karena komponen existing menggunakan CSS variables (bukan Tailwind), pendekatan terbaik adalah **hybrid**:
- CSS variables tetap dipertahankan untuk backward compatibility
- Komponen BARU ditulis menggunakan Tailwind classes
- Komponen existing di-refactor ke Tailwind secara bertahap

---

## 7. TASK 1.4 — Refactor globals.css ke Design System Hybrid

**Status: ❌ BELUM DILAKUKAN** (menunggu Task 1.3)

### 7.1 Perubahan yang Diperlukan

Saat ini `globals.css` sudah sangat baik dengan CSS variables. Perubahan minimal:

1. Tambahkan `@import "tailwindcss"` di baris pertama
2. Tambahkan `@theme {}` block untuk design tokens
3. Pertahankan semua CSS variables yang ada (backward compat)
4. Pertahankan semua keyframe animations
5. Tambahkan `.cursor-dot` dan `.cursor-ring` selectors untuk cursor hover states

### 7.2 Selector yang Perlu Ditambahkan

```css
/* Tambahkan di akhir globals.css */

/* ─── CURSOR HOVER STATES ─── */
/* Menggunakan :has() selector — tidak bisa di Tailwind */
body:has(a:hover) .cursor-dot,
body:has(button:hover) .cursor-dot {
  width: 20px;
  height: 20px;
  background: var(--accent2);
  transition: width 0.15s ease, height 0.15s ease;
}

body:has(a:hover) .cursor-ring,
body:has(button:hover) .cursor-ring {
  width: 60px;
  height: 60px;
  opacity: 0.15;
}

/* ─── LAB CARD COLOR THEMES ─── */
/* Dipakai oleh LabsOverlay */
.lc-red    { --lab-color: var(--accent); }
.lc-blue   { --lab-color: var(--accent2); }
.lc-green  { --lab-color: var(--accent3); }
.lc-yellow { --lab-color: var(--accent4); }
.lc-purple { --lab-color: #a855f7; }
.lc-orange { --lab-color: #f97316; }
```

---

## 8. TASK 1.5 — Refactor src/types/index.ts

**Status: ❌ BELUM DILAKUKAN**

### 8.1 Masalah dengan types/index.ts Saat Ini

```typescript
// SEKARANG — Tidak lengkap dan tidak match dengan rencana
export interface LabTool {
  id: string;
  icon: string;
  name: string;
  desc: string;
  status: 'live' | 'beta' | 'soon';  // ← 'soon' vs 'upcoming'? Tidak konsisten
  version: string;
  colorClass: string;  // ← 'lc-red' string, bukan typed color theme
}
```

### 8.2 File Baru yang Diinginkan

Ganti seluruh isi `src/types/index.ts` dengan versi lengkap ini:

```typescript
// src/types/index.ts — VERSI BARU

// ─── STATUS TYPES ─────────────────────────────────────────────────────────
// Digunakan di berbagai tempat, harus konsisten di seluruh codebase

export type LabStatus  = 'live' | 'beta' | 'upcoming' | 'soon' | 'deprecated'
export type PageStatus = 'active' | 'maintenance' | 'upcoming'
export type PostStatus = 'draft' | 'published' | 'archived'

// ─── LAB TYPES ────────────────────────────────────────────────────────────

// Warna tema untuk card Labs — digunakan sebagai class identifier
export type LabColorTheme = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'

// Interface utama untuk satu Lab tool
export interface LabItem {
  id:               string
  name:             string
  slug:             string
  description:      string
  fullDescription?: string        // Deskripsi panjang untuk halaman detail
  icon:             string        // Emoji atau simbol Unicode
  colorTheme:       LabColorTheme
  version:          string        // Format: "v1.2.3"
  status:           LabStatus
  url?:             string        // Link ke halaman lab (jika live/beta)
  features?:        string[]      // Fitur yang akan tersedia (untuk upcoming)
  estimatedRelease?: string       // "Q3 2026", "Soon", dll
  order:            number        // Urutan tampil di grid
}

// ─── TICKER TYPES ─────────────────────────────────────────────────────────

export interface TickerItem {
  text:     string
  color:    string  // Hex color untuk dot indicator
}

// ─── SEARCH & SUGGESTION TYPES ────────────────────────────────────────────

export type SuggestionCategory = 'design' | 'lab' | 'brand' | 'motion'

export interface SearchSuggestion {
  text:     string
  category: SuggestionCategory
  query:    string
}

// ─── FILTER TYPES ─────────────────────────────────────────────────────────

export interface FilterTab {
  label:  string
  value:  string
  count:  number
}

// ─── SHORTCUT TYPES ───────────────────────────────────────────────────────

export type ShortcutAction = 'search' | 'labs' | 'link'

export interface ShortcutItem {
  icon:   string
  label:  string
  action: ShortcutAction
  value:  string  // Search query, URL, atau '' untuk labs
}

// ─── RESULT CARD TYPES ────────────────────────────────────────────────────
// Dipakai di ResultsView untuk menampilkan search results

export interface ResultTag {
  label:      string
  colorClass: string  // CSS class untuk warna badge
}

export interface ResultCard {
  id:           string
  iconLetter:   string
  iconColorClass: string  // CSS class untuk warna ikon
  source:       string    // "priyatna.design › "
  sourceBold:   string    // "verdant-dashboard"
  title:        string
  description:  string
  tags:         ResultTag[]
  date:         string    // "Mar 2024"
}

// ─── BLOG TYPES ───────────────────────────────────────────────────────────
// (Untuk Fase 2 dan seterusnya)

export interface Post {
  id:           string
  title:        string
  slug:         string
  excerpt?:     string
  content:      string       // HTML string (akan jadi rich text di Fase 3)
  coverImage?:  string       // Path relatif ke /public/assets/images/
  tags:         string[]
  status:       PostStatus
  publishedAt?: string       // ISO date string
  createdAt:    string       // ISO date string
  readTimeMin?: number       // Estimasi waktu baca dalam menit
}

// ─── SHOWCASE/PROJECT TYPES ───────────────────────────────────────────────
// (Untuk Fase 2 dan seterusnya)

export interface Project {
  id:          string
  title:       string
  slug:        string
  description: string
  thumbnail?:  string         // Path relatif ke /public/assets/images/
  demoUrl?:    string
  repoUrl?:    string
  techStack:   string[]
  category:    string
  featured:    boolean
  order:       number
  status:      PageStatus
}

// ─── SITE CONFIG TYPES ────────────────────────────────────────────────────
// Kontrol status setiap halaman

export interface PageStatusConfig {
  status:    PageStatus
  message?:  string     // Pesan custom untuk maintenance/upcoming
  estimate?: string     // Estimasi waktu aktif, misal "Q2 2026"
}

export type SitePageStatuses = {
  [pageName: string]: PageStatusConfig
}

// ─── PAA (People Also Ask) TYPES ─────────────────────────────────────────

export interface PAA {
  question: string
  answer:   string
}
```

### 8.3 Update Import di File yang Terpengaruh

Setelah update `types/index.ts`, update semua import:

```bash
# Cari semua file yang import dari types
grep -r "from '@/types'" src/ --include="*.ts" --include="*.tsx"
grep -r "from '@/types/'" src/ --include="*.ts" --include="*.tsx"
```

File yang perlu diupdate:
- `src/data/index.ts` → perlu update tipe yang digunakan
- `src/components/labs/LabsOverlay.tsx` → update LabTool → LabItem
- `src/components/ui/Loader.tsx` → mungkin tidak perlu update

---

## 9. TASK 1.6 — Refactor src/data/ — Split & Strukturisasi

**Status: ❌ BELUM DILAKUKAN**

### 9.1 Masalah dengan data/index.ts Saat Ini

File `src/data/index.ts` berisi SEMUA data dalam satu file (~230 baris):
- Lab tools
- Result cards
- Suggestions
- Ticker items
- Filter tabs
- PAA items
- Related searches
- Quick chips
- Shortcuts

Ini melanggar prinsip **single responsibility** dan membuat file sulit di-maintain.

### 9.2 Struktur Target

```
src/data/
├── labs.ts          ← Data Lab tools (menggantikan LAB_TOOLS, LAB_TOOLS_FULL)
├── ticker.ts        ← Data ticker strip items
├── suggestions.ts   ← Search suggestions, quick chips, filter tabs
├── results.ts       ← Result cards, PAA items, related searches
├── shortcuts.ts     ← Home shortcut grid items
├── pageStatuses.ts  ← Status setiap halaman publik
└── index.ts         ← Re-export semua (backward compatibility)
```

### 9.3 src/data/labs.ts — File Baru

```typescript
// src/data/labs.ts
import type { LabItem } from '@/types'

export const LABS_DATA: LabItem[] = [
  {
    id:              'motion-studio',
    name:            'Motion Studio',
    slug:            'motion-studio',
    description:     'Timeline editor · Spring physics',
    fullDescription: 'Full timeline animation editor with spring physics engine, easing curve library, and keyframe sequencer. Export: Lottie · CSS · GSAP.',
    icon:            '⬡',
    colorTheme:      'red',
    version:         'v1.4.2',
    status:          'live',
    url:             '/labs/motion-studio',
    order:           1,
  },
  {
    id:              'pattern-forge',
    name:            'Pattern Forge',
    slug:            'pattern-forge',
    description:     'Truchet · Penrose · Custom weaves',
    fullDescription: 'Parametric pattern generator. Truchet tiles, Penrose tessellations, Voronoi cells, custom grids. Export: SVG · PNG · JSON.',
    icon:            '◈',
    colorTheme:      'blue',
    version:         'v2.0.1',
    status:          'live',
    url:             '/labs/pattern-forge',
    order:           2,
  },
  {
    id:              'color-oracle',
    name:            'Color Oracle',
    slug:            'color-oracle',
    description:     'AI palette engine · WCAG',
    fullDescription: 'AI palette architecture engine. Brief → semantic color system with dark mode, WCAG compliance, brand personality, and token output.',
    icon:            '✦',
    colorTheme:      'green',
    version:         'v0.8.0',
    status:          'beta',
    url:             '/labs/color-oracle',
    order:           3,
  },
  {
    id:              'type-foundry',
    name:            'Type Foundry',
    slug:            'type-foundry',
    description:     'Variable fonts · Optical sizing',
    fullDescription: 'Variable typeface builder and type scale generator. Optical size tuning, baseline grid alignment, and specimen export.',
    icon:            '⟐',
    colorTheme:      'yellow',
    version:         'v1.1.0',
    status:          'live',
    url:             '/labs/type-foundry',
    order:           4,
  },
  {
    id:              'grid-architect',
    name:            'Grid Architect',
    slug:            'grid-architect',
    description:     'Spatial systems · Baseline grids',
    fullDescription: 'Spatial grid system builder. Define column grids, baseline rhythms, and component spacing tokens. Figma & CSS export.',
    icon:            '⊕',
    colorTheme:      'purple',
    version:         'v0.5.3',
    status:          'beta',
    url:             '/labs/grid-architect',
    order:           5,
  },
  {
    id:              'icon-atelier',
    name:            'Icon Atelier',
    slug:            'icon-atelier',
    description:     'Custom icon sets · SVG export',
    fullDescription: 'Bespoke icon set generator. Draw with constraints, auto-generate filled/outlined/duotone variants, and export as SVG.',
    icon:            '◎',
    colorTheme:      'orange',
    version:         'v0.1.0',
    status:          'upcoming',
    features:        [
      'Constraint-based icon drawing canvas',
      'Auto-generate filled, outlined, duotone variants',
      'Export as SVG sprite or icon font',
      'Figma plugin integration',
    ],
    estimatedRelease: 'Q4 2026',
    order:           6,
  },
]

// Helper functions — interface ini harus SAMA dengan API Fase 3 nanti
export function getAllLabs(): LabItem[] {
  return LABS_DATA.sort((a, b) => a.order - b.order)
}

export function getActiveLabs(): LabItem[] {
  return LABS_DATA.filter((l) => l.status === 'live' || l.status === 'beta')
    .sort((a, b) => a.order - b.order)
}

export function getLabBySlug(slug: string): LabItem | undefined {
  return LABS_DATA.find((l) => l.slug === slug)
}
```

### 9.4 src/data/ticker.ts — File Baru

```typescript
// src/data/ticker.ts
import type { TickerItem } from '@/types'

export const TICKER_ITEMS: TickerItem[] = [
  { text: 'PRIYATNA DESIGN SYSTEM v4.2',          color: '#ff3b00' },
  { text: '247 PROJECTS · 34 COUNTRIES',           color: '#0047ff' },
  { text: 'ADDON LABS NOW OPEN · 6 TOOLS ACTIVE',  color: '#00c853' },
  { text: 'MOTION STUDIO BETA → TRY IT NOW',       color: '#ffd600' },
  { text: 'AWWWARDS SITE OF THE DAY 2024',         color: '#ff3b00' },
  { text: 'NEW: COLOR ORACLE AI PALETTE GEN',      color: '#0047ff' },
]
```

### 9.5 src/data/index.ts — Update untuk Backward Compat

```typescript
// src/data/index.ts — SETELAH SPLIT
// Re-export semua data agar import lama tetap berfungsi

// Baru — data dari file terpisah
export * from './labs'
export * from './ticker'
export * from './suggestions'
export * from './results'
export * from './shortcuts'
export * from './pageStatuses'

// Legacy aliases — hapus setelah semua komponen di-update
// export { LABS_DATA as LAB_TOOLS } from './labs'
```

**Catatan:** File split dilakukan secara bertahap. `index.ts` berfungsi sebagai adapter layer selama migrasi.

---

## 10. TASK 1.7 — Refactor src/store/ — Split Store

**Status: ❌ BELUM DILAKUKAN**

### 10.1 Masalah Saat Ini

`searchStore.ts` menyimpan terlalu banyak state yang tidak berkaitan:
- `isLabsOpen` → UI state, bukan search state
- `theme` → appearance state, bukan search state

Ini melanggar **separation of concerns**.

### 10.2 Buat src/store/uiStore.ts

```typescript
// src/store/uiStore.ts
import { create } from 'zustand'

interface UIStore {
  // State
  isLabsOpen: boolean

  // Actions
  openLabs:  () => void
  closeLabs: () => void
  toggleLabs: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isLabsOpen: false,

  openLabs:   () => set({ isLabsOpen: true }),
  closeLabs:  () => set({ isLabsOpen: false }),
  toggleLabs: () => set((state) => ({ isLabsOpen: !state.isLabsOpen })),
}))
```

### 10.3 Update searchStore.ts

Hapus `isLabsOpen`, `openLabs`, `closeLabs`, dan `theme`-related state dari `searchStore.ts`.

**Setelah refactor, searchStore hanya berisi:**
```typescript
interface SearchStore {
  query:        string
  isResultsView: boolean
  history:      string[]
  _hasHydrated: boolean

  setQuery:       (q: string) => void
  runSearch:      (q: string) => void
  goHome:         () => void
  addToHistory:   (q: string) => void
  clearHistory:   () => void
  setHasHydrated: (state: boolean) => void
}
```

### 10.4 Update Semua Komponen yang Pakai Store Lama

```bash
# Cari semua yang pakai isLabsOpen dari searchStore
grep -r "isLabsOpen\|openLabs\|closeLabs" src/ --include="*.tsx" --include="*.ts"
```

File yang perlu diupdate:
- `src/components/labs/LabsFab.tsx` → import dari `useUIStore`
- `src/components/labs/LabsOverlay.tsx` → import dari `useUIStore`
- `src/components/layout/HomeView.tsx` → cek apakah ada `openLabs`
- `src/components/layout/PageClient.tsx` → cek penggunaan labs state

### 10.5 Theme State

`theme` dan `toggleTheme` di `searchStore` bisa tetap di sana untuk sekarang (karena sudah persist ke localStorage), ATAU dipindah ke `uiStore`. Keputusan: **pertahankan di `searchStore` untuk sekarang** agar tidak break theme persistence. Refactor ini opsional di Fase 1.

---

## 11. TASK 1.8 — Buat src/lib/utils.ts

**Status: ❌ BELUM DILAKUKAN**

### 11.1 Mengapa Diperlukan

- `tailwind-merge` dan `clsx` sudah diinstall tapi tidak ada file yang menggunakannya secara terpusat
- Tanpa `cn()` function, merging Tailwind classes rawan error
- Utility functions akan dipakai di BANYAK tempat

### 11.2 Buat File

```bash
mkdir -p src/lib
touch src/lib/utils.ts
```

### 11.3 Isi src/lib/utils.ts

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── cn: Merge Tailwind classes dengan aman ────────────────────────────────
// Menggabungkan clsx (conditional classes) dengan tailwind-merge
// (deduplication & conflict resolution untuk Tailwind classes)
//
// Penggunaan:
//   cn('bg-paper', isActive && 'bg-accent', className)
//   cn('text-sm', 'text-lg')  → 'text-lg' (tailwind-merge resolve konflik)
//
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── formatDate: Format tanggal ke format yang readable ───────────────────
// Input:  Date object atau ISO string ("2026-01-15T00:00:00Z")
// Output: "Jan 2026" atau "15 Jan 2026" tergantung options
//
// Penggunaan:
//   formatDate('2026-01-15')        → "Jan 2026"
//   formatDate('2026-01-15', true)  → "15 Jan 2026"
//
export function formatDate(date: Date | string, includeDay = false): string {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = includeDay
    ? { day: 'numeric', month: 'short', year: 'numeric' }
    : { month: 'short', year: 'numeric' }
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

// ─── slugify: Convert string ke URL-safe slug ──────────────────────────────
// Input:  "Membangun Design System yang Scalable"
// Output: "membangun-design-system-yang-scalable"
//
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // Hapus karakter non-word (kecuali space & dash)
    .replace(/[\s_-]+/g, '-')   // Replace space/underscore dengan dash
    .replace(/^-+|-+$/g, '')    // Hapus leading/trailing dash
}

// ─── estimateReadTime: Hitung estimasi waktu baca ──────────────────────────
// Input:  String HTML atau plain text
// Output: Angka menit (minimum 1 menit)
//
// Asumsi: Rata-rata 200 kata per menit
//
export function estimateReadTime(content: string): number {
  const text  = content.replace(/<[^>]+>/g, '')   // Hapus HTML tags
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

// ─── clamp: Clamp angka antara min dan max ─────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
```

---

## 12. TASK 1.9 — Refactor src/app/layout.tsx

**Status: ❌ BELUM DILAKUKAN**

### 12.1 Masalah dengan layout.tsx Saat Ini

```typescript
// SEKARANG — Ada beberapa masalah:

// 1. Font loading via Google Fonts CDN di <link> tag
//    → Seharusnya pakai next/font/google untuk optimasi
// 2. Script untuk theme menggunakan inline script
//    → Sudah OK, ini diperlukan untuk mencegah FOUC (flash of unstyled content)
// 3. Metadata tidak lengkap (tidak ada OG, Twitter card)
// 4. ThemeProvider tidak di-wrap di sini
```

### 12.2 layout.tsx Target

```typescript
// src/app/layout.tsx — VERSI BARU
import type { Metadata } from 'next'
import { IBM_Plex_Mono, Bebas_Neue, DM_Serif_Display } from 'next/font/google'
import '@/styles/globals.css'

// Font optimization via next/font/google
// Keuntungan vs <link> CDN:
//   - Self-hosted (tidak ada external request)
//   - Tidak ada layout shift
//   - Automatic preload
//   - GDPR friendly (tidak kirim user ke Google)

const ibmPlexMono = IBM_Plex_Mono({
  weight:  ['400', '600', '700'],
  style:   ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  weight:  ['400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  weight:  ['400'],
  style:   ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — PRIYATNA',
    default:  'PRIYATNA — Design Search Engine',
  },
  description: 'Portfolio, Blog, Showcase, dan Creative Labs dari Priyatna. Design Search Engine.',
  keywords:    ['design', 'portfolio', 'UI/UX', 'design system', 'creative labs'],
  authors:     [{ name: 'Priyatna' }],
  openGraph: {
    type:      'website',
    locale:    'id_ID',
    url:       'https://priyatna-repository.github.io',
    siteName:  'PRIYATNA',
    title:     'PRIYATNA — Design Search Engine',
    description: 'Portfolio, Blog, Showcase, dan Creative Labs dari Priyatna.',
    images:    [{ url: '/assets/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:  'summary_large_image',
    title: 'PRIYATNA — Design Search Engine',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${ibmPlexMono.variable} ${bebasNeue.variable} ${dmSerifDisplay.variable}`}
    >
      <head>
        {/* Inline script untuk set theme SEBELUM React hydrate
            Ini WAJIB untuk mencegah "flash of wrong theme" (FOWT).
            Harus inline, tidak boleh jadi file eksternal. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = localStorage.getItem('priyatna-storage');
                var t = s ? JSON.parse(s)?.state?.theme : null;
                document.documentElement.setAttribute('data-theme', t || 'light');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### 12.3 Cara Update Font di globals.css

Setelah menggunakan `next/font`, hapus `@import` Google Fonts dari `globals.css` dan update body:

```css
/* HAPUS ini dari globals.css: */
/* @import url('https://fonts.googleapis.com/css2?family=...'); */

/* UPDATE ini di globals.css: */
body {
  /* Gunakan font variable dari next/font */
  font-family: var(--font-mono), var(--f-mono);
  /* --font-mono = dari next/font */
  /* var(--f-mono) = fallback jika next/font belum load */
}
```

---

## 13. TASK 1.10 — Buat src/app/(public)/layout.tsx

**Status: ❌ BELUM DILAKUKAN**

### 13.1 Mengapa Route Groups?

Route groups `(public)` dan `(admin)` memisahkan halaman berdasarkan konteks tanpa mempengaruhi URL.

Untuk sekarang (Fase 1-2), fungsi utamanya adalah menyiapkan struktur untuk Fase 4 (admin dashboard).

### 13.2 Migrasi PageClient ke Public Layout

Saat ini semua logic ada di `PageClient.tsx`. Target akhir:

```
app/layout.tsx              ← Root: HTML shell, fonts, metadata, theme script
app/(public)/layout.tsx     ← Public layout: Ticker, CustomCursor, LabsFab
app/(public)/page.tsx       ← Home page
```

**CATATAN:** Ini adalah refactor besar yang bisa dilakukan secara bertahap. Untuk Fase 1, cukup buat folder `(public)` dan pindahkan `page.tsx`:

```bash
mkdir -p src/app/\(public\)

# OPSI A: Pindahkan page.tsx ke dalam (public)
mv src/app/page.tsx src/app/\(public\)/page.tsx

# Buat layout.tsx untuk public pages
touch src/app/\(public\)/layout.tsx
```

### 13.3 Isi (public)/layout.tsx

```typescript
// src/app/(public)/layout.tsx
import CustomCursor from '@/components/layout/CustomCursor'
import Ticker from '@/components/ui/Ticker'
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
      <LabsFab />
      <LabsOverlay />
    </ThemeProvider>
  )
}
```

**Jika ini dilakukan**, maka `PageClient.tsx` perlu disederhanakan untuk hanya menangani search state dan render `HomeView`/`ResultsView`.

---

## 14. TASK 1.11 — Refactor Komponen Existing

**Status: ❌ BELUM DILAKUKAN**

### 14.1 LabsFab.tsx — Re-aktifkan dan Update

**Masalah:** LabsFab dikomentari di `PageClient.tsx`:
```tsx
{/* <LabsFab /> */}
```

**Penyebab komentarnya:** Kemungkinan karena konflik state atau belum di-update untuk uiStore.

**Langkah-langkah:**

1. Update `LabsFab.tsx` untuk menggunakan `uiStore`:
```typescript
// src/components/labs/LabsFab.tsx
'use client'

import { useUIStore } from '@/store/uiStore'

export default function LabsFab() {
  const openLabs = useUIStore((s) => s.openLabs)

  return (
    <button
      onClick={openLabs}
      aria-label="Buka Addon Labs"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 200,
        // ... styling lainnya
      }}
    >
      {/* ... isi button */}
    </button>
  )
}
```

2. Update `LabsOverlay.tsx` untuk menggunakan `uiStore` + tipe baru:
```typescript
import { useUIStore } from '@/store/uiStore'
import { getAllLabs } from '@/data/labs'
import type { LabItem } from '@/types'
```

3. Uncomment `<LabsFab />` di `PageClient.tsx`

### 14.2 CustomCursor.tsx — Verifikasi Touch Device Handling

```typescript
useEffect(() => {
  // Deteksi touch device - WAJIB untuk mobile
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.style.cursor = 'auto'  // Kembalikan cursor default
    return  // Jangan setup custom cursor
  }
  
  // ... setup cursor untuk desktop
}, [])
```

Pastikan logic ini ada dan berfungsi.

### 14.3 Tambahkan CSS Classes untuk CustomCursor

Tambahkan class `cursor-dot` dan `cursor-ring` ke element cursor:

```typescript
// src/components/layout/CustomCursor.tsx
return (
  <>
    <div
      ref={cursorRef}
      className="cursor-dot"  // ← Class untuk CSS hover selectors
      style={{
        position: 'fixed',
        // ...
      }}
    />
    <div
      ref={ringRef}
      className="cursor-ring"  // ← Class untuk CSS hover selectors
      style={{
        position: 'fixed',
        // ...
      }}
    />
  </>
)
```

Dan tambahkan CSS hover states di `globals.css` (lihat Task 1.4).

### 14.4 Buat src/app/not-found.tsx

```typescript
// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--paper)',
        color: 'var(--ink)',
        fontFamily: 'var(--f-mono)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 'clamp(80px, 15vw, 180px)',
          lineHeight: 1,
          color: 'var(--ink)',
        }}
      >
        404
      </div>
      <p style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'var(--muted)', marginTop: '1rem', letterSpacing: '0.1em' }}>
        HALAMAN INI TIDAK DITEMUKAN
      </p>
      <Link
        href="/"
        style={{
          marginTop: '2rem',
          fontSize: '10px',
          fontFamily: 'var(--f-mono)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          textDecoration: 'none',
        }}
      >
        ← Kembali ke Home
      </Link>
    </div>
  )
}
```

---

## 15. TASK 1.12 — Verifikasi Build & Deploy

**Status: ❌ BELUM DILAKUKAN — HARUS TERAKHIR**

### 15.1 Urutan Verifikasi

Lakukan setiap langkah ini secara berurutan. Jika satu langkah gagal, JANGAN lanjut ke berikutnya.

```bash
# Step 1: TypeScript check
npx tsc --noEmit
# Harus: 0 errors

# Step 2: ESLint check (setelah .eslintrc.json dibuat)
npm run lint
# Harus: 0 errors

# Step 3: Build production
npm run build
# Harus: berhasil, folder out/ ter-generate

# Step 4: Preview lokal
npx serve out
# Buka http://localhost:3000 dan test semua fitur

# Step 5: Jika semua OK, commit dan push ke develop
git add .
git commit -m "feat(phase1): complete foundation refactor"
git push origin develop

# Step 6: Merge ke main untuk deploy
git checkout main
git pull origin main
git merge develop --no-ff -m "release: phase 1 foundation complete"
git push origin main
# → GitHub Actions auto-deploy dimulai!

# Step 7: Pantau deploy
# Buka: github.com/Priyatna-repository/Priyatna-repository.github.io/actions
# Tunggu ~2-3 menit

# Step 8: Verify live site
# Buka: https://priyatna-repository.github.io
```

### 15.2 Test Checklist di Browser

Setelah deploy, test semua fitur berikut di browser:

```
□ Home page load tanpa error
□ Loader animation muncul dan selesai
□ Ticker berjalan di atas
□ Custom cursor mengikuti mouse (desktop)
□ Custom cursor TIDAK muncul di mobile (touch test)
□ Search box berfungsi (ketik sesuatu, enter)
□ Results view muncul setelah search
□ Kembali ke home (klik logo) berfungsi
□ Labs FAB button muncul di kanan bawah
□ Labs overlay terbuka saat klik FAB
□ Labs overlay tutup saat klik × atau backdrop
□ Labs overlay tutup saat tekan ESC
□ Theme toggle berfungsi (light/dark)
□ Theme tersimpan setelah refresh (localStorage)
□ Dark mode: semua elemen ter-style dengan benar
□ Suggestions muncul saat mengetik di search
□ Keyboard navigation di suggestions (↑↓)
□ Search history tersimpan setelah beberapa search
```

---

## 16. Checklist Penyelesaian Fase 1

Centang setiap item sebelum memulai Fase 2.

### ✅ Infrastruktur (Sudah Selesai)
- [x] `.gitignore` diperbaiki
- [x] `next.config.ts` dibuat untuk GitHub Pages
- [x] `.github/workflows/deploy.yml` dibuat
- [x] `.prettierrc` dibuat
- [x] `CLAUDE.md` dibuat
- [x] `docs/00-setup-proyek.md` dibuat
- [x] `docs/01-git-workflow-dan-cicd.md` dibuat

### 🔄 In Progress / Todo
- [ ] Tailwind CSS v4 diinstall (`npm install tailwindcss @tailwindcss/postcss`)
- [ ] `postcss.config.mjs` dibuat
- [ ] `globals.css` diupdate dengan `@import "tailwindcss"` dan `@theme {}`
- [ ] `src/types/index.ts` di-refactor ke versi lengkap
- [ ] `src/data/` di-split menjadi file-file terpisah
- [ ] `src/data/labs.ts` dibuat dengan `LabItem` interface baru
- [ ] `src/data/ticker.ts` dibuat
- [ ] `src/data/suggestions.ts` dibuat
- [ ] `src/data/results.ts` dibuat
- [ ] `src/data/shortcuts.ts` dibuat
- [ ] `src/data/pageStatuses.ts` dibuat
- [ ] `src/data/index.ts` di-update sebagai re-export
- [ ] `src/store/uiStore.ts` dibuat
- [ ] `src/store/searchStore.ts` di-refactor (hapus isLabsOpen)
- [ ] `src/lib/utils.ts` dibuat dengan `cn()`, `formatDate()`, `slugify()`
- [ ] `src/app/layout.tsx` di-refactor (next/font, metadata lengkap)
- [ ] `src/app/(public)/` folder dibuat
- [ ] `src/app/(public)/layout.tsx` dibuat
- [ ] `src/app/(public)/page.tsx` (pindahkan dari `src/app/page.tsx`)
- [ ] `LabsFab.tsx` diupdate ke `uiStore`
- [ ] `LabsOverlay.tsx` diupdate ke `uiStore` + tipe baru
- [ ] `<LabsFab />` di-uncomment di `PageClient.tsx`
- [ ] `CustomCursor.tsx` diverifikasi touch handling
- [ ] `src/app/not-found.tsx` dibuat
- [ ] `npm run build` berhasil tanpa error
- [ ] Site live dan semua fitur berfungsi di https://priyatna-repository.github.io

### ❌ Ditunda ke Fase Berikutnya
- [ ] ESLint config `.eslintrc.json` (bisa ditunda ke Fase 2)
- [ ] Husky + lint-staged (bisa ditunda ke Fase 2)
- [ ] `public/favicon.ico` (bisa ditunda ke Fase 2)
- [ ] `public/assets/images/og-default.jpg` (bisa ditunda ke Fase 2)

---

## 17. Ringkasan Perubahan File

Tabel ini merangkum semua file yang akan berubah di Fase 1:

| File | Action | Alasan |
|---|---|---|
| `.gitignore` | ✅ UPDATE | Hapus `docs/`, fix comment |
| `next.config.ts` | ✅ CREATE | Static export untuk GitHub Pages |
| `.prettierrc` | ✅ CREATE | Code formatting standar |
| `CLAUDE.md` | ✅ CREATE | Context untuk Claude Code |
| `.github/workflows/deploy.yml` | ✅ CREATE | CI/CD auto-deploy |
| `postcss.config.mjs` | ❌ CREATE | Diperlukan untuk Tailwind v4 |
| `src/styles/globals.css` | ❌ UPDATE | Tambah Tailwind import + @theme |
| `src/types/index.ts` | ❌ REWRITE | Interface lengkap & konsisten |
| `src/data/index.ts` | ❌ UPDATE | Jadi re-export (data dipindah ke file terpisah) |
| `src/data/labs.ts` | ❌ CREATE | Data labs dengan LabItem interface baru |
| `src/data/ticker.ts` | ❌ CREATE | Data ticker |
| `src/data/suggestions.ts` | ❌ CREATE | Data suggestions, chips, filter tabs |
| `src/data/results.ts` | ❌ CREATE | Data result cards, PAA |
| `src/data/shortcuts.ts` | ❌ CREATE | Data shortcut grid |
| `src/data/pageStatuses.ts` | ❌ CREATE | Status kontrol halaman publik |
| `src/store/searchStore.ts` | ❌ UPDATE | Hapus labs & UI state |
| `src/store/uiStore.ts` | ❌ CREATE | Labs open/close state |
| `src/lib/utils.ts` | ❌ CREATE | cn(), formatDate(), slugify() |
| `src/app/layout.tsx` | ❌ UPDATE | next/font, metadata lengkap |
| `src/app/(public)/layout.tsx` | ❌ CREATE | Public pages layout |
| `src/app/(public)/page.tsx` | ❌ CREATE/MOVE | Pindah dari `src/app/page.tsx` |
| `src/app/not-found.tsx` | ❌ CREATE | Custom 404 page |
| `src/components/labs/LabsFab.tsx` | ❌ UPDATE | Gunakan uiStore |
| `src/components/labs/LabsOverlay.tsx` | ❌ UPDATE | Gunakan uiStore + tipe baru |
| `src/components/layout/CustomCursor.tsx` | ❌ VERIFY | Touch device handling |
| `src/components/layout/PageClient.tsx` | ❌ UPDATE | Uncomment LabsFab, simplify |

---

**Fase 1 selesai → Milestone: Project berjalan dengan fondasi yang solid → Lanjut ke [Fase 2 — Public Pages Static Version](./pashe2.md)**

---

*Dokumen ini adalah source of truth untuk Fase 1. Setiap perubahan keputusan harus dicatat di sini sebelum diimplementasikan. Last updated: 2026-04-29*
