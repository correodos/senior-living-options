import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'entries');

const entrySchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(50).max(300),
  publishDate: z.coerce.date(),
  lastReviewed: z.coerce.date(),
  sources: z.array(z.string().url()).optional(),
  readingTime: z.number().int().positive().optional(),
  isPillar: z.boolean().default(false),
  category: z.enum([
    'assisted-living',
    'memory-care',
    'nursing-homes',
    'in-home-care',
    'senior-care-costs',
    'caregiver-resources',
  ]),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  relatedArticles: z.array(z.string()).optional(),
});

function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    const yaml = match[1];
    const data: Record<string, unknown> = {};

    let currentKey: string | null = null;
    let currentArray: string[] | null = null;

    yaml.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('#')) return;

      // Check if line starts an array item
      const arrayMatch = trimmedLine.match(/^-\s+(.+)$/);
      if (arrayMatch && currentKey !== null) {
        let itemValue = arrayMatch[1].trim();
        // Remove surrounding quotes
        itemValue = itemValue.replace(/^['"]|['"]$/g, '');
        if (currentArray !== null) {
          currentArray.push(itemValue);
        }
        return;
      }

      // If we were building an array and this line doesn't continue it, save the array
      if (currentArray !== null && !arrayMatch && currentKey !== null) {
        data[currentKey] = currentArray;
        currentArray = null;
        currentKey = null;
      }

      // Parse key-value pair
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) return;
      
      const key = trimmedLine.slice(0, colonIndex).trim();
      let value: unknown = trimmedLine.slice(colonIndex + 1).trim();

      if (!value) {
        // Key with no value on same line - could be start of array
        currentKey = key;
        currentArray = [];
        return;
      }

      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          value = (value as string).slice(1, -1).split(',').map((v: string) => v.trim().replace(/['"]/g, ''));
        }
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        value = new Date(value);
      } else if (typeof value === 'string' && /^\d+$/.test(value)) {
        value = parseInt(value, 10);
      } else if (typeof value === 'string') {
        value = value.replace(/^['"]|['"]$/g, '');
      }

      data[key] = value;
    });

    // Save any pending array at end
    if (currentArray !== null && currentKey !== null) {
      data[currentKey] = currentArray;
    }

    const body = content.slice(match[0].length).trim();
    return { data, body };
  } catch (e) {
    console.error('Error parsing frontmatter:', e);
    return null;
  }
}

