export function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } | null {
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
