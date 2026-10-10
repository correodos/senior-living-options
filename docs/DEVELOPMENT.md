# Guía de Desarrollo - Senior Living Options

> Estado: actualizado en octubre de 2026. Contenido y web en inglés de EE. UU.; documentación en
> español.

## Comandos principales

```bash
npm run dev               # Desarrollo local (http://localhost:4321)
npm run check             # TypeScript + Astro (astro check)
npm run lint              # ESLint
npm run lint:fix
npm run format            # Prettier (escribe)
npm run format:check      # Prettier (solo comprueba)
npm run validate:content  # Frontmatter, fechas, imágenes, links y datos de Medicaid
npm run validate:medicaid # Solo los datos de Medicaid
npm run build             # astro check + build a dist/
npm run preview           # Servir dist/ en local
```

Si el CSS parece antiguo en `npm run dev`, reinicia el servidor; la verdad está en el build.

## Flujo de trabajo

### 1. Crear un artículo

```bash
# 1. Crear el archivo en la carpeta de su categoría
touch src/content/entries/assisted-living/nombre-del-articulo.md

# 2. Añadir frontmatter (plantilla abajo) y escribir el contenido
# 3. Añadir la imagen hero en public/images/ (.webp + variantes -480 y -768)
# 4. Validar
npm run validate:content
```

El texto de los artículos lo escribe el dueño del sitio. El asistente no redacta artículos; solo
mantiene la infraestructura.

### 2. Plantilla de frontmatter

```yaml
---
title: 'Título (máx 120 caracteres)'
seoTitle: 'Título corto para Google (máx 60)' # si el title es largo
description: 'Descripción para SEO y social (50-300 caracteres)'
publishDate: 2026-10-01
lastReviewed: 2026-10-01
category: assisted-living # assisted-living | memory-care | nursing-homes | in-home-care | senior-care-costs | caregiver-resources
isPillar: false
sources: # 1-2 URLs en artículos normales; 7+ (.gov/.org) en pilares
  - 'https://www.medicare.gov/...'
readingTime: 8 # a mano (obligatorio en pilares)
image: /images/nombre-del-articulo.webp
imageAlt: 'Descripción accesible de la imagen'
tags: ['costos', 'checklist']
---
```

Los campos `states`, `tags`, `showTableOfContents`, `canonicalUrl` se aceptan pero hoy no tienen
efecto. `relatedArticles` es opcional: sin él, los relacionados se calculan solos. Detalle de todos
los campos en [CONTENT_MODEL.md](CONTENT_MODEL.md).

### 3. Checklist de una guía pilar

**Frontmatter**

- [ ] `title` ≤ 120 caracteres (con `seoTitle` ≤ 60 si es largo)
- [ ] `description` de 50-300 caracteres
- [ ] `publishDate` ≤ `lastReviewed` ≤ hoy
- [ ] `category` válida e `isPillar: true`
- [ ] `sources`: 7 o más URLs, preferiblemente `.gov`/`.org` (3 es el mínimo que exige el validador)
- [ ] `readingTime` (palabras totales / 200)
- [ ] `image` `.webp` en `public/images/` y variantes `<nombre>-480.webp` y `<nombre>-768.webp`
- [ ] `imageAlt` descriptivo
- [ ] La guía está enlazada como `pillarSlug` de su categoría en `src/utils/category.ts`

**Estructura Markdown**

- [ ] `## Key Takeaways` (5-6 bullets con negrita inicial) y `---`
- [ ] Intro empático de 2-3 párrafos
- [ ] 6-8 secciones `## H2` (el TOC muestra solo los H2)
- [ ] Al menos 2 tablas y 2 blockquotes con cita y enlace `.gov`/`.org`
- [ ] Al menos 1 enlace interno a `/category/...`
- [ ] `## Frequently Asked Questions` con 5-6 `###`
- [ ] `## Sources` numeradas (7 o más)

**Validación**

- [ ] `npm run validate:content` sin errores (los warnings de pilar son recomendaciones)
- [ ] `npm run check` y `npm run build` sin errores
- [ ] Vista previa: hero, TOC, tablas con scroll en móvil, CTA final

## Estructura de contenido

### Categorías (enum fijo)

| Slug                  | Label           | Uso                                        |
| --------------------- | --------------- | ------------------------------------------ |
| `assisted-living`     | Assisted Living | Comunidades residenciales con apoyo        |
| `memory-care`         | Memory Care     | Unidades especializadas Alzheimer/demencia |
| `nursing-homes`       | Nursing Homes   | Atención de enfermería 24/7                |
| `in-home-care`        | In-Home Care    | Cuidado en el hogar                        |
| `senior-care-costs`   | Costs & Finance | Costes, Medicare, Medicaid, seguros        |
| `caregiver-resources` | Caregiver Help  | Recursos para cuidadores familiares        |

### Tipos de contenido

- **Guía pilar (`isPillar: true`)**: 2500+ palabras, revisión cada 6 meses, 7+ fuentes recomendadas
  (mínimo 3). Una por categoría, ya publicadas las seis.
