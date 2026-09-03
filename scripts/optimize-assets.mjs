import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const source = join(process.cwd(), 'handoff', 'assets', 'characters');
const target = join(process.cwd(), 'public', 'assets', 'characters');
await mkdir(target, { recursive: true });
const files = (await readdir(source)).filter((name) => /\.(png|jpe?g)$/i.test(name));

// Source illustrations are opaque rasters with a flattened "transparency
// preview" checkerboard (two alternating near-gray tones, tinted
// differently per image) baked into the background pixels instead of a
// real alpha channel. For each image we auto-detect that image's own
// checker duo from its border pixels, then flood-fill it away starting
// from the border (so interior character details are left untouched even
// when they share a similar tone) before rebuilding a real alpha channel.
function colorDistance(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function detectBorderPalette(data, width, height, channels) {
  const counts = new Map();
  const bucket = (v) => Math.min(255, Math.round(v / 8) * 8);
  const add = (x, y) => {
    const o = (y * width + x) * channels;
    const key = `${bucket(data[o])},${bucket(data[o + 1])},${bucket(data[o + 2])}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  };
  // Sample a thin band near each edge (not just the single edge pixel) so a
  // soft drop-shadow/gradient right at the border is captured too, and keep
  // the top 4 clusters rather than 2 to cover checker duos with more than
  // one shade pair (some sources dither the checker across a small range).
  const band = Math.max(1, Math.round(height * 0.02));
  for (let x = 0; x < width; x += 2) { for (let b = 0; b < band; b++) { add(x, b); add(x, height - 1 - b); } }
  for (let y = 0; y < height; y += 2) { for (let b = 0; b < band; b++) { add(b, y); add(width - 1 - b, y); } }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([key]) => key.split(',').map(Number));
}

const CHECKER_TOLERANCE = 75;

async function removeCheckerboardBackground(inputPath) {
  // A median pre-pass removes JPEG ringing/noise around the checker cells
  // so the flood fill isn't blocked by stray blended seam pixels between
  // cells (which otherwise trap large interior checker regions as opaque
  // islands disconnected from the border).
  const { data, info } = await sharp(inputPath).median(7).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const palette = detectBorderPalette(data, width, height, channels);
  const size = width * height;
  const visited = new Uint8Array(size);
  const transparent = new Uint8Array(size);
  const stack = [];
  const index = (x, y) => y * width + x;
  for (let x = 0; x < width; x++) { stack.push(index(x, 0), index(x, height - 1)); }
  for (let y = 0; y < height; y++) { stack.push(index(0, y), index(width - 1, y)); }

  while (stack.length) {
    const p = stack.pop();
    if (visited[p]) continue;
    visited[p] = 1;
    const o = p * channels;
    const color = [data[o], data[o + 1], data[o + 2]];
    if (!palette.some((paletteColor) => colorDistance(color, paletteColor) < CHECKER_TOLERANCE)) continue;
    transparent[p] = 1;
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - width);
    if (y < height - 1) stack.push(p + width);
  }

  for (let p = 0; p < size; p++) {
    if (transparent[p]) data[p * channels + 3] = 0;
  }

  return sharp(data, { raw: { width, height, channels } });
}

// A few source renders carry a stray filename watermark (e.g. "char_loop_map")
// baked into the bottom margin, below the character's feet — see
// docs/handoff/assets/ASSETS_README.md "Baked-in English text". Blanking a
// fixed bottom band erases it without touching the character artwork above.
const WATERMARK_BOTTOM_FRACTIONS = {
  char_heroine_map: 0.06,
  char_heroine_certificate: 0.06,
  char_hero_certificate: 0.06,
};

async function eraseBottomWatermark(pipeline, fraction) {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const cutoff = Math.round(height * (1 - fraction));
  for (let y = cutoff; y < height; y++) {
    for (let x = 0; x < width; x++) {
      data[(y * width + x) * channels + 3] = 0;
    }
  }
  return sharp(data, { raw: { width, height, channels } });
}

await Promise.all(files.map(async (name) => {
  const baseName = parse(name).name;
  const output = join(target, `${baseName}.webp`);
  let cleaned = await removeCheckerboardBackground(join(source, name));
  if (WATERMARK_BOTTOM_FRACTIONS[baseName]) {
    cleaned = await eraseBottomWatermark(cleaned, WATERMARK_BOTTOM_FRACTIONS[baseName]);
  }
  await cleaned.resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(output);
}));
console.log(`Optimized ${files.length} character assets.`);
