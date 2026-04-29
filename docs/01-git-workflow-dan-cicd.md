# 01 — Git Workflow & CI/CD Pipeline
## Priyatna Repository · Development & Deployment Guide

> **Tujuan dokumen ini:** Menjelaskan secara detail bagaimana kode mengalir dari
> editor lokal sampai live di internet — mencakup branching strategy, commit conventions,
> pull request process, dan cara kerja GitHub Actions auto-deploy.

---

## DAFTAR ISI

1. [Gambaran Besar — Flow dari Lokal ke Live](#1-gambaran-besar)
2. [Branch Strategy](#2-branch-strategy)
3. [Commit Message Convention](#3-commit-message-convention)
4. [Daily Development Workflow](#4-daily-development-workflow)
5. [Merging ke Main — SOP Release](#5-merging-ke-main--sop-release)
6. [GitHub Actions — Cara Kerja CI/CD](#6-github-actions--cara-kerja-cicd)
7. [GitHub Pages — Setup & Konfigurasi](#7-github-pages--setup--konfigurasi)
8. [Monitoring Deploy](#8-monitoring-deploy)
9. [Rollback — Cara Revert jika Ada Masalah](#9-rollback)
10. [Troubleshooting CI/CD](#10-troubleshooting-cicd)
11. [Migrasi ke VPS (Masa Depan)](#11-migrasi-ke-vps-masa-depan)

---

## 1. Gambaran Besar

```
LOKAL                          GITHUB                         INTERNET
──────                         ──────                         ────────

[editor] → git push         → [branch: develop]
                                     ↓ PR + merge
                             [branch: main]  ←── TRIGGER GitHub Actions
                                     ↓
                             [GitHub Actions Runner]
                             1. checkout kode
                             2. npm ci
                             3. npm run build → folder out/
                             4. touch out/.nojekyll
                             5. push out/ ke gh-pages branch
                                     ↓
                             [branch: gh-pages]
                                     ↓ GitHub Pages serves
                             [priyatna-repository.github.io]  ← LIVE!
```

**Waktu dari push ke main sampai live:** ~2-3 menit

---

## 2. Branch Strategy

Project ini menggunakan **Git Flow yang disederhanakan** (cocok untuk solo/small team).

### 2.1 Struktur Branch

```
main         ← PRODUCTION. Protected. Hanya boleh di-merge, tidak boleh push langsung.
│
develop      ← DEVELOPMENT. Branch kerja utama sehari-hari.
│
├── feature/nama-fitur      ← Untuk fitur baru yang kompleks
├── fix/nama-bug            ← Untuk bug fix
└── docs/nama-doc           ← Untuk update dokumentasi saja
```

### 2.2 Aturan Per Branch

#### `main` — Production Branch
- **Hanya boleh diisi dari:** merge `develop` (atau branch lain setelah review)
- **Trigger deploy:** Ya — setiap push ke `main` memicu GitHub Actions
- **Direct push:** DILARANG (meskipun bisa secara teknis)
- **Force push:** DILARANG KERAS — bisa membuat deploy history kacau

#### `develop` — Development Branch
- **Ini adalah branch kerja harian**
- Boleh push langsung untuk perubahan kecil
- Untuk perubahan besar, buat branch `feature/*` lalu PR ke `develop`
- Boleh "kotor" (WIP commits, experiment) — bersihkan sebelum merge ke `main`

#### `feature/nama-fitur` — Feature Branch
- Dibuat dari: `develop`
- Di-merge ke: `develop` (melalui PR, opsional untuk solo dev)
- Naming: `feature/blog-list-page`, `feature/labs-overlay-refactor`
- Hapus setelah merge: `git branch -d feature/nama-fitur`

#### `fix/nama-bug` — Bugfix Branch
- Dibuat dari: `develop` (atau `main` jika hotfix production)
- Di-merge ke: `develop` (dan `main` jika hotfix)
- Naming: `fix/cursor-mobile-disable`, `fix/theme-hydration`

#### `gh-pages` — Deploy Branch (Jangan Disentuh!)
- **Ini di-generate otomatis oleh GitHub Actions**
- Berisi hasil build (folder `out/`) yang di-push oleh CI/CD
- Jangan checkout, edit, atau push ke branch ini secara manual
- Jika korup: hapus branch ini, GitHub Actions akan re-create saat deploy berikutnya

### 2.3 Cara Membuat Branch Baru

```bash
# Pastikan develop up-to-date
git checkout develop
git pull origin develop

# Buat branch baru dari develop
git checkout -b feature/blog-list-page

# ... kerjakan fitur ...

# Push branch ke remote
git push origin feature/blog-list-page

# Setelah selesai, merge ke develop
git checkout develop
git merge feature/blog-list-page
git push origin develop

# Hapus branch yang sudah di-merge
git branch -d feature/blog-list-page
git push origin --delete feature/blog-list-page
```

---

## 3. Commit Message Convention

Project ini mengikuti **Conventional Commits** — sebuah standar yang membuat riwayat git mudah dibaca dan nantinya bisa di-generate otomatis sebagai changelog.

### 3.1 Format

```
<type>(<scope>): <deskripsi singkat>

[body opsional — penjelasan lebih detail]

[footer opsional — breaking changes, closes issue]
```

### 3.2 Tipe Commit

| Type | Kapan digunakan | Contoh |
|---|---|---|
| `feat` | Fitur baru | `feat(blog): add blog list page` |
| `fix` | Bug fix | `fix(cursor): disable on touch devices` |
| `docs` | Dokumentasi saja | `docs(setup): add troubleshooting section` |
| `style` | Perubahan visual/CSS (tanpa logic) | `style(ticker): adjust animation speed` |
| `refactor` | Refactor kode tanpa fitur/bug baru | `refactor(store): split labs state to uiStore` |
| `perf` | Peningkatan performance | `perf(loader): reduce animation frame count` |
| `chore` | Maintenance (deps, config, build) | `chore: update next.js to 16.3` |
| `ci` | Perubahan CI/CD | `ci: add node version matrix to workflow` |
| `revert` | Revert commit sebelumnya | `revert: feat(blog): add blog list page` |

### 3.3 Scope (Opsional tapi Direkomendasikan)

Scope adalah nama area yang diubah:

```
feat(home): ...       ← Perubahan di Home page
feat(labs): ...       ← Perubahan di Labs
feat(blog): ...       ← Perubahan di Blog
fix(ticker): ...      ← Perubahan di Ticker component
fix(store): ...       ← Perubahan di Zustand store
chore(deps): ...      ← Update dependencies
docs(fase1): ...      ← Update dokumentasi Fase 1
ci(deploy): ...       ← Perubahan di GitHub Actions
```

### 3.4 Contoh Commit yang Baik

```bash
# Fitur baru
git commit -m "feat(labs): add LabStatusBadge component

Badge menampilkan status Live/Beta/Soon dengan warna berbeda.
Dipakai di LabsOverlay dan halaman /labs."

# Bug fix
git commit -m "fix(cursor): disable custom cursor on touch devices

Cursor selector menggunakan ontouchstart check di useEffect.
Sebelumnya cursor muncul di iPad tapi tidak berfungsi."

# Refactor
git commit -m "refactor(store): extract UI state ke uiStore

searchStore sekarang hanya handle search + history.
isLabsOpen dipindah ke uiStore untuk separation of concerns."

# Chore
git commit -m "chore: add next.config.ts for static export

Required untuk deployment ke GitHub Pages.
Adds output: 'export' dan images: { unoptimized: true }."

# Dokumentasi
git commit -m "docs: add 01-git-workflow-dan-cicd.md

Panduan lengkap branching strategy, commit conventions,
GitHub Actions workflow, dan GitHub Pages setup."
```

### 3.5 Commit yang TIDAK Baik (Hindari)

```bash
# ❌ Terlalu generik
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
git commit -m "wip"

# ❌ Tidak informatif
git commit -m "asdf"
git commit -m "test"

# ❌ Terlalu banyak dalam satu commit
git commit -m "add blog, fix cursor, update deps, refactor store, add docs"
# → Pecah jadi 5 commit terpisah!
```

### 3.6 Atomic Commits

**Satu commit = satu perubahan yang dapat berdiri sendiri.**

Prinsip: Jika kamu perlu menulis "dan" dalam commit message, kemungkinan besar commit itu bisa dipecah.

```bash
# Gunakan interactive staging untuk commit perubahan sebagian
git add -p

# Ini akan menampilkan setiap "hunk" perubahan satu per satu
# Tekan 'y' untuk stage, 'n' untuk skip, 's' untuk split
```

---

## 4. Daily Development Workflow

Ini adalah alur kerja yang harus diikuti setiap hari.

### 4.1 Mulai Hari Kerja

```bash
# 1. Pastikan kamu di branch develop
git checkout develop

# 2. Pull perubahan terbaru dari remote
git pull origin develop

# 3. Cek status — pastikan tidak ada perubahan yang "nyasar"
git status
# Output yang diharapkan: "nothing to commit, working tree clean"

# 4. Start development server
npm run dev
```

### 4.2 Saat Mengerjakan Fitur

```bash
# (Opsional) Buat branch feature jika fiturnya besar/kompleks
git checkout -b feature/labs-detail-page

# ... kerjakan fitur ...
# ... edit file, test di browser ...

# Cek apa yang berubah
git status
git diff

# Stage perubahan yang relevan
git add src/components/labs/LabsOverlay.tsx
git add src/data/index.ts
# ATAU stage semua perubahan (hati-hati!)
git add .

# Buat commit
git commit -m "feat(labs): add status filter to LabsOverlay

Filter tabs: ALL | LIVE | BETA | COMING SOON
Data-driven dari LabStatus type di types/index.ts"
```

### 4.3 Kerjakan Perubahan Kecil (Langsung di Develop)

```bash
# Untuk perubahan kecil (style tweak, typo, docs), langsung di develop
git checkout develop

# Edit file ...

# Stage dan commit
git add .
git commit -m "style(ticker): increase animation duration to 35s"

# Push ke remote
git push origin develop
```

### 4.4 Selesai dan Siap Deploy

```bash
# 1. Pastikan build tidak error
npm run build

# 2. Jika ada error, fix dulu sebelum merge ke main

# 3. Merge develop ke main
git checkout main
git pull origin main
git merge develop --no-ff -m "release: merge develop → main (Phase 1 complete)"

# 4. Push main — INI TRIGGER DEPLOY OTOMATIS
git push origin main

# 5. Kembali ke develop untuk kerja selanjutnya
git checkout develop
```

### 4.5 Visualisasi Git Log

```bash
# Lihat riwayat commit yang cantik
git log --oneline --graph --all

# Output contoh:
# * a1b2c3d (HEAD -> main, origin/main) release: merge develop for fase 1 foundation
# |\
# | * d4e5f6g (develop) feat(labs): add LabStatusBadge
# | * h7i8j9k style(ticker): adjust animation speed
# | * l0m1n2o docs: add 00-setup-proyek.md
# |/
# * p3q4r5s chore: initial project setup
```

---

## 5. Merging ke Main — SOP Release

Ini adalah prosedur yang harus diikuti **setiap kali** ingin deploy ke production.

### 5.1 Checklist Sebelum Merge

```
□ 1. Build berhasil tanpa error: npm run build
□ 2. Tidak ada TypeScript errors: npx tsc --noEmit
□ 3. Tampilan sudah di-review di browser (localhost)
□ 4. Tidak ada console.log yang tidak disengaja
□ 5. Semua file yang diubah sudah di-stage dan di-commit
□ 6. git status menunjukkan "working tree clean"
```

### 5.2 Prosedur Merge

```bash
# Step 1: Pastikan develop up-to-date
git checkout develop
git pull origin develop
npm run build   ← HARUS SUKSES

# Step 2: Pindah ke main dan update
git checkout main
git pull origin main

# Step 3: Merge develop ke main
# --no-ff: selalu buat merge commit (bukan fast-forward)
# Ini mempertahankan context bahwa ini adalah intentional release
git merge develop --no-ff

# Step 4: Git akan membuka text editor untuk merge commit message
# Tulis pesan yang jelas, contoh:
# "release: Phase 1 Foundation - add next.config, docs, CI/CD workflow"

# Step 5: Push ke main → DEPLOY OTOMATIS DIMULAI
git push origin main

# Step 6: Kembali ke develop
git checkout develop
```

### 5.3 Monitor Deploy

Setelah push ke main:
1. Buka https://github.com/Priyatna-repository/Priyatna-repository.github.io/actions
2. Lihat workflow "Deploy to GitHub Pages" yang sedang berjalan
3. Tunggu ~2-3 menit
4. Buka https://priyatna-repository.github.io untuk verify

---

## 6. GitHub Actions — Cara Kerja CI/CD

Ini adalah penjelasan detail untuk setiap langkah di file `.github/workflows/deploy.yml`.

### 6.1 Trigger

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

- **`push.branches: [main]`:** Workflow berjalan setiap kali ada push ke branch `main`
- **`workflow_dispatch`:** Bisa dijalankan manual dari tab Actions di GitHub

### 6.2 Permissions

```yaml
permissions:
  contents: write
```

Workflow butuh izin `write` ke repository untuk bisa push hasil build ke branch `gh-pages`.

### 6.3 Step-by-Step Penjelasan

**Step 1: Checkout**
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```
- Men-download seluruh kode dari branch `main` ke mesin GitHub Actions
- `fetch-depth: 0` artinya fetch seluruh git history (diperlukan jika ada tooling yang butuh git info)

**Step 2: Setup Node.js**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```
- Install Node.js versi 20 di runner
- `cache: 'npm'` → cache `node_modules` berdasarkan `package-lock.json`
- Jika `package-lock.json` tidak berubah, cache akan dipakai → build lebih cepat

**Step 3: Install Dependencies**
```yaml
- run: npm ci
```
- `npm ci` membaca `package-lock.json` dan install exact versions
- Lebih cepat dan deterministik dari `npm install`
- Jika lock file tidak sinkron, akan error dan build batal (bagus!)

**Step 4: Build**
```yaml
- run: npm run build
  env:
    NODE_ENV: production
```
- Jalankan `next build` yang menghasilkan folder `out/`
- `NODE_ENV: production` memastikan optimasi production diaktifkan
- Jika ada TypeScript error, ESLint error, atau build error → workflow berhenti di sini

**Step 5: Add .nojekyll**
```yaml
- run: touch ./out/.nojekyll
```
- File kosong ini **sangat penting** untuk Next.js di GitHub Pages
- **Mengapa?** GitHub Pages defaultnya menjalankan Jekyll processor yang mengabaikan folder/file yang diawali `_` (underscore)
- Next.js menghasilkan file seperti `_next/static/...` — tanpa `.nojekyll`, semua file `_next/` akan diabaikan!
- Hasil: blank page atau halaman tanpa CSS/JS

**Step 6: Deploy ke gh-pages**
```yaml
- uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./out
    publish_branch: gh-pages
```
- `peaceiris/actions-gh-pages` adalah action populer untuk deploy ke GitHub Pages
- `${{ secrets.GITHUB_TOKEN }}` adalah token otomatis dari GitHub — tidak perlu setup manual
- `publish_dir: ./out` → ambil konten folder `out/`
- `publish_branch: gh-pages` → push ke branch `gh-pages`
- GitHub Pages dikonfigurasi untuk melayani dari branch `gh-pages`

### 6.4 Total Waktu

| Step | Estimasi Waktu |
|---|---|
| Checkout | 5-10 detik |
| Setup Node.js (cache hit) | 5-15 detik |
| npm ci (cache hit) | 15-30 detik |
| npm run build | 30-60 detik |
| Deploy ke gh-pages | 10-20 detik |
| **Total** | **~2-3 menit** |

### 6.5 Melihat Log Build

1. Buka: https://github.com/Priyatna-repository/Priyatna-repository.github.io/actions
2. Klik nama workflow yang sedang berjalan
3. Klik nama job "Build & Deploy"
4. Expand setiap step untuk melihat log

---

## 7. GitHub Pages — Setup & Konfigurasi

### 7.1 Setup Awal (Sekali Saja)

Lakukan langkah ini satu kali setelah repository di-push ke GitHub:

1. Buka repository di GitHub
2. Klik tab **Settings**
3. Di sidebar kiri, klik **Pages** (di bawah "Code and automation")
4. Di bagian **Source**, pilih: **Deploy from a branch**
5. Di dropdown **Branch**, pilih: `gh-pages`
6. Di dropdown folder, pilih: `/ (root)`
7. Klik **Save**

```
GitHub Repository Settings
└── Pages
    └── Build and deployment
        └── Source: Deploy from a branch
            └── Branch: gh-pages  /  (root)
                └── [Save]
```

### 7.2 Verifikasi GitHub Pages Aktif

Setelah setup dan setelah GitHub Actions deploy pertama berjalan:
- Di halaman Settings → Pages, akan muncul: "Your site is live at https://priyatna-repository.github.io/"
- Klik link tersebut untuk verifikasi

### 7.3 Kenapa Branch `gh-pages` dan Bukan `main`?

Untuk proyek dengan kode sumber yang kompleks (Next.js), memisahkan branch kode sumber (`main`) dan branch hasil build (`gh-pages`) adalah praktik terbaik:

- `main` berisi TypeScript, JSX, node_modules config → tidak perlu di-serve
- `gh-pages` berisi HTML, CSS, JS murni yang di-generate → itulah yang di-serve

Alternatif yang **tidak digunakan** (dan kenapa):

| Opsi | Kenapa Tidak Dipakai |
|---|---|
| Deploy dari `main` `/docs` | Perlu commit hasil build ke `main` — mengotori git history |
| GitHub Actions dengan Pages artifact | Cara baru yang lebih kompleks, peaceiris sudah proven |
| Vercel/Netlify | Berbayar untuk custom domain, tapi bisa dipertimbangkan nanti |

### 7.4 Custom Domain (Opsional)

Jika ingin pakai domain sendiri (misal: `priyatna.dev`):

1. Di Settings → Pages → Custom domain: isi domain kamu
2. Di DNS provider (Cloudflare, Namecheap, dll), buat record:
   ```
   Type: CNAME
   Name: www
   Value: priyatna-repository.github.io
   ```
   Dan untuk apex domain:
   ```
   Type: A
   Name: @
   Values: 185.199.108.153
           185.199.109.153
           185.199.110.153
           185.199.111.153
   ```
3. Centang "Enforce HTTPS" di GitHub Pages settings

---

## 8. Monitoring Deploy

### 8.1 Cara Cek Status Deploy

**Opsi 1 — GitHub Actions tab:**
```
github.com/Priyatna-repository/Priyatna-repository.github.io/actions
```
- Hijau ✓ = berhasil
- Merah ✗ = gagal (klik untuk lihat error)
- Kuning ● = sedang berjalan

**Opsi 2 — Commit badge:**
Setelah push, di halaman commit GitHub akan muncul icon status di samping commit hash.

**Opsi 3 — Email notification:**
GitHub secara default mengirim email jika workflow gagal. Pastikan email notifications aktif di GitHub settings.

### 8.2 Workflow Sering Gagal? Cek Ini

```bash
# 1. Build lokal berhasil?
npm run build

# 2. package-lock.json ter-commit?
git status | grep package-lock.json

# 3. Ada TypeScript error?
npx tsc --noEmit
```

---

## 9. Rollback

### 9.1 Skenario: Deploy Berhasil tapi Tampilan Rusak

Jika setelah deploy ada bug yang lolos ke production:

**Opsi A — Quick revert (direkomendasikan):**
```bash
# Cari commit hash yang benar
git log --oneline main | head -5

# Revert ke commit sebelumnya (buat commit baru yang membalik perubahan)
git revert HEAD
git push origin main
# → GitHub Actions akan deploy versi yang sudah di-revert
```

**Opsi B — Reset ke commit spesifik (HATI-HATI, destructive):**
```bash
# Lihat log untuk cari commit yang stabil
git log --oneline main | head -10

# Reset ke commit tertentu
git reset --hard [commit-hash]
git push --force origin main  # HANYA jika benar-benar perlu!
```

⚠️ `--force push` ke `main` sangat jarang diperlukan. Lebih aman pakai `git revert`.

### 9.2 Skenario: GitHub Actions Gagal (Deploy Tidak Terjadi)

Jika workflow gagal, site lama masih live (tidak ada perubahan di `gh-pages`).
Ini adalah behavior yang aman — tidak ada deploy partial.

Cara fix:
1. Baca error log di Actions tab
2. Fix issue di lokal
3. Push fix ke `main` → workflow akan retry otomatis

### 9.3 Re-run Workflow Secara Manual

Jika workflow gagal karena alasan sementara (misal: GitHub server timeout):
1. Buka Actions tab
2. Klik workflow yang gagal
3. Klik "Re-run all jobs" di pojok kanan atas

---

## 10. Troubleshooting CI/CD

### 10.1 "Permission denied" saat deploy

**Gejala:**
```
Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"
remote: Permission to ... denied to github-actions[bot].
```

**Solusi:**
1. Buka Settings → Actions → General
2. Di "Workflow permissions", pilih "Read and write permissions"
3. Klik Save

### 10.2 "Branch gh-pages not found"

**Ini normal untuk deploy pertama.** `peaceiris/actions-gh-pages` akan otomatis membuat branch `gh-pages` jika belum ada.

### 10.3 "No such file or directory: out/"

**Gejala:** Deploy step gagal karena folder `out/` tidak ada.

**Penyebab:** Build step (`npm run build`) gagal sebelum deploy.

**Solusi:** Baca log di step "Build static export" untuk melihat error yang sebenarnya.

### 10.4 Site Live tapi Tampil Blank / Tanpa Style

**Penyebab paling umum:** File `.nojekyll` tidak ada di folder `out/`.

**Verifikasi di workflow log:**
```
Run touch ./out/.nojekyll
```
Step ini harus ada setelah build.

**Penyebab lain:** `basePath` salah di `next.config.ts`. Pastikan basePath kosong untuk user pages.

### 10.5 Cache npm Menyebabkan Build Fail

```yaml
# Jika cache bermasalah, tambahkan ini di workflow untuk clear cache:
- name: Clear npm cache
  run: npm cache clean --force
```

Atau dari GitHub: Actions tab → Management → Caches → hapus cache yang relevan.

---

## 11. Migrasi ke VPS (Masa Depan)

Dokumen ini juga mempersiapkan kamu untuk saat project siap pindah ke VPS dengan database.

### 11.1 Kapan Harus Migrasi?

Migrasi ke VPS diperlukan ketika:
- Butuh database (blog posts, showcase projects yang bisa di-edit dari admin)
- Butuh API routes (upload gambar, form submission, auth)
- Butuh server-side rendering untuk konten yang sering berubah
- Butuh admin dashboard

Referensi: `docs/overal.md` (Fase 3 dan 4)

### 11.2 Perubahan yang Diperlukan untuk VPS

**1. `next.config.ts`:**
```typescript
// Hapus ini untuk VPS:
output: 'export',       // ← HAPUS
trailingSlash: true,    // ← HAPUS (opsional)
images: {
  unoptimized: true,    // ← HAPUS
},
```

**2. GitHub Actions — ganti workflow:**
```yaml
# Ganti deploy.yml dengan ini (kerangka):
- name: Deploy to VPS via SSH
  uses: appleboy/ssh-action@v1
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USER }}
    key: ${{ secrets.VPS_SSH_KEY }}
    script: |
      cd /var/www/priyatna
      git pull origin main
      npm ci --omit=dev
      npm run build
      pm2 restart priyatna-app || pm2 start npm --name priyatna-app -- start
```

**3. GitHub Secrets yang perlu ditambahkan:**
- `VPS_HOST` — IP address VPS
- `VPS_USER` — username SSH (biasanya `root` atau `ubuntu`)
- `VPS_SSH_KEY` — private key SSH untuk akses VPS
- `DATABASE_URL` — connection string database

**4. Environment variables di VPS:**
```bash
# Di VPS, buat file .env.production
NEXT_PUBLIC_SITE_URL=https://priyatna-repository.github.io
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
```

### 11.3 Rekomendasi VPS

| Provider | Harga/bulan | Spesifikasi | Cocok untuk |
|---|---|---|---|
| DigitalOcean Droplet | $6-12 | 1-2GB RAM | Solo project |
| Vultr | $6-10 | 1-2GB RAM | Solo project |
| Railway | $5-20 | Managed | Mudah, auto-scale |
| Vercel | Gratis-$20 | Managed | Termudah untuk Next.js |

**Rekomendasi:** Vercel (paling mudah untuk Next.js, gratis untuk personal project, support ISR dan API routes)

Lihat detail lengkap: `docs/pashe3.md` (Fase 3 — Backend Infrastructure)

---

*Dokumen ini adalah panduan hidup — update setiap kali ada perubahan pada workflow atau infrastruktur.*
