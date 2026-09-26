# Senior Living Options - Architecture Decision Record

## Stack Tecnológico

| Capa      | Tecnología             | Versión | Justificación                                                    |
| --------- | ---------------------- | ------- | ---------------------------------------------------------------- |
| Framework | Astro                  | 4.x     | SSG nativo, islas de hidratación 0-JS por defecto, excelente SEO |
| Lenguaje  | TypeScript             | 5.x     | Tipado estricto para collections y componentes                   |
| Estilos   | CSS Vanilla            | -       | Sin dependencias, tokens CSS custom properties, ligero           |
| JS        | Vanilla ES Modules     | -       | Solo para interactividad mínima (search, nav, analytics)         |
| Contenido | Markdown + Frontmatter | -       | Archivos locales, versionados en Git, sin CMS externo            |
| Hosting   | Cloudflare Pages       | -       | Gratis, edge network, deploy automático desde GitHub             |
| CI/CD     | GitHub Actions         | -       | Lint, typecheck, build, deploy en push a main                    |

## Decisiones Clave

### 1. Astro Puro (Sin React/Vue/Svelte)

- **Razón**: Sitio de contenido estático, no necesita hidratación compleja
- **Beneficio**: 0 KB JS por defecto, build más rápido, bundle menor
- **Excepción**: Solo si surge necesidad real de interactividad compleja (ej. calculadora de costos
  interactiva)

### 2. Single Collection Schema con Category Enum

- **Schema único** para todo el contenido (`src/content/entries/`)
- **Campo `category`** enum: `assisted-living`, `memory-care`, `nursing-homes`, `in-home-care`,
  `senior-care-costs`, `caregiver-resources`
- **Campo `isPillar`** boolean: distingue pillar pages (completas, evergreen) de posts normales
- **Ventaja**: Consultas unificadas, menos duplicación, fácil migración futura

### 3. CSS Vanilla con Design Tokens

- **Tokens** en `src/styles/tokens.css` (custom properties)
- **Capas**: `@layer base, components, utilities`
- **Metodología**: BEM simplificado + utility classes para spacing
- **Responsive**: Mobile-first, breakpoints en tokens

### 4. Estructura de Rutas (File-based Routing)

```
/                           → Home (pillar pages destacadas + latest)
/category/[slug]/           → Listing por categoría (paginado)
/article/[slug]/            → Detail page individual
/search/                    → Búsqueda client-side (JS vanilla)
/sitemap-index.xml          → Generado automáticamente
/robots.txt                 → Generado automáticamente
```

### 5. SEO Técnico

- `@astrojs/sitemap` + `@astrojs/robots-txt`
- Meta tags dinámicos por página (Open Graph, Twitter Cards)
- JSON-LD: `Article`, `WebSite`, `BreadcrumbList`, `FAQPage` (si aplica)
- Canonical URLs automáticas
- `lastReviewed` en frontmatter para `dateModified` en schema

### 6. Content Model (Ver CONTENT_MODEL.md)

- Un solo collection `entries` con schema Zod definido
- Frontmatter validado en build time
- Imágenes en `public/images/` referenciadas por ruta relativa

### 7. Performance Budget

- **HTML**: < 30 KB gzipped
- **CSS**: < 15 KB gzipped (crítico inline, resto async)
- **JS**: < 10 KB gzipped (solo search + nav)
- **Imágenes**: WebP/AVIF, responsive, lazy-loading nativo
- **Lighthouse**: 95+ en todas las métricas

### 8. Accessibility (WCAG 2.1 AA)

- Semantic HTML5 obligatorio
- Focus visible en todos los interactivos
- Contraste 4.5:1 mínimo
- Alt text en todas las imágenes
- Skip links, landmarks ARIA

## Convenciones de Código

### TypeScript

- `strict: true` en tsconfig
- No `any` (usar `unknown` + type guards)
- Interfaces para props de componentes Astro
- Types derivados de collections con `CollectionEntry<'entries'>`

### Astro Components

- Un componente por archivo (`ComponentName.astro`)
- Props tipadas con `interface Props`
- Slot por defecto para composición
- CSS scoped por defecto (no global)

### CSS

- Tokens en `:root` con prefijo `--sl-` (senior-living)
- Clases utilitarias: `.u-mt-4`, `.u-flex`, `.u-sr-only`
- Componentes: `.c-card`, `.c-button`, `.c-header`
- BEM para variantes: `.c-card--featured`, `.c-button--secondary`

