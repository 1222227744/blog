# Repositorio del blog de Two (basado en Fuwari)

Este repositorio es mi blog personal, adaptado desde [saicaca/fuwari](https://github.com/saicaca/fuwari).  
Este README describe **mi proyecto ya personalizado**, no el template original.

## Archivos principales

1. Configuración del sitio/perfil: `src/config.ts`
2. Artículos: `src/content/posts/`
3. Configuración de despliegue: `astro.config.mjs`
4. Flujo de GitHub Pages: `.github/workflows/deploy.yml`

## Inicio rápido

```bash
pnpm install
pnpm dev
```

Comprobación y build:

```bash
pnpm astro check
pnpm type-check
pnpm run build
```

## Crear una nueva entrada

```bash
pnpm new-post your-post-name
```

Ejemplo de Frontmatter:

```yaml
---
title: Mi nueva entrada
published: 2026-03-22
description: Resumen corto
image: ""
tags: [notas, matematicas]
category: Estudio
draft: false
lang: zh_CN
---
```

## Publicación

1. Ejecuta: `pnpm astro check && pnpm run build`
2. Sube cambios a `main`
3. Espera a que termine GitHub Actions

## Créditos

- Plantilla original: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- Este repo contiene mis ajustes de contenido, perfil y despliegue
