# Senior Living Options

Guías completas para opciones de vivienda y cuidado de adultos mayores. El sitio está en inglés de
EE. UU.; la documentación del repositorio, en español.

## Stack Tecnológico

- **Framework**: Astro 7.x (SSG puro, casi 0 JS)
- **Lenguaje**: TypeScript 6.x
- **Validación**: Zod, incluido con Astro (`astro/zod`)
- **Estilos**: CSS Vanilla con Design Tokens (Custom Properties)
- **Contenido**: Markdown + Frontmatter (Collections de Astro) y datos JSON por estado
- **Hosting**: Cloudflare Pages (integración nativa con Git)
- **CI**: GitHub Actions (lint, tipos, validación y build)

## Inicio Rápido

```bash
npm install

npm run dev               # http://localhost:4321

npm run check             # TypeScript + Astro
npm run lint              # ESLint
npm run format:check      # Prettier
npm run validate:content  # Frontmatter, fechas, imágenes, links y datos de Medicaid

npm run build             # Genera dist/
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes Astro (layout, content, ui)
├── layouts/        # Base, Home, Category, Article, PillarArticle
├── pages/          # Rutas (file-based routing)
├── styles/         # CSS vanilla (tokens, base, components, utilities)
├── content/        # Collections de Astro
│   └── entries/    # Artículos Markdown por categoría
├── content.config.ts   # Definición de la collection
├── data/           # costs-by-state.json y medicaid-by-state.json
└── utils/          # SEO, categorías, costes, Medicaid, esquema
scripts/            # validate-content.ts y validate-medicaid.ts
docs/               # Documentación (ver abajo)
```

## Categorías de Contenido

| Categoría       | Slug                  | Descripción                                |
| --------------- | --------------------- | ------------------------------------------ |
| Assisted Living | `assisted-living`     | Comunidades residenciales con apoyo        |
| Memory Care     | `memory-care`         | Unidades especializadas Alzheimer/demencia |
| Nursing Homes   | `nursing-homes`       | Atención de enfermería 24/7                |
| In-Home Care    | `in-home-care`        | Cuidado en el hogar                        |
| Costs & Finance | `senior-care-costs`   | Costes, Medicare, Medicaid, seguros        |
| Caregiver Help  | `caregiver-resources` | Recursos para cuidadores familiares        |

## Documentación

Todo está en la carpeta [`docs/`](docs/README.md):

- [Arquitectura y decisiones](docs/ARCHITECTURE.md)
- [Modelo de contenido](docs/CONTENT_MODEL.md)
- [Guía de desarrollo](docs/DEVELOPMENT.md)
- [Guía de diseño y estructura](docs/diseño-estructura.md)

## CI / Despliegue

**CI (GitHub Actions)**: en cada push o PR a `main` se ejecuta `npm ci`, `lint`, `format:check`,
`check`, `validate:content` y `build`.

**Despliegue (Cloudflare Pages)**: un push a `main` construye con `npm run build` y publica `dist/`
(Node 22.x). La configuración de build está en el panel de Cloudflare Pages.

## Licencia

MIT