### Git

- **Main branch**: Solo código deployable (protegida)
- **Feature branches**: `feat/descripcion-corta`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **PRs**: Requieren CI pass + 1 approval

## Estructura de Carpetas

```
├── public/                 # Assets estáticos servidos tal cual
│   ├── images/             # Imágenes optimizadas (WebP/AVIF)
│   ├── favicon.ico
│   └── robots.txt          # Generado en build
├── src/
│   ├── components/         # Componentes Astro reutilizables
│   │   ├── layout/         # Header, Footer, SkipLink, Breadcrumbs
│   │   ├── content/        # Card, ArticleMeta, TableOfContents
│   │   └── ui/             # Button, Link, Icon, Badge
│   ├── layouts/            # Layouts de página
│   │   ├── BaseLayout.astro
│   │   ├── HomeLayout.astro
│   │   ├── CategoryLayout.astro
│   │   └── ArticleLayout.astro
│   ├── pages/              # Rutas (file-based routing)
│   │   ├── index.astro
│   │   ├── category/
│   │   │   └── [slug].astro
│   │   ├── article/
│   │   │   └── [slug].astro
│   │   └── search.astro
│   ├── styles/             # CSS vanilla
│   │   ├── tokens.css      # Design tokens (custom properties)
│   │   ├── base.css        # Reset, tipografía, elementos base
│   │   ├── components.css  # Estilos de componentes
│   │   ├── utilities.css   # Utility classes
│   │   └── global.css      # Importa todo (importado en BaseLayout)
│   ├── scripts/            # JS vanilla (ES Modules)
│   │   ├── search.js       # Búsqueda client-side (Fuse.js opcional)
│   │   ├── navigation.js   # Mobile menu, smooth scroll
│   │   └── analytics.js    # Plausible/GA4 consent-mode
│   ├── content/            # Collections Astro
│   │   ├── config.ts       # Definición de collections
│   │   └── entries/        # Archivos .md/.mdx
│   │       ├── assisted-living/
│   │       ├── memory-care/
│   │       ├── nursing-homes/
│   │       ├── in-home-care/
│   │       ├── senior-care-costs/
│   │       └── caregiver-resources/
│   ├── utils/              # Helpers puros
│   │   ├── seo.ts          # Meta tags, JSON-LD generators
│   │   ├── date.ts         # Formateo fechas
│   │   ├── markdown.ts     # Procesamiento contenido
│   │   └── category.ts     # Helpers de categoría (labels, colors)
│   └── types/              # Tipos globales (env.d.ts, content.d.ts)
├── scripts/                # Scripts de build/utilidades Node
│   ├── validate-content.mjs
│   └── generate-sitemap.mjs
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD a Cloudflare Pages
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── CONTENT_MODEL.md
```

## Scripts NPM

```json
{
  "dev": "astro dev", // localhost:4321
  "build": "astro check && astro build",
  "preview": "astro preview", // Test build local
  "check": "astro check", // TypeScript + Astro validation
  "lint": "eslint src --ext .astro,.ts,.js",
  "format": "prettier --write .",
  "validate:content": "node scripts/validate-content.mjs"
}
```

## Variables de Entorno

| Variable           | Descripción                                          | Requerida |
| ------------------ | ---------------------------------------------------- | --------- |
| `PUBLIC_SITE_URL`  | URL producción (ej. https://seniorlivingoptions.com) | Sí        |
| `PUBLIC_SITE_NAME` | Nombre del sitio para SEO                            | Sí        |
| `ANALYTICS_ID`     | ID Plausible/GA4 (opcional)                          | No        |

## Próximos Pasos

1. ✅ Definir arquitectura (este documento)
2. ⬜ Crear `package.json` + configs (TS, ESLint, Prettier)
3. ⬜ Estructura de carpetas + `astro.config.mjs`
4. ⬜ Collection schema (`src/content/config.ts`)
5. ⬜ Layouts base + design tokens CSS
6. ⬜ Páginas principales
7. ⬜ SEO + sitemap + robots
8. ⬜ GitHub repo + GitHub Actions deploy
9. ⬜ Documentación `DEVELOPMENT.md` + `DEPLOYMENT.md`