- **Artículo normal (`isPillar: false`)**: 800-2000 palabras, foco específico, revisión anual. Hoy
  hay uno (la comparación de los 7 tipos).

## Datos por estado

### Costes (`src/data/costs-by-state.json`)

Datos de la encuesta CareScout 2025 (publicada en marzo de 2026). Se actualizan una vez al año
cuando sale la nueva encuesta: se sustituyen los valores del JSON y `_meta` (`surveyYear`,
`publishedDate`) y se ejecuta el build. Las páginas `/costs/` y `/costs/[state]/` se generan solas.

### Medicaid (`src/data/medicaid-by-state.json`)

- Cada valor lleva fuente oficial, fecha efectiva y fecha de comprobación. Solo se muestran los
  valores `verified` leídos de un documento oficial; lo demás queda en `review` y no se ve.
- Procedimiento completo: `.claude/skills/update-medicaid-data/SKILL.md` y el registro de fuentes en
  `sources.md`. Cada revisión deja un informe en `docs/data-reports/`.
- `readerNotes` (opcional por estado) muestra avisos "Keep in mind" a los lectores.
- `docs/medicaid-sources/` guarda localmente los PDF consultados; está en `.gitignore`.
- Revisión recomendada: enero y julio (las cifras federales cambian el 1 de enero y el 1 de julio).

## Convenciones de código

### TypeScript

- `strict: true`; sin `any` (usar `unknown` y type guards).
- Interfaces para props. Types de collections: `CollectionEntry<'entries'>`.

### Componentes Astro

- Un componente por archivo, props tipadas con `interface Props`, slots para composición.

### CSS vanilla

- Tokens en `src/styles/tokens.css` (`--sl-*`), modo claro y oscuro.
- BEM simplificado: `.c-componente`, `.c-componente--variante`; utilidades `.u-*`.
- Estilos compartidos en `src/styles/components.css`; estilos específicos de una página, en su
  `<style>`.
- Mobile-first. Los textos van centrados y a ancho completo (sin `max-width` en párrafos).

**Estilos de la guía pilar** (`src/layouts/PillarArticleLayout.astro`): hero, TOC inline, Key
Takeaways (`h2#key-takeaways + ul`), tablas, barra de progreso, botón "Back to Top" y CTA final.
Detalle en [CONTENT_MODEL.md](CONTENT_MODEL.md#cómo-se-muestra-un-artículo).

### Git

- Se trabaja directamente sobre `main`; **no se hace commit ni push sin que el dueño lo pida**
  (regla de `AGENTS.md`).
- Commits convencionales: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- En cada push, GitHub Actions ejecuta lint, formato, `astro check`, validación y build; Cloudflare
  Pages despliega desde `main`.
- Archivos que no se suben: `.claude/launch.json` (local) y `docs/medicaid-sources/`.

## Depuración común

- **Errores de tipos en collections**: `npm run check`, o reiniciar el servidor TS de VS Code.
- **Imágenes que no cargan**: comprobar la ruta en `public/images/` y que el frontmatter use
  `/images/archivo.webp`. Si faltan las variantes `-480`/`-768`, la imagen carga pero sin `srcset`.
- **Build falla en Cloudflare**: revisar el log en el panel de Cloudflare Pages; suele ser
  `astro check` o `validate:content`.
- **CSS antiguo en dev**: reiniciar `npm run dev`.

## Variables de entorno

| Variable           | Dónde configurar | Requerida | Valor por defecto                         |
| ------------------ | ---------------- | --------- | ----------------------------------------- |
| `PUBLIC_SITE_URL`  | Cloudflare Pages | Sí        | `https://senior-living-options.pages.dev` |
| `PUBLIC_SITE_NAME` | Cloudflare Pages | Sí        | `Senior Living Options`                   |

En `.env.local` para desarrollo:

```env
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Senior Living Options (Dev)
```

## Checklist antes de publicar

- [ ] `npm run check`, `npm run lint` y `npm run format:check` pasan
- [ ] `npm run validate:content` pasa (incluye Medicaid)
- [ ] `npm run build` genera `dist/` sin errores
- [ ] Revisar `/`, `/category/*`, `/article/*`, `/costs/`, `/search/` y las páginas legales
- [ ] SEO: meta tags, JSON-LD y sitemap
- [ ] Responsive (móvil, tablet, escritorio) y accesibilidad (skip link, foco, contraste)
- [ ] Probar el formulario de contacto una vez publicado

## Presupuesto de rendimiento

| Métrica                  | Límite  | Real (oct. 2026)                                             |
| ------------------------ | ------- | ------------------------------------------------------------ |
| HTML gzipped (con CSS)   | < 30 KB | Home 12.7 KB · guía pilar 25.2 KB · página de estado 14.3 KB |
| JS                       | < 10 KB | Mínimo, inline                                               |
| Lighthouse Performance   | > 95    | 98-100                                                       |
| Lighthouse Accessibility | > 95    | 100                                                          |
| Lighthouse SEO           | > 95    | 100                                                          |

El CSS va inline dentro del HTML, así que su peso está incluido en la primera fila.

## Recursos útiles

- [Astro Docs](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Web.dev Performance](https://web.dev/fast/)
