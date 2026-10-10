import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

const ENTRIES_DIR = path.resolve('src/content/entries');
const costsMeta = JSON.parse(
  fs.readFileSync(path.resolve('src/data/costs-by-state.json'), 'utf-8')
)._meta;
const lastmodByUrl = new Map();
lastmodByUrl.set('costs/', costsMeta.publishedDate);
const categoryLastmod = new Map();

for (const category of fs.readdirSync(ENTRIES_DIR)) {
  const dir = path.join(ENTRIES_DIR, category);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const text = fs.readFileSync(path.join(dir, file), 'utf-8');
    const reviewed = text.match(/^lastReviewed:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1];
    if (!reviewed) continue;
    lastmodByUrl.set(`article/${category}/${file.replace(/\.md$/, '')}/`, reviewed);
    if (reviewed > (categoryLastmod.get(category) ?? '')) categoryLastmod.set(category, reviewed);
  }
}
for (const [category, date] of categoryLastmod) lastmodByUrl.set(`category/${category}/`, date);

const SITE_URL = 'https://senior-living-options.pages.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always',
    assets: 'assets',
  },
  compressHTML: true,
  prefetch: {
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/privacy/') &&
        !page.includes('/terms/') &&
        !page.includes('/disclaimer/') &&
        !page.includes('/accessibility/') &&
        !page.includes('/contact/thanks/'),
      serialize(item) {
        const relative = item.url.replace(SITE_URL + '/', '');
        const lastmod = relative.startsWith('costs/')
          ? costsMeta.publishedDate
          : lastmodByUrl.get(relative);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
});
