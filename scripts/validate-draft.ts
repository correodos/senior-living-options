// Validates article drafts in drafts/<category>/<slug>.md before they are published.
// Usage:
//   npm run validate:draft                     -> every draft
//   npm run validate:draft -- <slug>           -> one draft
//   npm run validate:draft -- <slug> --publish -> publish gate (markers, inline citations, image)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'astro/zod';
import { entrySchema } from '../src/utils/entry-schema';
import { parseFrontmatter } from './lib/frontmatter';
import { classifySource } from './lib/sources';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DRAFTS_DIR = path.join(ROOT, 'drafts');
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'entries');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');

const CATEGORIES = entrySchema.shape.category.options as readonly string[];
const MARKER_RE = /\[(VERIFICAR|ACTUALIZAR|ENLACE INTERNO|ENLACE FUENTE)[^\]]*\]/g;
const URL_RE = /https:\/\/[^\s)<>"'\]]+/g;

function listMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'images') out.push(...listMarkdown(full));
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      out.push(full);
    }
  }
  return out;
}

function stripTrailingPunctuation(url: string): string {
  return url.replace(/[.,;:]+$/, '');
}

// Returns the text of an H2 section (without its heading), up to the next H2.
function section(body: string, heading: string): string | null {
  const re = new RegExp(`^## ${heading}\\s*$`, 'm');
  const match = re.exec(body);
  if (!match) return null;
  const rest = body.slice(match.index + match[0].length);
  const next = rest.search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next);
}

function existingSlugs(): Set<string> {
  return new Set(
    listMarkdown(CONTENT_DIR).map((f) =>
      path.relative(CONTENT_DIR, f).replace(/\.md$/, '').replace(/\\/g, '/')
    )
  );
}

function stateCodes(): Set<string> {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'costs-by-state.json'), 'utf-8'));
  return new Set(Object.keys(data).filter((k) => !k.startsWith('_')).map((k) => k.toLowerCase()));
}

function internalLinkExists(href: string, slugs: Set<string>, states: Set<string>): boolean {
  const clean = href.split('#')[0];
  if (clean === '/' || clean === '') return true;
  const article = clean.match(/^\/article\/(.+?)\/$/);
  if (article) return slugs.has(article[1]);
  const category = clean.match(/^\/category\/([^/]+)\/$/);
  if (category) return CATEGORIES.includes(category[1]);
  if (clean === '/costs/') return true;
  const state = clean.match(/^\/costs\/([a-z]{2})\/$/);
  if (state) return states.has(state[1]);
  const page = clean.replace(/^\/|\/$/g, '');
  return (
    fs.existsSync(path.join(PAGES_DIR, `${page}.astro`)) ||
    fs.existsSync(path.join(PAGES_DIR, page, 'index.astro'))
  );
}

