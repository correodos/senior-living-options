# Senior Living Options

Guías completas para opciones de vivienda y cuidado de adultos mayores.

## Stack Tecnológico

- **Framework**: Astro 7.x (SSG puro, 0-JS por defecto)
- **Lenguaje**: TypeScript 6.x
- **Validación**: Zod 4.x
- **Estilos**: CSS Vanilla con Design Tokens (Custom Properties)
- **JS**: Vanilla ES Modules (solo search, nav, analytics)
- **Contenido**: Markdown + Frontmatter (Collections Astro)
- **Hosting**: Cloudflare Pages (integración nativa Git)
- **CI**: GitHub Actions (validación y build)

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev        # http://localhost:4321

# Validaciones
npm run check      # TypeScript + Astro
npm run lint       # ESLint
npm run format:check  # Prettier
npm run validate:content  # Frontmatter, fechas, imágenes, links

# Build producción
npm run build      # Genera dist/

# Preview build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes Astro reutilizables
├── layouts/        # Layouts de página (Base, Home, Category, Article)
├── pages/          # Rutas (file-based routing)
├── styles/         # CSS vanilla (tokens, base, components, utilities)
├── scripts/        # JS vanilla (search, nav, analytics)
├── content/        # Collections Astro (Markdown)
│   ├── config.ts   # Schema Zod
│   └── entries/    # Artículos por categoría
├── utils/          # Helpers (SEO, dates, markdown, category)
└── types/          # Tipos globales
```

## Categorías de Contenido

| Categoría       | Slug                  | Descripción                                |
| --------------- | --------------------- | ------------------------------------------ |
| Assisted Living | `assisted-living`     | Comunidades residenciales con apoyo        |
| Memory Care     | `memory-care`         | Unidades especializadas Alzheimer/demencia |
| Nursing Homes   | `nursing-homes`       | Atención enfermería 24/7                   |
| In-Home Care    | `in-home-care`        | Cuidado en el hogar                        |
| Costs & Finance | `senior-care-costs`   | Costos, Medicare, Medicaid, seguros        |
| Caregiver Help  | `caregiver-resources` | Recursos para cuidadores familiares        |

## Documentación

- [Arquitectura y Decisiones](ARCHITECTURE.md)
- [Modelo de Contenido](CONTENT_MODEL.md)
- [Guía de Desarrollo](DEVELOPMENT.md)
- [Guía de Despliegue](DEPLOYMENT.md)

## CI / Despliegue

**CI (GitHub Actions)**: En cada push/PR se ejecuta:

- `npm ci` — instalación limpia
- `npm run lint` — ESLint
- `npm run format:check` — Prettier
- `npm run check` — TypeScript + Astro
- `npm run validate:content` — Frontmatter, fechas, imágenes, links
- `npm run build` — Compilación completa a `dist/`

**Despliegue (Cloudflare Pages nativo)**:

- Push a `main` → Cloudflare Pages detecta commit → build automático → publica `dist/`
- PRs → Cloudflare Pages genera preview automático
- Configuración de build en Cloudflare: `npm run build` / output `dist/` / Node 22.x

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para configuración completa.

## Licencia

MIT
