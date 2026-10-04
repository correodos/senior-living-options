# Guía de Diseño y Estructura — Senior Living Options

Documento de referencia para el diseño visual, estructura de páginas y patrones de UI. Basado en el
mockup inicial (`senior_living_homepage_mockup.html`) y el proyecto Astro existente.

------ La página web tiene que estar en inglés de Estados Unidos ------

---

## 1. Identidad visual

### Paleta de color

El sitio usa una paleta editorial de confianza: fondo cálido, verde oscuro como color principal, con
colores de acento por categoría.

| Token CSS                  | Valor     | Uso                                          |
| -------------------------- | --------- | -------------------------------------------- |
| `--sl-color-bg`            | `#f8f7f4` | Fondo general de página                      |
| `--sl-color-bg-alt`        | `#ffffff` | Fondo de cards, hero, nav                    |
| `--sl-color-text`          | `#1a1a1a` | Texto principal                              |
| `--sl-color-text-muted`    | `#666666` | Subtítulos, metadatos                        |
| `--sl-color-border`        | `#e5e3de` | Divisores, bordes de card                    |
| `--sl-color-primary`       | `#1a4d3a` | Verde oscuro — acción principal, logo, links |
| `--sl-color-primary-hover` | `#143d2e` | Hover de primary                             |
| `--sl-color-primary-light` | `#eaf4ef` | Fondos sutiles (badges, banners)             |

**Colores por categoría** (para badges e iconos):

| Categoría       | Background | Texto     |
| --------------- | ---------- | --------- |
| Assisted Living | `#eaf4ef`  | `#1a4d3a` |
| Memory Care     | `#eef1fb`  | `#3a4d9e` |
| Nursing Homes   | `#fef3ea`  | `#9e5a1a` |
| In-Home Care    | `#f0faf5`  | `#1a6640` |
| Costs & Finance | `#f4eafb`  | `#7a1a9e` |
| Caregiver Help  | `#fdf4ea`  | `#9e6a1a` |

### Tipografía

El sitio usa **dos familias** con roles claramente separados:

- **Georgia, serif** — Títulos `h1`, `h2`, logo, pull quotes. Comunica autoridad editorial y
  confianza. Line-height `1.25`.
- **System UI, sans-serif** (`-apple-system, sans-serif`) — Todo lo demás: body, labels, botones,
  metadatos, navegación. Line-height `1.6` para cuerpo, `1.4` para UI.

**Escala tipográfica:**

| Uso            | Tamaño                   | Familia | Peso                                 |
| -------------- | ------------------------ | ------- | ------------------------------------ |
| H1 hero        | `30px` (desktop: `36px`) | Georgia | 700                                  |
| H2 sección     | `20px`                   | Georgia | 700                                  |
| H3 card        | `14px`                   | Sans    | 600                                  |
| Body           | `15px`                   | Sans    | 400                                  |
| UI labels      | `13px`                   | Sans    | 400–500                              |
| Badges / meta  | `11–12px`                | Sans    | 500–600                              |
| Eyebrow labels | `11px`                   | Sans    | 600, uppercase, letter-spacing 0.8px |

**Longitud de línea:** máximo `65ch` para body text en artículos. El hero usa `max-width: 540px`.

### Espaciado y radio

- Espaciado base: múltiplos de `4px` (4, 8, 10, 12, 16, 20, 24, 28, 32, 48px)
- Bordes redondeados: `8px` para botones y cards, `4–5px` para badges, `20px` para pill badges
- Sin sombras decorativas innecesarias — solo en cards al hacer hover

---

## 2. Componentes globales

### Navegación (Header)

```
[ Logo ]                [ Link ] [ Link ] [ Link ] [ Link ]
```

- Altura fija: `52px`
- Fondo blanco, borde inferior `1px #e5e3de`
- Logo: Georgia, 17px, verde oscuro, con segunda palabra en color `#5a9e7a`
- Links de nav: Sans, 13px, color `#555`, hover verde oscuro
- Mobile: hamburguer icon → menú desplegable con los mismos links en columna + botón "Buscar"
- El header NO es sticky en mobile; sí puede ser sticky en desktop si el contenido es largo

### Footer

- Fondo `#f8f7f4`, borde superior
- Una sola línea: copyright + disclaimer legal
- Sans, 11px, color `#aaa`
- Opcionalmente: columnas con links a categorías y páginas legales si el sitio crece

---

## 3. Página de inicio (Home)

### 3.1 Hero

**Objetivo:** capturar al visitante que llega agobiado buscando ayuda para un familiar.

