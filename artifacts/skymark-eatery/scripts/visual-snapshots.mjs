/**
 * Reliable visual QA: build, preview, capture desktop + mobile with ?visualQa=1
 * (disables scroll-reveal / transition surprises). Progressive scroll + segment
 * clips + full-page. Output: design-snapshots/
 *
 * Run: pnpm run visual:snapshots
 * Desktop only: pnpm run visual:snapshots:desktop  (passes --desktop)
 * Partial desktop QA: pnpm run visual:snapshots:qa-partial
 *   (--shots=… comma list). In zsh, quote the value: --shots='home-hero,home-full,menu-full,contact-full'
 */
import { chromium } from "playwright";
import { execSync, spawn } from "node:child_process";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "design-snapshots");
const base = "http://127.0.0.1:4173";

/** Stale preview servers leave 4173 bound; Vite then picks another port while this script still probes 4173 */
function freePreviewPort(port = 4173) {
  if (process.platform === "win32") return;
  try {
    execSync(
      `lsof -nP -iTCP:${port} -sTCP:LISTEN -t 2>/dev/null | xargs kill -9 2>/dev/null`,
      { stdio: "ignore", shell: "/bin/bash" },
    );
  } catch {
    /* ignore */
  }
}

/**
 * `fullPage: true` hangs on these marketing routes (Playwright + fixed chrome).
 * Stitch viewport captures; strip the fixed header band from frames after the first.
 * Fixed-position back-to-top is omitted when `?visualQa=1` (see Layout) so stitched
 * PNGs do not repeat the primary-colored control on every strip.
 */
async function screenshotStitchedFullPage(page, outPath) {
  const size = page.viewportSize();
  if (!size) return;
  const { width: vw, height: vh } = size;

  const headerH = await page.evaluate(() => {
    const hdr = document.querySelector("header");
    return hdr ? Math.ceil(hdr.getBoundingClientRect().height) : 72;
  });

  const scrollH = await page.evaluate(() =>
    Math.max(
      document.documentElement?.scrollHeight ?? 0,
      document.body?.scrollHeight ?? 0,
    ),
  );

  const step = Math.max(320, vh - headerH);
  const cappedScrollH = Math.min(Math.max(scrollH, vh), 28_000);
  const raw = [];
  const maxStrips = 45;
  for (let y = 0; y < cappedScrollH && raw.length < maxStrips; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await settlePage(page);
    raw.push(await page.screenshot({ type: "png", timeout: 60_000 }));
  }

  const strips = [];
  for (let i = 0; i < raw.length; i++) {
    const meta = await sharp(raw[i]).metadata();
    const w = meta.width ?? vw;
    const h = meta.height ?? vh;
    if (i === 0) {
      strips.push(await sharp(raw[i]).png().toBuffer());
    } else {
      const top = Math.min(headerH, Math.max(0, h - 2));
      strips.push(
        await sharp(raw[i])
          .extract({ left: 0, top, width: w, height: h - top })
          .png()
          .toBuffer(),
      );
    }
  }

  let totalH = 0;
  const heights = [];
  for (const s of strips) {
    const m = await sharp(s).metadata();
    const hh = m.height ?? 0;
    heights.push(hh);
    totalH += hh;
  }

  const composites = [];
  let acc = 0;
  for (let i = 0; i < strips.length; i++) {
    composites.push({ input: strips[i], top: acc, left: 0 });
    acc += heights[i];
  }

  await sharp({
    create: {
      width: vw,
      height: totalH,
      channels: 4,
      background: { r: 10, g: 14, b: 20, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outPath);
}

function withVisualQa(pathname) {
  const sep = pathname.includes("?") ? "&" : "?";
  return `${base}${pathname}${sep}visualQa=1`;
}

async function waitForServer() {
  for (let i = 0; i < 80; i++) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 3000);
      const r = await fetch(base, { signal: ac.signal });
      clearTimeout(t);
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
  /** Never hang on a single broken/slow image (load/error may never fire) */
  await page
    .evaluate(() => {
      const pending = [...document.images]
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              const done = () => resolve();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
              setTimeout(done, 4000);
            }),
        );
      return Promise.race([
        Promise.all(pending),
        new Promise((resolve) => setTimeout(resolve, 4500)),
      ]);
    })
    .catch(() => {});
  await page.waitForTimeout(200);
}

