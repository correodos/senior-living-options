# Guía de Diseño y Estructura — Senior Living Options

Documento de referencia del diseño visual, la estructura de páginas y los patrones de interfaz.
Actualizado en octubre de 2026 para reflejar el sitio real.

> **La página web tiene que estar en inglés de Estados Unidos.** Esta guía está en español, pero
> todos los textos que ve el lector (títulos, botones, etiquetas, mensajes) se escriben en inglés.

---

## 1. Identidad visual

### Paleta de color

Paleta editorial de confianza: fondo cálido, verde oscuro como color principal y acentos por
categoría. Los valores viven en `src/styles/tokens.css`, con versión clara y oscura (se cambia con
el botón del tema de la cabecera).

| Token CSS                  | Valor (claro) | Uso                                          |
| -------------------------- | ------------- | -------------------------------------------- |
| `--sl-color-bg`            | `#f8f7f4`     | Fondo general de página                      |
| `--sl-color-bg-alt`        | `#ffffff`     | Fondo de cards, hero, nav                    |
| `--sl-color-text`          | `#1a1a1a`     | Texto principal                              |
| `--sl-color-text-muted`    | `#555555`     | Subtítulos, metadatos                        |
| `--sl-color-border`        | `#e5e3de`     | Divisores, bordes de card                    |
| `--sl-color-primary`       | `#1a4d3a`     | Verde oscuro — acción principal, logo, links |
| `--sl-color-primary-hover` | `#143d2e`     | Hover de primary                             |
| `--sl-color-primary-light` | `#eaf4ef`     | Fondos sutiles (badges, banners)             |

**Colores por categoría** (badges e iconos):

| Categoría       | Background | Texto     |
| --------------- | ---------- | --------- |
| Assisted Living | `#eaf4ef`  | `#1a4d3a` |
| Memory Care     | `#eef1fb`  | `#3a4d9e` |
| Nursing Homes   | `#fef3ea`  | `#9e5a1a` |
| In-Home Care    | `#f0faf5`  | `#1a6640` |
| Costs & Finance | `#f4eafb`  | `#7a1a9e` |
| Caregiver Help  | `#fdf4ea`  | `#8a5a12` |

Los textos del modo oscuro se ajustan para cumplir el contraste 4.5:1 (comprobado con axe).

### Tipografía

Dos familias con roles separados:

- **Georgia, serif** — `h1`, `h2`, logo y pull quotes. Autoridad editorial.
- **System UI, sans-serif** — cuerpo, etiquetas, botones, metadatos y navegación.

La escala está en `tokens.css` (`--sl-fs-*`). El texto base es **18px** (`1.125rem`) y el pequeño
**16px**, pensados para lectores mayores. El interlineado del cuerpo es relajado
(`--sl-lh-relaxed`).

**Longitud de línea:** no hay máximo en los párrafos. Los textos van **centrados en la página y a
ancho completo** (decisión del dueño del sitio). Las páginas legales y de confianza usan un
contenedor de 780px.

### Espaciado y radio

- Espaciado por tokens `--sl-space-*` (múltiplos de 4px).
- Bordes redondeados por tokens `--sl-radius-*`; pill badges con radio grande.
- Sin sombras decorativas innecesarias; solo en cards al hacer hover.

---

## 2. Componentes globales

### Cabecera (Header)

```
[ Logo ]     [ Assisted Living ] [ Memory Care ] [ Nursing Homes ] [ In-Home Care ]
             [ Costs & Finance ] [ Caregiver Help ] [ About ]            [ theme ]
```

- Altura de la barra: `52px`; **sticky** en todos los tamaños.
- Menú en una sola fila desde **1200px**; por debajo, botón hamburguesa con menú desplegable.
- Hover y foco solo cambian el color (el texto no se desplaza).
- Botón de cambio de tema claro/oscuro solo aquí (no en el hero de los artículos).

### Pie de página (Footer)

Cuatro columnas en escritorio (apiladas en móvil, con Topics y About en dos columnas):

