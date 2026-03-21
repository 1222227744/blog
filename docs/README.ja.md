# Two のブログリポジトリ（Fuwari ベース）

このリポジトリは、[saicaca/fuwari](https://github.com/saicaca/fuwari) をベースにした **私用ブログ** です。  
この README はテンプレート本家ではなく、私の運用用ドキュメントです。

## よく編集する場所

1. サイト情報とプロフィール: `src/config.ts`
2. 記事: `src/content/posts/`
3. デプロイ設定: `astro.config.mjs`
4. GitHub Pages ワークフロー: `.github/workflows/deploy.yml`

## クイックスタート

```bash
pnpm install
pnpm dev
```

チェックとビルド:

```bash
pnpm astro check
pnpm type-check
pnpm run build
```

## 新規記事の作成

```bash
pnpm new-post your-post-name
```

Frontmatter 例:

```yaml
---
title: 新しい記事
published: 2026-03-22
description: 要約
image: ""
tags: [note, math]
category: Study
draft: false
lang: zh_CN
---
```

## 公開手順

1. `pnpm astro check && pnpm run build`
2. `main` ブランチへ push
3. GitHub Actions の完了を確認

## 備考

- 本家テンプレート: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- このリポジトリは個人用に構成・文章を変更しています
