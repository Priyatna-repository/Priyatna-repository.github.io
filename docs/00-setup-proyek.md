# 00 — Setup Proyek Lokal
## Priyatna Repository · Developer Onboarding Guide

> **Tujuan dokumen ini:** Panduan lengkap untuk menyiapkan environment development
> dari nol sampai bisa menjalankan project di lokal dan melakukan deploy pertama.

---

## DAFTAR ISI

1. [Prerequisites — Apa yang Harus Terinstall](#1-prerequisites)
2. [Clone & Install](#2-clone--install)
3. [Struktur Folder — Navigasi Codebase](#3-struktur-folder)
4. [Menjalankan Development Server](#4-menjalankan-development-server)
5. [Build & Verify](#5-build--verify)
6. [Environment Variables](#6-environment-variables)
7. [IDE Setup — VS Code](#7-ide-setup--vs-code)
8. [Troubleshooting — Masalah Umum](#8-troubleshooting)
9. [Ringkasan Commands](#9-ringkasan-commands)

---

## 1. Prerequisites

Sebelum mulai, pastikan semua tools berikut sudah terinstall di mesin lokal.

### 1.1 Node.js (WAJIB)

Project ini membutuhkan **Node.js versi 20 atau lebih baru** (LTS).

```bash
# Cek versi yang terinstall
node --version
# Output yang diharapkan: v20.x.x atau lebih baru
```

**Cara install Node.js:**

**Opsi A — nvm (Direkomendasikan, bisa switch versi):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart terminal, lalu install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20
```

**Opsi B — Download langsung:**
Pergi ke https://nodejs.org → download versi LTS (bukan Current)

**Mengapa Node.js 20?**
GitHub Actions workflow (`deploy.yml`) menggunakan Node.js 20. Menggunakan versi yang sama di lokal dan CI mencegah perbedaan behavior build.

### 1.2 npm (sudah bundled dengan Node.js)

```bash
# Cek versi npm
npm --version
# Output yang diharapkan: 10.x.x atau lebih baru
```

Project ini menggunakan `npm` (bukan yarn/pnpm) karena `package-lock.json` sudah ada.
**Jangan ganti ke yarn atau pnpm** tanpa diskusi — bisa menyebabkan lock file conflict.

### 1.3 Git (WAJIB)

```bash
# Cek versi git
git --version
# Output yang diharapkan: git version 2.x.x
```

**Cara install Git:**
- Linux: `sudo apt install git` atau `sudo dnf install git`
- macOS: `xcode-select --install` atau `brew install git`
- Windows: Download dari https://git-scm.com

**Setup Git identity (wajib untuk commit):**
```bash
git config --global user.name "Priyatna"
git config --global user.email "priyatna.info@gmail.com"
```

### 1.4 VS Code (Sangat Direkomendasikan)

Lihat Bagian 7 untuk daftar extension yang direkomendasikan.

---

## 2. Clone & Install

### 2.1 Clone Repository

```bash
# Clone dengan HTTPS (tidak perlu SSH key)
git clone https://github.com/Priyatna-repository/Priyatna-repository.github.io.git

# Atau jika sudah setup SSH key (lebih nyaman jangka panjang)
git clone git@github.com:Priyatna-repository/Priyatna-repository.github.io.git

# Masuk ke folder project
cd Priyatna-repository.github.io
```

### 2.2 Periksa Branches yang Ada

```bash
# Lihat semua branch (lokal dan remote)
git branch -a

# Output yang diharapkan:
# * develop          ← branch aktif saat ini
#   main             ← branch production
#   remotes/origin/develop
#   remotes/origin/main
#   remotes/origin/gh-pages  ← auto-generated oleh GitHub Actions
```

**Penting:** Jangan pernah push langsung ke `main` atau `gh-pages`.
Selalu kerjakan di `develop` atau branch `feature/*`.

### 2.3 Install Dependencies

```bash
# Install semua package dari package-lock.json
# `npm ci` memastikan versi tepat sama seperti yang di lock file
npm ci
```

**Kenapa `npm ci` bukan `npm install`?**
- `npm ci` membaca `package-lock.json` secara persis — tidak ada surprises
- Lebih cepat karena skip dependency resolution
- Cocok untuk "clean install" (menghapus node_modules terlebih dahulu)
- Jika `package-lock.json` tidak sinkron dengan `package.json`, akan error (ini bagus!)

**`npm install` digunakan hanya ketika:**
- Menambahkan package baru: `npm install framer-motion`
- Menghapus package: `npm uninstall package-name`
- Update package: `npm update package-name`

---

## 3. Struktur Folder

Ini adalah peta navigasi codebase. Baca sebelum mulai coding.

```
Priyatna-repository.github.io/
│
├── .github/
│   └── workflows/
│       └── deploy.yml          ← CI/CD: Auto-deploy ke GitHub Pages
│                                  ⚠️ Jangan edit kecuali ada alasan kuat
│
├── docs/                       ← Dokumentasi teknis proyek (SELALU update!)
│   ├── 00-setup-proyek.md      ← File ini
│   ├── 01-git-workflow-dan-cicd.md
│   ├── overal.md               ← Master plan & visi platform
│   ├── pashe1.md               ← Fase 1: Refactor detail
│   ├── pashe2.md               ← Fase 2: Public pages
│   ├── index.html              ← Referensi HTML visual utama
│   └── index2.html             ← Referensi HTML visual tambahan
│
├── public/                     ← File statis (gambar, ikon)
│   └── assets/
│       ├── images/
│       │   └── hero-background.jpg
│       └── icons/
│           ├── logo-main.png
│           └── tit-logo.png
│
├── src/                        ← SEMUA kode aplikasi ada di sini
│   │
│   ├── app/                    ← Next.js App Router
│   │   ├── layout.tsx          ← Root HTML wrapper (lang, fonts, metadata)
│   │   └── page.tsx            ← Entry point: render PageClient
│   │
│   ├── components/             ← Komponen React
│   │   ├── labs/
│   │   │   ├── LabsFab.tsx     ← Floating action button "Addon Labs"
│   │   │   └── LabsOverlay.tsx ← Modal grid semua lab tools
│   │   ├── layout/
│   │   │   ├── CustomCursor.tsx← Custom cursor dot + ring (disabled di mobile)
│   │   │   ├── HomeView.tsx    ← Tampilan home: logo, search box, chips
│   │   │   ├── PageClient.tsx  ← Client root: orchestrate semua komponen
│   │   │   └── ResultsView.tsx ← Tampilan hasil pencarian (2 kolom)
│   │   └── ui/
│   │       ├── ImageComparison.tsx ← Before/after image slider
│   │       ├── Loader.tsx      ← Loading screen dengan counter animasi
│   │       ├── Tabs.tsx        ← Tab component (menggunakan Radix UI)
│   │       ├── ThemeToggle.tsx ← Toggle light/dark mode
│   │       └── Ticker.tsx      ← Scrolling text strip di bagian atas
│   │
│   ├── data/
│   │   └── index.ts            ← SEMUA data statis: labs, results, suggestions,
│   │                             ticker, filter tabs, PAA items, shortcuts
│   │
│   ├── providers/
│   │   └── ThemeProvider.tsx   ← Sinkronisasi Zustand theme ↔ data-theme attribute
│   │
│   ├── store/
│   │   └── searchStore.ts      ← Zustand store: query, search state, labs modal,
│   │                             theme, search history (persisted ke localStorage)
│   │
│   ├── styles/
│   │   └── globals.css         ← CSS variables, dark mode, animasi, base reset
│   │
│   └── types/
│       └── index.ts            ← TypeScript interfaces: LabTool, ResultCard, dll
│
├── .gitignore                  ← File yang tidak ditrack git
├── .prettierrc                 ← Konfigurasi code formatter
├── CLAUDE.md                   ← Context untuk Claude Code AI
├── next.config.ts              ← Next.js config (static export untuk GitHub Pages)
├── package.json                ← Dependencies & scripts
├── package-lock.json           ← Lock file — jangan edit manual
├── README.md                   ← Readme publik (tampil di GitHub)
└── tsconfig.json               ← TypeScript compiler config
```

### Cara Cepat Menemukan File

```bash
# Cari komponen berdasarkan nama
find src/components -name "*.tsx" | grep -i "loader"

# Cari teks dalam seluruh src/
grep -r "useSearchStore" src/ --include="*.tsx"

# Lihat semua komponen yang ada
find src/components -name "*.tsx" | sort
```

---

## 4. Menjalankan Development Server

### 4.1 Start Server

```bash
# Dari root folder project
npm run dev
```

**Output yang diharapkan:**
```
  ▲ Next.js 16.x.x
  - Local:   http://localhost:3000
  - Network: http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 1234ms
```

Buka browser ke **http://localhost:3000**

### 4.2 Yang Terjadi Saat Development

- **Hot Module Replacement (HMR):** Setiap kali save file `.tsx` atau `.css`, browser langsung refresh tampilan tanpa reload penuh
- **Fast Refresh:** React state dipertahankan saat komponen berubah (kecuali perubahan props yang mempengaruhi state)
- **TypeScript checking:** Error TypeScript muncul di terminal dan browser overlay

### 4.3 Port Sudah Dipakai?

```bash
# Gunakan port berbeda
npm run dev -- --port 3001

# Atau kill process yang memakai port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 5. Build & Verify

**WAJIB dilakukan sebelum push ke `main`!**

### 5.1 Production Build

```bash
# Build static export → hasilkan folder out/
npm run build
```

**Apa yang terjadi:**
1. Next.js compile semua TypeScript dan JSX
2. Optimasi bundle (tree-shaking, minification)
3. Generate HTML statis untuk setiap halaman
4. Output ke folder `out/`

**Output yang diharapkan:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (3/3)
✓ Finalizing page optimization

Route (app)                Size    First Load JS
┌ ○ /                     5.2 kB  102 kB
└ ○ /_not-found           977 B   97.7 kB
```

**Jika build GAGAL:**
- Baca error message dengan teliti — Next.js memberikan pesan error yang informatif
- Error TypeScript ditampilkan dengan nama file dan nomor baris
- Lihat Bagian 8 (Troubleshooting)

### 5.2 Preview Build Lokal

```bash
# Setelah build, preview hasilnya secara lokal
# CATATAN: `npm start` tidak bekerja untuk static export
# Gunakan server statis sederhana:

npx serve out
# Buka: http://localhost:3000
```

### 5.3 Cek Ukuran Bundle

```bash
# Lihat detail ukuran setiap halaman
npm run build 2>&1 | grep -A 20 "Route (app)"
```

---

## 6. Environment Variables

### 6.1 Status Sekarang: Tidak Ada ENV Vars

Saat ini (Fase 1-2) project ini **tidak membutuhkan** environment variables.
Semua data berasal dari `src/data/index.ts` (file statis).

### 6.2 Untuk Masa Depan (Fase 3 — Backend)

Ketika backend ditambahkan, environment variables akan dibutuhkan:

```bash
# Buat file .env.local (sudah di-ignore oleh .gitignore)
cp .env.example .env.local

# Edit sesuai kebutuhan
nano .env.local
```

**Contoh isi .env.local (Fase 3):**
```env
# Database (Supabase)
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Auth
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

**Aturan environment variables:**
- Variabel dengan prefix `NEXT_PUBLIC_` bisa diakses di browser (client-side)
- Variabel tanpa prefix hanya tersedia di server-side code (API routes, dll)
- **JANGAN PERNAH commit file `.env` atau `.env.local` ke git!**
- Untuk GitHub Actions, tambahkan secrets di: Repository Settings → Secrets and Variables → Actions

---

## 7. IDE Setup — VS Code

### 7.1 Extension yang Wajib

Buka VS Code, tekan `Ctrl+P`, paste setiap perintah:

```
ext install dbaeumer.vscode-eslint
```
**ESLint** — highlight error TypeScript/JS secara realtime di editor

```
ext install esbenp.prettier-vscode
```
**Prettier** — format otomatis saat save file

```
ext install bradlc.vscode-tailwindcss
```
**Tailwind CSS IntelliSense** — autocomplete untuk class Tailwind (untuk nanti)

```
ext install ms-vscode.vscode-typescript-next
```
**TypeScript Nightly** — versi TypeScript terbaru dengan fitur terkini

### 7.2 Settings VS Code yang Direkomendasikan

Buat file `.vscode/settings.json` (folder `.vscode/` sudah di-ignore oleh git):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.suggest.autoImports": true,
  "files.associations": {
    "*.css": "css"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 7.3 Path Alias `@/`

TypeScript dikonfigurasi dengan path alias `@/` yang maps ke `src/`.

**Cara kerja:**
```typescript
// Ini sama:
import { useSearchStore } from '../../../store/searchStore'  // ❌ Susah dibaca
import { useSearchStore } from '@/store/searchStore'         // ✅ Bersih
```

Di `tsconfig.json` sudah ada konfigurasi:
```json
"paths": {
  "@/*": ["src/*"]
}
```

VS Code dengan TypeScript extension akan otomatis resolve path alias ini.

---

## 8. Troubleshooting

### 8.1 `npm ci` gagal — "Cannot read package.json"

**Gejala:** Error saat `npm ci` tentang package.json tidak ditemukan.

**Solusi:** Pastikan kamu ada di root folder project:
```bash
ls package.json   # Harus ada
```
Jika tidak ada, berarti kamu di folder yang salah. `cd` ke folder yang benar.

### 8.2 `npm ci` gagal — "package-lock.json tidak sinkron"

**Gejala:**
```
npm error `npm ci` can only install packages when your package.json and
package-lock.json are in sync.
```

**Solusi:**
```bash
# Regenerate lock file
rm package-lock.json
npm install

# Commit lock file yang baru
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
```

### 8.3 `npm run build` gagal — TypeScript errors

**Gejala:** Build error dengan pesan TypeScript.

**Cara debug:**
```bash
# Jalankan TypeScript check saja tanpa build
npx tsc --noEmit

# Ini akan menampilkan semua TypeScript errors dengan detail
```

**Error umum:**
- `Type 'undefined' is not assignable to...` → Tambahkan null check atau optional chaining
- `Module not found: '@/...'` → Pastikan path alias di tsconfig.json sudah benar
- `Property 'xxx' does not exist on type 'yyy'` → Update interface di `src/types/index.ts`

### 8.4 `npm run build` gagal — Static Export error

**Gejala:**
```
Error: Page "/xxx" is missing "generateStaticParams()"
```

**Penyebab:** Halaman dengan dynamic route (`[slug]`) membutuhkan `generateStaticParams()` untuk static export.

**Solusi:** Tambahkan fungsi `generateStaticParams()` di page.tsx:
```typescript
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### 8.5 Port 3000 sudah dipakai

```bash
# Cari process yang pakai port 3000
lsof -i :3000

# Kill process tersebut
kill -9 [PID]

# Atau langsung:
lsof -ti:3000 | xargs kill -9
```

### 8.6 CSS tidak ter-update di browser

**Gejala:** Perubahan di CSS tidak terlihat meski sudah save.

**Solusi:**
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) atau `Cmd+Shift+R` (Mac)
2. Clear browser cache: `F12` → Application → Storage → Clear site data
3. Restart dev server: `Ctrl+C` di terminal → `npm run dev`

### 8.7 Custom cursor tidak muncul

**Normal:** Custom cursor disabled di touch device (mobile/tablet).

**Di desktop:** Jika kursor tidak muncul, cek di console browser (`F12`) apakah ada JavaScript error.

### 8.8 Theme tidak konsisten setelah refresh

**Penyebab:** Zustand store belum di-hydrate dari localStorage.

**Sudah ditangani di `PageClient.tsx`:**
```tsx
// Jika belum hydrated, tampilkan overlay kosong
if (!hasHydrated) {
  return <div style={{ position: 'fixed', inset: 0, background: 'var(--paper)' }} />
}
```

Ini normal dan berlangsung < 50ms.

---

## 9. Ringkasan Commands

```bash
# ─── Development ──────────────────────────────────────────────────
npm run dev          # Start dev server di localhost:3000
npm run build        # Build production (static export ke folder out/)
npm run lint         # Cek ESLint errors

# ─── Git Workflow ─────────────────────────────────────────────────
git status           # Lihat file yang berubah
git add -p           # Stage perubahan secara selektif (patch mode)
git commit -m "..."  # Commit dengan pesan
git push origin develop   # Push ke branch develop
git push origin main      # Push ke main → trigger auto-deploy!

# ─── Utilities ────────────────────────────────────────────────────
npx tsc --noEmit     # TypeScript check tanpa build
npx serve out        # Preview hasil build secara lokal
npm ci               # Clean install dependencies

# ─── Debugging ────────────────────────────────────────────────────
lsof -ti:3000 | xargs kill -9    # Kill process di port 3000
npm cache clean --force           # Bersihkan npm cache jika ada masalah
```

---

## Langkah Selanjutnya

Setelah setup berhasil:
1. Baca [01-git-workflow-dan-cicd.md](./01-git-workflow-dan-cicd.md) — cara kerja git dan deploy
2. Baca [pashe1.md](./pashe1.md) — rencana refactor yang sedang dikerjakan
3. Lihat branch `develop` untuk melihat progress terkini

---

*Dokumen ini harus diupdate setiap kali ada perubahan pada setup atau tooling.*
