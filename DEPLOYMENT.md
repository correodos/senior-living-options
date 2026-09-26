# Guía de Despliegue - Senior Living Options

## Arquitectura de Despliegue

```
GitHub (main) → GitHub Actions → Cloudflare Pages → CDN Global
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

### 3. Configurar Cloudflare Pages
1. Ir a [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. "Create a project" → "Connect to Git"
3. Seleccionar repositorio `senior-living-options`
4. Configuración:
   - **Project name**: `senior-living-options`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (raíz)

### 4. Variables de Entorno en Cloudflare Pages
En Settings → Environment variables:

**Production:**
| Variable | Valor |
|----------|-------|
| `PUBLIC_SITE_URL` | `https://seniorlivingoptions.com` |
| `PUBLIC_SITE_NAME` | `Senior Living Options` |
| `ANALYTICS_ID` | `TU_ID_PLAUSIBLE_O_GA4` (opcional) |

**Preview (opcional, hereda de production):**
| Variable | Valor |
|----------|-------|
| `PUBLIC_SITE_URL` | `https://preview-senior-living-options.pages.dev` |

### 5. Secrets en GitHub Actions
En Settings → Secrets and variables → Actions → New repository secret:

| Secret | Descripción |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare (Account > API Tokens > Create Token > Edit Cloudflare Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID (en dashboard Cloudflare, URL: `dash.cloudflare.com/ACCOUNT_ID`) |
| `PUBLIC_SITE_URL` | `https://seniorlivingoptions.com` |
| `PUBLIC_SITE_NAME` | `Senior Living Options` |
| `ANALYTICS_ID` | ID analytics (opcional) |

## Pipeline CI/CD

### Flujo Principal (Push a main)
```
1. Lint & Type Check (ubuntu-latest)
   ├── npm ci
   ├── npm run lint
   ├── npm run format:check
   ├── npm run check
   └── npm run validate:content

2. Build (ubuntu-latest, needs: lint)
   ├── npm ci
   ├── npm run build
   └── Upload artifacts (dist/)

3. Deploy Production (needs: build, if: push to main)
   ├── Download artifacts
   └── cloudflare/pages-action → main branch

4. Deploy Preview (needs: build, if: pull_request)
   ├── Download artifacts
   └── cloudflare/pages-action → preview-{PR_NUMBER} branch
```

### Verificar Pipeline
1. Crear PR → Ver "Deploy Preview" en checks
2. Merge PR → Ver "Deploy Production" en checks
3. Verificar en Cloudflare Pages dashboard

## Dominio Personalizado

### 1. En Cloudflare Pages
1. Settings → Custom domains → "Add custom domain"
2. Ingresar: `seniorlivingoptions.com`
3. Seguir instrucciones DNS

### 2. Configuración DNS (en tu registrador o Cloudflare DNS)
| Tipo | Nombre | Contenido | Proxy |
|------|--------|-----------|-------|
| CNAME | @ | `senior-living-options.pages.dev` | ✅ Proxied |
| CNAME | www | `senior-livingoptions.pages.dev` | ✅ Proxied |

### 3. SSL/TLS
- En Cloudflare: SSL/TLS → Full (strict)
- Edge Certificates → Always Use HTTPS: On
- Automatic HTTPS Rewrites: On

## Variables de Build

### Astro Config (`astro.config.mjs`)
```js
const SITE_URL = 'https://seniorlivingoptions.com';

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

## Monitoreo y Logs

### GitHub Actions
- Actions tab → Workflow runs
- Logs detallados por job
- Re-run failed jobs

### Cloudflare Pages
- Dashboard → Project → Deployments
- Build logs
- Preview URLs: `https://preview-{number}.senior-living-options.pages.dev`
- Production: `https://seniorlivingoptions.com`

### Analytics
- Plausible/GA4 configurado via `ANALYTICS_ID`
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
- En Cloudflare Pages: Settings → Build → Node version → 20
- Agregar `NODE_OPTIONS=--max-old-space-size=4096` en env vars

### Deploy falla: "Permission denied"
- Verificar `CLOUDFLARE_API_TOKEN` permisos: `Account > Cloudflare Pages > Edit`
- Verificar `CLOUDFLARE_ACCOUNT_ID` correcto

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
- [ ] Cloudflare Pages project creado
- [ ] Variables de entorno en Cloudflare (Production + Preview)
- [ ] Secrets en GitHub Actions (5 secrets)
- [ ] Dominio personalizado configurado (DNS + SSL)
- [ ] Primer push a main → Deploy success
- [ ] Verificar producción: HTTPS, meta tags, sitemap, robots.txt
- [ ] Verificar preview en PR
- [ ] Analytics funcionando
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
node scripts/generate-search-index.mjs
```