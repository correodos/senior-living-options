# Senior Living Options - Architecture Decision Record

> Estado: actualizado en octubre de 2026 para reflejar el proyecto real. El sitio publicado y la web
> están en inglés de EE. UU.; la documentación está en español.

## Stack Tecnológico

| Capa       | Tecnología             | Versión | Justificación                                                     |
| ---------- | ---------------------- | ------- | ----------------------------------------------------------------- |
| Framework  | Astro                  | 7.x     | SSG nativo, 0 JS por defecto, excelente SEO                       |
| Lenguaje   | TypeScript             | 6.x     | Tipado estricto para collections y componentes                    |
| Estilos    | CSS Vanilla            | -       | Sin dependencias, tokens CSS custom properties, ligero            |
| JS         | Vanilla                | -       | Solo interactividad mínima, inline en los componentes que la usan |
| Contenido  | Markdown + Frontmatter | -       | Archivos locales, versionados en Git, sin CMS externo             |
| Validación | Zod (`astro/zod`)      | 4.x     | Viene con Astro; no es una dependencia aparte                     |
| Datos      | JSON + Zod             | -       | Costes por estado y datos de Medicaid, validados en CI            |
| Hosting    | Cloudflare Pages       | -       | Gratis, edge network, integración nativa con Git                  |
| CI         | GitHub Actions         | -       | Lint, typecheck, validación y build en cada push/PR               |

Dependencias de ejecución: `astro`, `@astrojs/check`, `@astrojs/sitemap`, `typescript`. El resto son
herramientas de desarrollo (ESLint, Prettier, `tsx`, `terser`). No hay React, Vue ni Svelte.

## Decisiones Clave

### 1. Astro puro (sin React/Vue/Svelte)

- **Razón**: sitio de contenido estático, no necesita hidratación compleja.
- **Beneficio**: casi 0 KB de JS, build rápido, Lighthouse 98-100 en todas las métricas.
- **Excepción**: solo si surge una necesidad real de interactividad compleja.

### 2. Single collection con `category` enum

- **Schema único** en `src/utils/entry-schema.ts`, usado por `src/content.config.ts` y por
  `scripts/validate-content.ts` (una sola fuente de verdad).
- **Campo `category`**: `assisted-living`, `memory-care`, `nursing-homes`, `in-home-care`,
  `senior-care-costs`, `caregiver-resources`.
- **Campo `isPillar`**: distingue las guías completas (usan `PillarArticleLayout`) de los artículos
  normales (usan `ArticleLayout`).
- Ver [CONTENT_MODEL.md](CONTENT_MODEL.md).

### 3. CSS vanilla con design tokens

- **Tokens** en `src/styles/tokens.css` (prefijo `--sl-`), con modo claro y oscuro.
- **Capas**: `@layer base, components` (las utilidades están en `utilities.css`).
- **Metodología**: BEM simplificado (`.c-componente`, `.c-componente--variante`) y utilidades
  `.u-*`.
- **Responsive**: mobile-first. El menú de la cabecera pasa a una fila desde 1200px.
- Las hojas de estilo se incluyen inline en el HTML (`inlineStylesheets: 'always'`).

### 4. Datos por estado como JSON validado

- `src/data/costs-by-state.json`: costes de la encuesta CareScout 2025 por estado (mensual, anual,
  por hora, centro de día, enfermería privada) y su metadata.
- `src/data/medicaid-by-state.json`: datos de Medicaid por estado, cada valor con fuente oficial,
  fecha efectiva y fecha de comprobación. Solo se muestran los valores `verified` y `read`.
- Validación: `scripts/validate-medicaid.ts` (esquema en `src/utils/medicaid-schema.ts`).
- Procedimiento de actualización: skill `.claude/skills/update-medicaid-data/`. Informes de cada
  revisión en `docs/data-reports/`.

### 5. SEO técnico

- `@astrojs/sitemap` **activo**, con `lastmod` tomado de `lastReviewed` (artículos y categorías) y
  de la fecha de la encuesta (páginas de costes). Se excluyen las páginas legales y la página
  `/contact/thanks/`.
- `public/robots.txt` estático, con la línea `Sitemap:`.
- Meta tags dinámicos (Open Graph, Twitter Cards) y canonical automático.
- JSON-LD: `Article`, `FAQPage`, `BreadcrumbList`, `CollectionPage`, `AboutPage`, `ContactPage`
  (combinados con `combineJsonLd` en `src/utils/seo.ts`).
- `lastReviewed` en el frontmatter alimenta `dateModified`.
- Cabeceras de seguridad y caché en `public/_headers` (Cloudflare Pages).

### 6. Performance

| Métrica                  | Objetivo | Real (oct. 2026) |
| ------------------------ | -------- | ---------------- |
| Lighthouse Performance   | > 95     | 98-100           |
| Lighthouse Accessibility | > 95     | 100              |
| Lighthouse SEO           | > 95     | 100              |
| Lighthouse Best Practice | > 95     | 100              |

