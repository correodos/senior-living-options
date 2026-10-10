# Cómo crear un artículo nuevo

> Guía paso a paso para que un artículo nuevo quede igual que los actuales. Actualizada en octubre
> de 2026. El texto del artículo se escribe en **inglés de EE. UU.**; esta guía está en español.
>
> El contenido lo escribe el dueño del sitio. El asistente no redacta artículos: solo mantiene la
> plantilla, el diseño y el validador.

Referencias reales para copiar el formato:

| Tipo                    | Archivo de ejemplo                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Guía pilar (modelo)     | `src/content/entries/assisted-living/assisted-living-complete-guide.md`                               |
| Artículo normal/soporte | `src/content/entries/caregiver-resources/senior-living-options-complete-comparison-of-all-7-types.md` |

---

## 1. Elegir el tipo de artículo

| Tipo                                    | Cuándo                                                           | Layout                |
| --------------------------------------- | ---------------------------------------------------------------- | --------------------- |
| **Guía pilar** (`isPillar: true`)       | La guía principal de una categoría. **Ya existen las seis.**     | `PillarArticleLayout` |
| **Artículo normal** (`isPillar: false`) | Cualquier artículo nuevo de soporte, comparación o tema concreto | `ArticleLayout`       |

Lo normal a partir de ahora es crear **artículos normales**. Solo se crearía una guía pilar nueva si
se sustituye una de las seis existentes.

Diferencias visibles:

- **Pilar**: hero con la foto de fondo, título blanco, etiquetas "Pillar Article", índice numerado
  arriba ("In this guide", solo H2), caja verde de Key Takeaways, barra de progreso, botón "volver
  arriba" y CTA final con tres botones.