- **Marca:** nombre, una frase y la nota "Cost figures come from official and published sources… and
  are reviewed every year."
- **Topics:** las 6 categorías y "Costs by State".
- **Guides:** las 6 guías pilar ("<Categoría>: Complete Guide").
- **About:** About, Editorial Policy, Contact y Search.
- **Franja inferior:** copyright, aviso de que es información educativa y los enlaces legales
  (Privacy Policy, Terms of Use, Disclaimer, Accessibility).

---

## 3. Página de inicio (Home)

Orden real de secciones:

1. **Hero:** "Understanding your senior care options — without the overwhelm", párrafo corto y dos
   botones: "Find the right care type →" y "Compare costs by state". No hay badge de "Trusted by N
   families" (solo se pondría con un dato real y verificable).
2. **Trust bar:** "Researched from government and nonprofit sources" · "Updated 2026".
3. **Categorías (silos):** "What type of care do you need?" / "Explore care options by category".
   Grid de 6 cards (icono, nombre, descripción corta); toda la card es un enlace.
4. **Most read guides:** las 6 guías pilar en formato lista editorial (badge de categoría, título,
   "Complete guide", minutos de lectura y fecha), ordenadas por fecha. Enlace "See all →".
5. **Costes por estado:** "Senior care costs vary widely by state", medianas nacionales de assisted
   living, residencia y cuidado en casa, y un selector de estado que lleva a `/costs/<estado>/`.
6. **Quick answers:** 5 preguntas desplegables con respuesta breve y enlace a la guía.
7. **Not sure where to start?:** 4 pasos y el botón "Read the complete guide →".

Ideas futuras (no implementadas): un quiz de orientación de 3 preguntas (`/quiz/`) y una sección
"Stay informed" con suscripción (requeriría un servicio de email y actualizar la política de
privacidad).

---

## 4. Página de artículo

Hay dos layouts:

- **Guía pilar** (`PillarArticleLayout`): hero con imagen, breadcrumbs, categoría y la etiqueta
  **Pillar Article**, TOC inline y contenido a ancho completo.
- **Artículo normal** (`ArticleLayout`): cabecera sencilla, contenido en columna principal y TOC
  sticky a la derecha en pantallas grandes (plegable en móvil).

### 4.1 Elementos comunes

- **Breadcrumbs:** Home > Categoría > Artículo.
- **Metadatos:** categoría, "Published" y "Updated" (fecha de revisión), minutos de lectura. La
  fecha de revisión es la importante en este nicho.
- **No hay "Revisado por" ni botón de compartir.** No hay revisores reales y no se inventan.
- **TOC:** en pilares, caja inline arriba ("In this guide", solo H2, sin sticky). En artículos
  normales, sidebar sticky ("In this article", H2 y H3) con resaltado de la sección activa.
- **Key Takeaways:** sección `## Key Takeaways` al inicio del Markdown; se muestra con fondo
  `--sl-color-primary-light` y checks verdes en las guías pilar. Es obligatoria como estándar
  editorial en pilares, pero hoy solo la tienen 2 de las 6.
- **Cuerpo:** tablas con cabecera y scroll horizontal accesible por teclado, blockquotes con borde
  verde, H2 con margen superior generoso, links verdes subrayados en el texto.
- **CTA final:** en pilares, tres botones (la categoría, "costs" y búsqueda); en artículos normales,
  dos (la categoría y la guía pilar).
- **Fuentes:** sección `## Sources` en el Markdown, con la fecha de última revisión.
- **Relacionados:** "Related Guides" (`RelatedArticles`): primero de la misma categoría y luego
  otros pilares.
- **Barra de progreso de lectura** (3px) y botón "Back to Top".

El detalle técnico de cada componente está en [CONTENT_MODEL.md](CONTENT_MODEL.md).

---

## 5. Página de categoría