function partialShotToFilename(key) {
  const map = {
    "home-hero": "home-desktop-hero.png",
    "home-mid": "home-desktop-mid.png",
    "home-full": "home-desktop-full.png",
    "menu-full": "menu-desktop-full.png",
    "catering-full": "catering-desktop-full.png",
    "contact-full": "contact-desktop-full.png",
  };
  return map[key] ?? null;
}

async function screenshotViewportClip(page, outPath) {
  const size = page.viewportSize();
  if (!size) return;
  const total = await page.evaluate(() =>
    Math.max(document.body?.scrollHeight ?? 0, document.documentElement?.scrollHeight ?? 0),
  );
  const clip = {
    x: 0,
    y: 0,
    width: size.width,
    height: Math.min(size.height, Math.max(total, size.height)),
  };
  await page.screenshot({ path: outPath, clip, timeout: 60_000 });
}

/** Desktop 1440×900 only; overwrites named files in design-snapshots/ */
async function capturePartialDesktopShots(page, keys) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const key of keys) {
    const file = partialShotToFilename(key);
    if (!file)
      throw new Error(
        `Unknown --shots key: ${key}. Expected: home-hero, home-mid, home-full, menu-full, catering-full, contact-full`,
      );
    const outPath = path.join(outDir, file);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

    if (key === "menu-full") {
      await page.goto(withVisualQa("/menu"), { waitUntil: "load", timeout: 90_000 });
      await settlePage(page);
      await screenshotStitchedFullPage(page, outPath);
      continue;
    }

    if (key === "catering-full") {
      await page.goto(withVisualQa("/catering"), { waitUntil: "load", timeout: 90_000 });
      await settlePage(page);
      await screenshotStitchedFullPage(page, outPath);
      continue;
    }

    if (key === "contact-full") {
      await page.goto(withVisualQa("/contact"), { waitUntil: "load", timeout: 90_000 });
      await settlePage(page);
      await screenshotStitchedFullPage(page, outPath);
      continue;
    }

    await page.goto(withVisualQa("/"), { waitUntil: "load", timeout: 90_000 });
    await settlePage(page);
    const total = await page.evaluate(() =>
      Math.max(document.body?.scrollHeight ?? 0, document.documentElement?.scrollHeight ?? 0),
    );
    const size = page.viewportSize();
    if (!size) continue;
    const { width, height } = size;

    if (key === "home-hero") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await settlePage(page);
      await screenshotViewportClip(page, outPath);
    } else if (key === "home-mid") {
      const midY = Math.max(0, Math.floor(total * 0.42 - height / 2));
      await page.evaluate((y) => window.scrollTo(0, y), midY);
      await settlePage(page);
      await screenshotViewportClip(page, outPath);
    } else if (key === "home-full") {
      await screenshotStitchedFullPage(page, outPath);
    }
  }
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
  const shotsArg = process.argv.find((a) => a.startsWith("--shots="));
  const partialShotKeys = shotsArg
    ? shotsArg
        .slice("--shots=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  fs.mkdirSync(outDir, { recursive: true });
  if (partialShotKeys?.length) {
    for (const key of partialShotKeys) {
      const name = partialShotToFilename(key);
      if (!name) throw new Error(`Unknown --shots key: ${key}`);
      const p = path.join(outDir, name);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  } else {
    for (const f of fs.readdirSync(outDir)) {
      if (f.endsWith(".png")) fs.unlinkSync(path.join(outDir, f));
    }
  }

  freePreviewPort(4173);
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
    await new Promise((r) => setTimeout(r, 1200));
    await waitForServer();

    const browser = await chromium.launch({
      args: ["--disable-dev-shm-usage", "--disable-gpu"],
    });

    if (partialShotKeys?.length) {
      for (const shotKey of partialShotKeys) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await capturePartialDesktopShots(page, [shotKey]);
        await page.close();
      }
    } else {
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
    }
    await browser.close();
  } finally {
    preview.kill("SIGTERM");
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("Screenshots →", outDir);
  if (partialShotKeys?.length) {
    console.log("Partial:", partialShotKeys.join(", "));
  } else {
    console.log("Per route: {slug}-{desktop|iphone14}-{hero|mid|footer|full}.png");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
