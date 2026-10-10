# Documentación

| Documento                                    | Para qué sirve                                                       |
| -------------------------------------------- | -------------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)           | Stack, decisiones, rutas, carpetas, scripts, CI y despliegue         |
| [CONTENT_MODEL.md](CONTENT_MODEL.md)         | Esquema de los artículos, estructura de las guías y cómo se muestran |
| [NUEVO_ARTICULO.md](NUEVO_ARTICULO.md)       | Paso a paso para crear un artículo igual que los actuales            |
| [DEVELOPMENT.md](DEVELOPMENT.md)             | Flujo de trabajo, plantillas, convenciones y datos por estado        |
| [diseño-estructura.md](diseño-estructura.md) | Diseño visual, páginas y patrones de interfaz                        |

## Qué documento usar

| Si quieres…                                                            | Abre                                         |
| ---------------------------------------------------------------------- | -------------------------------------------- |
| Escribir y publicar un artículo nuevo                                  | [NUEVO_ARTICULO.md](NUEVO_ARTICULO.md)       |
| Saber qué hace cada campo del frontmatter o qué comprueba el validador | [CONTENT_MODEL.md](CONTENT_MODEL.md)         |
| Cambiar el aspecto (colores, iconos, secciones de una página)          | [diseño-estructura.md](diseño-estructura.md) |
| Ejecutar comandos, actualizar datos por estado o seguir convenciones   | [DEVELOPMENT.md](DEVELOPMENT.md)             |
| Entender el stack, las rutas, el CI o el despliegue                    | [ARCHITECTURE.md](ARCHITECTURE.md)           |
| Actualizar los datos de Medicaid                                       | `.claude/skills/update-medicaid-data/`       |

Si dos documentos parecen decir cosas distintas, manda el más específico: para artículos,
NUEVO_ARTICULO.md; para campos y validación, CONTENT_MODEL.md; para diseño, diseño-estructura.md. En
cualquier caso, la verdad final es el código (`src/utils/entry-schema.ts`,
`scripts/validate-content.ts`, `src/styles/tokens.css`).

## Otras carpetas

- `data-reports/`: un informe por cada revisión de los datos de Medicaid (qué se añadió, qué quedó
  en revisión y qué falta). El procedimiento está en `.claude/skills/update-medicaid-data/`.
- `medicaid-sources/`: copias locales de las páginas y PDF oficiales consultados. **No se sube a
  GitHub** (está en `.gitignore`).

## Idioma

La documentación está en español. El sitio web y su contenido, en inglés de EE. UU.
