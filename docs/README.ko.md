# Two의 블로그 저장소 (Fuwari 기반)

이 저장소는 [saicaca/fuwari](https://github.com/saicaca/fuwari)를 기반으로 만든 **개인 블로그 프로젝트**입니다.  
이 문서는 원본 템플릿 README가 아니라, 내 저장소 운영 문서입니다.

## 자주 수정하는 파일

1. 사이트/프로필 설정: `src/config.ts`
2. 게시글: `src/content/posts/`
3. 배포 관련 설정: `astro.config.mjs`
4. GitHub Pages 워크플로: `.github/workflows/deploy.yml`

## 빠른 시작

```bash
pnpm install
pnpm dev
```

검사 및 빌드:

```bash
pnpm astro check
pnpm type-check
pnpm run build
```

## 새 글 작성

```bash
pnpm new-post your-post-name
```

Frontmatter 예시:

```yaml
---
title: 새 글
published: 2026-03-22
description: 요약
image: ""
tags: [note, math]
category: Study
draft: false
lang: zh_CN
---
```

## 배포 순서

1. `pnpm astro check && pnpm run build`
2. `main` 브랜치에 push
3. GitHub Actions 배포 완료 확인

## 참고

- 원본 템플릿: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- 이 저장소는 개인 운영 목적에 맞게 내용/설정을 변경했습니다
