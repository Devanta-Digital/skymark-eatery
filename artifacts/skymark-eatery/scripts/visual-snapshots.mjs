/**
 * Reliable visual QA: build, preview, capture desktop + mobile with ?visualQa=1
 * (disables scroll-reveal / transition surprises). Progressive scroll + segment
 * clips + full-page. Output: design-snapshots/
 *
 * Run: pnpm run visual:snapshots
 * Desktop only: pnpm run visual:snapshots:desktop  (passes --desktop)
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "design-snapshots");
const base = "http://127.0.0.1:4173";

function withVisualQa(pathname) {
  const sep = pathname.includes("?") ? "&" : "?";
  return `${base}${pathname}${sep}visualQa=1`;
}

async function waitForServer() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(base);
      if (r.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Preview not reachable at ${base}`);
}

async function settlePage(page) {
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(350);
  await page
    .evaluate(() =>
      Promise.all(
        [...document.images]
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              }),
          ),
      ),
    )
    .catch(() => {});
  await page.waitForTimeout(200);
}

async function captureSegments(page, slug, vpName) {
  const size = page.viewportSize();
  if (!size) return;
  const { width, height } = size;

  const total = await page.evaluate(() =>
    Math.max(document.body?.scrollHeight ?? 0, document.documentElement?.scrollHeight ?? 0),
  );

  const clip = { x: 0, y: 0, width, height: Math.min(height, Math.max(total, height)) };

  await page.evaluate(() => window.scrollTo(0, 0));
  await settlePage(page);
  await page.screenshot({
    path: path.join(outDir, `${slug}-${vpName}-hero.png`),
    clip,
    timeout: 60_000,
  });

  const midY = Math.max(0, Math.floor(total * 0.42 - height / 2));
  await page.evaluate((y) => window.scrollTo(0, y), midY);
  await settlePage(page);
  await page.screenshot({
    path: path.join(outDir, `${slug}-${vpName}-mid.png`),
    clip,
    timeout: 60_000,
  });

  const footY = Math.max(0, total - height);
  await page.evaluate((y) => window.scrollTo(0, y), footY);
  await settlePage(page);
  await page.screenshot({
    path: path.join(outDir, `${slug}-${vpName}-footer.png`),
    clip,
    timeout: 60_000,
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  await settlePage(page);
  await page.screenshot({
    path: path.join(outDir, `${slug}-${vpName}-full.png`),
    fullPage: true,
    timeout: 120_000,
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith(".png")) fs.unlinkSync(path.join(outDir, f));
  }

  const build = spawn("pnpm", ["exec", "vite", "build", "--config", "vite.config.ts"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  await new Promise((resolve, reject) => {
    build.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`vite build ${code}`))));
  });

  const preview = spawn(
    "pnpm",
    ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", "4173", "--config", "vite.config.ts"],
    { cwd: root, stdio: "ignore", shell: process.platform === "win32" },
  );

  try {
    await new Promise((r) => setTimeout(r, 600));
    await waitForServer();

    const browser = await chromium.launch();
    const paths = ["/", "/menu", "/catering", "/contact"];
    const desktopOnly = process.argv.includes("--desktop");
    const viewports = desktopOnly
      ? [{ name: "desktop", width: 1440, height: 900 }]
      : [
          { name: "desktop", width: 1440, height: 900 },
          { name: "iphone14", width: 390, height: 844 },
        ];

    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.emulateMedia({ reducedMotion: "reduce" });

      for (const p of paths) {
        const slug = p === "/" ? "home" : p.replace(/\//g, "");
        await page.goto(withVisualQa(p), { waitUntil: "load", timeout: 90_000 });
        await settlePage(page);
        await captureSegments(page, slug, vp.name);
      }
      await page.close();
    }
    await browser.close();
  } finally {
    preview.kill("SIGTERM");
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("Screenshots →", outDir);
  console.log("Per route: {slug}-{desktop|iphone14}-{hero|mid|footer|full}.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
