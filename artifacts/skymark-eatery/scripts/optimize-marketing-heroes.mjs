/**
 * Produces 16:9 marketing JPEGs under public/images/marketing/ from in-repo source photos.
 * Run from package root: node scripts/optimize-marketing-heroes.mjs
 * (Regenerate with Gemini + gemini-imagegen skill when GEMINI_API_KEY is available for AI-enhanced art.)
 */
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = path.join(root, "public", "images", "marketing");

const W = 1920;
const H = 1080;
const q = 88;

async function to16x9(srcRel, outName, position) {
  const input = path.join(root, "public", srcRel);
  const out = path.join(outDir, outName);
  await sharp(input)
    .resize(W, H, {
      fit: "cover",
      position: position ?? sharp.strategy.attention,
    })
    .jpeg({ quality: q, mozjpeg: true })
    .toFile(out);
  // eslint-disable-next-line no-console
  console.log("wrote", path.relative(root, out));
}

await mkdir(outDir, { recursive: true });

await to16x9(
  "images/instagram/hero-pasta-enhanced.jpg",
  "menu-hero-16x9.jpg",
  "centre",
);
await to16x9(
  "images/instagram/greek-salad.jpg",
  "catering-hero-16x9.jpg",
  sharp.strategy.attention,
);
await to16x9(
  "images/instagram/hero-pasta-enhanced.jpg",
  "og-share-16x9.jpg",
  "centre",
);