**Estructura:**

```
[ Badge: "Trusted by 50,000+ families" ]
[ H1: Titular empático y claro ]
[ Párrafo: 1-2 líneas de propuesta de valor ]
[ CTA primario ] [ CTA secundario ]
```

**Reglas:**

- El H1 debe validar la emoción del usuario, no vender. Ejemplo: _"Understanding your senior care
  options — without the overwhelm"_. Evitar lenguajes corporativos ("soluciones integrales",
  "recursos de calidad").
- El badge superior solo si hay un número real y verificable. Si no, omitir.
- CTA primario: acción de descubrimiento ("Find the right care type →")
- CTA secundario: acción de comparación ("Compare costs by state")
- Fondo blanco para el hero, contrasta con el `#f8f7f4` del resto

### 3.2 Trust Bar

Aparece inmediatamente después del hero, antes del contenido.

```
[ ✓ Researched from government and nonprofit sources ] · [ ↻ Updated 2026 ]
```

- Fondo `#f8f7f4`, borde inferior
- Sans, 12px, gris, con icono verde al frente
- Máximo 3 ítems — si hay más, elegir los más verificables

### 3.3 Grid de categorías (Silos)

**Objetivo:** orientar al usuario que no sabe qué tipo de cuidado necesita.

```
[ Eyebrow: "What type of care do you need?" ]
[ Subtítulo: instrucción clara ]
[ Grid 3×2 de cards de categoría ]
```

**Card de categoría:**

- Fondo blanco, borde `1px #e5e3de`, radio `10px`
- Icono emoji en cuadrado redondeado con color de fondo de la categoría
- Título: Sans 14px bold
- Descripción: Sans 11px, gris, máx. 2 líneas
- Hover: borde cambia a verde (`#5a9e7a`)
- El card entero es clickeable → va a la página de categoría

**Idea a añadir — quiz de orientación:** Antes o debajo de este grid, un banner tipo:

```
[ ¿No sabes por dónde empezar? → Responde 3 preguntas y te orientamos ]
```

Lleva a una página o modal con 3 preguntas simples (¿necesita ayuda médica constante? / ¿puede vivir
solo? / ¿tiene presupuesto limitado?) y recomienda el tipo de cuidado más adecuado. Muy efectivo
para engagement.

### 3.4 Artículos más leídos

**Objetivo:** mostrar el contenido de mayor valor sin imagen, formato lista editorial.

```
[ H2: "Most read guides" ]                    [ See all → ]
[ Badge categoría ] [ Título del artículo ]
                    [ Tiempo de lectura · Fecha ]
```

**Reglas:**

- Sin imágenes en esta sección — formato lista limpio
- Máximo 4-6 artículos
- Badge de categoría con color de la categoría correspondiente
- Tiempo de lectura es un dato de confianza; incluirlo siempre
- Ordenar por relevancia/tráfico, no por fecha

### 3.5 FAQs rápidas

**Objetivo:** responder las preguntas más comunes directamente en home (SEO + UX).

```
[ H2: "Quick answers" ]
---
[ Pregunta en negrita ]
[ Respuesta corta ] [ link → ]
---
[ Pregunta ]
[ Respuesta ] [ link → ]
```

**Reglas:**

- Máximo 4 preguntas
- Las respuestas son breves (1-2 líneas) con un link a la guía completa
- El contenido debe ser factual y actualizado con año
- Las preguntas deben ser exactamente como las busca la gente en Google (usa Search Console o
  SEMrush para elegirlas)

**Ideas de preguntas para el home:**

1. How much does assisted living cost per month?
2. Does Medicare cover assisted living?
3. What's the difference between memory care and assisted living?
4. How do I know when it's time for a nursing home?

### 3.6 Módulo adicional recomendado — Costos por estado

Entre la sección de artículos y las FAQs, añadir un módulo destacado:

```
[ Título: "Senior care costs vary widely by state" ]
[ Subtítulo: "Find out what you'd pay in your state" ]
[ Selector de estado (dropdown) ] [ → Ver costos ]
```

Este módulo puede ser solo un selector que lleva a la página de costos filtrada. Es el contenido más
buscado en este nicho y da una razón clara para interactuar en la home.

### 3.7 Módulo adicional — Checklist de primeros pasos

Para usuarios en crisis que no saben por dónde empezar:

```
[ Título: "Not sure where to start?" ]
[ 3-4 pasos numerados con icono y texto muy corto ]
[ CTA: "Read the complete guide →" ]
```

Ejemplo de pasos:

