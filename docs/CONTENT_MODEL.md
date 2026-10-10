# Content Model - Senior Living Options

> Estado: actualizado en octubre de 2026. El contenido del sitio está en inglés de EE. UU.; esta
> documentación, en español. El esquema real vive en `src/utils/entry-schema.ts`.

## Collection: `entries`

Una sola collection para todo el contenido. Cada archivo Markdown en `src/content/entries/` sigue
este esquema. Se define en `src/content.config.ts` (glob loader) y el esquema se comparte con
`scripts/validate-content.ts`.

### Schema Zod (resumen de `src/utils/entry-schema.ts`)

```typescript
import { z } from 'astro/zod';

export const entrySchema = z.object({
  // Obligatorios
  title: z.string().min(1).max(120),
  description: z.string().min(50).max(300), // meta description + social
  publishDate: z.coerce.date(),
  lastReviewed: z.coerce.date(),
  category: z.enum([
    'assisted-living',
    'memory-care',
    'nursing-homes',
    'in-home-care',
    'senior-care-costs',
    'caregiver-resources',
  ]),
  isPillar: z.boolean().default(false),

  // Opcionales
  sources: z.array(z.url()).optional(),
  readingTime: z.number().int().positive().optional(), // minutos, se escribe a mano
  image: z.string().optional(), // ruta desde /public, .webp
  imageAlt: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.url().optional(),
  tags: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  relatedArticles: z.array(z.string()).optional(),
});
```

### Qué campos usa realmente el código

| Campo                                                   | Uso hoy                                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `title`, `description`, `category`, `isPillar`          | Páginas, tarjetas, SEO, JSON-LD                                                          |
| `publishDate`, `lastReviewed`                           | Fechas en pantalla, `dateModified`, `lastmod` del sitemap                                |
| `sources`                                               | Esquema `Article`; la lista visible es la sección `## Sources` del Markdown              |
| `readingTime`                                           | "N min read" (obligatorio en pilares; se escribe a mano)                                 |
| `image`, `imageAlt`                                     | Hero y tarjetas. Si existen `-480.webp` y `-768.webp`, se genera `srcset`                |
| `seoTitle`, `seoDescription`                            | Sobrescriben título y descripción en `<head>` (`src/utils/seo.ts`)                       |
| `noIndex`, `noFollow`                                   | Robots meta, índice de búsqueda y artículos relacionados                                 |
| `relatedArticles`                                       | Se lee en los layouts; hoy ningún artículo lo rellena (los relacionados son automáticos) |
| `states`, `tags`, `showTableOfContents`, `canonicalUrl` | **Definidos en el esquema pero sin efecto todavía.** El TOC siempre se muestra           |

### Frontmatter de ejemplo (pilar)

```yaml
---
title: 'The Complete Guide to Assisted Living: Costs, Services, and How to Choose'
seoTitle: 'Assisted Living Guide: Costs, Services & How to Choose'
description:
  'Everything families need to know about assisted living: what it is, what it costs in 2025, how
  Medicaid and VA benefits help, and how to choose the right facility.'
publishDate: 2026-09-27
lastReviewed: 2026-10-09
category: assisted-living
isPillar: true
sources:
  - 'https://www.nia.nih.gov/health/...'
  # mínimo 3 (error), recomendado 7 o más (.gov/.org)
readingTime: 14
image: /images/assisted-living-complete-guide.webp
imageAlt: 'Senior smiling in assisted living community common area'
tags: ['assisted living', 'senior care', 'long-term care']
showTableOfContents: true
---
```

`title` puede tener hasta 120 caracteres; si supera unos 60, añade `seoTitle` (máximo 60) para que
no se corte en los resultados de Google.

## Estructura estándar de una guía pilar

Las guías pilar (`isPillar: true`) siguen esta estructura. Es una **recomendación editorial**: el
validador solo avisa (warning) de lo que falta.

```markdown
## Key Takeaways

- **Punto clave 1** — descripción concisa con dato específico. (5-6 bullets, negrita inicial)

---

Intro empático (2-3 párrafos) que conecte con la situación del lector.

---

## What Is [Topic]?

### Tabla comparativa principal

## Costs (tabla nacional con fuente CareScout + variación por estado)

## Who Pays: Medicare, Medicaid, VA, seguro de cuidados a largo plazo

## Services / What's Included

## How to Choose (pasos + tabla "What to look for")

## Frequently Asked Questions (5-6 preguntas con `###`)

