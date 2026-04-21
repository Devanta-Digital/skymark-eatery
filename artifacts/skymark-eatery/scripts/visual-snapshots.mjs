/**
 * Builds, serves preview, captures desktop + mobile PNGs (Playwright).
 * Output: design-snapshots/*.png — run after visual passes: pnpm run visual:snapshots
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

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

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
    { cwd: root, stdio: "pipe", shell: process.platform === "win32" },
  );

  try {
    await waitForServer();

    const browser = await chromium.launch();
    const paths = ["/", "/menu", "/catering", "/contact"];
    const viewports = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "iphone14", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      for (const p of paths) {
        const slug = p === "/" ? "home" : p.replace(/\//g, "");
        await page.goto(`${base}${p}`, { waitUntil: "networkidle", timeout: 60_000 });
        await page.screenshot({
          path: path.join(outDir, `${slug}-${vp.name}.png`),
          fullPage: true,
        });
      }
      await page.close();
    }
    await browser.close();
  } finally {
    preview.kill("SIGTERM");
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("Screenshots →", outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
