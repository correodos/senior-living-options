export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('es-ES', defaultOptions).format(date);
}

export function formatDateShort(date: Date): string {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getReadingTime(content: string, wordsPerMinute = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function isDateRecent(date: Date, days = 180): boolean {
  const diff = Date.now() - date.getTime();
  return diff < days * 24 * 60 * 60 * 1000;
}

export function sortByDateDesc<T extends { data: { publishDate: Date } }>(a: T, b: T): number {
  return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}

export function sortByDateAsc<T extends { data: { publishDate: Date } }>(a: T, b: T): number {
  return a.data.publishDate.getTime() - b.data.publishDate.getTime();
}