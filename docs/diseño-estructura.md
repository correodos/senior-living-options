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

**Modo oscuro** (paleta "salvia", más tranquila que un verde intenso):

| Token CSS                  | Valor (oscuro) | Uso                                 |
| -------------------------- | -------------- | ----------------------------------- |
| `--sl-color-bg`            | `#131614`      | Fondo general (gris con tono verde) |
| `--sl-color-bg-alt`        | `#1c201d`      | Cards, cabecera                     |
| `--sl-color-text`          | `#e8e8e4`      | Texto principal                     |
| `--sl-color-text-muted`    | `#c2c6c1`      | Subtítulos, metadatos               |
| `--sl-color-border`        | `#2f3530`      | Bordes                              |
| `--sl-color-primary`       | `#8fd3ad`      | Botones, enlaces, foco              |
| `--sl-color-primary-light` | `#1d2e24`      | Bandas y fondos sutiles             |

Los colores de categoría también tienen versión oscura suavizada. Contraste medido en octubre de
2026: todos los textos superan 4.5:1 en ambos modos (en oscuro, entre 7.9 y 10.7:1; el más justo es
el naranja de Nursing Homes en claro, 4.9:1). Cualquier color nuevo se define en los dos bloques de
modo oscuro de `tokens.css` (preferencia del sistema y `[data-theme='dark']`).

### Iconos

Iconos de línea SVG propios (`src/components/ui/Icon.astro`), trazo de 1.75px y esquinas
redondeadas, con el color de cada categoría. **No se usan emoji** en ninguna parte del sitio.

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
- Sin sombras decorativas innecesarias; solo en cards al hacer hover (elevación de 2px).

### Interacción y accesibilidad

- Anillo de foco de **3px** visible en ambos modos al navegar con teclado.
- Animaciones cortas (hover de tarjetas, flecha de FAQ, botón "volver arriba"); todas se desactivan
  con `prefers-reduced-motion`.
- Objetivos de pulsación amplios: tarjetas y filas de listas enteras son clicables.

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
   botones: "Find the right care type →" y "Compare costs by state". Fondo con dos degradados
   radiales suaves (verde arriba a la izquierda, melocotón abajo a la derecha) hechos con tokens,
   sin imagen. No hay badge de "Trusted by N families" (solo se pondría con un dato real y
   verificable).
2. **Trust bar:** "Researched from government and nonprofit sources" · "Updated 2026". Lista
   estática (en móvil, una línea debajo de otra); sin texto en movimiento.
3. **Categorías (silos):** "What type of care do you need?" / "Explore care options by category".
   Grid de 6 cards horizontales: icono a la izquierda en su color de categoría, título con flecha
   "→" y descripción corta completa. Toda la card es un enlace.
4. **Most read guides:** las 6 guías pilar en formato lista editorial (badge de categoría, título,
   "Complete guide", minutos de lectura y fecha), ordenadas por fecha. En móvil la categoría va
   encima del título; desde 768px, en columna a la izquierda. Toda la fila es clicable. Enlace "See
   all →".
5. **Costes por estado:** "Senior care costs vary widely by state", medianas nacionales de assisted
   living, residencia y cuidado en casa, y un selector de estado que lleva a `/costs/<estado>/`.
6. **Quick answers:** 5 preguntas desplegables (flecha verde que gira al abrir) con respuesta breve
   y enlace a la guía.
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
- **TOC:** en pilares, caja inline arriba ("In this guide", solo H2 numerados 01, 02…, sin sticky).
  En artículos normales, sidebar sticky ("In this article", H2 y H3) con resaltado de la sección
  activa.
- **Hero de pilares:** el texto sobre la foto (breadcrumbs, descripción, fechas) usa blanco fijo y
  un velo oscuro en ambos modos para que siempre se lea.
- **Key Takeaways:** sección `## Key Takeaways` al inicio del Markdown; se muestra con fondo
  `--sl-color-primary-light` y checks verdes en las guías pilar. Es el estándar editorial
  recomendado en pilares (el validador solo avisa si falta); hoy solo la tienen 2 de las 6. En
  artículos normales se escribe como blockquote.
- **Cuerpo:** tablas con cabecera y scroll horizontal accesible por teclado, blockquotes con borde
  verde, H2 con margen superior generoso, links verdes subrayados en el texto.
- **CTA final:** en pilares, tres botones (la categoría, "costs" y búsqueda); en artículos normales,
  dos (la categoría y la guía pilar).
- **Fuentes:** sección `## Sources` en el Markdown, con la fecha de última revisión.
- **Relacionados:** "Related Guides" (`RelatedArticles`): primero de la misma categoría y luego
  otros pilares.
- **Barra de progreso de lectura** (3px) y botón "Back to Top".

El detalle técnico de cada componente está en [CONTENT_MODEL.md](CONTENT_MODEL.md) y el
procedimiento para crear artículos nuevos, en [NUEVO_ARTICULO.md](NUEVO_ARTICULO.md).

---

## 5. Página de categoría

```
[ Breadcrumbs: Home > Categoría ]
[ Etiqueta con icono y fondo de su color + H1 con el nombre ]
[ Descripción ]

[ "Core Guides": guía pilar destacada con etiqueta "Pillar Article" ]

[ "Articles & Guides": cards de artículos normales ("1 article" / "N articles") ]

[ Solo en Costs & Finance: selector de estado ]

[ "Explore Other Categories": cards de las otras 5 categorías con "View guides →" ]
```

La sección "Articles & Guides" **solo aparece si la categoría tiene artículos normales**. Hoy solo
la tiene Caregiver Help; en las demás aparecerá sola en cuanto se publique el primero.

---

## 6. Búsqueda

- Página `/search/` con un campo de búsqueda; funciona en el navegador con el índice generado en el
  build (`src/pages/search-index.json.ts` → `/search-index.json`).
- `robots.txt` no indexa `/search/`.

---

## 7. Costes por estado

- `/costs/`: tabla ordenable con los 50 estados (medianas de la encuesta CareScout 2025). En móvil
  muestra el aviso "Swipe the table sideways to see all columns →", la columna de estados queda fija
  al deslizar y una sombra en el borde derecho indica que hay más columnas.
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

| Breakpoint          | Cambios principales                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Mobile (< 640px)    | Hamburguesa · grid de categorías a 1 columna · TOC plegable · pie con marca a todo el ancho · trust bar en dos líneas |
| Tablet (640-1023px) | Grid de categorías a 2 columnas · sin sidebar de TOC · pie en 2 columnas                                              |
| Desktop (≥ 1024px)  | Grid de categorías a 3 columnas · TOC sticky en artículos normales · pie en 4 columnas                                |
| ≥ 1200px            | El menú de la cabecera pasa a una sola fila                                                                           |

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
