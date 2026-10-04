export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function excerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export function extractHeadings(
  content: string
): Array<{ level: number; text: string; slug: string }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; slug: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ level, text, slug: slugify(text) });
  }

  return headings;
}

export function addHeadingAnchors(content: string): string {
  return content.replace(/^(#{2,3})\s+(.+)$/gm, (_match, hashes, text) => {
    const slug = slugify(text.trim());
    return `${hashes} ${text.trim()} <a class="heading-anchor" href="#${slug}" aria-label="Enlace a ${text.trim()}">#</a>`;
  });
}

export function getTableOfContents(
  content: string
): Array<{ level: number; text: string; slug: string }> {
  // Run on content BEFORE heading anchors are added to avoid capturing anchor HTML
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; slug: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    // Strip any existing heading anchor links from text
    const text = match[2].trim().replace(/\s*<a class="heading-anchor".*$/, '');
    headings.push({ level, text, slug: slugify(text) });
  }

  return headings;
}
