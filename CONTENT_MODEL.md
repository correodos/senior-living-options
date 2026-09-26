# Content Model - Senior Living Options

## Collection: `entries`

Un solo collection para todo el contenido del sitio. Cada archivo Markdown en `src/content/entries/` sigue este schema.

### Schema Zod

```typescript
import { z } from 'astro:content';

export const entrySchema = z.object({
  // Campos obligatorios
  title: z.string().min(1).max(120),
  description: z.string().min(50).max(300),  // Para meta description + social
  publishDate: z.date(),
  lastReviewed: z.date(),
  
  // Categoría (enum - define el subnicho)
  category: z.enum([
    'assisted-living',
    'memory-care',
    'nursing-homes',
    'in-home-care',
    'senior-care-costs',
    'caregiver-resources'
  ]),
  
  // Tipo de contenido
  isPillar: z.boolean().default(false),  // true = pillar page completa, false = artículo/post
  
  // Campos opcionales
  sources: z.array(z.string().url()).optional(),  // URLs gubernamentales (.gov, .org)
  readingTime: z.number().int().positive().optional(),  // Minutos, calculado en build
  image: z.string().optional(),  // Ruta relativa desde /public/images/
  imageAlt: z.string().optional(),  // Alt text descriptivo
  
  // SEO opcional (sobrescribe defaults)
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
  
  // Taxonomía adicional
  tags: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),  // Para contenido específico por estado
  
  // Configuración de página
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  relatedArticles: z.array(z.string()).optional(),  // slugs de artículos relacionados
});
```

### Frontmatter Ejemplo

```yaml
---
title: "Guía Completa de Assisted Living: Costos, Servicios y Cómo Elegir"
description: "Todo lo que necesitas saber sobre comunidades de assisted living: costos promedio por estado, servicios incluidos, señales de que es momento de mudarse y checklist de evaluación."
publishDate: 2024-01-15
lastReviewed: 2024-11-20
category: assisted-living
isPillar: true
sources:
  - "https://www.medicare.gov/coverage/assisted-living"
  - "https://www.nia.nih.gov/health/assisted-living-facilities"
readingTime: 12
image: /images/assisted-living-guide-hero.webp
imageAlt: "Adulto mayor sonriendo en área común de comunidad assisted living"
tags:
  - "costos"
  - "checklist"
  - "servicios"
states:
  - "CA"
  - "TX"
  - "FL"
showTableOfContents: true
relatedArticles:
  - "assisted-living-vs-memory-care"
  - "como-pagar-assisted-living"
  - "senior-care-costs-by-state"
---
```

### Categorías y Labels

| Enum Value | Label (ES) | Label (EN) | Color Token | Icono |
|------------|------------|------------|-------------|-------|
| `assisted-living` | Assisted Living | Assisted Living | `--sl-color-al` | 🏠 |
| `memory-care` | Memory Care | Memory Care | `--sl-color-mc` | 🧠 |
| `nursing-homes` | Nursing Homes | Nursing Homes | `--sl-color-nh` | 🏥 |
| `in-home-care` | In-Home Care | In-Home Care | `--sl-color-ihc` | 🏡 |
| `senior-care-costs` | Costs & Finance | Costs & Finance | `--sl-color-cf` | 💰 |
| `caregiver-resources` | Caregiver Help | Caregiver Help | `--sl-color-cr` | 🤝 |

### Reglas de Contenido

#### Pillar Pages (`isPillar: true`)
- **Longitud**: 2,500+ palabras
- **Estructura**: TOC obligatorio, secciones H2/H3 profundas
- **Actualización**: `lastReviewed` cada 6 meses máximo
- **Fuentes**: Mínimo 3 fuentes `.gov/.org` verificables
- **SEO**: Target keyword principal + 5-10 long-tail
- **Ejemplos**: 
  - `/article/guia-completa-assisted-living/`
  - `/article/costos-cuidado-mayores-por-estado/`

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
│   ├── guia-completa-assisted-living.md          # pillar
│   ├── senales-momento-assisted-living.md
│   ├── assisted-living-vs-memory-care.md
│   └── como-pagar-assisted-living.md
├── memory-care/
│   ├── guia-completa-memory-care.md              # pillar
│   ├── alzheimer-vs-demencia-diferencias.md
│   └── costos-memory-care-por-estado.md
├── nursing-homes/
│   ├── guia-completa-nursing-homes.md            # pillar
│   ├── nursing-home-vs-assisted-living.md
│   └── como-elegir-nursing-home.md
├── in-home-care/
│   ├── guia-completa-in-home-care.md             # pillar
│   ├── tipos-cuidado-domicilio.md
│   └── agencias-vs-cuidadores-independientes.md
├── senior-care-costs/
│   ├── costos-cuidado-mayores-por-estado.md      # pillar
│   ├── medicare-medicaid-diferencias.md
│   ├── seguros-cuidado-largo-plazo.md
│   └── beneficios-veteranos-aid-attendance.md
└── caregiver-resources/
    ├── guia-completa-cuidadores.md               # pillar
    - burnout-cuidadores-senales-soluciones.md
    - recursos-apoyo-cuidadores-familia.md
    - checklist-cuidado-diario.md
```

### Validaciones en Build

El script `scripts/validate-content.mjs` verifica:

1. **Schema Zod** - Frontmatter válido
2. **Fechas** - `publishDate` ≤ `lastReviewed` ≤ hoy
3. **Pillar pages** - Tienen `readingTime`, `image`, `sources` (mín 3)
4. **Imágenes** - Archivo existe en `public/images/`
5. **Links internos** - `relatedArticles` slugs existen
6. **Duplicados** - No hay slugs repetidos
7. **SEO** - `title` ≤ 60 chars, `description` 50-160 chars

### Consultas Comunes (Astro Content API)

```typescript
// Todas las entradas
const allEntries = await getCollection('entries');

// Solo pillar pages
const pillars = (await getCollection('entries')).filter(e => e.data.isPillar);

// Por categoría
const assistedLiving = (await getCollection('entries'))
  .filter(e => e.data.category === 'assisted-living');

// Por categoría + pillar
const alPillars = (await getCollection('entries'))
  .filter(e => e.data.category === 'assisted-living' && e.data.isPillar);

// Últimas 5 publicaciones (ordenadas por publishDate)
const latest = (await getCollection('entries'))
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 5);

// Artículos relacionados (misma categoría, excluyendo actual)
const related = (await getCollection('entries'))
  .filter(e => e.data.category === currentCategory && e.slug !== currentSlug)
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

Los archivos `.md` se moverían a subcarpetas y el campo `category` se volvería implícito por la collection.