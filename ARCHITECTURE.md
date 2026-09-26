# Senior Living Options - Architecture Decision Record

## Stack Tecnológico

| Capa       | Tecnología             | Versión | Justificación                                                    |
| ---------- | ---------------------- | ------- | ---------------------------------------------------------------- |
| Framework  | Astro                  | 7.x     | SSG nativo, islas de hidratación 0-JS por defecto, excelente SEO |
| Lenguaje   | TypeScript             | 6.x     | Tipado estricto para collections y componentes                   |
| Estilos    | CSS Vanilla            | -       | Sin dependencias, tokens CSS custom properties, ligero           |
| JS         | Vanilla ES Modules     | -       | Solo para interactividad mínima (search, nav, analytics)         |
| Contenido  | Markdown + Frontmatter | -       | Archivos locales, versionados en Git, sin CMS externo            |
| Validación | Zod                    | 4.x     | Schema validation para content collections                       |
| Hosting    | Cloudflare Pages       | -       | Gratis, edge network, integración nativa Git                     |
| CI         | GitHub Actions         | -       | Lint, typecheck, build, validación en push/PR                    |

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
/article/[...slug]/         → Detail page individual (rest parameter para rutas anidadas)
/search/                    → Búsqueda client-side (JS vanilla)
/sitemap-index.xml          → Generado automáticamente (temporalmente deshabilitado por bug)
/robots.txt                 → Estático en public/
```

### 5. SEO Técnico

- `@astrojs/sitemap` temporalmente deshabilitado (bug con `trailingSlash: always`)
- `@astrojs/robots-txt` reemplazado por `public/robots.txt` estático
- Meta tags dinámicos por página (Open Graph, Twitter Cards)
- JSON-LD: `Article`, `WebSite`, `BreadcrumbList`, `FAQPage` (si aplica)
- Canonical URLs automáticas
- `lastReviewed` en frontmatter para `dateModified` en schema

### 6. Content Model (Ver CONTENT_MODEL.md)

- Un solo collection `entries` con schema Zod 4.x definido
- Frontmatter validado en build time
- Imágenes en `public/images/` referenciadas por ruta relativa
- Loader `glob` para content collections (Astro 7)

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
│   └── robots.txt          # Estático (generado en build temporalmente deshabilitado)
├── src/
│   ├── components/         # Componentes Astro reutilizables
│   │   ├── layout/         # Header, Footer, SkipLink, Breadcrumbs
│   │   ├── content/        # Card, ArticleMeta, TableOfContents
│   │   └── ui/             # Button, Link, Icon, Badge, Search
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
│   │   │   └── [...slug].astro
│   │   └── search.astro
│   ├── styles/             # CSS vanilla
│   │   ├── tokens.css      # Design tokens (custom properties)
│   │   ├── base.css        # Reset, tipografía, elementos base
│   │   ├── components.css  # Estilos de componentes
│   │   ├── utilities.css   # Utility classes
│   │   └── global.css      # Importa todo (importado en BaseLayout)
│   ├── scripts/            # JS vanilla (ES Modules)
│   │   ├── search.js       # Búsqueda client-side
│   │   ├── navigation.js   # Mobile menu, smooth scroll
│   │   └── analytics.js    # Plausible/GA4 consent-mode
│   ├── content/            # Collections Astro
│   │   ├── config.ts       # Definición de collections (Zod 4 + glob loader)
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
│   ├── validate-content.ts
│   └── generate-search-index.ts
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI pipeline (validación + build verification)
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── .prettierignore
├── .gitignore
├── README.md
├── ARCHITECTURE.md
├── CONTENT_MODEL.md
├── DEVELOPMENT.md
├── DEPLOYMENT.md
└── .prettierignore
```

## Scripts NPM

```json
{
  "dev": "astro dev", // localhost:4321
  "build": "astro check && astro build",
  "preview": "astro preview", // Test build local
  "check": "astro check", // TypeScript + Astro validation
  "lint": "eslint src --ext .astro,.ts,.js",
  "lint:fix": "eslint src --ext .astro,.ts,.js --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "validate:content": "tsx scripts/validate-content.ts",
  "prepare": "husky install"
}
```

## Variables de Entorno

| Variable           | Dónde configurar | Requerida | Valor por defecto                         |
| ------------------ | ---------------- | --------- | ----------------------------------------- |
| `PUBLIC_SITE_URL`  | Cloudflare Pages | Sí        | `https://senior-living-options.pages.dev` |
| `PUBLIC_SITE_NAME` | Cloudflare Pages | Sí        | `Senior Living Options`                   |
| `ANALYTICS_ID`     | Cloudflare Pages | No        | -                                         |

### Desarrollo Local (`.env.local`)

```env
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Senior Living Options (Dev)
```

## CI / Despliegue

### CI (GitHub Actions)

En cada push/PR se ejecuta:

- `npm ci` — instalación limpia
- `npm run lint` — ESLint
- `npm run format:check` — Prettier
- `npm run check` — TypeScript + Astro
- `npm run validate:content` — Frontmatter, fechas, imágenes, links
- `npm run build` — Compilación completa a `dist/` (verificación)

### Despliegue (Cloudflare Pages Nativo)

- Push a `main` → Cloudflare Pages detecta commit → build automático → publica `dist/`
- PRs → Cloudflare Pages genera preview automático
- Configuración de build en Cloudflare: `npm run build` / output `dist/` / Node 22.x

### Variables de Build en Cloudflare Pages

| Variable           | Valor                                     |
| ------------------ | ----------------------------------------- |
| `PUBLIC_SITE_URL`  | `https://senior-living-options.pages.dev` |
| `PUBLIC_SITE_NAME` | `Senior Living Options`                   |
| `ANALYTICS_ID`     | (opcional)                                |

## Próximos Pasos

1. ✅ Definir arquitectura (este documento)
2. ✅ Crear `package.json` + configs (TS, ESLint, Prettier)
3. ✅ Estructura de carpetas + `astro.config.mjs`
4. ✅ Collection schema (`src/content/config.ts`) con Zod 4 + glob loader
5. ✅ Layouts base + design tokens CSS
6. ✅ Páginas principales
7. ✅ SEO + robots.txt
8. ✅ GitHub repo + CI pipeline
9. ✅ Documentación `DEVELOPMENT.md` + `DEPLOYMENT.md`
10. ⬜ Configurar Cloudflare Pages nativo en dashboard
11. ⬜ Configurar variables de entorno en Cloudflare Pages
12. ⬜ Configurar dominio personalizado (cuando esté disponible)
