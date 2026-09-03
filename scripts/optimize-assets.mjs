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

// The checker pattern's own cell size, estimated from tone run-lengths along
// a few near-border rows (where we know the content is pure checker). Used
// by the enclosed-pocket pass below to size its detection window correctly.
function estimateCellSize(data, width, height, channels, lightColor, darkColor) {
  const rows = [2, Math.round(height * 0.01), height - 3, height - Math.round(height * 0.01) - 1];
  const runs = [];
  const classify = (x, y) => {
    const o = (y * width + x) * channels;
    const color = [data[o], data[o + 1], data[o + 2]];
    if (colorDistance(color, lightColor) < CHECKER_TOLERANCE) return 1;
    if (colorDistance(color, darkColor) < CHECKER_TOLERANCE) return 2;
    return 0;
  };
  for (const y of rows) {
    let run = 1;
    let previous = null;
    for (let x = 0; x < width; x++) {
      const tone = classify(x, y);
      if (tone === previous) { run++; continue; }
      if (previous) runs.push(run);
      run = 1;
      previous = tone;
    }
  }
  runs.sort((a, b) => a - b);
  return runs.length ? runs[Math.floor(runs.length / 2)] : 20;
}

async function removeCheckerboardBackground(inputPath) {
  // A median pre-pass removes JPEG ringing/noise around the checker cells
  // so the flood fill isn't blocked by stray blended seam pixels between
  // cells (which otherwise trap large interior checker regions as opaque
  // islands disconnected from the border).
  const { data, info } = await sharp(inputPath).median(7).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const palette = detectBorderPalette(data, width, height, channels);
  const [lightColor] = palette;
  const size = width * height;
  const index = (x, y) => y * width + x;

  // Per-pixel tone: 1 = matches the light checker shade, 2 = matches any of
  // the (usually gray) darker shades, 0 = neither (real character content).
  const tone = new Uint8Array(size);
  for (let p = 0; p < size; p++) {
    const o = p * channels;
    const color = [data[o], data[o + 1], data[o + 2]];
    if (colorDistance(color, lightColor) < CHECKER_TOLERANCE) tone[p] = 1;
    else if (palette.slice(1).some((paletteColor) => colorDistance(color, paletteColor) < CHECKER_TOLERANCE)) tone[p] = 2;
  }

  // Pass 1: flood fill from the image border through checker-toned pixels.
  // This alone clears the vast majority of the background but — by design —
  // can never reach a pocket of checker pattern fully enclosed by the
  // character's own opaque line art (e.g. the gap under a raised arm), no
  // matter the tolerance: that boundary is the character's outline, not a
  // color the palette would ever match.
  const visited = new Uint8Array(size);
  const transparent = new Uint8Array(size);
  const stack = [];
  for (let x = 0; x < width; x++) { stack.push(index(x, 0), index(x, height - 1)); }
  for (let y = 0; y < height; y++) { stack.push(index(0, y), index(width - 1, y)); }
  while (stack.length) {
    const p = stack.pop();
    if (visited[p]) continue;
    visited[p] = 1;
    if (!tone[p]) continue;
    transparent[p] = 1;
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - width);
    if (y < height - 1) stack.push(p + width);
  }

  // Pass 2: catch those enclosed pockets by texture instead of connectivity.
  // For every still-opaque, checker-toned pixel, look at a window around it
  // (sized to a few checker cells) and count how much of that window is each
  // of the two checker tones via a summed-area table. A genuine checkerboard
  // pocket reads as a strong, roughly 50/50 mix of both tones; a real
  // character detail that merely happens to be light/gray (an off-white
  // sleeve, gray glasses, a metal prosthetic) reads as overwhelmingly one
  // tone, because it's a solid fill, not an alternating pattern — so it's
  // left untouched even though pass 1 also couldn't clear it.
  const lightPrefix = new Int32Array((width + 1) * (height + 1));
  const darkPrefix = new Int32Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = index(x, y);
      const row = y * (width + 1);
      const nextRow = (y + 1) * (width + 1);
      lightPrefix[nextRow + x + 1] = (tone[p] === 1 ? 1 : 0) + lightPrefix[row + x + 1] + lightPrefix[nextRow + x] - lightPrefix[row + x];
      darkPrefix[nextRow + x + 1] = (tone[p] === 2 ? 1 : 0) + darkPrefix[row + x + 1] + darkPrefix[nextRow + x] - darkPrefix[row + x];
    }
  }
  const windowSum = (prefix, x0, y0, x1, y1) => {
    x0 = Math.max(0, x0); y0 = Math.max(0, y0);
    x1 = Math.min(width - 1, x1); y1 = Math.min(height - 1, y1);
    if (x1 < x0 || y1 < y0) return 0;
    return prefix[(y1 + 1) * (width + 1) + (x1 + 1)] - prefix[y0 * (width + 1) + (x1 + 1)] - prefix[(y1 + 1) * (width + 1) + x0] + prefix[y0 * (width + 1) + x0];
  };
  const cellSize = estimateCellSize(data, width, height, channels, palette[0], palette[1]);
  const win = Math.max(4, Math.round(cellSize * 1.6));
  const minWindowCoverage = 0.3; // enough checker-toned context nearby to judge the pattern at all
  const minToneBalance = 0.28; // fraction the minority tone must reach to count as "alternating", not "solid fill"
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = index(x, y);
      if (transparent[p] || !tone[p]) continue;
      const lightCount = windowSum(lightPrefix, x - win, y - win, x + win, y + win);
      const darkCount = windowSum(darkPrefix, x - win, y - win, x + win, y + win);
      const total = lightCount + darkCount;
      if (total < (win * 2) ** 2 * minWindowCoverage) continue;
      if (Math.min(lightCount, darkCount) / total > minToneBalance) transparent[p] = 1;
    }
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
