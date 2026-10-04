# agents.md — Senior Living Options

El proyecto es en ingles de Estados Unidos, pero, te comunicas conmigo en español.

## Identidad del proyecto

Sitio web informativo sobre Senior Living & Elderly Care. Stack: Astro · TypeScript · CSS vanilla ·
JavaScript vanilla. Hosting: Cloudflare Pages. Contenido: artículos informativos y comparaciones,
sin directorio de negocios.

## Modelo de IA

- Modelo único: Nemotron Ultra
- No asumir capacidades de otros modelos

## Regla absoluta — Git y GitHub

**NUNCA ejecutar git push, git commit, ni ninguna acción hacia GitHub sin que el usuario lo ordene
explícitamente.** Puedes crear archivos, modificarlos y organizarlos en local. El usuario decide
cuándo y qué sube al repositorio.

## Cómo trabajar

- El usuario puede dar instrucciones largas o cortas indistintamente
- Si la instrucción es ambigua, pregunta UNA sola cosa antes de actuar
- Si la instrucción es clara, actúa directamente sin pedir confirmación
- Trabaja un bloque lógico cada vez, no todo de golpe
- Al terminar cada bloque, resume en 2-3 líneas qué hiciste y qué sigue

## Estructura del proyecto

src/ components/ # Componentes Astro reutilizables (Header, Footer, Card) layouts/ # BaseLayout,
ArticleLayout, CategoryLayout pages/ # index, category/[slug], article/[slug] styles/ # tokens.css,
base.css, components.css, utilities.css scripts/ # JS vanilla: search, navigation, analytics
content/ # Collections Astro (ver Content Model) utils/ # Helpers: date, seo, markdown public/ #
Assets estáticos, favicon, robots.txt

## Content Model

Schema único para todos los artículos:

- title, description, publishDate, lastReviewed
- sources[] → URLs de fuentes gubernamentales y oficiales
- isPillar (boolean) → distingue pillar page de post normal
- category → enum de los 6 subnichos
- image, imageAlt (opcionales)

## Subnichos y prioridad

1. /senior-care-costs/ ← PRIORIDAD ALTA (CPC más alto en AdSense)
2. /assisted-living/
3. /memory-care/
4. /nursing-homes/
5. /in-home-care/
6. /caregiver-resources/

Cada subnicho tiene una pillar page y posts de soporte bajo ella.

## Contenido

- Todos los artículos son informativos o comparativos
- Las fuentes deben ser oficiales: medicare.gov, medicaid.gov, ssa.gov, cdc.gov
- Tono claro, accesible, orientado a familias y cuidadores
- Sin listados de negocios ni directorios de centros

## Diseño y frontend

- CSS vanilla, sin frameworks CSS externos salvo decisión explícita del usuario
- Animaciones permitidas: sutiles, CSS puro o AOS
- Imágenes de fondo permitidas en hero sections y cabeceras de post
- Diseño accesible: la audiencia principal es adultos mayores y sus familias
- Sin React, Vue ni Svelte salvo orden explícita del usuario

## SEO técnico

- @astrojs/sitemap activo
- Meta tags dinámicos por página (Open Graph, Twitter Cards)
- JSON-LD schema: Article, FAQPage, BreadcrumbList
- Core Web Vitals como prioridad en cualquier decisión de rendimiento

## Monetización

- Google AdSense (fase inicial)
- No añadir ningún sistema de afiliados sin orden del usuario

## Lo que NO debes hacer

- No subir nada a GitHub sin orden explícita
- No instalar dependencias nuevas sin confirmar con el usuario
- No cambiar el schema de content collections sin avisar
- No añadir React/Vue/Svelte sin orden explícita
- No modificar archivos existentes si la tarea solo pide crear nuevos