## Sources (lista numerada, mínimo 7 recomendado, preferiblemente .gov/.org)
```

### Reglas de estructura (resumen)

| Elemento                        | Requerido       | Detalle                                                  |
| ------------------------------- | --------------- | -------------------------------------------------------- |
| `## Key Takeaways`              | Recomendado     | 5-6 bullets, negrita inicial, `---` abajo                |
| Intro empático                  | Sí              | 2-3 párrafos                                             |
| Secciones `## H2`               | Mín 6           | Alimentan el TOC (solo H2)                               |
| Tablas comparativas             | Mín 2           | Sintaxis pipe                                            |
| Blockquotes con fuente          | Mín 2           | Cita + enlace .gov/.org                                  |
| Enlaces internos                | Mín 1           | A `/category/[slug]/` u otras guías                      |
| `## Frequently Asked Questions` | Sí              | Se convierte en JSON-LD `FAQPage` (H3 bajo esta sección) |
| `## Sources`                    | Sí              | Lista numerada                                           |
| Longitud                        | ~2500+ palabras | Objetivo, no hard limit                                  |

Estado actual: solo `assisted-living` y `nursing-homes` tienen `## Key Takeaways`;
`validate:content` lo avisa en las demás guías.

## Cómo se muestra un artículo

### Guía pilar (`PillarArticleLayout.astro`)

| Componente           | Clase CSS                     | Comportamiento real                                                                                            |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Hero**             | `.c-pillar-hero`              | Imagen + overlay; crece con el contenido (altura mínima `min(40vh, 500px)`)                                    |
| **Título**           | `.c-pillar-hero__title`       | Blanco fijo `#ffffff` en ambos modos, serif, text-shadow                                                       |
| **Descripción**      | `.c-pillar-hero__description` | `var(--sl-color-text-muted)`                                                                                   |
| **Etiquetas**        | `.c-badge`                    | Categoría y "Pillar Article"                                                                                   |
| **TOC**              | `.c-pillar-toc`               | Caja **inline arriba**, solo H2, título "In this guide". **No es sticky**                                      |
| **Key Takeaways**    | `h2#key-takeaways + ul`       | Fondo `var(--sl-color-primary-light)`, checks ✓ (si la guía tiene la sección)                                  |
| **Tablas**           | `.c-pillar-content table`     | Scroll horizontal accesible por teclado; las tablas de estados con más de 5 columnas pasan a tarjetas en móvil |
| **Reading Progress** | `.c-reading-progress`         | Barra superior de 3px, `z-index: 201`                                                                          |
| **Back to Top**      | `.c-back-to-top`              | Botón fijo abajo a la derecha tras hacer scroll                                                                |
| **CTA final**        | `.c-pillar-cta`               | Tres botones: categoría (primario), costes (outline) y búsqueda (outline)                                      |
| **Relacionados**     | `RelatedArticles.astro`       | "Related Guides": misma categoría y luego otros pilares                                                        |
| **FAQ Schema**       | Automático                    | JSON-LD `FAQPage` desde las H3 bajo "Frequently Asked Questions"                                               |
| **Theme Toggle**     | En el Header                  | Solo en la cabecera global                                                                                     |

### Artículo normal (`ArticleLayout.astro`)

- Breadcrumbs, categoría, título y metadatos ("Published" y "Updated" con la fecha de revisión).
- Contenido en columna principal (`.c-article-main`) con **TOC sticky a la derecha** (H2 y H3,
  título "In this article") en pantallas grandes y un TOC plegable en móvil.
- CTA final con dos botones (categoría y guía pilar) y artículos relacionados.
- No tiene estilo propio de "Key Takeaways".

No se muestran "Revisado por" ni botón de compartir: no hay revisores reales y no se inventan.

### Categorías y Labels

| Enum Value            | Label           | Token de color                    | Icono |
| --------------------- | --------------- | --------------------------------- | ----- |
| `assisted-living`     | Assisted Living | `--sl-color-al-bg` / `-al-text`   | 🏠    |
| `memory-care`         | Memory Care     | `--sl-color-mc-bg` / `-mc-text`   | 🧠    |
| `nursing-homes`       | Nursing Homes   | `--sl-color-nh-bg` / `-nh-text`   | 🏥    |
| `in-home-care`        | In-Home Care    | `--sl-color-ihc-bg` / `-ihc-text` | 🏡    |
| `senior-care-costs`   | Costs & Finance | `--sl-color-cf-bg` / `-cf-text`   | 💰    |
| `caregiver-resources` | Caregiver Help  | `--sl-color-cr-bg` / `-cr-text`   | 🤝    |