- Imágenes WebP con variantes `-480` y `-768` y `srcset` (`src/utils/images.ts`).
- Fuentes del sistema y Georgia: sin fuentes externas.

### 7. Accesibilidad (WCAG 2.1 AA)

- HTML semántico, landmarks, skip link, foco visible, contraste 4.5:1 como mínimo.
- Tablas con scroll horizontal accesibles por teclado.
- Auditorías con axe sin violaciones en las páginas probadas.

## Estructura de Rutas

```
/                           → Home (guías destacadas, costes por estado, FAQs rápidas)
/category/[slug]/           → Listado por categoría (guía pilar destacada + artículos)
/article/[...slug]/         → Artículo (id con carpeta: /article/<categoría>/<archivo>/)
/costs/                     → Índice de costes por estado (ordenable)
/costs/[state]/             → 50 páginas de estado (costes + Medicaid)
/search/                    → Búsqueda en el cliente (usa /search-index.json)
/about/                     → Qué es el sitio y quién está detrás
/editorial-policy/          → Cómo se hacen los artículos, fuentes, cifras y correcciones
/contact/  /contact/thanks/ → Formulario de contacto (Formspree) y página de confirmación
/privacy/ /terms/ /disclaimer/ /accessibility/  → Páginas legales (noindex)
/404                        → Página de error
/sitemap-index.xml          → Generado en build
/robots.txt                 → Estático en public/
```

## Estructura de Carpetas

```
├── public/                 # Assets estáticos (images/, favicon, robots.txt, _headers)
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Footer, SkipLink, Breadcrumbs
│   │   ├── content/        # Card, ArticleMeta, TableOfContents, RelatedArticles
│   │   └── ui/             # Button, Search, StateSelector
│   ├── layouts/            # BaseLayout, HomeLayout, CategoryLayout, ArticleLayout,
│   │                       # PillarArticleLayout
│   ├── pages/              # Rutas (ver arriba)
│   ├── styles/             # tokens.css, base.css, components.css, utilities.css, global.css
│   ├── content/entries/    # Markdown por categoría
│   ├── content.config.ts   # Collection `entries` (glob loader + schema)
│   ├── data/               # costs-by-state.json, medicaid-by-state.json
│   ├── utils/              # category, costs, images, medicaid, medicaid-schema, entry-schema, seo
│   ├── scripts/            # Reservada (vacía): el JS vive inline en los componentes
│   └── types/              # Reservada (vacía)
├── scripts/                # validate-content.ts, validate-medicaid.ts
├── .claude/skills/         # update-medicaid-data (procedimiento y registro de fuentes)
├── .github/workflows/      # deploy.yml (CI)
├── docs/                   # Esta documentación, data-reports/ y medicaid-sources/ (local)
├── astro.config.mjs, package.json, tsconfig.json, eslint.config.js, prettier.config.js
├── AGENTS.md               # Reglas de trabajo con el asistente
└── README.md
```

## Scripts NPM

```json
{
  "dev": "astro dev", // localhost:4321
  "build": "astro check && astro build",
  "preview": "astro preview",
  "check": "astro check",
  "lint": "eslint src --ext .astro,.ts,.js",
  "lint:fix": "eslint src --ext .astro,.ts,.js --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "validate:content": "tsx scripts/validate-content.ts && tsx scripts/validate-medicaid.ts",
  "validate:medicaid": "tsx scripts/validate-medicaid.ts"
}
```

## Variables de Entorno

| Variable           | Dónde configurar | Requerida | Valor por defecto                         |
| ------------------ | ---------------- | --------- | ----------------------------------------- |
| `PUBLIC_SITE_URL`  | Cloudflare Pages | Sí        | `https://senior-living-options.pages.dev` |
| `PUBLIC_SITE_NAME` | Cloudflare Pages | Sí        | `Senior Living Options`                   |

No hay variables de analítica: el sitio no usa analytics.

En `.env.local` para desarrollo:

```env
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Senior Living Options (Dev)
```

## CI / Despliegue

### CI (GitHub Actions, `.github/workflows/deploy.yml`)

En cada push o PR a `main` se ejecuta (Node 22.12):

- `npm ci`, `npm run lint`, `npm run format:check`, `npm run check`
- `npm run validate:content` (frontmatter, fechas, imágenes y datos de Medicaid)
- `npm run build` (verificación; el despliegue no lo hace este workflow)

### Despliegue (Cloudflare Pages)

- Push a `main` → Cloudflare Pages construye con `npm run build` y publica `dist/` (Node 22.x).
- Los PRs, si se usan, generan una vista previa.
- Los logs de build están en el panel de Cloudflare Pages, no en GitHub Actions.

## Pendiente

1. Configurar un dominio propio (cuando exista).
2. Publicidad (AdSense): añadir consentimiento de cookies y ajustar la CSP de `public/_headers`.
3. Revisión anual de cifras: costes (marzo, nueva encuesta) y Medicaid (enero y julio).
