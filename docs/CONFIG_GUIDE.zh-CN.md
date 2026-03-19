# Fuwari 博客完整配置指南（面向当前仓库）

本文针对你当前仓库 `fuwari` 编写，覆盖以下内容：

1. 站点基础配置（标题、语言、主题、Banner、Favicon 等）
2. 个人信息配置（头像、昵称、简介、社交链接）
3. 导航与跳转链接配置
4. 文章管理（增删改查，含草稿、分类、标签、封面）
5. 页面内容管理（About、自定义页面）
6. 部署到 GitHub Pages
7. 绑定自定义域名（含 DNS 记录与 HTTPS）
8. 常见问题与排查

---

## 1. 你主要会改哪些文件

| 目标 | 文件 |
| --- | --- |
| 全局站点信息、头像、导航、许可证、代码高亮主题 | `src/config.ts` |
| GitHub Pages 域名与子路径（`site`/`base`） | `astro.config.mjs` |
| 首页分页数量 | `src/constants/constants.ts` |
| 文章 Frontmatter 校验规则 | `src/content/config.ts` |
| 新建文章脚本模板 | `scripts/new-post.js` |
| 关于页内容 | `src/content/spec/about.md` |
| 侧栏组件顺序（头像/分类/标签） | `src/components/widget/SideBar.astro` |
| 页脚文案（RSS/Sitemap/Powered by） | `src/components/Footer.astro` |
| GitHub Actions 部署流程 | `.github/workflows/deploy.yml` |

---

## 2. 本地开发与构建命令

你当前项目推荐 `pnpm`，并且你已经有 `blog-env` 容器。

```bash
# 进入容器（容器名以你本机为准）
docker exec -it blog-env sh
cd /app

# 安装依赖
pnpm install --frozen-lockfile

# 本地开发
pnpm dev

# 类型检查
pnpm astro check

# 生产构建（含 Pagefind 搜索索引）
pnpm run build
```

---

## 3. 配置站点基础信息（标题、主题、语言、Banner、Favicon）

编辑 `src/config.ts` 的 `siteConfig`。

### 3.1 标题与副标题

```ts
title: "你的博客名",
subtitle: "你的副标题",
```

### 3.2 语言

可选值（由类型约束）：`en`、`zh_CN`、`zh_TW`、`ja`、`ko`、`es`、`th`、`vi`、`tr`、`id`

```ts
lang: "zh_CN",
```

### 3.3 主题色与是否允许访客改色

```ts
themeColor: {
  hue: 250,   // 0~360
  fixed: false, // true=隐藏访客调色按钮
},
```

### 3.4 顶部 Banner

```ts
banner: {
  enable: true,
  src: "assets/images/your-banner.png", // 相对 /src
  position: "center", // top | center | bottom
  credit: {
    enable: true,
    text: "Photo by ...",
    url: "https://...",
  },
},
```

`src` 路径规则：

1. 以 `/` 开头：从 `public/` 目录取，例如 `/images/banner.jpg`
2. 不以 `/` 开头：从 `src/` 目录解析，例如 `assets/images/banner.png`

### 3.5 Favicon

`siteConfig.favicon` 为空数组时，使用 `src/constants/icon.ts` 的默认图标。

如果你要自定义：

1. 把图标放到 `public/favicon/`
2. 在 `src/config.ts` 里填：

```ts
favicon: [
  { src: "/favicon/icon-light-32.png", theme: "light", sizes: "32x32" },
  { src: "/favicon/icon-dark-32.png", theme: "dark", sizes: "32x32" },
],
```

### 3.6 目录 TOC

```ts
toc: {
  enable: true,
  depth: 2, // 1~3
},
```

---

## 4. 配置头像、昵称、简介、社交链接

编辑 `src/config.ts` 的 `profileConfig`。

```ts
export const profileConfig = {
  avatar: "assets/images/my-avatar.png",
  name: "你的昵称",
  bio: "一句简介",
  links: [
    { name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/xxx" },
    { name: "X", icon: "fa6-brands:x-twitter", url: "https://x.com/xxx" },
  ],
};
```

说明：

1. `avatar` 路径规则同 Banner。
2. 图标使用 Iconify 名称，图标代码可在 https://icones.js.org 查询。
3. 若图标集未安装，需要安装对应包，例如：

```bash
pnpm add @iconify-json/fa6-brands
```

---

## 5. 配置导航与页面跳转链接

编辑 `src/config.ts` 的 `navBarConfig.links`。