Definidas en `src/utils/category.ts` (cada categoría tiene su `pillarSlug`).

## Reglas de Contenido

### Guías pilar (`isPillar: true`)

- **Longitud**: 2,500+ palabras. **Actualización**: `lastReviewed` cada 6 meses como máximo.
- **Fuentes**: mínimo 3 (el validador da error con menos) y 7 o más recomendadas, `.gov/.org`.
- **Imagen**: `.webp` en `public/images/`, más las variantes `<nombre>-480.webp` y `-768.webp`.
- **Ejemplo de URL**: `/article/assisted-living/assisted-living-complete-guide/`

### Artículos normales (`isPillar: false`)

- **Longitud**: 800-2,000 palabras (los actuales son más largos). **Revisión**: cada 12 meses.
- **Fuentes**: 1-2 como mínimo.
- **Ejemplo de URL**:
  `/article/caregiver-resources/senior-living-options-complete-comparison-of-all-7-types/`

El `slug`/`id` de un artículo incluye su carpeta de categoría.

## Contenido actual

```
src/content/entries/
├── assisted-living/assisted-living-complete-guide.md           # pilar
├── memory-care/memory-care-complete-guide.md                   # pilar
├── nursing-homes/nursing-homes-complete-guide.md               # pilar
├── in-home-care/in-home-care-complete-guide.md                 # pilar
├── senior-care-costs/senior-care-costs-complete-guide.md       # pilar
└── caregiver-resources/
    ├── caregiver-resources-complete-guide.md                   # pilar
    └── senior-living-options-complete-comparison-of-all-7-types.md   # artículo normal
```

No hay más artículos de soporte planificados. Si se añaden, enlazan a su guía pilar.

## Validaciones (`npm run validate:content`)

`scripts/validate-content.ts` (con `tsx`) comprueba:

1. **Schema Zod**: frontmatter válido.
2. **Fechas**: `publishDate` ≤ `lastReviewed` ≤ hoy.
3. **Pilares (errores)**: tienen `readingTime`, `image` y al menos 3 `sources`.
4. **Imágenes**: el archivo existe en `public/` (error en artículos normales, aviso en pilares).
5. **Relacionados**: los slugs de `relatedArticles` existen.
6. **Duplicados**: no hay slugs repetidos.
7. **SEO**: `seoTitle` ≤ 60 y `seoDescription` entre 50 y 160 caracteres.

Avisos solo (no rompen el build), para pilares: menos de 7 fuentes, fuentes que no sean `.gov/.org`,
menos de 2500 palabras, falta de `## Key Takeaways`, `## Frequently Asked Questions` o `## Sources`,
menos de 2 tablas, menos de 2 blockquotes con URL y ningún enlace a `/category/`.

Después encadena `scripts/validate-medicaid.ts` (datos de Medicaid, ver abajo).

## Datos por estado (no son Markdown)

- `src/data/costs-by-state.json`: costes por estado de la encuesta CareScout 2025. Alimenta
  `/costs/` y `/costs/[state]/`.
- `src/data/medicaid-by-state.json`: datos de Medicaid por estado, con fuente oficial, fecha
  efectiva y fecha de comprobación por valor. Solo se muestran los valores con `status: "verified"`
  y `method: "read"`. El campo opcional `readerNotes` muestra avisos "Keep in mind" a los lectores.
- Procedimiento y fuentes: `.claude/skills/update-medicaid-data/`. Informes en `docs/data-reports/`.

## Consultas comunes (Astro Content API)

```typescript
import { getCollection } from 'astro:content';

const all = await getCollection('entries');

// Solo guías pilar
const pillars = all.filter((e) => e.data.isPillar);

// Por categoría
const assistedLiving = all.filter((e) => e.data.category === 'assisted-living');

// Últimas 5 publicaciones
const latest = [...all]
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 5);

// Mismo artículo: usar e.id (incluye la carpeta), no e.slug
const related = all.filter((e) => e.data.category === currentCategory && e.id !== currentId);
```

## Migración futura

Si hiciera falta separar en collections por categoría, los `.md` pasarían a subcarpetas con su
propia collection y `category` sería implícito. Hoy no hace falta.
