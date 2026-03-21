# คลังบล็อกของ Two (พัฒนาต่อจาก Fuwari)

โปรเจกต์นี้คือบล็อกส่วนตัวของฉัน โดยนำ [saicaca/fuwari](https://github.com/saicaca/fuwari) มาปรับใช้  
README นี้เป็นเอกสารสำหรับรีโปของฉันเอง ไม่ใช่เอกสารต้นฉบับของเทมเพลต

## ไฟล์ที่ใช้งานบ่อย

1. ตั้งค่าเว็บไซต์/โปรไฟล์: `src/config.ts`
2. บทความ: `src/content/posts/`
3. ตั้งค่าการ deploy: `astro.config.mjs`
4. Workflow ของ GitHub Pages: `.github/workflows/deploy.yml`

## เริ่มต้นอย่างรวดเร็ว

```bash
pnpm install
pnpm dev
```

ตรวจสอบและ build:

```bash
pnpm astro check
pnpm type-check
pnpm run build
```

## สร้างโพสต์ใหม่

```bash
pnpm new-post your-post-name
```

ตัวอย่าง Frontmatter:

```yaml
---
title: โพสต์ใหม่ของฉัน
published: 2026-03-22
description: สรุปสั้น
image: ""
tags: [note, math]
category: Study
draft: false
lang: zh_CN
---
```

## วิธีเผยแพร่

1. รัน `pnpm astro check && pnpm run build`
2. push ไปที่ `main`
3. รอ GitHub Actions deploy เสร็จ

## เครดิต

- เทมเพลตต้นฉบับ: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- รีโปนี้มีการปรับแต่งเนื้อหาและการ deploy สำหรับใช้งานส่วนตัว
