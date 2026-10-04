# Content Model - Senior Living Options

## Collection: `entries`

Un solo collection para todo el contenido del sitio. Cada archivo Markdown en `src/content/entries/`
sigue este schema.

### Schema Zod

```typescript
import { z } from 'astro:content';

export const entrySchema = z.object({
  // Campos obligatorios
  title: z.string().min(1).max(120),
  description: z.string().min(50).max(300), // Para meta description + social
  publishDate: z.date(),
  lastReviewed: z.date(),

  // Categoría (enum - define el subnicho)
  category: z.enum([
    'assisted-living',
    'memory-care',
    'nursing-homes',
    'in-home-care',
    'senior-care-costs',
    'caregiver-resources',
  ]),

  // Tipo de contenido
  isPillar: z.boolean().default(false), // true = pillar page completa, false = artículo/post

  // Campos opcionales
  sources: z.array(z.string().url()).optional(), // URLs gubernamentales (.gov, .org)
  readingTime: z.number().int().positive().optional(), // Minutos, calculado en build
  image: z.string().optional(), // Ruta relativa desde /public/images/
  imageAlt: z.string().optional(), // Alt text descriptivo

  // SEO opcional (sobrescribe defaults)
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),

  // Taxonomía adicional
  tags: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(), // Para contenido específico por estado

  // Configuración de página
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  relatedArticles: z.array(z.string()).optional(), // slugs de artículos relacionados
});
```

### Frontmatter Ejemplo (Pillar Page Completo)

```yaml
---
title: 'The Complete Guide to Assisted Living: Costs, Services, and How to Choose'
description:
  'Everything families need to know about assisted living: what it is, what it costs in 2025, how
  Medicaid and VA benefits help, and how to choose the right facility.'
publishDate: 2026-09-27
lastReviewed: 2026-09-27
category: assisted-living
isPillar: true
sources:
  - 'https://www.nia.nih.gov/health/assisted-living-and-nursing-homes/long-term-care-facilities-assisted-living-nursing-homes'
  - 'https://www.nia.nih.gov/health/caregiving/does-older-adult-your-life-need-help'
  - 'https://www.nia.nih.gov/health/assisted-living-and-nursing-homes/how-choose-nursing-home-or-other-long-term-care-facility'
  - 'https://www.ahcancal.org/Assisted-Living/Facts-and-Figures/Pages/default.aspx'
  - 'https://investor.genworth.com/news-events/press-releases/detail/1054/carescout-releases-2025-cost-of-care-survey-results'
  - 'https://www.aarp.org/caregiving/basics/assisted-living-options/'
  - 'https://www.benefits.va.gov/persona/veteran-elderly.asp'
readingTime: 14
image: /images/assisted-living-complete-guide.png
imageAlt: 'Senior smiling in assisted living community common area'
tags:
  - 'assisted living'
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
  - 'assisted-living-vs-memory-care'
  - 'medicare-assisted-living'
  - 'when-nursing-home'
---
```

### Estructura Estándar Pillar Page

Todos los artículos pilar (`isPillar: true`) deben seguir esta estructura exacta basada en el
artículo de referencia `assisted-living-complete-guide.md`:

```markdown
---
[frontmatter completo - ver arriba]
---

## Key Takeaways

- **Punto clave 1** — descripción concisa con dato específico.
- **Punto clave 2** — descripción concisa con dato específico.
- **Punto clave 3** — descripción concisa con dato específico.
- **Punto clave 4** — descripción concisa con dato específico.
- **Punto clave 5** — descripción concisa con dato específico.
- **Punto clave 6** — descripción concisa con dato específico.

---

Párrafo de introducción empático (2-3 párrafos) que conecte con la situación del lector. Establece
autoridad: "The information here comes from federal health agencies and independent research, not
from facilities trying to fill beds."

---

## What Is [Topic]?

[Definición clara, nivel de cuidado, para quién es, servicios típicos]

### [Subsección comparativa clave]

[Tabla comparativa principal - MÍN 1 tabla por artículo pilar]

|                         | [Opción A] | [Opción B] |
| ----------------------- | ---------- | ---------- |
| **Care level**          | ...        | ...        |
| **Who it's for**        | ...        | ...        |
| **Median monthly cost** | $X,XXX     | $X,XXX     |
| **Medicare coverage**   | ...        | ...        |
| **Medicaid coverage**   | ...        | ...        |

---

## [Sección H2 Principal 2]

[Contenido profundo con subsecciones H3]

### [Subsección H3]

[Detalles, listas, datos]

> **Cita institucional** — Texto de fuente .gov/.org con autoridad. →
> [Enlace a fuente](https://www.nia.nih.gov/...)

---

## [Sección H2 Principal 3]: Costos

### National Median Costs ([Año])

[Tabla de costos nacionales con fuente Genworth/CareScout]

| Care Type    | Monthly Median | Annual Median |
| ------------ | -------------- | ------------- |
| **[Topic]**  | $X,XXX         | $XX,XXX       |
| [Comparable] | $X,XXX         | $XX,XXX       |

_Source: [Fuente] ([año]). [Enlace]._

### Cost Variation by State

[Tabla top 5-10 estados caros/baratos]

| State    | Monthly Median | Annual Median |
| -------- | -------------- | ------------- |
| [Estado] | $X,XXX         | $XX,XXX       |

---

## [Sección H2 Principal 4]: Who Pays / Financiamiento

### Medicare: What It Does and Doesn't Cover

**Medicare does not pay for [topic].** [Explicación clara].

[Detalles de qué SÍ cubre Medicare en este contexto]

### Medicaid: Possible, But Complex

[Explicación HCBS waivers, 46 states + DC, qué cubre/no cubre, eligibility basics]

### VA Benefits for Veterans

[Tabla VA Aid & Attendance rates año actual]

| Status                 | Monthly Maximum | Annual Maximum |
| ---------------------- | --------------- | -------------- |
| Single veteran         | $X,XXX          | $XX,XXX        |
| Veteran with dependent | $X,XXX          | $XX,XXX        |
| Surviving spouse       | $X,XXX          | $XX,XXX        |

### Long-Term Care Insurance

[Guidance sobre revisar pólizas, benefit triggers, elimination periods]

---

## [Sección H2 Principal 5]: Services / What's Included

### Standard Services (Included in Base Rate)

- [Lista servicios base]

### Services That Vary by Facility

- [Lista servicios variables]

---

## [Sección H2 Principal 6]: How to Choose

### Step 1: Define the Care Needs

[Preguntas clave, assessment]

### Step 2: Narrow Your List

[Eldercare Locator, Area Agency on Aging, referrals]

### Step 3: Visit in Person — More Than Once

[Tabla: Area | What to Look For]

| Area                     | What to Look For |
| ------------------------ | ---------------- |
| **Staff interactions**   | ...              |
| **Residents' demeanor**  | ...              |
| **Physical environment** | ...              |
| **Dining**               | ...              |
| **Safety features**      | ...              |
| **Activities**           | ...              |

### Step 4: Ask the Hard Questions

[Lista preguntas esenciales: staff ratios, turnover, care plans, discharge, family notification,
arbitration]

### Step 5: Review the Contract Carefully

[Arbritration clauses, fee increases, what happens if funds run out]

---

## Frequently Asked Questions

### [Pregunta 1]?

[Respuesta concisa, autoritativa, con dato específico si aplica]

### [Pregunta 2]?

[Respuesta...]

### [Pregunta 3]?

[Respuesta...]

### [Pregunta 4]?

[Respuesta...]

### [Pregunta 5]?

[Respuesta...]

### [Pregunta 6]?

[Respuesta...]

---

## Sources

1. **Fuente 1.** "Título exacto." URL. Reviewed/Accessed: [fecha].
2. **Fuente 2.** "Título exacto." URL. Reviewed/Accessed: [fecha].
3. **Fuente 3.** "Título exacto." URL. Reviewed/Accessed: [fecha].
4. **Fuente 4.** "Título exacto." URL. Reviewed/Accessed: [fecha].
5. **Fuente 5.** "Título exacto." URL. Reviewed/Accessed: [fecha].
6. **Fuente 6.** "Título exacto." URL. Reviewed/Accessed: [fecha].
7. **Fuente 7.** "Título exacto." URL. Reviewed/Accessed: [fecha].

[MÍNIMO 7 fuentes, preferiblemente .gov/.org, numeradas consecutivamente]
```

### Reglas de Estructura Pillar (Resumen)

