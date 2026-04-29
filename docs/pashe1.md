# FASE 1 — Refactor & Fondasi
## Priyatna Repository · Technical Documentation

> **Status:** Active Development  
> **Durasi:** 1–2 minggu  
> **Tujuan:** Merapikan codebase yang ada, menetapkan standar, dan membangun fondasi yang kuat sebelum fitur baru ditambahkan.  
> **Prasyarat:** Project Next.js 14+ sudah berjalan secara lokal.

---

## DAFTAR ISI

1. [Aturan Dasar & Prinsip](#1-aturan-dasar--prinsip)
2. [Struktur Folder — Spesifikasi Lengkap](#2-struktur-folder--spesifikasi-lengkap)
3. [Naming Convention & Coding Standards](#3-naming-convention--coding-standards)
4. [Setup Design System — Tailwind + CSS Variables](#4-setup-design-system--tailwind--css-variables)
5. [Setup Tooling — ESLint, Prettier, Husky](#5-setup-tooling--eslint-prettier-husky)
6. [Konversi Komponen Existing](#6-konversi-komponen-existing)
7. [Setup Data Layer (Static)](#7-setup-data-layer-static)
8. [Langkah-Langkah Eksekusi](#8-langkah-langkah-eksekusi)
9. [Checklist Penyelesaian Fase 1](#9-checklist-penyelesaian-fase-1)

---

## 1. Aturan Dasar & Prinsip

### 1.1 Filosofi Codebase

**Satu tanggung jawab per file.** Setiap file hanya melakukan satu hal. Komponen hanya merender UI, hooks hanya mengandung logika, store hanya mengandung state global.

**Co-location.** Data dan tipe yang digunakan oleh satu fitur disimpan dekat dengan fitur itu. Hanya data yang dipakai lintas-fitur yang masuk ke folder global (`src/data/`, `src/types/`).

**No magic.** Setiap konfigurasi dan keputusan harus bisa dijelaskan. Tambahkan komentar jika sebuah pattern tidak obvious.

**Static first.** Semua konten dimulai dari file statis (`src/data/index.ts`). Database akan menggantikan ini di Fase 3, tapi interface-nya harus sama agar tidak perlu refactor besar.

### 1.2 Aturan yang Tidak Boleh Dilanggar

```
❌ JANGAN pernah menaruh komponen di dalam folder app/
❌ JANGAN import langsung dari node_modules di komponen — selalu lewat abstraksi lib/
❌ JANGAN gunakan `any` di TypeScript — gunakan `unknown` jika tidak yakin tipenya
❌ JANGAN commit file: .env, tsconfig.tsbuildinfo, .next/, node_modules/
❌ JANGAN gunakan inline style di JSX kecuali untuk nilai dinamis (misalnya animation-delay)
❌ JANGAN hardcode warna atau ukuran font — selalu gunakan token dari Tailwind config
✅ SELALU gunakan path alias @/ untuk import
✅ SELALU definisikan tipe TypeScript untuk semua props komponen
✅ SELALU export named (bukan default) untuk utility functions dan types
✅ SELALU export default untuk komponen React
```

---

## 2. Struktur Folder — Spesifikasi Lengkap

### 2.1 Gambaran Umum

```
priyatna-repository.github.io/
├── public/
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/          ← jika self-host font
├── src/
│   ├── app/                ← Next.js App Router ONLY
│   ├── components/         ← semua komponen React
│   ├── providers/          ← React context providers
│   ├── hooks/              ← custom hooks
│   ├── lib/                ← utilities & config eksternal
│   ├── store/              ← Zustand global state
│   ├── data/               ← static data (sementara, sebelum DB)
│   ├── styles/             ← global CSS
│   └── types/              ← TypeScript type definitions
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 2.2 Folder `public/` — Aturan

```
public/
└── assets/
    ├── images/
    │   ├── home.jpg              ← (pindah dari root public/)
    │   └── og-default.jpg        ← Open Graph default image
    └── icons/
        ├── logo2-removebg-preview.png   ← (pindah dari assets/)
        └── tit-logo.png                 ← (pindah dari assets/)
```

**Aturan `public/`:**
- Semua file gambar HARUS masuk ke `public/assets/images/`
- Semua file ikon HARUS masuk ke `public/assets/icons/`
- Tidak boleh ada file langsung di root `public/` (kecuali `favicon.ico`, `robots.txt`, `sitemap.xml`)
- Nama file menggunakan `kebab-case` seluruhnya (lowercase, pisah dengan tanda hubung)
- Contoh penamaan benar: `hero-background.jpg`, `logo-main.png`, `og-image-default.jpg`

### 2.3 Folder `src/app/` — Aturan

```
src/app/
├── (public)/                     ← Route group: halaman publik
│   ├── layout.tsx                ← Layout publik (header, footer, cursor, ticker)
│   ├── page.tsx                  ← Home: search hub
│   ├── blog/
│   │   ├── page.tsx              ← Blog list
│   │   └── [slug]/
│   │       └── page.tsx          ← Blog detail
│   ├── showcase/
│   │   ├── page.tsx              ← Showcase grid
│   │   └── [slug]/
│   │       └── page.tsx          ← Showcase detail
│   └── labs/
│       ├── page.tsx              ← Labs grid
│       └── [slug]/
│           └── page.tsx          ← Lab individual (full workspace)
│
├── (admin)/                      ← Route group: admin (Fase 4)
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── dashboard/
│       └── ...
│
├── api/                          ← API Routes (Fase 3)
│   └── ...
│
├── layout.tsx                    ← Root layout (html, body, fonts, metadata)
├── not-found.tsx                 ← 404 page
└── error.tsx                     ← Error boundary
```

**Aturan `app/`:**
- Hanya boleh berisi file routing Next.js: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`
- **DILARANG** menaruh komponen React biasa di sini — semua komponen masuk ke `src/components/`
- Route groups `(public)` dan `(admin)` tidak memengaruhi URL, hanya untuk organisasi
- Setiap `page.tsx` harus sesedikit mungkin — hanya import dan render komponen dari `components/`

**Contoh page.tsx yang benar:**
```tsx
// src/app/(public)/page.tsx
import { PageClient } from '@/components/layout/PageClient'

export default function HomePage() {
  return <PageClient />
}
```

**Contoh page.tsx yang salah:**
```tsx
// ❌ JANGAN LAKUKAN INI
export default function HomePage() {
  return (
    <div>
      {/* 200 baris JSX langsung di sini */}
    </div>
  )
}
```

### 2.4 Folder `src/components/` — Aturan

```
src/components/
├── ui/                           ← Komponen generik, reusable, tidak tahu konteks bisnis
│   ├── Loader.tsx
│   ├── Ticker.tsx
│   ├── ThemeToggle.tsx
│   ├── StatusBadge.tsx           ← NEW
│   ├── ImageComparison.tsx       ← pindah dari core/
│   └── Tabs.tsx                  ← pindah dari core/
│
├── layout/                       ← Komponen struktural halaman
│   ├── PageClient.tsx            ← pindah dari app/
│   ├── HomeView.tsx
│   ├── ResultsView.tsx
│   └── CustomCursor.tsx
│
└── labs/                         ← Komponen khusus fitur Labs
    ├── LabsFab.tsx
    └── LabsOverlay.tsx
```

**Aturan `components/`:**

- `ui/` berisi komponen yang tidak tahu tentang bisnis/domain. Tidak boleh import dari `data/` atau `store/`. Menerima semua yang dibutuhkan lewat props.
- `layout/` berisi komponen yang membentuk struktur halaman. Boleh menggunakan store Zustand dan data.
- `labs/` berisi komponen yang spesifik untuk fitur Labs. Boleh import dari data labs.
- Satu file = satu komponen utama. Subcomponen kecil boleh ada dalam file yang sama jika tidak dipakai di tempat lain.
- Semua nama file komponen menggunakan `PascalCase.tsx`

### 2.5 Folder `src/providers/` — Aturan

```
src/providers/
└── ThemeProvider.tsx             ← pindah dari components/
```

**Alasan dipisah:** Provider adalah "wrapper" React context, bukan komponen yang merender UI. Memisahkannya mencegah kebingungan.

**Aturan `providers/`:**
- Hanya berisi React Context providers
- Nama file: `[Nama]Provider.tsx`
- Harus diimport di `app/layout.tsx`, bukan di komponen individual

### 2.6 Folder `src/hooks/` — Aturan

```
src/hooks/
├── useSearch.ts                  ← logika search (extract dari komponen)
├── useTheme.ts                   ← akses theme context
├── useLabsStatus.ts              ← baca status labs
└── useCounter.ts                 ← animasi counter (extract dari loader)
```

**Aturan `hooks/`:**
- Semua file dimulai dengan `use` (lowercase)
- Hanya boleh berisi React hooks (useState, useEffect, custom hooks)
- Tidak boleh merender JSX — hanya return data atau fungsi
- Nama file: `use[NamaHook].ts` (bukan .tsx karena tidak ada JSX)

### 2.7 Folder `src/lib/` — Aturan

```
src/lib/
├── auth.ts                       ← Auth.js config (Fase 4)
├── db.ts                         ← Prisma client (Fase 3)
├── utils.ts                      ← helper functions umum
└── validators.ts                 ← Zod schemas (Fase 3)
```

**Aturan `lib/`:**
- Berisi konfigurasi library eksternal dan utility functions murni
- Tidak boleh berisi komponen React atau hooks
- `utils.ts` hanya untuk fungsi yang benar-benar generic (formatDate, cn/classnames, dll)
- Setiap fungsi di `utils.ts` harus bisa di-test tanpa React

**Contoh `utils.ts`:**
```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes dengan aman
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format tanggal ke format "Jan 2026"
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

// Buat slug dari string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### 2.8 Folder `src/store/` — Aturan

```
src/store/
├── searchStore.ts                ← sudah ada, tetap di sini
└── uiStore.ts                    ← NEW: state UI global (modal, overlay)
```

**Aturan `store/`:**
- Hanya boleh menggunakan Zustand
- Satu store per domain/fitur
- Nama file: `[domain]Store.ts`
- Tidak boleh ada business logic kompleks — hanya state dan simple actions

### 2.9 Folder `src/data/` — Aturan

```
src/data/
├── index.ts                      ← re-export semua data
├── labs.ts                       ← data labs (status, nama, deskripsi)
├── ticker.ts                     ← data ticker items
├── shortcuts.ts                  ← data shortcut chips di home
└── suggestions.ts                ← data search suggestions
```

**Aturan `src/data/`:**
- Ini adalah "database sementara" — data statis yang akan diganti dengan fetch dari API di Fase 3
- Semua data HARUS menggunakan tipe dari `src/types/index.ts`
- Interface data harus identik dengan yang akan dikembalikan oleh API nanti
- Ini adalah satu-satunya tempat hardcoded content boleh ada

### 2.10 Folder `src/types/` — Aturan

```
src/types/
└── index.ts                      ← semua type definitions
```

**Aturan `types/`:**
- Semua TypeScript interface dan type ada di sini
- Export semuanya sebagai named export
- Kelompokkan dengan komentar yang jelas

---

## 3. Naming Convention & Coding Standards

### 3.1 Penamaan File

| Jenis File | Convention | Contoh |
|---|---|---|
| Komponen React | PascalCase.tsx | `HomeView.tsx`, `LabsOverlay.tsx` |
| Custom Hook | camelCase.ts | `useSearch.ts`, `useTheme.ts` |
| Utility/Lib | camelCase.ts | `utils.ts`, `validators.ts` |
| Store Zustand | camelCase.ts | `searchStore.ts`, `uiStore.ts` |
| Data statis | camelCase.ts | `labs.ts`, `ticker.ts` |
| Type definitions | index.ts | selalu `index.ts` di folder types/ |
| Next.js routing | lowercase | `page.tsx`, `layout.tsx`, `route.ts` |
| CSS | camelCase.css | `globals.css` |

### 3.2 Penamaan di Dalam File

```ts
// ✅ BENAR

// Komponen: PascalCase
export default function HomeView() {}

// Props interface: NamaKomponenProps
interface HomeViewProps {
  initialQuery?: string
}

// Variabel & fungsi: camelCase
const searchQuery = ''
function handleSearch() {}

// Konstanta global: SCREAMING_SNAKE_CASE
const MAX_RESULTS = 247
const TICKER_SPEED = 30

// Tipe & Interface: PascalCase
interface LabItem {}
type LabStatus = 'live' | 'beta' | 'upcoming' | 'soon' | 'deprecated'

// Enum: PascalCase dengan nilai PascalCase
enum PageStatus {
  Active = 'active',
  Maintenance = 'maintenance',
  Upcoming = 'upcoming',
}
```

### 3.3 Struktur File Komponen

Setiap file komponen harus mengikuti urutan ini:

```tsx
// 1. Imports — urutan: react → next → external libs → internal (@/) → relative (./)
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSearch } from '@/hooks/useSearch'
import type { LabItem } from '@/types'

// 2. Type/Interface definitions (jika spesifik untuk file ini)
interface LabCardProps {
  item: LabItem
  className?: string
}

// 3. Subcomponen kecil (jika tidak dipakai di luar file ini)
function LabStatusBadge({ status }: { status: LabItem['status'] }) {
  // ...
}

// 4. Komponen utama — selalu default export
export default function LabCard({ item, className }: LabCardProps) {
  // 4a. Hooks dulu
  const [isHovered, setIsHovered] = useState(false)
  
  // 4b. Derived values / computed
  const statusLabel = item.status.toUpperCase()
  
  // 4c. Effects
  useEffect(() => {}, [])
  
  // 4d. Event handlers
  function handleClick() {}
  
  // 4e. Return JSX
  return (
    <div className={cn('lab-card', className)}>
      {/* ... */}
    </div>
  )
}
```

### 3.4 Import Rules

Selalu gunakan path alias `@/` untuk import internal. Tidak boleh menggunakan relative path yang naik level (`../../`):

```ts
// ✅ BENAR
import { cn } from '@/lib/utils'
import HomeView from '@/components/layout/HomeView'
import type { LabItem } from '@/types'

// ❌ SALAH
import { cn } from '../../lib/utils'
import HomeView from '../components/layout/HomeView'
```

---

## 4. Setup Design System — Tailwind + CSS Variables

### 4.1 Filosofi Design System

Semua nilai visual dari referensi HTML (`index.html`) harus dikonversi menjadi **Tailwind tokens**. Ini memastikan konsistensi di seluruh codebase dan tidak ada nilai magic yang tersebar.

Aturan ketat:
- **Tidak boleh menulis warna hex langsung** di className Tailwind — gunakan token
- **Tidak boleh menulis px values** yang tidak ada di Tailwind scale — extend config jika perlu
- CSS Variables di `:root` tetap dipertahankan di `globals.css` untuk kompatibilitas dengan CSS murni

### 4.2 `tailwind.config.ts` — Konfigurasi Lengkap

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      // ─── COLORS ───
      // Sumber: CSS variables di referensi index.html
      colors: {
        ink:     '#0a0a0a',   // --ink: warna teks & background dark
        paper: {
          DEFAULT: '#f5f2ec', // --paper: background utama
          2:       '#ede9e0', // --paper2: hover state
          3:       '#e4dfd3', // --paper3: pressed / active state
        },
        accent: {
          DEFAULT: '#ff3b00', // --accent: merah — primary action, CTA
          2:       '#0047ff', // --accent2: biru — links, judul card
          3:       '#00c853', // --accent3: hijau — success, live status
          4:       '#ffd600', // --accent4: kuning — warning, beta status
        },
        muted: {
          DEFAULT: '#7a7060', // --muted: secondary text
          2:       '#b0a898', // --muted2: placeholder, disabled
        },
        border: {
          DEFAULT: '#2a2a2a',             // --border: border gelap
          light:   'rgba(10,10,10,0.12)', // --border-light: border halus
        },
        // Warna lab cards (dari referensi)
        lab: {
          red:    '#ff3b00',
          blue:   '#0047ff',
          green:  '#00c853',
          yellow: '#ffd600',
          purple: '#a855f7',
          orange: '#f97316',
        },
      },
      
      // ─── FONTS ───
      // Sumber: Google Fonts di head referensi HTML
      fontFamily: {
        mono:    ['IBM Plex Mono', 'monospace'],    // --f-mono: body text
        display: ['Bebas Neue', 'cursive'],          // --f-display: heading besar
        serif:   ['DM Serif Display', 'serif'],      // --f-serif: italic accent
      },
      
      // ─── SPACING ───
      // Nilai khusus yang tidak ada di Tailwind default
      spacing: {
        '30':  '30px',   // tinggi ticker strip
        '7.5': '30px',   // alias
      },
      
      // ─── BORDER RADIUS ───
      // Referensi menggunakan --radius: 2px (hampir tidak ada radius)
      borderRadius: {
        none:    '0px',
        minimal: '2px',  // --radius dari referensi
      },
      
      // ─── FONT SIZE ───
      // Nilai kecil yang sering dipakai di referensi
      fontSize: {
        '2xs': ['8px',  { lineHeight: '1.5' }],
        'xs':  ['9px',  { lineHeight: '1.5' }],
        'sm':  ['10px', { lineHeight: '1.6' }],
        'base':['11px', { lineHeight: '1.7' }],
        'md':  ['12px', { lineHeight: '1.8' }],
        'lg':  ['13px', { lineHeight: '1.6' }],
        'xl':  ['16px', { lineHeight: '1.5' }],
      },
      
      // ─── LETTER SPACING ───
      letterSpacing: {
        'tightest': '-0.02em',
        'tight':    '-0.01em',
        'normal':   '0',
        'wide':     '0.03em',
        'wider':    '0.05em',
        'widest':   '0.08em',
        'ultra':    '0.12em',
        'extreme':  '0.15em',
        'max':      '0.2em',
      },
      
      // ─── ANIMATION ───
      // Dari CSS referensi
      transitionTimingFunction: {
        'priyatna': 'cubic-bezier(0.23, 1, 0.32, 1)', // --transition
      },
      
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(110%)' },
          to:   { transform: 'translateY(0)' },
        },
        'wipe-in': {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to:   { clipPath: 'inset(0 0% 0 0)' },
        },
        'fade-slide': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'card-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'fab-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'ticker-run': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        'orb-float': {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)' },
          '50%':      { transform: 'scale(1.1) translate(5px, -5px)' },
        },
        'drop-in': {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(20px)' },
          to:   { opacity: '1', transform: 'none' },
        },
      },
      
      animation: {
        'slide-up':   'slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1) both',
        'wipe-in':    'wipe-in 0.7s cubic-bezier(0.23, 1, 0.32, 1) both',
        'fade-slide': 'fade-slide 0.6s cubic-bezier(0.23, 1, 0.32, 1) both',
        'card-in':    'card-in 0.4s cubic-bezier(0.23, 1, 0.32, 1) both',
        'fab-in':     'fab-in 0.8s 1.5s cubic-bezier(0.23, 1, 0.32, 1) both',
        'ticker':     'ticker-run 30s linear infinite',
        'pulse':      'pulse 1.5s ease-in-out infinite',
        'orb-float':  'orb-float 5s ease-in-out infinite',
        'drop-in':    'drop-in 0.15s ease',
        'modal-in':   'modal-in 0.35s cubic-bezier(0.23, 1, 0.32, 1) both',
      },
    },
  },
  plugins: [],
}

export default config
```

### 4.3 `globals.css` — Struktur Lengkap

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── CSS VARIABLES ─── */
/* Dipertahankan untuk kompatibilitas dengan CSS murni & animasi kompleks */
:root {
  --ink:          #0a0a0a;
  --paper:        #f5f2ec;
  --paper2:       #ede9e0;
  --paper3:       #e4dfd3;
  --accent:       #ff3b00;
  --accent2:      #0047ff;
  --accent3:      #00c853;
  --accent4:      #ffd600;
  --muted:        #7a7060;
  --muted2:       #b0a898;
  --border:       #2a2a2a;
  --border-light: rgba(10, 10, 10, 0.12);
  --f-mono:       'IBM Plex Mono', monospace;
  --f-display:    'Bebas Neue', cursive;
  --f-serif:      'DM Serif Display', serif;
  --radius:       2px;
  --transition:   cubic-bezier(0.23, 1, 0.32, 1);
}

/* ─── BASE RESET ─── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  scroll-behavior: smooth;
}

body {
  font-family: var(--f-mono);
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  overflow-x: hidden;
  cursor: none; /* custom cursor aktif */
}

/* ─── NOISE TEXTURE ─── */
/* Texture overlay dari referensi — tidak bisa dibuat dengan Tailwind */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: var(--paper);
}

::-webkit-scrollbar-thumb {
  background: var(--muted2);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--muted);
}

/* ─── SELECTION ─── */
::selection {
  background: var(--accent);
  color: var(--paper);
}

/* ─── FOCUS VISIBLE ─── */
/* Untuk accessibility — muncul saat navigasi keyboard */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ─── UTILITY LAYER ─── */
@layer utilities {
  /* Cursor custom — semua elemen interaktif */
  .cursor-custom {
    cursor: none;
  }

  /* Font display shorthand */
  .font-display {
    font-family: var(--f-display);
  }
  
  .font-serif {
    font-family: var(--f-serif);
  }

  /* Mix blend mode untuk cursor */
  .blend-multiply {
    mix-blend-mode: multiply;
  }
  
  /* Hide scrollbar tapi tetap bisa scroll */
  .scrollbar-none {
    scrollbar-width: none;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
}
```

### 4.4 Font Setup di `app/layout.tsx`

```tsx
// src/app/layout.tsx
import { IBM_Plex_Mono, Bebas_Neue, DM_Serif_Display } from 'next/font/google'
import type { Metadata } from 'next'
import '@/styles/globals.css'

// Setup font dengan Next.js Font Optimization
const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — PRIYATNA',
    default: 'PRIYATNA — Design Search Engine',
  },
  description: 'Portfolio, Blog, Showcase, dan Labs dari Priyatna.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://priyatna-repository.github.io',
    siteName: 'PRIYATNA',
    images: [{ url: '/assets/images/og-default.jpg' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${ibmPlexMono.variable} ${bebasNeue.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="font-mono bg-paper text-ink min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
```

---

## 5. Setup Tooling — ESLint, Prettier, Husky

### 5.1 Package yang Perlu Diinstall

```bash
# Prettier
npm install -D prettier prettier-plugin-tailwindcss

# ESLint plugins tambahan
npm install -D eslint-plugin-import @typescript-eslint/eslint-plugin

# Husky + lint-staged
npm install -D husky lint-staged

# Utility
npm install clsx tailwind-merge
```

### 5.2 `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    // TypeScript
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    
    // React
    "react/self-closing-comp": "error",
    "react/jsx-no-useless-fragment": "warn",
    
    // Import
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["../../*"],
            "message": "Gunakan path alias @/ untuk import. Jangan naik lebih dari 1 level."
          }
        ]
      }
    ]
  }
}
```

### 5.3 `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 90,
  "bracketSpacing": true,
  "arrowParens": "always",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.ts"
}
```

> `prettier-plugin-tailwindcss` akan otomatis mengurutkan className Tailwind sesuai urutan yang direkomendasikan.

### 5.4 Setup Husky

```bash
# Inisialisasi Husky
npx husky init

# Buat pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

### 5.5 `package.json` — Tambahkan Konfigurasi lint-staged

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

### 5.6 `.gitignore` — Update

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# TypeScript build cache
tsconfig.tsbuildinfo        ← TAMBAHKAN INI

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
```

### 5.7 `tsconfig.json` — Setup Path Alias

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]        ← path alias utama
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 6. Konversi Komponen Existing

Bagian ini menjelaskan cara mengkonversi setiap komponen dari referensi HTML ke React/Next.js dengan mengikuti semua aturan yang sudah ditetapkan.

### 6.1 `CustomCursor.tsx`

**Lokasi:** `src/components/layout/CustomCursor.tsx`  
**Sumber dari referensi:** `#cursor` dan `#cursor-ring` + script animasi cursor

**Aturan komponen ini:**
- Harus `'use client'` karena menggunakan `mousemove` event
- Harus disabled di touch devices (mobile tidak punya hover)
- Harus `position: fixed` dan `pointer-events: none` agar tidak menghalangi klik
- Smooth lag pada ring dibuat dengan `requestAnimationFrame`

```tsx
// src/components/layout/CustomCursor.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const ringPos  = useRef({ x: 0, y: 0 })
  const mouse    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Jangan tampilkan di touch device
    if ('ontouchstart' in window) return

    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    function onMouseMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY }
      cursor!.style.left = e.clientX + 'px'
      cursor!.style.top  = e.clientY + 'px'
    }

    function animateRing() {
      // Lag effect: ring mengikuti mouse dengan delay
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12
      ring!.style.left = ringPos.current.x + 'px'
      ring!.style.top  = ringPos.current.y + 'px'
      requestAnimationFrame(animateRing)
    }

    document.addEventListener('mousemove', onMouseMove)
    const rafId = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Dot kecil — mengikuti mouse tepat */}
      <div
        ref={cursorRef}
        className="
          fixed z-[9999] pointer-events-none
          w-3 h-3 rounded-full bg-accent
          -translate-x-1/2 -translate-y-1/2
          transition-[width,height,background] duration-200
          blend-multiply
          cursor-dot
        "
      />
      {/* Ring besar — lag mengikuti mouse */}
      <div
        ref={ringRef}
        className="
          fixed z-[9998] pointer-events-none
          w-10 h-10 rounded-full border border-ink
          -translate-x-1/2 -translate-y-1/2
          opacity-40
          cursor-ring
        "
      />
    </>
  )
}
```

Tambahkan CSS untuk hover state ke `globals.css` (karena Tailwind tidak bisa handle `:has()` selector):

```css
/* Di globals.css — Cursor hover states */
body:has(a:hover) .cursor-dot,
body:has(button:hover) .cursor-dot {
  width: 20px;
  height: 20px;
  background: var(--accent2);
}

body:has(a:hover) .cursor-ring,
body:has(button:hover) .cursor-ring {
  width: 60px;
  height: 60px;
  opacity: 0.15;
}
```

### 6.2 `Ticker.tsx`

**Lokasi:** `src/components/ui/Ticker.tsx`  
**Sumber dari referensi:** `.ticker-wrap`, `.ticker-track`, ticker items

**Aturan:**
- Data ticker harus datang dari props atau dari `src/data/ticker.ts` (bukan hardcoded di dalam komponen)
- Pause on hover behavior
- Item digandakan 2x untuk efek infinite loop seamless

```tsx
// src/components/ui/Ticker.tsx
'use client'

import { useRef } from 'react'
import { TICKER_ITEMS } from '@/data/ticker'

export default function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null)

  function pauseTicker()  {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }
  function resumeTicker() {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  // Duplikasi item untuk infinite loop seamless
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] bg-ink border-b border-border h-[30px] overflow-hidden"
      onMouseEnter={pauseTicker}
      onMouseLeave={resumeTicker}
    >
      <div
        ref={trackRef}
        className="flex h-full items-center w-max animate-ticker"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-8 whitespace-nowrap"
          >
            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-paper2">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 6.3 `Loader.tsx`

**Lokasi:** `src/components/ui/Loader.tsx`  
**Sumber dari referensi:** `#loader` + script counter

**Aturan:**
- Harus `'use client'`
- Logic counter di-extract ke hook `useCounter.ts`
- Menerima callback `onComplete` untuk memberi tahu parent saat loading selesai

```tsx
// src/components/ui/Loader.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface LoaderProps {
  onComplete?: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState(false)
  const letters = ['P','R','I','Y','A','T','N','A']

  useEffect(() => {
    let current = 0
    const timer = setInterval(() => {
      current += Math.random() * 8 + 2
      if (current > 100) current = 100
      setPct(Math.floor(current))

      if (current >= 100) {
        clearInterval(timer)
        setTimeout(() => {
          setHidden(true)
          onComplete?.()
        }, 300)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [onComplete])

  if (hidden) return null

  return (
    <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center z-[10000] transition-opacity duration-[800ms]">
      {/* Logo dengan slide-up per huruf */}
      <div className="font-display text-paper overflow-hidden leading-none"
           style={{ fontSize: 'clamp(60px, 12vw, 140px)' }}>
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block animate-slide-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Counter */}
      <div className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-muted2 mt-6">
        LOADING &nbsp;
        <span>{String(pct).padStart(3, '0')}</span>%
      </div>

      {/* Progress bar */}
      <div className="w-[200px] h-px bg-white/10 mt-5 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-accent transition-all duration-[2s]"
          style={{ width: `${pct}%`, transitionTimingFunction: 'var(--transition)' }}
        />
      </div>

      {/* Tag pojok kanan bawah */}
      <div className="absolute bottom-8 right-8 text-[9px] tracking-[0.15em] text-muted2 uppercase">
        Design Search Engine · Est. 2026
      </div>
    </div>
  )
}
```

### 6.4 `LabsFab.tsx` + `LabsOverlay.tsx`

**Aturan:**
- State `isOpen` dikelola di `uiStore.ts` (Zustand) agar bisa diakses dari shortcut grid di Home
- Data labs datang dari `src/data/labs.ts`

```tsx
// src/components/labs/LabsFab.tsx
'use client'

import { useUIStore } from '@/store/uiStore'

export default function LabsFab() {
  const openLabs = useUIStore((s) => s.openLabs)

  return (
    <button
      onClick={openLabs}
      className="
        fixed bottom-8 right-8 z-[200] bg-ink
        border border-accent3 px-5 py-3
        flex items-center gap-2.5
        transition-all duration-300
        hover:bg-accent3
        group
        animate-fab-in
        cursor-custom
      "
    >
      {/* Pulsing dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-accent3 animate-pulse flex-shrink-0" />
      
      {/* Icon */}
      <span className="text-base text-accent3 transition-colors group-hover:text-ink">
        ⬡
      </span>
      
      {/* Label */}
      <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-accent3 transition-colors group-hover:text-ink">
        Addon Labs
      </span>
    </button>
  )
}
```

---

## 7. Setup Data Layer (Static)

### 7.1 `src/types/index.ts` — Semua Type Definitions

```ts
// src/types/index.ts

// ─── STATUS TYPES ───
export type LabStatus    = 'live' | 'beta' | 'upcoming' | 'soon' | 'deprecated'
export type PageStatus   = 'active' | 'maintenance' | 'upcoming'
export type PostStatus   = 'draft' | 'published' | 'archived'

// ─── LAB TYPES ───
export type LabColorTheme = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'

export interface LabItem {
  id:          string
  name:        string
  slug:        string
  description: string
  icon:        string          // emoji atau simbol
  colorTheme:  LabColorTheme
  version:     string          // format: "v1.2.3"
  status:      LabStatus
  url?:        string          // link ke halaman lab jika ada
  order:       number
}

// ─── TICKER TYPES ───
export type TickerDotColor = 'red' | 'blue' | 'green' | 'yellow'

export interface TickerItem {
  text:  string
  color: string   // hex color
}

// ─── SEARCH TYPES ───
export type SuggestionCategory = 'design' | 'lab' | 'brand' | 'motion'

export interface SearchSuggestion {
  text:     string
  category: SuggestionCategory
  query:    string
}

// ─── SHORTCUT TYPES ───
export interface ShortcutItem {
  label:  string
  icon:   string
  action: 'search' | 'labs' | 'link'
  value:  string    // search query atau URL
}

// ─── BLOG TYPES ───
export interface Post {
  id:          string
  title:       string
  slug:        string
  excerpt?:    string
  content:     string
  coverImage?: string
  tags:        string[]
  status:      PostStatus
  publishedAt?: string
  createdAt:   string
}

// ─── PROJECT TYPES ───
export interface Project {
  id:          string
  title:       string
  slug:        string
  description: string
  thumbnail?:  string
  demoUrl?:    string
  repoUrl?:    string
  techStack:   string[]
  category:    string
  featured:    boolean
  order:       number
  status:      PageStatus
}
```

### 7.2 `src/data/labs.ts`

```ts
// src/data/labs.ts
import type { LabItem } from '@/types'

export const LABS_DATA: LabItem[] = [
  {
    id:          'motion-studio',
    name:        'Motion Studio',
    slug:        'motion-studio',
    description: 'Full timeline animation editor dengan spring physics engine, easing curve library, dan keyframe sequencer.',
    icon:        '⬡',
    colorTheme:  'red',
    version:     'v1.4.2',
    status:      'live',
    url:         '/labs/motion-studio',
    order:       1,
  },
  {
    id:          'pattern-forge',
    name:        'Pattern Forge',
    slug:        'pattern-forge',
    description: 'Parametric pattern generator. Truchet tiles, Penrose tessellations, Voronoi cells, custom grids.',
    icon:        '◈',
    colorTheme:  'blue',
    version:     'v2.0.1',
    status:      'live',
    url:         '/labs/pattern-forge',
    order:       2,
  },
  {
    id:          'color-oracle',
    name:        'Color Oracle',
    slug:        'color-oracle',
    description: 'AI palette architecture engine. Brief → semantic color system dengan dark mode, WCAG compliance, brand personality, dan token output.',
    icon:        '✦',
    colorTheme:  'green',
    version:     'v0.8.0',
    status:      'beta',
    url:         '/labs/color-oracle',
    order:       3,
  },
  {
    id:          'type-foundry',
    name:        'Type Foundry',
    slug:        'type-foundry',
    description: 'Variable typeface builder dan type scale generator. Optical size tuning, baseline grid alignment.',
    icon:        '⟐',
    colorTheme:  'yellow',
    version:     'v1.1.0',
    status:      'live',
    url:         '/labs/type-foundry',
    order:       4,
  },
  {
    id:          'grid-architect',
    name:        'Grid Architect',
    slug:        'grid-architect',
    description: 'Spatial grid system builder. Define column grids, baseline rhythms, dan component spacing tokens.',
    icon:        '⊕',
    colorTheme:  'purple',
    version:     'v0.5.3',
    status:      'beta',
    url:         '/labs/grid-architect',
    order:       5,
  },
  {
    id:          'icon-atelier',
    name:        'Icon Atelier',
    slug:        'icon-atelier',
    description: 'Bespoke icon set generator. Draw with constraints, auto-generate filled/outlined/duotone variants.',
    icon:        '◎',
    colorTheme:  'orange',
    version:     'v0.1.0',
    status:      'upcoming',
    order:       6,
  },
]
```

### 7.3 `src/data/ticker.ts`

```ts
// src/data/ticker.ts
import type { TickerItem } from '@/types'

export const TICKER_ITEMS: TickerItem[] = [
  { text: 'PRIYATNA DESIGN SYSTEM v4.2',        color: '#ff3b00' },
  { text: '247 PROJECTS · 34 COUNTRIES',         color: '#0047ff' },
  { text: 'ADDON LABS NOW OPEN · 6 TOOLS ACTIVE', color: '#00c853' },
  { text: 'MOTION STUDIO BETA → TRY IT NOW',     color: '#ffd600' },
  { text: 'AWWWARDS SITE OF THE DAY 2024',       color: '#ff3b00' },
  { text: 'NEW: COLOR ORACLE AI PALETTE GEN',    color: '#0047ff' },
]
```

### 7.4 `src/data/index.ts` — Re-export

```ts
// src/data/index.ts
export * from './labs'
export * from './ticker'
export * from './suggestions'
export * from './shortcuts'
```

---

## 8. Langkah-Langkah Eksekusi

Ikuti langkah ini secara berurutan. Setiap langkah harus selesai dan berjalan sebelum lanjut ke langkah berikutnya.

### STEP 1 — Buat Folder Baru
```bash
# Dari root project
mkdir -p src/providers
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/labs
mkdir -p src/components/admin
mkdir -p src/data
mkdir -p public/assets/images
mkdir -p public/assets/icons
```

### STEP 2 — Pindahkan File yang Ada

```bash
# Pindah komponen yang salah lokasi
mv src/app/PageClient.tsx src/components/layout/PageClient.tsx
mv src/components/ThemeProvider.tsx src/providers/ThemeProvider.tsx
mv src/core/ImageComparison.tsx src/components/ui/ImageComparison.tsx
mv src/core/Tabs.tsx src/components/ui/Tabs.tsx

# Pindah komponen ke subfolder yang benar
mv src/components/CustomCursor.tsx src/components/layout/CustomCursor.tsx
mv src/components/HomeView.tsx src/components/layout/HomeView.tsx
mv src/components/ResultsView.tsx src/components/layout/ResultsView.tsx
mv src/components/LabsFab.tsx src/components/labs/LabsFab.tsx
mv src/components/LabsOverlay.tsx src/components/labs/LabsOverlay.tsx
mv src/components/Loader.tsx src/components/ui/Loader.tsx
mv src/components/Ticker.tsx src/components/ui/Ticker.tsx
mv src/components/ThemeToggle.tsx src/components/ui/ThemeToggle.tsx

# Pindah aset
mv public/home.jpg public/assets/images/home.jpg
mv public/assets/logo2-removebg-preview.png public/assets/icons/logo2.png
mv public/assets/tit-logo.png public/assets/icons/tit-logo.png

# Hapus folder yang tidak dipakai
rmdir src/core
```

### STEP 3 — Update Semua Import

Setelah memindahkan file, semua import yang merujuk path lama harus diupdate. Contoh:

```ts
// Sebelum
import ThemeProvider from '../components/ThemeProvider'
import PageClient from './PageClient'

// Sesudah
import ThemeProvider from '@/providers/ThemeProvider'
import PageClient from '@/components/layout/PageClient'
```

Gunakan fitur Find & Replace di VS Code (`Ctrl+H`) untuk update sekaligus.

### STEP 4 — Install Dependencies

```bash
npm install clsx tailwind-merge
npm install -D prettier prettier-plugin-tailwindcss husky lint-staged
```

### STEP 5 — Buat File Konfigurasi

Buat semua file konfigurasi sesuai spesifikasi di Bagian 4 dan 5:
- `tailwind.config.ts` (timpa yang ada)
- `.eslintrc.json` (timpa yang ada)
- `.prettierrc` (baru)
- Update `.gitignore`
- Update `tsconfig.json` (pastikan path alias ada)

### STEP 6 — Setup Husky

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

### STEP 7 — Buat File Data Statis

Buat semua file di `src/data/`:
- `src/types/index.ts` — semua type
- `src/data/labs.ts`
- `src/data/ticker.ts`
- `src/data/suggestions.ts`
- `src/data/shortcuts.ts`
- `src/data/index.ts`

### STEP 8 — Update `globals.css` dan `tailwind.config.ts`

Ganti isi kedua file ini sesuai spesifikasi di Bagian 4.

### STEP 9 — Update `app/layout.tsx`

Setup font via `next/font/google` dan import providers.

### STEP 10 — Verifikasi

```bash
# Pastikan semua build tanpa error
npm run type-check
npm run lint
npm run build
```

Jika ada error TypeScript atau ESLint, selesaikan sebelum lanjut ke Fase 2.

---

## 9. Checklist Penyelesaian Fase 1

Tandai setiap item sebelum memulai Fase 2:

### Struktur
- [ ] Folder `public/assets/images/` dan `public/assets/icons/` sudah ada, semua aset sudah dipindah
- [ ] Tidak ada file di root `public/` selain favicon/robots/sitemap
- [ ] Folder `src/core/` sudah dihapus
- [ ] Folder `src/hooks/` sudah berisi minimal 1 hook (bukan kosong)
- [ ] `PageClient.tsx` sudah dipindah ke `src/components/layout/`
- [ ] `ThemeProvider.tsx` sudah dipindah ke `src/providers/`
- [ ] Semua komponen `src/components/` sudah masuk subfolder yang benar (`ui/`, `layout/`, `labs/`)

### Konfigurasi
- [ ] `tailwind.config.ts` sudah berisi semua design tokens (warna, font, animasi)
- [ ] `globals.css` sudah diupdate (CSS variables, noise texture, scrollbar, selection)
- [ ] `.eslintrc.json` sudah diupdate
- [ ] `.prettierrc` sudah ada
- [ ] `.gitignore` sudah mencakup `tsconfig.tsbuildinfo`
- [ ] `tsconfig.json` sudah ada path alias `@/*`
- [ ] Husky sudah setup dengan pre-commit hook

### Code Quality
- [ ] `npm run type-check` tidak ada error
- [ ] `npm run lint` tidak ada error atau warning
- [ ] `npm run build` berhasil tanpa error
- [ ] Tidak ada `any` type di seluruh codebase
- [ ] Tidak ada import dengan `../../`

### Data
- [ ] `src/types/index.ts` sudah berisi semua tipe yang dibutuhkan
- [ ] `src/data/labs.ts` sudah berisi data labs dari referensi
- [ ] `src/data/ticker.ts` sudah berisi data ticker
- [ ] `src/data/index.ts` sudah me-re-export semua data

### Komponen
- [ ] `CustomCursor.tsx` sudah dikonversi ke React
- [ ] `Loader.tsx` sudah dikonversi ke React dengan callback `onComplete`
- [ ] `Ticker.tsx` sudah dikonversi ke React dengan data dari `data/ticker.ts`
- [ ] `LabsFab.tsx` sudah dikonversi ke React
- [ ] `LabsOverlay.tsx` sudah dikonversi ke React

---

**Fase 1 selesai → Lanjut ke [FASE 2 — Public Pages Static Version]**

---

*Dokumen ini adalah source of truth untuk Fase 1. Setiap keputusan yang tidak tercakup di sini harus didiskusikan dan ditambahkan sebelum diimplementasikan.*