```ts
links: [
  LinkPreset.Home,
  LinkPreset.Archive,
  LinkPreset.About,
  { name: "项目", url: "https://github.com/you/repo", external: true },
  { name: "友链", url: "/links/", external: false },
],
```

规则：

1. 内部链接不要写 `base` 前缀，框架会自动加。
2. `external: true` 会新标签页打开，并显示外链图标。
3. 内置预设在 `src/constants/link-presets.ts`：`Home`、`Archive`、`About`。

---

## 6. 文章管理（CRUD 全流程）

文章目录：`src/content/posts/`

### 6.1 新增文章（Create）

方式 A：脚本创建

```bash
pnpm new-post my-first-post
```

会生成 `src/content/posts/my-first-post.md`，模板来自 `scripts/new-post.js`。

方式 B：手动创建

你也可以创建目录结构：

```text
src/content/posts/my-post/
├─ index.md
└─ cover.jpg
```

### 6.2 Frontmatter 字段说明

由 `src/content/config.ts` 校验。

```yaml
---
title: My Post
published: 2026-03-20
updated: 2026-03-21
description: 简介
image: ./cover.jpg
tags: [Astro, Blog]
category: 技术
draft: false
lang: zh_CN
---
```

字段说明：

1. `published` 必填，日期
2. `updated` 可选，更新日期
3. `draft: true` 表示草稿
4. `image` 支持远程 URL、`/public` 路径、相对 Markdown 路径
5. `category` 可为空，空时归类为未分类

### 6.3 查询文章（Read）

1. 首页按 `published` 倒序展示（`src/utils/content-utils.ts`）
2. 文章详情页：`/posts/<slug>/`
3. 归档页：`/archive/`
4. 标签筛选：`/archive/?tag=Astro`
5. 分类筛选：`/archive/?category=技术`
6. 未分类筛选：`/archive/?uncategorized=true`

### 6.4 修改文章（Update）

直接改对应 `.md` 文件内容和 Frontmatter 即可。

### 6.5 删除文章（Delete）

删除文章文件或目录即可，例如：

```bash
rm -rf src/content/posts/my-post
```

建议同时删除不再使用的图片资源，避免仓库累积垃圾文件。

### 6.6 草稿发布规则（很重要）

当前实现是：

1. `开发模式` 会显示草稿
2. `生产构建` 会自动隐藏 `draft: true`

所以请以 `pnpm run build` 结果作为“线上最终效果”判断标准。

---

## 7. 关于页与其他页面管理

### 7.1 About 页面内容

编辑 `src/content/spec/about.md`，支持 Markdown 扩展语法（如 admonitions、GitHub 卡片等）。

### 7.2 新增自定义页面

例如新增友情链接页：

1. 新建 `src/pages/links.astro`
2. 在 `src/config.ts` 的 `navBarConfig.links` 添加 `{ name: "友链", url: "/links/" }`

---

## 8. 侧栏、页脚、分页等“布局元素”配置

### 8.1 侧栏组件顺序

文件：`src/components/widget/SideBar.astro`

你可以调整 `Profile / Categories / Tags` 的显示顺序，或删掉其中某个组件。

### 8.2 页脚内容

文件：`src/components/Footer.astro`

可改版权文案、保留或移除 RSS/Sitemap/Powered by 链接。

### 8.3 每页文章数

文件：`src/constants/constants.ts`

```ts
export const PAGE_SIZE = 8;
```

改完后首页分页会自动变化。

### 8.4 文章许可证模块

文件：`src/config.ts` 的 `licenseConfig`

```ts
licenseConfig: {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
}
```

---

## 9. 多语言文案怎么改

你已选择 `siteConfig.lang` 后，导航/按钮等文案来自 `src/i18n/languages/*.ts`。

例如中文简体文件：

`src/i18n/languages/zh_CN.ts`

你可以直接改这个文件里的翻译文本。

---

## 10. 部署到 GitHub Pages（你当前仓库）

你已经有 `.github/workflows/deploy.yml`，核心流程是正确的（`withastro/action@v5` + `actions/deploy-pages@v4`）。

你要确保：

1. 仓库 Settings -> Pages -> Source 选择 `GitHub Actions`
2. 推送到 `main` 分支会自动触发部署

### 10.1 `astro.config.mjs` 如何设置

你当前仓库远程是 `1222227744/blog`，属于“项目站点（Project Pages）”。

典型配置：

```ts
site: "https://1222227744.github.io",
base: "/blog/",
```

说明：

1. `site` 是 GitHub Pages 主域
2. `base` 是仓库名路径
3. 如果仓库名是 `username.github.io`，通常 `base` 用 `/`

---

