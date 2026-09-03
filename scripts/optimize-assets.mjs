import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const source = join(process.cwd(), 'handoff', 'assets', 'characters');
const target = join(process.cwd(), 'public', 'assets', 'characters');
await mkdir(target, { recursive: true });
const files = (await readdir(source)).filter((name) => name.endsWith('.png'));
await Promise.all(files.map(async (name) => {
  const output = join(target, `${parse(name).name}.webp`);
  await sharp(join(source, name)).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(output);
}));
console.log(`Optimized ${files.length} character assets.`);
