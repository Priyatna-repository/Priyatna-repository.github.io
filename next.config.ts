import type { NextConfig } from 'next'

// ─── GitHub Pages Deployment Config ──────────────────────────────────────────
//
// SAAT INI: Static export untuk GitHub Pages (gratis, tanpa server)
//
// Cara kerja:
//   `npm run build` → menghasilkan folder `out/` berisi HTML/CSS/JS statis
//   GitHub Actions mengambil folder `out/` dan push ke branch `gh-pages`
//   GitHub Pages melayani konten dari branch `gh-pages`
//
// CATATAN PENTING — basePath:
//   Repo ini adalah USER PAGE (Priyatna-repository.github.io), bukan project page.
//   User page dilayani dari root URL tanpa prefix, jadi basePath TIDAK diperlukan.
//
//   Jika suatu saat repo berganti ke project page (misal: github.io/portfolio),
//   uncomment baris basePath di bawah dan sesuaikan dengan nama repo:
//   basePath: '/nama-repo',
//   assetPrefix: '/nama-repo/',
//
// ─── MIGRASI KE VPS / VERCEL (MASA DEPAN) ────────────────────────────────────
//
// Ketika sudah siap pindah ke VPS dengan database:
//   1. Hapus `output: 'export'` dan `trailingSlash: true`
//   2. Hapus `images: { unoptimized: true }`
//   3. Tambahkan konfigurasi untuk database, auth, API routes
//   4. Update GitHub Actions workflow untuk deploy ke VPS (bukan gh-pages)
//   Referensi: docs/pashe3.md (Fase 3 — Backend Infrastructure)
//
// ─────────────────────────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  // Static HTML export — wajib untuk GitHub Pages
  output: 'export',

  // Tambahkan trailing slash agar URL konsisten di static hosting
  // /blog → /blog/ (mencegah 404 di beberapa static host)
  trailingSlash: true,

  // Disable Next.js image optimization (tidak tersedia di static export)
  // Untuk static export, gambar harus di-optimize secara manual sebelum di-commit
  // atau gunakan CDN eksternal (Cloudinary, imgix, dll.)
  images: {
    unoptimized: true,
  },

  // Matikan telemetri Next.js (optional, untuk privacy)
  // telemetry: false,
}

export default nextConfig
