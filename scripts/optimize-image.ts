// Turns the image the user dropped in drafts/images/<slug>.<ext> into the three WebP files the
// site uses: public/images/<slug>.webp (1200x675), <slug>-768.webp and <slug>-480.webp.
// Usage: npm run image:optimize -- <slug>
// Uses sharp, which is already installed as a dependency of Astro.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const INBOX = path.join(ROOT, 'drafts', 'images');
const OUT_DIR = path.join(ROOT, 'public', 'images');

const SIZES = [
  { suffix: '', width: 1200, height: 675, maxKB: 100 },
  { suffix: '-768', width: 768, height: 432, maxKB: 60 },
  { suffix: '-480', width: 480, height: 270, maxKB: 35 },
];
const INPUT_EXT = ['.png', '.jpg', '.jpeg', '.webp'];

async function encode(input: string, width: number, height: number, maxKB: number) {
  let buffer: Buffer = Buffer.alloc(0);
  let quality = 82;
  for (; quality >= 50; quality -= 4) {
    buffer = await sharp(input)
      .rotate()
      .resize(width, height, { fit: 'cover', position: 'attention' })
      .webp({ quality, effort: 6 })
      .toBuffer();
    if (buffer.length <= maxKB * 1024) break;
  }
  return { buffer, quality: Math.max(quality, 50) };
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Uso: npm run image:optimize -- <slug>');
    process.exit(1);
  }
  const file = INPUT_EXT.map((ext) => path.join(INBOX, `${slug}${ext}`)).find((f) => fs.existsSync(f));
  if (!file) {
    console.error(`No hay imagen en drafts/images/ con el nombre ${slug}.(png|jpg|jpeg|webp)`);
    process.exit(1);
  }

  const meta = await sharp(file).metadata();
  console.log(`📷 ${path.basename(file)}: ${meta.width}×${meta.height}, ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  if ((meta.width ?? 0) < 1200 || (meta.height ?? 0) < 675) {
    console.log('   ⚠️  La imagen es menor de 1200×675: se ampliará y puede verse borrosa');
  }
  const ratio = (meta.width ?? 1) / (meta.height ?? 1);
  if (Math.abs(ratio - 16 / 9) > 0.05) {
    console.log('   ⚠️  No es 16:9: se recorta automáticamente centrado en la zona de interés');
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const size of SIZES) {
    const { buffer, quality } = await encode(file, size.width, size.height, size.maxKB);
    const out = path.join(OUT_DIR, `${slug}${size.suffix}.webp`);
    fs.writeFileSync(out, buffer);
    const kb = buffer.length / 1024;
    const flag = kb > size.maxKB ? ' ⚠️ supera el objetivo' : '';
    console.log(`   ✅ public/images/${slug}${size.suffix}.webp  ${size.width}×${size.height}  q${quality}  ${kb.toFixed(0)} KB${flag}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