1. Evaluate the level of care needed
2. Understand your budget and payment options
3. Research facilities in your area
4. Visit and ask the right questions

### 3.8 Newsletter / Suscripción

Al final de la home, antes del footer:

```
[ Título: "Stay informed" ]
[ Subtítulo: sin spam, cancelar cuando quieras ]
[ Input email ] [ Botón: Subscribe ]
[ Link a política de privacidad ]
```

**Importante:** Este formulario necesita un backend o un servicio (Mailchimp, ConvertKit, Resend).
Actualmente en el código es un placeholder sin action. Conectarlo antes de publicar o quitarlo.

---

## 4. Página de artículo

### 4.1 Estructura general (desktop)

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
├─────────────────────────────────────────────────────────┤
│ Breadcrumb: Inicio > Categoría > Artículo               │
├─────────────────┬───────────────────────┬───────────────┤
│                 │ Badge categoría       │               │
│  (espacio)      │ H1 del artículo       │  TOC sticky   │
│                 │ Meta: fecha · tiempo  │               │
│                 ├───────────────────────┤  260px        │
│                 │ Caja "Key Takeaways"  │               │
│                 ├───────────────────────┤               │
│                 │ Contenido del         │               │
│                 │ artículo              │               │
│                 │                       │               │
│                 │ ...                   │               │
│                 ├───────────────────────┤               │
│                 │ Fuentes               │               │
│                 ├───────────────────────┤               │
│                 │ Artículos relacionados│               │
└─────────────────┴───────────────────────┴───────────────┘
│ FOOTER                                                  │
```

### 4.2 Header del artículo

```
[ Badge: categoría ]     [ Badge: "Artículo Pilar" — si aplica ]
[ H1 ]
[ Revisado: fecha · Actualizado: fecha · X min lectura ]
[ Revisado por: nombre/organización ]        [ Compartir → ]
```

**Reglas:**

- El H1 no debe repetir el eyebrow del badge de categoría
- La fecha de revisión es más importante que la de publicación para este nicho — mostrarla
  prominentemente
- "Revisado por" añade credibilidad médica/legal. Si no hay revisor real, omitir (no inventar)

### 4.3 Caja "Key Takeaways" (puntos clave)

Inmediatamente después del H1, antes del cuerpo:

```
┌─────────────────────────────────────────────┐
│  📋 Key Takeaways                           │
│                                             │
│  • El costo medio nacional es $4,500/mes    │
│  • Medicare no cubre assisted living        │
│  • Medicaid sí puede ayudar en algunos      │
│    estados                                  │
│  • El proceso de búsqueda tarda 2-3 meses   │
└─────────────────────────────────────────────┘
```

Fondo `#eaf4ef`, borde izquierdo verde 3px, 3-5 bullets máximo. Es lo primero que lee quien escanea.

### 4.4 Tabla de contenidos (TOC)

- Sticky en sidebar derecho (desktop), colapsable en mobile
- Solo H2 y H3 del artículo
- Highlight del heading activo mientras se hace scroll
- Título: "In this guide" o "En esta guía"

### 4.5 Estilos del cuerpo del artículo

- Tablas: siempre con header, bordes sutiles, fondo alterno en filas
- Blockquotes: borde izquierdo verde, fondo `#eaf4ef`
- H2: divisor implícito — añadir margen top generoso (`2.5rem`)
- Listas: spacing generoso entre items (no comprimidos)
- Links: color verde, subrayado al hover, siempre descriptivos (no "click aquí")
- Imágenes: `max-width: 100%`, con caption opcional debajo en sans pequeño

### 4.6 CTA contextual al final del artículo

```
┌─────────────────────────────────────────────┐
│  ¿Buscas algo específico?                   │
│  Usa nuestra guía de costos por estado      │
│  para ver precios reales en tu zona.        │
│                                             │
│  [ Ver costos por estado → ]                │
└─────────────────────────────────────────────┘
```

El CTA debe ser relevante al contenido del artículo, no genérico. Definir uno por categoría.

### 4.7 Fuentes y referencias

Al final del artículo:

```
[ H2: Sources ]
[ Lista numerada de fuentes con links ]
[ "Última revisión: fecha" ]
```

Es importante para el EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) de Google.
Todas las URLs de fuentes ya están en el frontmatter de los `.md`.

### 4.8 Artículos relacionados

```
[ H2: "También puede interesarte" ]
[ Grid 2-3 cards mini con título + categoría ]
```

Evitar mostrar el mismo artículo que se está leyendo. Cada artículo de soporte enlaza a su pillar
page (obligatorio), a 2 artículos del mismo silo y a 1 artículo de otro silo relacionado.

