import fs from 'node:fs';
import path from 'node:path';

const VARIANT_WIDTHS = [480, 768];
const FULL_WIDTH = 1200;

export function heroImageUrl(image: string | undefined): string | null {
  return image ? `/images/${image.replace(/^.*[\\/]images[\\/]/, '')}` : null;
}

export function responsiveSrcset(src: string): string | undefined {
  if (!src.endsWith('.webp')) return undefined;
  const base = src.slice(0, -'.webp'.length);
  const variants = VARIANT_WIDTHS.filter((width) =>
    fs.existsSync(path.join(process.cwd(), 'public', `${base}-${width}.webp`))
  ).map((width) => `${base}-${width}.webp ${width}w`);
  return variants.length > 0 ? [...variants, `${src} ${FULL_WIDTH}w`].join(', ') : undefined;
}
