# Guía de Desarrollo - Senior Living Options

## Comandos Principales

```bash
# Desarrollo local (localhost:4321)
npm run dev

# Validar TypeScript + Astro
npm run check

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check

# Validar contenido (frontmatter, fechas, imágenes, links)
npm run validate:content

# Build producción
npm run build

# Preview build local
npm run preview
```

## Flujo de Trabajo Diario

### 1. Iniciar desarrollo

```bash
npm run dev
```

- Abre `http://localhost:4321`
- Hot reload automático
- Type checking en tiempo real

### 2. Crear nuevo artículo

```bash
# 1. Crear archivo en la categoría correspondiente
touch src/content/entries/assisted-living/nuevo-articulo.md

# 2. Añadir frontmatter (ver plantilla abajo)
# 3. Escribir contenido en Markdown
# 4. Validar
npm run validate:content
```

### 3. Plantilla de Frontmatter

```yaml
---
title: 'Título del Artículo (máx 120 chars)'
description: 'Descripción para SEO y social (50-300 chars)'
publishDate: 2024-01-15
lastReviewed: 2024-11-20
category: assisted-living # assisted-living | memory-care | nursing-homes | in-home-care | senior-care-costs | caregiver-resources
isPillar: false # true solo para guías fundamentales
sources: # Obligatorio para pilares (mín 3 URLs .gov/.org)
  - 'https://www.medicare.gov/...'
  - 'https://www.nia.nih.gov/...'
readingTime: 8 # Calculado en build, opcional manual
image: /images/articulo-hero.webp
imageAlt: 'Descripción accesible de la imagen'
tags: ['costo', 'checklist']
states: ['CA', 'TX', 'FL']
showTableOfContents: true
relatedArticles:
  - 'otro-articulo-relacionado'
---
```

### 4. Commit y Push

```bash
# Verificar todo antes de commit
npm run check && npm run lint && npm run validate:content

# Commit convencional
git add .
git commit -m "feat: nueva guía sobre assisted living en California"

# Push
git push origin feature/nueva-guia
```

## Estructura de Contenido

### Categorías (Enum fijo)

| Slug                  | Label           | Uso                                        |
| --------------------- | --------------- | ------------------------------------------ |
| `assisted-living`     | Assisted Living | Comunidades residenciales con apoyo        |
| `memory-care`         | Memory Care     | Unidades especializadas Alzheimer/demencia |
| `nursing-homes`       | Nursing Homes   | Atención enfermería 24/7                   |
| `in-home-care`        | In-Home Care    | Cuidado en el hogar                        |
| `senior-care-costs`   | Costs & Finance | Costos, Medicare, Medicaid, seguros        |
| `caregiver-resources` | Caregiver Help  | Recursos para cuidadores familiares        |

### Tipos de Contenido

- **Pillar (`isPillar: true`)**: Guías completas 2500+ palabras, revisadas cada 6 meses, 3+ fuentes
  gubernamentales
- **Artículo normal (`isPillar: false`)**: 800-2000 palabras, foco específico, revisadas anualmente

## Convenciones de Código

### TypeScript

- `strict: true` - Sin `any`, usar `unknown` + type guards
- Interfaces para props de componentes
- Types derivados de collections: `CollectionEntry<'entries'>`

### Astro Components

- Un componente por archivo (`NombreComponente.astro`)
- Props tipadas: `interface Props { ... }`
- CSS scoped por defecto
- Slots para composición

### CSS (Vanilla)

- Tokens en `tokens.css` (custom properties `--sl-*`)
- Capas: `@layer base, components, utilities`
- Mobile-first, breakpoints en tokens
- BEM simplificado: `.c-componente`, `.c-componente--variante`

### Git

- Main protegida, solo via PR
- Branches: `feat/descripcion`, `fix/descripcion`, `docs/descripcion`
- Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
- PR requieren CI pass

## Debugging Común

### Type errors en collections

```bash
# Regenerar tipos
npm run check
# O reiniciar TS server en VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

### Imágenes no cargan

- Verificar ruta en `public/images/`
- Frontmatter usa ruta relativa: `/images/archivo.webp`
- Formato: WebP preferido, AVIF para moderna

### Build falla en Cloudflare

- Revisar logs en GitHub Actions
- Común: `astro check` falla por tipos
- `npm run validate:content` falla por frontmatter

## Variables de Entorno

| Variable           | Descripción      | Requerida  |
| ------------------ | ---------------- | ---------- |
| `PUBLIC_SITE_URL`  | URL producción   | Sí (build) |
| `PUBLIC_SITE_NAME` | Nombre sitio SEO | Sí (build) |
| `ANALYTICS_ID`     | ID Plausible/GA4 | No         |

En `.env.local` para desarrollo:

```env
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Senior Living Options (Dev)
```

## Testing Checklist Pre-Deploy

- [ ] `npm run check` pasa
- [ ] `npm run lint` pasa
- [ ] `npm run format:check` pasa
- [ ] `npm run validate:content` pasa
- [ ] `npm run build` genera `dist/` sin errores
- [ ] `npm run preview` funciona local
- [ ] Verificar páginas: `/`, `/category/*`, `/article/*`, `/search/`
- [ ] Verificar SEO: meta tags, JSON-LD, sitemap
- [ ] Verificar responsive: mobile, tablet, desktop
- [ ] Verificar accesibilidad: skip links, focus visible, contraste

## Performance Budget

| Métrica                  | Límite  |
| ------------------------ | ------- |
| HTML gzipped             | < 30 KB |
| CSS gzipped              | < 15 KB |
| JS gzipped               | < 10 KB |
| Lighthouse Performance   | > 95    |
| Lighthouse Accessibility | > 95    |
| Lighthouse SEO           | > 95    |

## Recursos Útiles

- [Astro Docs](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Web.dev Performance](https://web.dev/fast/)
