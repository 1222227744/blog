# Two's Blog (Based on Fuwari)

This repository is my personal blog project, adapted from the open-source template [saicaca/fuwari](https://github.com/saicaca/fuwari).

This README is for **my deployed blog repo**, not the original template documentation.

## Language Docs

- [中文](docs/README.zh-CN.md)
- [日本語](docs/README.ja.md)
- [한국어](docs/README.ko.md)
- [Español](docs/README.es.md)
- [ไทย](docs/README.th.md)
- [Tiếng Việt](docs/README.vi.md)
- [Bahasa Indonesia](docs/README.id.md)

## Project Status

- Framework: Astro 5
- Package manager: pnpm 9
- Deployment target: GitHub Pages
- Current site config source: `src/config.ts`

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start local dev server

```bash
pnpm dev
```

### 3. Type checks

```bash
pnpm astro check
pnpm type-check
```

### 4. Production build

```bash
pnpm run build
```

## Main Config Files

- Site/profile/navbar/license: `src/config.ts`
- Astro site/base/deploy behavior: `astro.config.mjs`
- Content schema: `src/content/config.ts`
- New post script: `scripts/new-post.js`

For a full Chinese configuration tutorial, see:

- [docs/CONFIG_GUIDE.zh-CN.md](docs/CONFIG_GUIDE.zh-CN.md)

## Writing Posts

Create a post:

```bash
pnpm new-post your-post-name
```

Then edit the generated file in `src/content/posts/`.

Frontmatter example:

```yaml
---
title: My Post
published: 2026-03-22
description: Short summary
image: ""
tags: [notes, math]
category: Study
draft: false
lang: zh_CN
---
```

## Deployment (GitHub Pages)

This repo uses GitHub Actions workflow:

- `.github/workflows/deploy.yml`

Before deploying, confirm:

1. `astro.config.mjs` has correct `site` and `base`
2. Repository Settings -> Pages -> Source = `GitHub Actions`

## Credits

- Upstream template: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- My repository customizations: content, profile, deployment settings, docs, and post workflow

## License

This repository follows the existing project license:

- [LICENSE](LICENSE)
