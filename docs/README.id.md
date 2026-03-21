# Repositori blog Two (berbasis Fuwari)

Repositori ini adalah blog pribadi saya yang dikustom dari [saicaca/fuwari](https://github.com/saicaca/fuwari).  
README ini menjelaskan versi blog saya sendiri, bukan dokumentasi template asli.

## File yang paling sering diubah

1. Konfigurasi site/profil: `src/config.ts`
2. Konten artikel: `src/content/posts/`
3. Konfigurasi deploy: `astro.config.mjs`
4. Workflow GitHub Pages: `.github/workflows/deploy.yml`

## Mulai cepat

```bash
pnpm install
pnpm dev
```

Cek dan build:

```bash
pnpm astro check
pnpm type-check
pnpm run build
```

## Membuat posting baru

```bash
pnpm new-post your-post-name
```

Contoh Frontmatter:

```yaml
---
title: Post Baru
published: 2026-03-22
description: Ringkasan singkat
image: ""
tags: [catatan, matematika]
category: Study
draft: false
lang: zh_CN
---
```

## Cara publish

1. Jalankan `pnpm astro check && pnpm run build`
2. Push ke branch `main`
3. Tunggu GitHub Actions selesai deploy

## Kredit

- Template asli: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- Repo ini sudah disesuaikan untuk penggunaan blog pribadi saya