## 11. 绑定你自己的域名（重点）

以下流程基于 2026-03 可用的 GitHub 官方文档：

1. GitHub Pages 自定义域名总入口  
   https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
2. DNS 记录与具体配置  
   https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
3. 域名验证（防止劫持）  
   https://docs.github.com/en/enterprise-cloud@latest/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
4. Astro 的 GitHub Pages 指南  
   https://docs.astro.build/en/guides/deploy/github/

### 11.1 第一步：先在 GitHub 仓库里设置 Custom domain

路径：`Repository Settings -> Pages -> Custom domain`

先填你的域名再去配 DNS，避免子域名被抢注风险。

### 11.2 第二步：DNS 配置

#### 情况 A：你用子域名（推荐上手）

例子：`www.example.com`

添加 `CNAME`：

1. Host: `www`
2. Value: `1222227744.github.io`

#### 情况 B：你用根域名（apex）

例子：`example.com`

添加 `A` 记录到 GitHub Pages IP（官方当前值）：

1. `185.199.108.153`
2. `185.199.109.153`
3. `185.199.110.153`
4. `185.199.111.153`

可选再加 `AAAA`（IPv6）：

1. `2606:50c0:8000::153`
2. `2606:50c0:8001::153`
3. `2606:50c0:8002::153`
4. `2606:50c0:8003::153`

建议同时配置 `www` 的 CNAME，这样 GitHub 会自动做 `www <-> apex` 跳转。

### 11.3 第三步：修改 Astro 配置

绑定自定义域名后，通常应改为：

```ts
site: "https://example.com",
base: "/",
```

如果你之前是项目路径 `base: "/blog/"`，要去掉，避免链接多出 `/blog/`。

### 11.4 第四步：是否需要 `public/CNAME`

Astro 文档会建议添加 `public/CNAME`。  
但 GitHub 文档说明：当你使用自定义 GitHub Actions 发布源时，`CNAME` 文件不是必需项。

你的仓库就是 Actions 发布流，所以以仓库 Pages 设置中的 Custom domain 为准。

### 11.5 第五步：开启 HTTPS 和域名验证

1. 等 DNS 生效后，在 Pages 设置里勾选 `Enforce HTTPS`
2. 在账号或组织的 `Settings -> Pages` 完成域名验证（添加 TXT 记录）

注意：

1. 不要使用 `*.example.com` 这种通配符记录，存在接管风险
2. 如果你配置了 CAA 记录，至少要允许 `letsencrypt.org`，否则 HTTPS 证书可能失败

### 11.6 Windows 下快速检查 DNS 是否生效

```powershell
Resolve-DnsName example.com -Type A
Resolve-DnsName www.example.com -Type CNAME
Resolve-DnsName _github-pages-challenge-你的GitHub用户名.example.com -Type TXT
```

---

## 12. 推荐发布流程（每次更新内容时）

1. 修改配置或文章
2. 本地检查：`pnpm astro check`
3. 本地构建：`pnpm run build`
4. 提交并推送到 `main`
5. 在 GitHub Actions 看部署日志
6. 打开站点验证页面、文章和链接

---

## 13. 常见问题速查

### Q1: 构建时报 `window is not defined`

原因：服务端渲染阶段使用了浏览器 API。  
处理：放到 `onMount`，或组件改 `client:only="svelte"`。

### Q2: 构建时报 Tailwind `@apply` 类不存在

原因：在一个样式文件里 `@apply` 另一个文件自定义类，构建顺序不稳定。  
处理：改成原子类，或确保同层 `@layer` 内可解析。

### Q3: 线上链接 404，路径多一段或少一段

原因：`astro.config.mjs` 的 `base` 配置与部署 URL 不匹配。  
处理：项目页用 `base: "/仓库名/"`；自定义域名通常用 `base: "/"`。

### Q4: 草稿在本地能看到，线上看不到

这是设计行为。`draft: true` 在生产构建会被过滤。

---

## 14. 你可以直接套用的最小个性化清单

1. 改 `src/config.ts`：
   `siteConfig.title`、`siteConfig.subtitle`、`siteConfig.lang`、`profileConfig`、`navBarConfig`
2. 换头像和 Banner 图片：
   放 `src/assets/images/`，更新路径
3. 改关于页：
   `src/content/spec/about.md`
4. 发第一篇文章：
   `pnpm new-post hello-world`
5. 校验并构建：
   `pnpm astro check && pnpm run build`
6. 推送部署：
   `git push origin main`
7. 绑定域名后改 `astro.config.mjs`：
   `site=https://你的域名`，`base=/`

