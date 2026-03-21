# Two 的博客仓库说明（基于 Fuwari）

这是我自己的博客仓库，基于 [saicaca/fuwari](https://github.com/saicaca/fuwari) 二次改造。

本文件用于说明**我的博客项目怎么维护和发布**，不是原模板的官方 README。

## 你在这个仓库里最常做的事

1. 改站点信息与个人资料：`src/config.ts`
2. 写新文章：`src/content/posts/`
3. 调整部署参数：`astro.config.mjs`
4. 推送到 GitHub 后自动部署：`.github/workflows/deploy.yml`

## 快速开始

```bash
pnpm install
pnpm dev
```

类型检查与构建：

```bash
pnpm astro check
pnpm type-check
pnpm run build
```

## 关键配置文件

- 站点标题/副标题/主题/导航/头像/社交链接：`src/config.ts`
- `site` 与 `base`（影响 GitHub Pages 路径）：`astro.config.mjs`
- 文章 Frontmatter 校验：`src/content/config.ts`
- 新建文章脚本：`scripts/new-post.js`

## 新建并发布文章

```bash
pnpm new-post your-post-name
```

然后编辑 `src/content/posts/your-post-name.md`（或目录型文章的 `index.md`）。

Frontmatter 示例：

```yaml
---
title: 我的新文章
published: 2026-03-22
description: 一句话简介
image: ""
tags: [学习, 笔记]
category: 数学
draft: false
lang: zh_CN
---
```

发布流程：

1. 本地检查：`pnpm astro check && pnpm run build`
2. 提交代码并推送到 `main`
3. 等待 GitHub Actions 自动部署完成

## GitHub Pages 注意事项

1. 仓库 Settings -> Pages -> Source 必须选 `GitHub Actions`
2. `astro.config.mjs` 的 `site`/`base` 要和你的实际域名路径一致
3. 绑定自定义域名后通常把 `base` 设为 `/`

## 完整配置教程

请看我写的详细文档：

- [CONFIG_GUIDE.zh-CN.md](./CONFIG_GUIDE.zh-CN.md)

## 致谢

- 模板来源：[saicaca/fuwari](https://github.com/saicaca/fuwari)
- 本仓库是个人博客落地版本，包含我的内容与部署配置
