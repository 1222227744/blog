# Kho blog của Two (dựa trên Fuwari)

Đây là repo blog cá nhân của tôi, được tùy biến từ [saicaca/fuwari](https://github.com/saicaca/fuwari).  
Tài liệu này mô tả cách vận hành repo của tôi, không phải README gốc của template.

## Các file quan trọng

1. Cấu hình site/profile: `src/config.ts`
2. Bài viết: `src/content/posts/`
3. Cấu hình deploy: `astro.config.mjs`
4. Workflow GitHub Pages: `.github/workflows/deploy.yml`

## Bắt đầu nhanh

```bash
pnpm install
pnpm dev
```

Kiểm tra và build:

```bash
pnpm astro check
pnpm type-check
pnpm run build
```

## Tạo bài viết mới

```bash
pnpm new-post your-post-name
```

Ví dụ Frontmatter:

```yaml
---
title: Bài viết mới
published: 2026-03-22
description: Mô tả ngắn
image: ""
tags: [note, math]
category: Study
draft: false
lang: zh_CN
---
```

## Quy trình publish

1. Chạy `pnpm astro check && pnpm run build`
2. Push lên nhánh `main`
3. Chờ GitHub Actions deploy xong

## Ghi công

- Template gốc: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- Repo này đã được cá nhân hóa về nội dung và cấu hình deploy