function validateFile(filePath: string): { valid: boolean; errors: string[]; warnings: string[]; slug: string } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const slug = relativePath.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/');

  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    errors.push('Frontmatter inválido o ausente');
    return { valid: false, errors, warnings, slug };
  }

  const result = entrySchema.safeParse(parsed.data);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      errors.push(`${issue.path.join('.')}: ${issue.message}`);
    });
  }

  const data = result.success ? result.data : (parsed.data as z.infer<typeof entrySchema>);

  if (data.publishDate && data.lastReviewed) {
    const pubDate = new Date(data.publishDate);
    const revDate = new Date(data.lastReviewed);
    const now = new Date();

    if (pubDate > revDate) {
      errors.push('publishDate debe ser anterior o igual a lastReviewed');
    }
    if (revDate > now) {
      errors.push('lastReviewed no puede ser fecha futura');
    }
  }

  if (data.isPillar) {
    // ERRORS (fallan build)
    if (!data.readingTime) errors.push('Artículos pilar requieren readingTime');
    if (!data.image) errors.push('Artículos pilar requieren image');
    if (!data.sources || data.sources.length < 3) errors.push('Artículos pilar requieren al menos 3 sources');

    // WARNINGS (no fallan build, solo avisan)
    if (data.sources && data.sources.length < 7) {
      warnings.push(`Pillar: se recomiendan 7+ sources (.gov/.org), hay ${data.sources.length}`);
    }
    if (data.sources) {
      const nonGovOrg = data.sources.filter((s: string) => !s.includes('.gov') && !s.includes('.org'));
      if (nonGovOrg.length > 0) {
        warnings.push(`Pillar: ${nonGovOrg.length} sources no son .gov/.org`);
      }
    }

    // Validaciones de estructura markdown (warnings)
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 2500) {
      warnings.push(`Pillar: word count ${wordCount} < 2500 recomendadas`);
    }

    const hasKeyTakeaways = /^## Key Takeaways/m.test(content);
    if (!hasKeyTakeaways) {
      warnings.push('Pillar: falta sección "## Key Takeaways"');
    }

    const hasFAQ = /^## Frequently Asked Questions/m.test(content);
    if (!hasFAQ) {
      warnings.push('Pillar: falta sección "## Frequently Asked Questions"');
    }

    const hasSources = /^## Sources/m.test(content);
    if (!hasSources) {
      warnings.push('Pillar: falta sección "## Sources"');
    }

    const tableCount = (content.match(/\|[\s\S]*?\n\|[-|:\s]+\|/g) || []).length;
    if (tableCount < 2) {
      warnings.push(`Pillar: se recomiendan 2+ tablas comparativas, detectadas ${tableCount}`);
    }

    const blockquoteCount = (content.match(/^> .*(?:https?:\/\/[^\s]+)/gm) || []).length;
    if (blockquoteCount < 2) {
      warnings.push(`Pillar: se recomiendan 2+ blockquotes con fuentes .gov/.org, detectados ${blockquoteCount}`);
    }

    const internalLinkCount = (content.match(/\]\(\/category\/[^)]+\)/g) || []).length;
    if (internalLinkCount < 1) {
      warnings.push('Pillar: se recomienda al menos 1 enlace interno a /category/');
    }
  }

  if (data.image) {
    const imagePath = path.join(__dirname, '..', 'public', data.image.replace(/^\//, ''));
    if (!fs.existsSync(imagePath)) {
      if (data.isPillar) {
        warnings.push(`Pillar: imagen hero no encontrada en public/: ${data.image}`);
      } else {
        errors.push(`Imagen no encontrada: ${data.image}`);
      }
    }
  }

  if (data.relatedArticles) {
    const allSlugs = getAllMarkdownFiles(CONTENT_DIR).map((f) =>
      path.relative(CONTENT_DIR, f).replace(/\.(md|mdx)$/, '').replace(/\\/g, '/')
    );
    data.relatedArticles.forEach((relatedSlug: string) => {
      if (!allSlugs.includes(relatedSlug)) {
        errors.push(`relatedArticles slug no existe: ${relatedSlug}`);
      }
    });
  }

  if (data.seoTitle && data.seoTitle.length > 60) {
    errors.push('seoTitle excede 60 caracteres');
  }
  if (data.seoDescription && (data.seoDescription.length < 50 || data.seoDescription.length > 160)) {
    errors.push('seoDescription debe tener entre 50 y 160 caracteres');
  }

  return { valid: errors.length === 0, errors, warnings, slug };
}

function main() {
  console.log('🔍 Validando contenido...\n');

  const files = getAllMarkdownFiles(CONTENT_DIR);
  let validCount = 0;
  let invalidCount = 0;
  const allErrors: Array<{ slug: string; errors: string[] }> = [];
  const slugs = new Set<string>();

  for (const file of files) {
    const { valid, errors, warnings, slug } = validateFile(file);

    if (slugs.has(slug)) {
      allErrors.push({ slug, errors: [`Slug duplicado: ${slug}`] });
      invalidCount++;
      continue;
    }
    slugs.add(slug);

    if (valid) {
      validCount++;
      console.log(`✅ ${slug}`);
      if (warnings.length > 0) {
        warnings.forEach((w) => console.log(`   ⚠️  ${w}`));
      }
    } else {
      invalidCount++;
      allErrors.push({ slug, errors });
      console.log(`❌ ${slug}`);
      errors.forEach((e) => console.log(`   - ${e}`));
      if (warnings.length > 0) {
        warnings.forEach((w) => console.log(`   ⚠️  ${w}`));
      }
    }
  }

  console.log(`\n📊 Resumen: ${validCount} válidos, ${invalidCount} con errores`);

  if (invalidCount > 0) {
    console.log('\n❌ Validación fallida');
    process.exit(1);
  } else {
    console.log('\n✅ Validación exitosa');
  }
}

main();