| Elemento                        | Requerido       | Detalle                                       |
| ------------------------------- | --------------- | --------------------------------------------- |
| `## Key Takeaways`              | Sí              | 5-6 bullets, **negrita inicial**, `---` abajo |
| Intro empático                  | Sí              | 2-3 párrafos tras `---`                       |
| Secciones `## H2`               | Mín 6           | Principales temas del artículo                |
| Tablas comparativas             | Mín 2-3         | Sintaxis pipe `                               | --- | --- | `   |
| Blockquotes `>`                 | Mín 2-3         | Con cita + fuente .gov/.org + enlace          |
| Enlaces internos                | Mín 1           | A `/category/[slug]/` relacionadas            |
| `## Frequently Asked Questions` | Sí              | 5-6 preguntas con `###`                       |
| `## Sources`                    | Sí              | Mín 7, numeradas, formato consistente         |
| Divisores `---`                 | Sí              | Entre secciones mayores                       |
| Longitud                        | ~2500+ palabras | Objetivo, no hard limit                       |

### Componentes Visuales Pillar (Renderizado)

El layout `PillarArticleLayout.astro` aplica automáticamente:

| Componente           | Clase CSS                     | Comportamiento                                                       |
| -------------------- | ----------------------------- | -------------------------------------------------------------------- |
| **Hero**             | `.c-pillar-hero`              | Imagen full-width + overlay gradiente + breadcrumbs inline           |
| **Título**           | `.c-pillar-hero__title`       | Blanco fijo `#ffffff` ambos modos, serif, text-shadow                |
| **Descripción**      | `.c-pillar-hero__description` | Gris `var(--sl-color-text-muted)` ambos modos                        |
| **TOC Inline**       | `.c-pillar-toc`               | Solo H2, iconos ▸, sticky en desktop                                 |
| **Key Takeaways**    | `h2#key-takeaways + ul`       | Fondo `var(--sl-color-primary-light)`, checks ✓ verdes               |
| **Tablas**           | `.c-pillar-content table`     | Scroll horizontal mobile + card layout auto (>5 filas, ≥3 cols)      |
| **Reading Progress** | `.c-reading-progress`         | Barra superior 3px, z-index 199                                      |
| **Back to Top**      | `.c-back-to-top`              | Botón fijo esquina inf-dcha, aparece tras scroll                     |
| **CTA Final**        | `.c-pillar-cta`               | 2 botones (primary + outline), fondo `var(--sl-color-primary-light)` |
| **FAQ Schema**       | Auto                          | JSON-LD FAQPage extraído de H3 bajo "Frequently Asked Questions"     |
| **Theme Toggle**     | En Header                     | Solo en Header global, NO en hero del artículo                       |

---

### Categorías y Labels

| Enum Value            | Label (ES)      | Label (EN)      | Color Token      | Icono |
| --------------------- | --------------- | --------------- | ---------------- | ----- |
| `assisted-living`     | Assisted Living | Assisted Living | `--sl-color-al`  | 🏠    |
| `memory-care`         | Memory Care     | Memory Care     | `--sl-color-mc`  | 🧠    |
| `nursing-homes`       | Nursing Homes   | Nursing Homes   | `--sl-color-nh`  | 🏥    |
| `in-home-care`        | In-Home Care    | In-Home Care    | `--sl-color-ihc` | 🏡    |
| `senior-care-costs`   | Costs & Finance | Costs & Finance | `--sl-color-cf`  | 💰    |
| `caregiver-resources` | Caregiver Help  | Caregiver Help  | `--sl-color-cr`  | 🤝    |

### Reglas de Contenido

#### Pillar Pages (`isPillar: true`)