function validateDraft(file: string, publish: boolean) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];
  const rel = path.relative(DRAFTS_DIR, file).replace(/\\/g, '/');
  const slugId = rel.replace(/\.md$/, '');
  const [folder, slug] = slugId.split('/');

  const content = fs.readFileSync(file, 'utf-8').replace(/\r\n/g, '\n');
  const parsed = parseFrontmatter(content);
  if (!parsed) return { slugId, errors: ['Frontmatter inválido o ausente'], warnings, info };

  // Frontmatter
  const result = entrySchema.safeParse(parsed.data);
  if (!result.success) {
    result.error.issues.forEach((issue) => errors.push(`${issue.path.join('.')}: ${issue.message}`));
  }
  const data = (result.success ? result.data : parsed.data) as z.infer<typeof entrySchema>;
  const body = parsed.body;

  if (!slug || !CATEGORIES.includes(folder)) {
    errors.push(`Ruta incorrecta: debe ser drafts/<categoria>/<slug>.md (categorías: ${CATEGORIES.join(', ')})`);
  } else if (data.category !== folder) {
    errors.push(`category "${data.category}" no coincide con la carpeta "${folder}"`);
  }
  if (slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push('El slug debe ir en minúsculas con guiones');
  if (existingSlugs().has(slugId)) errors.push(`Ya existe un artículo publicado con este slug: ${slugId}`);
  if (data.isPillar) warnings.push('isPillar: true — los 6 pilares ya existen; lo normal es false');
  if (data.title && data.title.length > 60 && !data.seoTitle) warnings.push('title > 60 caracteres: añade seoTitle');
  if (data.description && (data.description.length < 140 || data.description.length > 160)) {
    warnings.push(`description tiene ${data.description.length} caracteres (ideal 140-160)`);
  }
  if (data.publishDate && data.lastReviewed && new Date(data.publishDate) > new Date(data.lastReviewed)) {
    errors.push('publishDate debe ser anterior o igual a lastReviewed');
  }
  if (data.lastReviewed && new Date(data.lastReviewed) > new Date()) errors.push('lastReviewed no puede ser futura');
  if (!data.imageAlt) errors.push('Falta imageAlt');

  // Image
  const image = data.image ? path.join(ROOT, 'public', data.image.replace(/^\//, '')) : null;
  if (data.image !== `/images/${slug}.webp`) errors.push(`image debe ser /images/${slug}.webp`);
  if (!image || !fs.existsSync(image)) {
    const inbox = fs.existsSync(path.join(DRAFTS_DIR, 'images'))
      ? fs.readdirSync(path.join(DRAFTS_DIR, 'images')).find((f) => f.startsWith(`${slug}.`) && !f.endsWith('.prompt.md'))
      : undefined;
    const msg = inbox
      ? `Imagen en el buzón (drafts/images/${inbox}) sin optimizar: npm run image:optimize -- ${slug}`
      : `Falta la imagen: deja drafts/images/${slug}.png (o .jpg/.webp) y ejecuta npm run image:optimize -- ${slug}`;
    (publish ? errors : warnings).push(msg);
  }

  // Structure
  if (/^# /m.test(body)) errors.push('No uses H1 (#) en el cuerpo: el título sale del frontmatter');
  if (!/^> \*\*Key Takeaways\*\*/m.test(body)) errors.push('Falta "> **Key Takeaways**" (blockquote) al inicio');
  const h2Count = (body.match(/^## /gm) || []).length;
  if (h2Count < 6) warnings.push(`Solo ${h2Count} H2 (contando FAQ y Sources); se recomiendan 4+ de contenido`);
  if (!/\|[^\n]*\|\n\|[-|:\s]+\|/.test(body)) warnings.push('No hay ninguna tabla');
  if (/\p{Extended_Pictographic}/u.test(body)) errors.push('El texto contiene emoji');
  if (/!\[[^\]]*\]\(/.test(body)) errors.push('No se permiten imágenes dentro del texto');
  if (/^In conclusion/im.test(body)) warnings.push('Evita "In conclusion"');

  const faq = section(body, 'Frequently Asked Questions');
  if (faq === null) {
    errors.push('Falta "## Frequently Asked Questions"');
  } else {
    const questions = (faq.match(/^### /gm) || []).length;
    if (questions < 4 || questions > 6) warnings.push(`FAQ con ${questions} preguntas (objetivo 4-6)`);
    if (/^\s*([-*]|\d+\.)\s|^\|/m.test(faq)) errors.push('La FAQ no puede tener listas ni tablas (FAQPage solo recoge texto)');
  }

  // Sources
  const sourcesSection = section(body, 'Sources');
  const fmSources = (data.sources || []).map(stripTrailingPunctuation);
  if (sourcesSection === null) {
    errors.push('Falta "## Sources"');
  } else {
    const listed = [...new Set((sourcesSection.match(URL_RE) || []).map(stripTrailingPunctuation))];
    listed.filter((u) => !fmSources.includes(u)).forEach((u) => errors.push(`En ## Sources pero no en frontmatter: ${u}`));
    fmSources.filter((u) => !listed.includes(u)).forEach((u) => errors.push(`En frontmatter pero no en ## Sources: ${u}`));
  }
  if (fmSources.length < 5) warnings.push(`${fmSources.length} fuentes (se recomiendan 5+)`);
  let official = 0;
  for (const url of fmSources) {
    const { tier, reason } = classifySource(url);
    if (tier === 'official' || tier === 'cost-survey') official++;
    if (tier === 'blocked' || tier === 'unknown') errors.push(`Fuente no autorizada (${reason}): ${url}`);
    if (tier === 'context') warnings.push(`Fuente solo de contexto (no para cifras clave): ${url}`);
  }
  if (fmSources.length > 0 && official === 0) errors.push('Ninguna fuente oficial (.gov) ni de la encuesta de costes');

  // Body before ## Sources: links and inline citations
  const sourcesAt = body.search(/^## Sources\s*$/m);
  const mainBody = sourcesAt === -1 ? body : body.slice(0, sourcesAt);
  const slugs = existingSlugs();
  const states = stateCodes();
  const internal = [...mainBody.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
  internal.forEach((href) => {
    if (!href.endsWith('/') && !href.includes('#')) errors.push(`Enlace interno sin barra final: ${href}`);
    else if (!internalLinkExists(href, slugs, states)) errors.push(`Enlace interno a una página que no existe: ${href}`);
  });
  if (!internal.some((h) => h.startsWith('/category/') || h.startsWith('/article/'))) {
    warnings.push('Sin enlaces internos a su categoría o guía pilar');
  }
  const inlineCitations = (mainBody.match(/\(Source:[^)]*\)/g) || []).length;
  const externalLinks = (mainBody.match(/\]\(https?:\/\/[^)]+\)/g) || []).length;
  if (publish) {
    if (inlineCitations) errors.push(`${inlineCitations} citas "(Source: …)" en el texto: quítalas antes de publicar`);
    if (externalLinks) errors.push(`${externalLinks} enlaces externos en el texto: las fuentes van solo en ## Sources`);
  } else if (inlineCitations || externalLinks) {
    info.push(`${inlineCitations} citas "(Source: …)" y ${externalLinks} enlaces externos en el texto (se quitan al publicar)`);
  }

  // Review markers
  const markers = [...content.matchAll(MARKER_RE)].map((m) => m[0]);
  if (markers.length) {
    const list = `${markers.length} marcadores pendientes: ${markers.join(' | ')}`;
    (publish ? errors : warnings).push(list);
  }

  // Length
  const words = mainBody.replace(/^>\s?/gm, '').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  const expectedMinutes = Math.max(1, Math.round(words / 250));
  info.push(`${words} palabras (sin Sources) → readingTime ${expectedMinutes}`);
  if (data.readingTime && Math.abs(data.readingTime - expectedMinutes) > 1) {
    warnings.push(`readingTime ${data.readingTime} no cuadra con ${words} palabras (≈ ${expectedMinutes})`);
  }
  if (words < 1200) warnings.push(`${words} palabras: por debajo del mínimo (1200)`);

  return { slugId, errors, warnings, info };
}

function main() {
  const args = process.argv.slice(2);
  const publish = args.includes('--publish');
  const wanted = args.filter((a) => !a.startsWith('--'));
  let files = listMarkdown(DRAFTS_DIR);
  if (wanted.length) {
    files = files.filter((f) => wanted.some((w) => f.replace(/\\/g, '/').replace(/\.md$/, '').endsWith(`/${w}`)));
  }
  if (!files.length) {
    console.log(wanted.length ? `No hay borrador para: ${wanted.join(', ')}` : 'No hay borradores en drafts/');
    process.exit(wanted.length ? 1 : 0);
  }

  console.log(`🔍 Validando borradores${publish ? ' (modo publicación)' : ''}...\n`);
  let failed = 0;
  for (const file of files) {
    const { slugId, errors, warnings, info } = validateDraft(file, publish);
    console.log(`${errors.length ? '❌' : '✅'} ${slugId}`);
    errors.forEach((e) => console.log(`   - ${e}`));
    warnings.forEach((w) => console.log(`   ⚠️  ${w}`));
    info.forEach((i) => console.log(`   ℹ️  ${i}`));
    if (errors.length) failed++;
  }
  console.log(`\n📊 ${files.length - failed} correctos, ${failed} con errores`);
  if (failed) process.exit(1);
}

main();
