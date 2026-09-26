import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCollection } from 'astro:content';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');

async function generateSearchIndex() {
  console.log('🔍 Generando índice de búsqueda...');

  const entries = await getCollection('entries');

  const searchIndex = entries.map((entry) => ({
    title: entry.data.title,
    description: entry.data.description,
    url: `/article/${entry.id}/`,
    category: entry.data.category,
    content: entry.body,
    isPillar: entry.data.isPillar,
    publishDate: entry.data.publishDate.toISOString(),
  }));

  const outputPath = path.join(DIST_DIR, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));

  console.log(`✅ Índice de búsqueda generado: ${searchIndex.length} entradas`);
  console.log(`📄 Guardado en: ${outputPath}`);
}

generateSearchIndex().catch((err) => {
  console.error('❌ Error generando índice:', err);
  process.exit(1);
});