- **Longitud**: 2,500+ palabras
- **Estructura**: Ver [Estructura Estándar Pillar Page](#estructura-estandar-pillar-page) — TOC
  obligatorio, 6+ H2, 2+ tablas, 2+ blockquotes, FAQ, Sources
- **Actualización**: `lastReviewed` cada 6 meses máximo
- **Fuentes**: Mínimo 7 fuentes `.gov/.org` verificables
- **SEO**: Target keyword principal + 5-10 long-tail
- **Ejemplos**:
  - `/article/assisted-living-complete-guide/`

#### Artículos Normales (`isPillar: false`)

- **Longitud**: 800-2,000 palabras
- **Enfoque**: Pregunta específica, ángulo narrow
- **Actualización**: `lastReviewed` cada 12 meses
- **Fuentes**: 1-2 fuentes mínimas
- **Ejemplos**:
  - `/article/senales-que-es-momento-assisted-living/`
  - `/article/medicare-cubre-memory-care/`

### Estructura de Carpetas de Contenido

```
src/content/entries/
├── assisted-living/
│   ├── assisted-living-complete-guide.md          # pillar (actual)
│   ├── senales-momento-assisted-living.md
│   ├── assisted-living-vs-memory-care.md
│   └── como-pagar-assisted-living.md
├── memory-care/
│   ├── complete-guide-memory-care.md              # pillar (pendiente)
│   ├── alzheimer-vs-demencia-diferencias.md
│   └── costos-memory-care-por-estado.md
├── nursing-homes/
│   ├── complete-guide-nursing-homes.md            # pillar (pendiente)
│   ├── nursing-home-vs-assisted-living.md
│   └── como-elegir-nursing-home.md
├── in-home-care/
│   ├── complete-guide-in-home-care.md             # pillar (pendiente)
│   ├── tipos-cuidado-domicilio.md
│   └── agencias-vs-cuidadores-independientes.md
├── senior-care-costs/
│   ├── complete-guide-senior-care-costs.md        # pillar (pendiente)
│   ├── medicare-medicaid-diferencias.md
│   ├── seguros-cuidado-largo-plazo.md
│   └── beneficios-veteranos-aid-attendance.md
└── caregiver-resources/
    ├── complete-guide-caregiver-resources.md      # pillar (pendiente)
    - burnout-cuidadores-senales-soluciones.md
    - recursos-apoyo-cuidadores-familia.md
    - checklist-cuidado-diario.md
```

> **Nota**: Los slugs de pillar pages pendientes (`complete-guide-*`) son placeholders. El slug real
> se definirá al crear cada artículo.

### Validaciones en Build

El script `scripts/validate-content.ts` (ejecutado con `tsx`) verifica:

1. **Schema Zod** - Frontmatter válido
2. **Fechas** - `publishDate` ≤ `lastReviewed` ≤ hoy
3. **Pillar pages** - Tienen `readingTime`, `image`, `sources` (mín 7, .gov/.org), estructura
   markdown completa
4. **Imágenes** - Archivo existe en `public/images/`
5. **Links internos** - `relatedArticles` slugs existen
6. **Duplicados** - No hay slugs repetidos
7. **SEO** - `title` ≤ 60 chars, `description` 50-160 chars

**Validaciones adicionales Pillar (WARNING only, no fallan build):**

- `sources.length >= 7` y todas `.gov` o `.org`
- Word count >= 2500
- Presencia de secciones: `## Key Takeaways`, `## Frequently Asked Questions`, `## Sources`
- Mínimo 2 tablas (patrón `|---|---|`)
- Mínimo 2 blockquotes con URLs `.gov`/`.org`
- Al menos 1 enlace interno a `/category/`
- Imagen hero existe en `public/images/`

### Consultas Comunes (Astro Content API)

```typescript
// Todas las entradas
const allEntries = await getCollection('entries');

// Solo pillar pages
const pillars = (await getCollection('entries')).filter((e) => e.data.isPillar);

// Por categoría
const assistedLiving = (await getCollection('entries')).filter(
  (e) => e.data.category === 'assisted-living'
);

// Por categoría + pillar
const alPillars = (await getCollection('entries')).filter(
  (e) => e.data.category === 'assisted-living' && e.data.isPillar
);

// Últimas 5 publicaciones (ordenadas por publishDate)
const latest = (await getCollection('entries'))
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 5);

// Artículos relacionados (misma categoría, excluyendo actual)
const related = (await getCollection('entries'))
  .filter((e) => e.data.category === currentCategory && e.slug !== currentSlug)
  .slice(0, 3);
```

### Migración Futura

Si se necesita separar en collections por categoría:

```typescript
// astro.config.mjs
collections: {
  'assisted-living': defineCollection({ schema: entrySchema }),
  'memory-care': defineCollection({ schema: entrySchema }),
  // ...
}
```

Los archivos `.md` se moverían a subcarpetas y el campo `category` se volvería implícito por la
collection.
