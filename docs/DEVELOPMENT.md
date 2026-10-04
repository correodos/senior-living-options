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

### Checklist Visual — Pillar Page (copiar al crear nueva)

**Frontmatter**
- [ ] `title` ≤ 120 chars, descriptivo + año
- [ ] `description` 50-300 chars, incluye patrón "Everything families need to know about [topic]: what it is, what it costs in [year], how Medicaid and VA benefits help, and how to choose the right facility."
- [ ] `publishDate` = `lastReviewed` = hoy (YYYY-MM-DD)
- [ ] `category`: uno de 6 enum
- [ ] `isPillar: true`
- [ ] `sources`: MÍN 7 URLs .gov/.org verificables
- [ ] `readingTime`: estimado (palabras totales / 200)
- [ ] `image`: `/images/[category]-complete-guide.png` (subir a `public/images/`)
- [ ] `imageAlt`: descriptivo, incluye contexto
- [ ] `tags`: 5-6 tags relevantes
- [ ] `states`: códigos 2 letras estados cubiertos
- [ ] `showTableOfContents: true`
- [ ] `relatedArticles`: 3 slugs existentes misma/otra categoría

**Estructura Markdown**
- [ ] `## Key Takeaways` (5-6 bullets, **negrita inicial**, `---` abajo)
- [ ] Intro empático 2-3 párrafos (`---` abajo)
- [ ] 6-8 secciones `## H2` principales
- [ ] Subsecciones `### H3` donde aplique
- [ ] Mín 2 tablas comparativas (`| Header | Header |` + `|---|---|`)
- [ ] Mín 2 blockquotes `>` con cita + fuente .gov + enlace
- [ ] Enlaces internos a categorías relacionadas (`→ [Texto](/category/x/)`)
- [ ] `## Frequently Asked Questions` (5-6 preguntas `###`)
- [ ] `## Sources` numeradas (mín 7, formato: `1. **Fuente.** "Título." URL. Acceso: fecha.`)

**Validación**
- [ ] `npm run validate:content` pasa (warnings OK para pillar)
- [ ] `npm run check` pasa (tipos)
- [ ] Preview local: hero se ve, TOC funciona, tablas scroll mobile, CTA visible

### 3. Plantilla de Frontmatter

#### Artículo Normal (`isPillar: false`)

```yaml
---
title: 'Título del Artículo (máx 120 chars)'
description: 'Descripción para SEO y social (50-300 chars)'
publishDate: 2024-01-15
lastReviewed: 2024-11-20
category: assisted-living # assisted-living | memory-care | nursing-homes | in-home-care | senior-care-costs | caregiver-resources
isPillar: false
sources: # Opcional para artículos normales (1-2 URLs .gov/.org)
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

#### Pillar Page (`isPillar: true`) — Plantilla Completa

Basada en `assisted-living-complete-guide.md` (referencia):

```yaml
---
title: 'The Complete Guide to [Topic]: Costs, Services, and How to Choose'
description: 'Everything families need to know about [topic]: what it is, what it costs in [year], how Medicaid and VA benefits help, and how to choose the right facility.'
publishDate: 2026-09-27
lastReviewed: 2026-09-27
category: assisted-living # assisted-living | memory-care | nursing-homes | in-home-care | senior-care-costs | caregiver-resources
isPillar: true
sources: # OBLIGATORIO: MÍN 7 URLs .gov/.org
  - 'https://www.nia.nih.gov/health/...'
  - 'https://www.nia.nih.gov/health/...'
  - 'https://www.nia.nih.gov/health/...'
  - 'https://www.ahcancal.org/...'
  - 'https://investor.genworth.com/...'
  - 'https://www.aarp.org/...'
  - 'https://www.benefits.va.gov/...'
readingTime: 14 # Estimado: palabras totales / 200
image: /images/[category]-complete-guide.png
imageAlt: 'Senior smiling in [topic] community common area'
tags:
  - '[topic]'
  - 'senior care'
  - 'long-term care'
  - 'memory care'
  - 'aging parents'
states:
  - 'CA'
  - 'TX'
  - 'FL'
  - 'NY'
  - 'MA'
  - 'NJ'
  - 'HI'
  - 'CT'
showTableOfContents: true
relatedArticles:
  - '[topic]-vs-memory-care'
  - 'medicare-[topic]'
  - 'when-nursing-home'
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

**Pillar Page Styles** (`src/layouts/PillarArticleLayout.astro`, líneas ~189-750):
- Hero: `.c-pillar-hero`, `.c-pillar-hero__overlay`, `.c-pillar-hero__content`, `.c-pillar-hero__title`, `.c-pillar-hero__description`
- TOC Inline: `.c-pillar-toc`, `.c-pillar-toc__list`, `.c-pillar-toc__link`
- Key Takeaways: `h2#key-takeaways + ul` (checks ✓ verdes, fondo primary-light)
- Tablas responsive: `.c-pillar-content table`, `.table-wrapper` (JS enhanced: scroll shadows, mobile card layout)
- Reading Progress: `.c-reading-progress` (top bar), `.c-back-to-top` (fixed button)
- CTA Final: `.c-pillar-cta` (2 botones, fondo primary-light)
- FAQ Schema: auto-extraído de H3 bajo "Frequently Asked Questions"
- Theme Toggle: solo en Header global (`Header.astro`), NO en hero

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

- Revisar logs en Cloudflare Pages dashboard (no GitHub Actions)
- Común: `astro check` falla por tipos
- `npm run validate:content` falla por frontmatter

## Variables de Entorno

| Variable           | Dónde configurar | Requerida | Valor por defecto                         |
| ------------------ | ---------------- | --------- | ----------------------------------------- |
| `PUBLIC_SITE_URL`  | Cloudflare Pages | Sí        | `https://senior-living-options.pages.dev` |
| `PUBLIC_SITE_NAME` | Cloudflare Pages | Sí        | `Senior Living Options`                   |
| `ANALYTICS_ID`     | Cloudflare Pages | No        | -                                         |

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
