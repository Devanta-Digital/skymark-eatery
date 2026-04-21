/**
 * Builds web-ready logos from `public/logo-source.png` (preferred) or `public/logo.webp`.
 * - Knocks out near-black plate (edge-connected flood) so black line art inside colors stays.
 * - Knocks out near-white / warm-paper plate (legacy webp exports).
 * - Trims transparent margins, light sharpen, high-quality WebP/PNG.
 * - Writes `logo-header.webp` (lifted + cream tint) for dark chrome.
 *
 * Run from package root: pnpm run process-logo
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function resolveInputPath() {
  const png = path.join(root, "public", "logo-source.png");
  const webp = path.join(root, "public", "logo.webp");
  if (fs.existsSync(png)) return png;
  if (fs.existsSync(webp)) return webp;
  throw new Error("Missing logo input: add public/logo-source.png or public/logo.webp");
}

/** Pixels the flood may step through (true black / plate AA), not navy body type. */
function isFloodVoid(r, g, b) {
  const max = Math.max(r, g, b);
  const avg = (r + g + b) / 3;
  return max <= 34 && avg <= 30;
}

function floodEdgeVoidToTransparent(out, width, height) {
  const stride = width * height;
  const seen = new Uint8Array(stride);
  const qx = new Int32Array(stride);
  const qy = new Int32Array(stride);
  let qh = 0;
  let qt = 0;

  const push = (x, y) => {
    const p = y * width + x;
    if (seen[p]) return;
    const i = p * 4;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (!isFloodVoid(r, g, b)) return;
    seen[p] = 1;
    qx[qt] = x;
    qy[qt] = y;
    qt++;
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (qh < qt) {
    const x = qx[qh];
    const y = qy[qh];
    qh++;
    const i = (y * width + x) * 4;
    out[i + 3] = 0;
    if (x > 0) push(x - 1, y);
    if (x + 1 < width) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y + 1 < height) push(x, y + 1);
  }
}

function removeLightPlates(out) {
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const avg = (r + g + b) / 3;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    const nearWhitePlate = avg >= 248 && spread <= 14;
    const warmPaper =
      avg >= 235 &&
      spread <= 22 &&
      r > g - 6 &&
      r > b - 6 &&
      g > b - 10;
    if (nearWhitePlate || warmPaper) {
      out[i + 3] = 0;
    }
  }
}

async function main() {
  const src = resolveInputPath();
  const input = sharp(src).ensureAlpha();
  const { data, info } = await input.clone().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) throw new Error(`Expected RGBA, got ${channels} channels`);

  const out = Buffer.from(data);
  floodEdgeVoidToTransparent(out, width, height);
  removeLightPlates(out);

  let pipeline = sharp(out, {
    raw: { width, height, channels: 4 },
  })
    .trim({ threshold: 12 })
    .sharpen({ sigma: 0.6, m1: 0.8, m2: 2.5, x1: 2, y2: 10, y3: 20 });

  const meta = await pipeline.metadata();
  const tw = meta.width ?? width;
  const th = meta.height ?? height;

  const pngPath = path.join(root, "public", "logo-transparent.png");
  const webpPath = path.join(root, "public", "logo-transparent.webp");
  await pipeline.clone().png({ compressionLevel: 9 }).toFile(pngPath);
  await pipeline
    .clone()
    .webp({ quality: 93, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(webpPath);

  // Dark chrome: lift mids so navy reads on charcoal; keep reds/greens legible
  const headerPath = path.join(root, "public", "logo-header.webp");
  await sharp(webpPath)
    .ensureAlpha()
    .modulate({ brightness: 1.32, saturation: 0.95 })
    .linear(1.05, -(12 * 1.05))
    .tint({ r: 252, g: 249, b: 244 })
    .webp({ quality: 93, alphaQuality: 100, effort: 6 })
    .toFile(headerPath);

  const svgPath = path.join(root, "public", "logo.svg");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${tw} ${th}" width="${tw}" height="${th}" role="img" aria-label="Skymark Eatery logo">
  <title>Skymark Eatery</title>
  <image href="/logo-transparent.webp" x="0" y="0" width="${tw}" height="${th}" preserveAspectRatio="xMidYMid meet" />
</svg>
`;
  fs.writeFileSync(svgPath, svg, "utf8");

  console.log("Input:", src);
  console.log("Wrote:", pngPath, webpPath, headerPath, svgPath, `(${tw}×${th})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