```
[ Breadcrumbs: Home > Categoría ]
[ Icono + H1 con el nombre ]
[ Descripción ]

[ "Core Guides": guía pilar destacada con etiqueta "Pillar Article" ]

[ "Articles & Guides": cards de artículos, o "More articles coming soon on …" si no hay ]

[ "Explore Other Categories": cards de las otras 5 categorías con "View guides →" ]
```

---

## 6. Búsqueda

- Página `/search/` con un campo de búsqueda; funciona en el navegador con el índice generado en el
  build (`src/pages/search-index.json.ts` → `/search-index.json`).
- `robots.txt` no indexa `/search/`.

---

## 7. Costes por estado

- `/costs/`: tabla ordenable con los 50 estados (medianas de la encuesta CareScout 2025).
- `/costs/[state]/`: costes del estado (mensual, anual, por hora, centro de día, enfermería
  privada), posición frente al resto, estados similares, FAQs, metodología y fuentes, y la sección
  "Paying with Medicaid in <estado>".
- La sección de Medicaid solo muestra valores verificados en documentos oficiales, cada uno con su
  fuente y fechas. Si no pudimos verificar el estado, muestra una nota con la fecha y el enlace a la
  agencia. Algunos estados llevan además un aviso "Keep in mind" (campo `readerNotes`).

---

## 8. Páginas de confianza y legales

| Página                                                    | Indexable | Contenido                                                                                                      |
| --------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| `/about/`                                                 | Sí        | Por qué existe el sitio y quién está detrás (proyecto de una persona, sin nombre)                              |
| `/editorial-policy/`                                      | Sí        | Cómo se hacen los artículos (con ayuda de IA y revisión humana), fuentes, cifras, independencia y correcciones |
| `/contact/`                                               | Sí        | Formulario (Formspree) y a quién acudir para consejo médico, legal o financiero                                |
| `/contact/thanks/`                                        | No        | Confirmación del envío                                                                                         |
| `/privacy/`, `/terms/`, `/disclaimer/`, `/accessibility/` | No        | Páginas legales (`noindex`, fuera del sitemap)                                                                 |
| `/404`                                                    | -         | Página de error                                                                                                |

Las fechas "Last updated" de estas páginas son fijas: se cambian a mano cuando cambia el texto.

---

## 9. Patrones de UI reutilizables

- **Badges de categoría:** `.c-badge` con los colores de su categoría; la etiqueta "Pillar Article"
  usa `.c-badge--pillar`.
- **Eyebrow labels:** `.c-eyebrow`, mayúsculas, color verde primario, solo como orientador de
  sección.
- **Formularios:** `.c-form`, `.c-form-group`, `.c-form-label`, `.c-form-input`, `.c-form-hint` (en
  `components.css`). Los campos llevan etiqueta visible; los obligatorios se marcan con `*` y
  atributo `required`.
- **Divisores:** `<hr>` o borde inferior; nunca decorativos.

---

## 10. Comportamiento responsive

| Breakpoint          | Cambios principales                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Mobile (< 640px)    | Hamburguesa · grid de categorías a 1 columna · TOC plegable · pie con marca a todo el ancho |
| Tablet (640-1023px) | Grid de categorías a 2 columnas · sin sidebar de TOC · pie en 2 columnas                    |
| Desktop (≥ 1024px)  | Grid de categorías a 3 columnas · TOC sticky en artículos normales · pie en 4 columnas      |
| ≥ 1200px            | El menú de la cabecera pasa a una sola fila                                                 |

---

## 11. Pendiente

1. **Dominio propio** (ahora `senior-living-options.pages.dev`).
2. **Publicidad (AdSense):** consentimiento de cookies y ajuste de la CSP en `public/_headers`;
   revisar la política de privacidad y la política editorial en ese momento.
3. **Ideas opcionales:** quiz de orientación (`/quiz/`), mapa del sitio en HTML, suscripción por
   email, campo opcional de email en el formulario de accesibilidad.

---

_Creado en septiembre de 2026; revisado en octubre de 2026. Actualizar cuando cambie la dirección de
diseño._