---

## 5. Página de categoría

### 5.1 Estructura

```
[ Breadcrumb: Inicio > Categoría ]
[ H1: nombre de la categoría ]
[ Descripción: 2-3 líneas explicando qué es ]
[ Dato destacado: ej. "Costo medio: $4,500/mes" ]

[ Artículo pilar destacado — diseño diferenciado ]

[ H2: "Todas las guías" ]
[ Grid de cards de artículos ]
```

### 5.2 Artículo pilar destacado

El artículo pilar de la categoría merece un tratamiento visual diferente al resto:

```
┌─────────────────────────────────────────────────────┐
│  [ Imagen hero ]                                    │
│  Badge "Guía Completa"                              │
│  H2 del artículo (más grande que los demás)         │
│  Descripción completa (2-3 líneas)                  │
│  Tiempo lectura · Fecha · [ Leer la guía → ]        │
└─────────────────────────────────────────────────────┘
```

### 5.3 Grid de artículos regulares

- Cards con imagen, badge de categoría, título, excerpt y metadatos
- Grid 2 columnas en tablet, 3 en desktop
- Si no hay artículos aún en una categoría, mostrar mensaje amigable ("Próximamente — estamos
  trabajando en estas guías") en lugar de página vacía

---

## 6. Página de búsqueda

- Input de búsqueda prominente al entrar
- Resultados en lista (no grid) — más fácil de escanear
- Cada resultado: título + excerpt + badge de categoría + fecha
- Si no hay resultados: sugerir categorías relacionadas
- La búsqueda funciona con el índice JSON generado en build — **conectar el script
  `generate-search-index.ts` al proceso de build antes de publicar**

---

## 7. Patrones de UI reutilizables

### Badges de categoría

```html
<span class="badge" style="background: #eaf4ef; color: #1a4d3a">Assisted Living</span>
```

- Padding: `3px 8px`, radio: `4px`, sans 10-11px, font-weight 600
- Usar siempre el color de la categoría correspondiente

### Eyebrow labels (etiquetas de sección)

```
WHAT TYPE OF CARE DO YOU NEED?
```

- Sans, 11px, uppercase, letter-spacing 0.8px, color verde primario
- Solo como orientador de sección, no abusarlos

### Divisores

- `<hr>` o `border-bottom: 1px solid #e5e3de` entre secciones relacionadas
- Nunca decorativos, siempre tienen función separadora

### Cards de artículo (variante mini — para artículos relacionados)

- Sin imagen
- Badge + título (2 líneas max) + tiempo de lectura
- Borde en hover

---

## 8. Comportamiento responsive

| Breakpoint          | Cambios principales                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Mobile (< 640px)    | Nav colapsa a hamburger · Grid de silos pasa a 2 columnas · TOC desaparece (reemplazar por collapse inline) · Hero: tipografía más pequeña |
| Tablet (640-1023px) | Grid 2 columnas · Sidebar TOC desaparece · Nav puede seguir visible                                                                        |
| Desktop (≥ 1024px)  | Layout completo · TOC sticky · Nav horizontal                                                                                              |

---

## 9. Páginas pendientes de crear

Estas páginas no existen aún y son importantes:

| Página      | Prioridad | Descripción                                                     |
| ----------- | --------- | --------------------------------------------------------------- |
| `/about/`   | Alta      | Quiénes somos, proceso editorial, revisores                     |
| `/privacy/` | Alta      | Política de privacidad (requerida legalmente si hay newsletter) |
| `/404`      | Media     | Página de error personalizada con sugerencias                   |
| `/quiz/`    | Media     | Quiz de orientación de 3 preguntas                              |
| `/sitemap/` | Baja      | Sitemap HTML para usuarios                                      |

---

## 10. Cosas a resolver antes de publicar

1. **Conectar el sitemap XML** — habilitar `@astrojs/sitemap` en `astro.config.mjs` o resolver el
   bug reportado
2. **Crear imágenes faltantes** — `og-default.webp` y `logo.webp` en `/public/images/`
3. **Conectar el formulario de newsletter** a Mailchimp, ConvertKit u otro proveedor
4. **Integrar `generate-search-index.ts`** en el script de build para que la búsqueda funcione
5. **Corregir el render de markdown** en `[...slug].astro` (usar `entry.render()` de Astro)
6. **Añadir RSS real** o quitar el `<link rel="alternate">` del head

---

_Documento creado: Septiembre 2026. Actualizar cuando cambie la dirección de diseño._
