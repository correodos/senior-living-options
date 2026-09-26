# Senior Living Options

Guías completas para opciones de vivienda y cuidado de adultos mayores.

## Stack Tecnológico

- **Framework**: Astro 4.x (SSG puro, 0-JS por defecto)
- **Lenguaje**: TypeScript 5.x
- **Estilos**: CSS Vanilla con Design Tokens (Custom Properties)
- **JS**: Vanilla ES Modules (solo search, nav, analytics)
- **Contenido**: Markdown + Frontmatter (Collections Astro)
- **Hosting**: Cloudflare Pages
- **CI/CD**: GitHub Actions

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev        # http://localhost:4321

# Validaciones
npm run check      # TypeScript + Astro
npm run lint       # ESLint
npm run validate:content  # Frontmatter, fechas, imágenes

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

## Despliegue

Push a `main` → GitHub Actions → Cloudflare Pages (automático)

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para configuración completa.

## Licencia

MIT
