import { getCollection } from 'astro:content';

const MAX_CONTENT_CHARS = 4000;

function toPlainText(markdown: string): string {
  return markdown
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/^\s*-{3,}\s*$/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const entries = await getCollection('entries', ({ data }) => !data.noIndex);

  const index = entries.map((entry) => ({
    title: entry.data.title,
    description: entry.data.description,
    url: `/article/${entry.id}/`,
    category: entry.data.category,
    content: toPlainText(entry.body ?? '').slice(0, MAX_CONTENT_CHARS),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
