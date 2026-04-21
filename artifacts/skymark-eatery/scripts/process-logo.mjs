/**
 * Removes near-white plate background from raster logo; writes transparent WebP/PNG.
 * Run from package root: node scripts/process-logo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public", "logo.webp");

async function main() {
  const input = sharp(src).ensureAlpha();
  const { data, info } = await input.clone().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) throw new Error(`Expected RGBA, got ${channels} channels`);

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const avg = (r + g + b) / 3;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    // Kill near-white plate + light grey backing (common on exported logos)
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

  const rawImage = sharp(out, {
    raw: { width, height, channels: 4 },
  });

  const pngPath = path.join(root, "public", "logo-transparent.png");
  const webpPath = path.join(root, "public", "logo-transparent.webp");
  await rawImage.clone().png({ compressionLevel: 9 }).toFile(pngPath);
  await rawImage.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(webpPath);

  // Light-on-dark header variant: lift mids toward cream (multiply blend feel)
  const headerPath = path.join(root, "public", "logo-header.webp");
  await sharp(webpPath)
    .ensureAlpha()
    .modulate({ brightness: 1.12, saturation: 0.85 })
    .tint({ r: 255, g: 252, b: 246 })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(headerPath);

  console.log("Wrote:", pngPath, webpPath, headerPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
