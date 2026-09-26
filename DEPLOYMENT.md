# Guía de Despliegue - Senior Living Options

## Arquitectura de Despliegue

```
GitHub (main) → Cloudflare Pages (native) → CDN Global
                     ↓
              Preview Deployments (PRs)
```

## Configuración Inicial (Una sola vez)

### 1. Crear Repositorio GitHub

```bash
# En GitHub web: New repository
# Name: senior-living-options
# Visibility: Private o Public
# NO inicializar con README, .gitignore, license
```

### 2. Conectar Local

```bash
git init
git remote add origin https://github.com/TU_USUARIO/senior-living-options.git
git branch -M main
git add .
git commit -m "chore: initial project setup"
git push -u origin main
```

### 3. Configurar Cloudflare Pages (Integración Nativa)

1. Ir a [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. "Create a project" → "Connect to Git"
3. Seleccionar repositorio `senior-living-options`
4. Configuración:
   - **Project name**: `senior-living-options`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (raíz)
   - **Node version**: `22.x` (o `22.12.0`)

### 4. Variables de Entorno en Cloudflare Pages

En Settings → Environment variables:

**Production:**

| Variable           | Valor                                     |
| ------------------ | ----------------------------------------- |
| `PUBLIC_SITE_URL`  | `https://senior-living-options.pages.dev` |
| `PUBLIC_SITE_NAME` | `Senior Living Options`                   |
| `ANALYTICS_ID`     | `TU_ID_PLAUSIBLE_O_GA4` (opcional)        |

**Preview (opcional, hereda de production):**

| Variable          | Valor                                             |
| ----------------- | ------------------------------------------------- |
| `PUBLIC_SITE_URL` | `https://preview-senior-living-options.pages.dev` |

### 5. Secrets en GitHub Actions (SOLO CI, no despliegue)

En Settings → Secrets and variables → Actions → New repository secret:

| Secret                  | Descripción                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Token API Cloudflare (Account > API Tokens > Create Token > Edit Cloudflare Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID (en dashboard Cloudflare, URL: `dash.cloudflare.com/ACCOUNT_ID`)        |

> **Nota**: Estos secrets solo son necesarios si en el futuro se quiere automatizar algo desde
> GitHub Actions. Para el despliegue nativo de Cloudflare Pages **no son necesarios**.

## Pipeline CI/CD

### Flujo Principal (Push a main)

```
1. CI (GitHub Actions) - ubuntu-latest
   ├── npm ci
   ├── npm run lint
   ├── npm run format:check
   ├── npm run check
   ├── npm run validate:content
   └── npm run build (verificación)

2. Deploy (Cloudflare Pages nativo)
   ├── Detecta commit en main
   ├── Ejecuta: npm run build
   ├── Publica: dist/
   └── CDN Global
```

### Flujo Preview (Pull Requests)

```
1. CI (GitHub Actions) - mismo pipeline
2. Cloudflare Pages Preview
   ├── Detecta PR
   ├── Ejecuta: npm run build
   ├── Publica: dist/
   └── URL: https://preview-{PR_NUMBER}.senior-living-options.pages.dev
```

### Verificar Pipeline

1. Crear PR → Ver "Deploy Preview" en Cloudflare Pages dashboard
2. Merge PR → Ver "Deploy Production" en Cloudflare Pages dashboard
3. Verificar en Cloudflare Pages dashboard

## Dominio Personalizado

### 1. En Cloudflare Pages

1. Settings → Custom domains → "Add custom domain"
2. Ingresar: `seniorlivingoptions.com` (cuando lo tengas)
3. Seguir instrucciones DNS

### 2. Configuración DNS (en tu registrador o Cloudflare DNS)

| Tipo  | Nombre | Contenido                         | Proxy      |
| ----- | ------ | --------------------------------- | ---------- |
| CNAME | @      | `senior-living-options.pages.dev` | ✅ Proxied |
| CNAME | www    | `senior-living-options.pages.dev` | ✅ Proxied |

### 3. SSL/TLS

- En Cloudflare: SSL/TLS → Full (strict)
- Edge Certificates → Always Use HTTPS: On
- Automatic HTTPS Rewrites: On

## Variables de Build

### Astro Config (`astro.config.mjs`)

```js
const SITE_URL = 'https://senior-living-options.pages.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  // ...
});
```

### Variables en Build Time

Las variables `PUBLIC_*` están disponibles en:

- `import.meta.env.PUBLIC_SITE_URL` (cliente + servidor)
- `Astro.url` (servidor)

### Variables de Entorno Necesarias

| Variable           | Dónde configurar | Requerida | Valor por defecto                         |
| ------------------ | ---------------- | --------- | ----------------------------------------- |
| `PUBLIC_SITE_URL`  | Cloudflare Pages | Sí        | `https://senior-living-options.pages.dev` |
| `PUBLIC_SITE_NAME` | Cloudflare Pages | Sí        | `Senior Living Options`                   |
| `ANALYTICS_ID`     | Cloudflare Pages | No        | -                                         |

### Desarrollo Local (`.env.local`)

```env
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Senior Living Options (Dev)
```

## Monitoreo y Logs

### GitHub Actions (CI)

- Actions tab → Workflow runs
- Logs detallados por job
- Re-run failed jobs

### Cloudflare Pages

- Dashboard → Project → Deployments
- Build logs
- Preview URLs: `https://preview-{number}.senior-living-options.pages.dev`
- Production: `https://senior-living-options.pages.dev`

### Analytics

- Plausible/GA4 configurado via `ANALYTICS_ID` (opcional)
- Verificar en `/search/` que tracking funciona

## Rollback

### Cloudflare Pages

1. Dashboard → Deployments
2. Encontrar deployment anterior estable
3. "Promote to production" / "Rollback to this deployment"

### Git

```bash
# Revertir commit específico
git revert COMMIT_HASH
git push origin main

# O reset hard (cuidado)
git reset --hard COMMIT_HASH
git push --force-with-lease origin main
```

## Troubleshooting

### Build falla: "Module not found"

- Verificar imports: `@/` alias en `tsconfig.json`
- Case sensitivity: Linux vs Windows/Mac

### Build falla: "Out of memory"

- En Cloudflare Pages: Settings → Build → Node version → 22
- Agregar `NODE_OPTIONS=--max-old-space-size=4096` en env vars

### Sitemap no genera

- Verificar `site` en `astro.config.mjs`
- Verificar `@astrojs/sitemap` en integraciones
- Build local: `npm run build && ls dist/sitemap*`

### Imágenes no cargan en producción

- Verificar `public/images/` en repo
- Rutas en frontmatter: `/images/archivo.webp`
- Cloudflare Pages sirve `public/` en root

## Checklist Pre-Producción

- [ ] Repo GitHub creado y conectado
- [ ] Cloudflare Pages project creado con integración nativa
- [ ] Variables de entorno en Cloudflare Pages (Production + Preview)
- [ ] Primer push a main → Deploy success
- [ ] Verificar producción: HTTPS, meta tags, sitemap, robots.txt
- [ ] Verificar preview en PR
- [ ] Analytics funcionando (si configurado)
- [ ] Lighthouse > 95 en producción

## Comandos Útiles

```bash
# Ver logs build local
npm run build 2>&1 | tee build.log

# Limpiar cache
rm -rf node_modules dist .astro
npm install

# Verificar tipos sin build
npm run check

# Validar solo contenido
npm run validate:content

# Generar search index manual
node scripts/generate-search-index.ts

# Preview local del build
npm run preview
```

## Resumen de Cambios Recientes (vs versión anterior)

| Antes (GitHub Actions deploy)            | Ahora (Cloudflare Pages nativo)                         |
| ---------------------------------------- | ------------------------------------------------------- |
| GitHub Actions hace build + deploy       | Cloudflare Pages hace build + deploy                    |
| `cloudflare/wrangler-action` en workflow | Nativo (sin action)                                     |
| Secrets necesarios: 5                    | Secrets necesarios: 0 (para deploy)                     |
| Artifacts upload/download                | Nativo (sin artifacts)                                  |
| Variables en GitHub Secrets              | Variables en Cloudflare Pages dashboard                 |
| Preview: `preview-{PR}.pages.dev`        | Preview: `preview-{PR}.senior-living-options.pages.dev` |

---

> **Nota importante**: El workflow de GitHub Actions (`.github/workflows/deploy.yml`) ahora es
> **solo CI** (validación y build). El despliegue real lo hace Cloudflare Pages automáticamente al
> detectar commits en `main` o PRs. No se sube `dist/` desde GitHub Actions.
