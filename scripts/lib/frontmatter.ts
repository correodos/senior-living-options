import { parse } from 'yaml';

// Reads the frontmatter block at the top of a Markdown file with a real YAML parser, so the
// validators see the same values the site build does. Windows line endings (CRLF) are accepted.
export function parseFrontmatter(
  content: string
): { data: Record<string, unknown>; body: string } | null {
  const text = content.replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) return null;

  try {
    const data = parse(match[1]);
    if (data === null || typeof data !== 'object' || Array.isArray(data)) return null;

    const body = text.slice(match[0].length).trim();
    return { data: data as Record<string, unknown>, body };
  } catch (e) {
    console.error('Error parsing frontmatter:', e);
    return null;
  }
}