- **Normal**: cabecera sencilla con breadcrumbs y metadatos, índice lateral fijo en escritorio ("In
  this article", H2 y H3) y plegable en móvil, CTA final con dos botones (categoría y guía pilar).

---

## 2. Nombre y ubicación del archivo

```
src/content/entries/<categoria>/<slug-del-articulo>.md
```

- `<categoria>`: una de `assisted-living`, `memory-care`, `nursing-homes`, `in-home-care`,
  `senior-care-costs`, `caregiver-resources`. Debe coincidir con el campo `category`.
- `<slug-del-articulo>`: en inglés, minúsculas y con guiones, igual que la palabra clave principal.
  Ejemplo: `assisted-living-vs-nursing-home.md`.
- La URL final será `/article/<categoria>/<slug-del-articulo>/`.
- No cambies el nombre del archivo una vez publicado (cambiaría la URL).

---

## 3. Imagen principal

Todos los artículos tienen imagen (en las tarjetas y en el hero de los pilares).

| Archivo en `public/images/` | Tamaño     | Uso                         |
| --------------------------- | ---------- | --------------------------- |
| `<slug>.webp`               | 1200 × 675 | Imagen principal (16:9)     |
| `<slug>-768.webp`           | 768 × 432  | Tablet (se usa en `srcset`) |
| `<slug>-480.webp`           | 480 × 270  | Móvil (se usa en `srcset`)  |

- Formato **WebP**, proporción **16:9**. Las actuales pesan entre 30 y 100 KB la grande; intenta no
  pasar de ~100 KB.
- Usa el **mismo nombre que el archivo `.md`** (así se hizo en todas menos una).
- Si faltan `-768` y `-480`, la imagen se ve igual pero sin `srcset` (peor para el rendimiento).
- Fotos realistas de personas mayores y familias en entornos cálidos, como las actuales. En los
  pilares el texto va encima de la foto (con un velo oscuro), así que evita fotos muy claras o con
  mucho detalle en la parte izquierda.
- `imageAlt`: describe la escena en inglés, en una frase corta. Ejemplo:
  `'Senior smiling in assisted living community common area'`.

---

## 4. Frontmatter

Copia la plantilla que toque y rellénala. Los valores entre comillas simples.

### 4.1 Artículo normal

```yaml
---
title: 'Assisted Living vs. Nursing Home: Costs, Care and How to Decide'
seoTitle: 'Assisted Living vs. Nursing Home: Which Is Right?' # solo si title > 60 caracteres
description:
  'Compare assisted living and nursing homes side by side: 2025 costs, level of care, what Medicare
  and Medicaid pay, and how to choose.'
publishDate: 2026-11-01
lastReviewed: 2026-11-01
category: assisted-living
isPillar: false
readingTime: 9
image: /images/assisted-living-vs-nursing-home.webp
imageAlt: 'Daughter and senior mother comparing care options at home'
sources:
  - 'https://www.medicare.gov/...'
  - 'https://www.nia.nih.gov/...'
tags: ['assisted living', 'nursing home', 'senior care costs']
---
```

### 4.2 Guía pilar

Igual que el anterior, con estos cambios:

```yaml
isPillar: true
readingTime: 14 # obligatorio en pilares
sources: # mínimo 3 (error si hay menos); recomendado 7 o más, preferiblemente .gov/.org
  - '...'
```

Y además, en `src/utils/category.ts`, el campo `pillarSlug` de su categoría debe apuntar a la nueva
guía (`'<categoria>/<slug>'`). De eso dependen el enlace del pie de página "<Categoría>: Complete
Guide" y el botón de la guía en los artículos normales.

### 4.3 Reglas de cada campo

| Campo             | Regla                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `title`           | Máx. 120 caracteres. Patrón habitual: "Tema: Costs, Services, and How to Choose".            |
| `seoTitle`        | Máx. 60. Añádelo si `title` pasa de ~60 para que Google no lo corte.                         |
| `description`     | 50-300 caracteres (ideal 140-160). Se usa en Google, redes y tarjetas.                       |
| `seoDescription`  | Opcional, 50-160. Solo si quieres una versión distinta para Google.                          |
| `publishDate`     | Fecha de publicación (`AAAA-MM-DD`). No puede ser posterior a `lastReviewed`.                |
| `lastReviewed`    | Última revisión del contenido. No puede ser futura. Actualízala cada vez que revises cifras. |
| `category`        | Igual que la carpeta.                                                                        |
| `readingTime`     | Minutos, a mano: **palabras ÷ 250**, redondeado (los actuales están entre 12 y 15).          |
| `sources`         | URLs completas. Deben coincidir con las de la sección `## Sources` del texto.                |
| `tags`, `states`  | Se aceptan pero hoy no tienen efecto visible. Opcionales.                                    |
| `relatedArticles` | Opcional: lista de ids (`'<categoria>/<slug>'`). Sin él, los relacionados se eligen solos.   |
| `noIndex`         | `true` solo para ocultar el artículo de Google, la búsqueda y los relacionados.              |

### 4.4 Longitud, fuentes y revisión

Mismos criterios que [CONTENT_MODEL.md](CONTENT_MODEL.md#reglas-de-contenido):

| Tipo            | Longitud                                  | Fuentes                                               | Revisar `lastReviewed` |
| --------------- | ----------------------------------------- | ----------------------------------------------------- | ---------------------- |
| Guía pilar      | 2500+ palabras (las actuales, 2900-3900)  | Mínimo 3 (error); 7 o más recomendadas, `.gov`/`.org` | Cada 6 meses           |
| Artículo normal | 800-2000 palabras (el actual tiene ~3400) | Mínimo 1-2; el actual usa 11                          | Cada 12 meses          |

Para que quede como los actuales, apunta a la parte alta: un artículo normal de 2000-3500 palabras
con 5 o más fuentes.

---

## 5. Estructura del texto

### 5.1 Guía pilar

Mismo orden que `assisted-living-complete-guide.md`:

```markdown
## Key Takeaways

- **Frase clave en negrita** seguida de la explicación con un dato concreto.
- **National median cost:** $6,200/month ($74,400/year) as of 2025.
- (5-6 puntos en total, todos con el inicio en negrita)

---

Intro empática de 2-3 párrafos: la situación del lector, qué cubre la guía y de dónde salen los
datos.

---

## What Is [Topic]?

Texto...

### [Topic] vs. [Alternativa]: Key Differences

|                                | [Topic] | [Alternativa] |
| ------------------------------ | ------- | ------------- |
| **Care level**                 | ...     | ...           |
| **Median monthly cost (2025)** | ...     | ...           |

---

## What Does [Topic] Cost?

### National Median Costs (2025)

(tabla + fuente CareScout + enlace a /costs/)

---

## Who Pays for [Topic]?

### Medicare: What It Does and Doesn't Cover

### Medicaid: ...

### VA Benefits for Veterans

### Long-Term Care Insurance

---

## How to Choose [a/an Topic Provider]

### Step 1: ...

### Step 2: ...

---

## Frequently Asked Questions

### ¿Pregunta 1 en inglés?

Respuesta en un párrafo.

### ¿Pregunta 2?

Respuesta...

(5-6 preguntas)

---

## Sources

1. **Organismo.** "Título de la página." https://url-completa. Accessed: Month YYYY.

2. **Organismo.** "Título." https://url. Accessed: Month YYYY.
```

Puntos importantes:

- **`## Key Takeaways` tiene que ser un H2 seguido directamente de una lista** (`- ...`). Así se
  muestra en la caja verde con checks. Si hay un párrafo entre medias, pierde el estilo.
- Separa las secciones principales con `---` (línea horizontal), como en las guías actuales.
- El índice "In this guide" se genera solo con **los H2** y los numera (01, 02…). Usa 6-8 H2. Los H3
  organizan dentro de cada sección pero no salen en el índice.
- El título del artículo **no** se escribe en el Markdown (sale del `title`). Empieza directamente
  por `## Key Takeaways`.

### 5.2 Artículo normal

Mismo orden que `senior-living-options-complete-comparison-of-all-7-types.md`:

```markdown
> **Key Takeaways**
>
> - Punto clave con dato concreto.
> - Punto clave...
> - (4-5 puntos)

---

Intro empática de 2-3 párrafos.

---

## [Primer tema]

...

## [Segundo tema]

...

## How to Choose ...

---

## Frequently Asked Questions

### Pregunta?

Respuesta.

---

## Sources

1. Organismo. "Título." https://url. Accessed Month YYYY.
2. ...
```

- En los artículos normales los Key Takeaways van **dentro de un blockquote** (`> **Key Takeaways**`
  y cada punto con `> - `), porque ese layout no tiene la caja verde de los pilares.
- El índice lateral recoge H2 y H3.

### 5.3 Secciones con nombre exacto

Estos títulos tienen que escribirse **exactamente así**, porque el código los busca:

| Sección                         | Por qué                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| `## Key Takeaways` (pilares)    | Activa la caja verde con checks.                                                         |
| `## Frequently Asked Questions` | Cada `###` debajo se convierte en pregunta del esquema `FAQPage` (resultados de Google). |
| `## Sources`                    | El validador comprueba que exista en los pilares.                                        |

En la FAQ, cada pregunta es un `###` y la respuesta es el párrafo de debajo. No metas listas ni
tablas dentro de las respuestas: el esquema de Google solo recoge texto.

---

## 6. Formato dentro del texto

| Elemento           | Cómo se escribe                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Cifras importantes | En negrita: `**$6,200 per month ($74,400 per year)**`                                                             |
| Tablas             | Sintaxis con barras. Primera columna en negrita para las etiquetas: `\| **Care level** \| ... \|`                 |
| Fila destacada     | Toda en negrita: `\| **National median** \| **$6,200** \| **$74,400** \|`                                         |
| Notas aclaratorias | Párrafo en cursiva: `*Note: Starting with the 2025 survey, CareScout merged...*`                                  |
| Citas / consejos   | Blockquote: `> The NIA recommends...`. Si añades el enlace a la fuente en la misma línea, el validador lo cuenta. |
| Enlace a otra guía | `[nursing home](/article/nursing-homes/nursing-homes-complete-guide/)`                                            |
| Enlace a categoría | `→ [Learn more about memory care](/category/memory-care/)`                                                        |
| Enlace a costes    | `[care costs in all 50 states](/costs/)` o a un estado: `/costs/tx/`                                              |
| Teléfonos útiles   | En el texto, sin enlace: `Eldercare Locator at 1-800-677-1116`                                                    |

- Enlaces internos con barra final (`/category/memory-care/`), sin el dominio.
- Las tablas anchas se deslizan en horizontal en móvil automáticamente; en los pilares, las tablas
  de 3+ columnas y más de 5 filas se convierten en tarjetas en móvil.
- No uses emoji en el texto ni en los títulos: el sitio usa iconos SVG propios.
- No incluyas imágenes dentro del texto: los artículos actuales solo tienen la imagen principal.

### Fuentes

- La lista de fuentes admitidas, por orden de preferencia, está en `AGENTS.md` (sección
  "Contenido"): primero oficiales (medicare.gov, medicaid.gov, cms.gov, va.gov, nia.nih.gov,
  acl.gov…), luego la encuesta de costes CareScout/Genworth, luego organizaciones sin ánimo de lucro
  (AARP, Alzheimer's Association…). Las cifras clave (costes, límites, coberturas) deben venir de
  una fuente oficial o de la encuesta de costes.
- Formato en `## Sources`: lista numerada con organismo en negrita, título entre comillas, URL
  completa y "Accessed: Month YYYY" (o "Released:" para informes con fecha).
- Las mismas URLs van en el campo `sources` del frontmatter.

---

## 7. Qué pasa automáticamente al publicar

No hay que tocar código para que un artículo normal aparezca:

| Dónde                               | Qué ocurre                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| Página de su categoría              | Aparece la sección **"Articles & Guides"** con su tarjeta (oculta mientras no hay ninguno). |
| "Related Guides" de otros artículos | Se incluye entre los relacionados de su categoría.                                          |
| Búsqueda (`/search/`)               | Entra en el índice de búsqueda en el siguiente build.                                       |
| Sitemap                             | Se añade con `lastReviewed` como fecha de modificación.                                     |
| SEO                                 | Meta tags, Open Graph, JSON-LD `Article`, `BreadcrumbList` y `FAQPage` se generan solos.    |
| Home, "Most read guides"            | Muestra primero las 6 guías pilar, así que los artículos normales no salen ahí de momento.  |

Lo que sí conviene hacer a mano: añadir un enlace al artículo nuevo desde su guía pilar (en la
sección relacionada) para que reciba tráfico interno.

---

## 8. Validar y revisar

```bash
npm run validate:content   # frontmatter, fechas, imagen, fuentes y estructura
npm run build              # comprobación completa
npm run dev                # vista previa en http://localhost:4321
```

- **Errores** (❌) rompen el build y hay que corregirlos.
- **Avisos** (⚠️) en pilares son recomendaciones editoriales (menos de 7 fuentes, falta de Key
  Takeaways, menos de 2 tablas o blockquotes con fuente, sin enlace a `/category/`, menos de 2500
  palabras). Las guías actuales tienen algunos avisos y es aceptable.

En la vista previa revisa, en móvil y escritorio, y en modo claro y oscuro:

- La tarjeta del artículo en su página de categoría (imagen, etiqueta, título).
- El índice y que todos los H2 aparezcan.
- Las tablas en móvil.
- En pilares: que el texto del hero se lea bien sobre la foto y que salga la caja de Key Takeaways.

---

## 9. Checklist rápida

**Archivo e imagen**

- [ ] `src/content/entries/<categoria>/<slug>.md`, nombre en inglés con guiones
- [ ] `public/images/<slug>.webp` (1200×675) + `-768.webp` + `-480.webp`
- [ ] `imageAlt` descriptivo en inglés

**Frontmatter**

- [ ] `title` (y `seoTitle` si pasa de 60 caracteres), `description` de 50-300
- [ ] `publishDate` ≤ `lastReviewed` ≤ hoy
- [ ] `category` igual que la carpeta, `isPillar` correcto
- [ ] `readingTime` (palabras ÷ 250)
- [ ] `sources` con las mismas URLs que la sección `## Sources`

**Texto**

- [ ] Key Takeaways (H2 + lista en pilares; blockquote en artículos normales)
- [ ] Intro de 2-3 párrafos entre `---`
- [ ] Secciones H2 claras (6-8 en pilares)
- [ ] Al menos una tabla con cifras y su fuente
- [ ] Enlaces internos a su guía pilar, su categoría o `/costs/`
- [ ] `## Frequently Asked Questions` con preguntas `###`
- [ ] `## Sources` numeradas, solo fuentes oficiales o de referencia
- [ ] Sin emoji, sin imágenes dentro del texto, todo en inglés de EE. UU.

**Antes de subir**

- [ ] `npm run validate:content` y `npm run build` sin errores
- [ ] Revisado en la vista previa (móvil, escritorio, claro y oscuro)
- [ ] Commit y push solo cuando el dueño lo decida
