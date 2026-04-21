# Skymark visual system reset — handoff (Apr 2026)

## Tools installed / configured

| Tool | Status |
|------|--------|
| **Playwright** (`playwright`, `@playwright/test`) | Added to `@workspace/skymark-eatery` devDependencies; Chromium installed via `pnpm exec playwright install chromium`. |
| **Sharp** | Used in `scripts/process-logo.mjs` for local raster processing (ImageMagick was **not** available in PATH on this machine). |
| **Playwright MCP** | **Not** present in the Cursor MCP tool list for this session; validation uses **`pnpm run visual:snapshots`** (programmatic Chromium). |
| **Figma MCP** | Plugin metadata exists in Cursor (`plugin-figma-figma`); **not invoked** here (no linked frame / design context). |
| **remove.bg / Photoroom API** | **Not configured** (no API keys in repo). |
| **ImageMagick** | **Not installed** locally; Sharp is the supported fallback. |
| **Cursor image generation** | Not used (no new raster food assets in this pass). |

## Logo asset fix

- **Source:** `artifacts/skymark-eatery/public/logo.webp` (raster with light plate).
- **Pipeline:** `node scripts/process-logo.mjs` → writes:
  - `public/logo-transparent.png` / `public/logo-transparent.webp` — alpha via near-white / warm-paper heuristics.
  - `public/logo-header.webp` — lightened/tinted variant for dark chrome.
- **SVG:** `public/logo.svg` — wraps the transparent WebP for scalable containers (still raster-backed).
- **Usage:** `src/lib/branding.ts` (`BRAND_LOGO.onDark` / `onLight`). Public shell uses **onDark** in header + footer; light sheets (cart, mobile drawer, auth) use **onLight**. Inline paths in auth/admin use `/logo-transparent.webp`.
- **Chrome polish:** Header + footer marks use **`mix-blend-multiply`** so residual light plate reads into the charcoal bar instead of a white “sticker.”
- **Sizing:** Header mark bumped (`h-11` → `h-[2.85rem]` expanded); footer `h-14`.

## Playwright screenshots (after this pass)

Regenerate anytime from `artifacts/skymark-eatery`:

```bash
pnpm run visual:snapshots
```

Outputs (gitignored): `design-snapshots/*-{desktop,iphone14}.png` for `/`, `/menu`, `/catering`, `/contact`.

## Selected direction: **A — Dark editorial / high-contrast**

Documented comparison: `palette-directions.md`.  
Rationale: strongest **section resets**, **CTA separation**, and **mobile legibility** vs beige-on-beige; aligns with Damas / GEM / Terroni-style **dark dining + brass** cues without copying palettes literally.

### Token summary (`src/index.css`)

- Cool paper background (`220°` hue family), ink foreground.
- **Primary:** wine `354 78% 42%` (replaces dusty terracotta).
- **Surfaces:** `--surface-dark` ≈ `hsl(222 30% 6%)` for hero / dark bands.
- **Accent:** brass kickers on dark via `.section-dark .section-kicker` and nav hovers.

## Files changed (this pass)

- `artifacts/skymark-eatery/package.json` — scripts + deps (sharp, playwright).
- `artifacts/skymark-eatery/.gitignore` — `design-snapshots/`
- `artifacts/skymark-eatery/scripts/process-logo.mjs`, `scripts/visual-snapshots.mjs`
- `artifacts/skymark-eatery/public/logo-transparent.png`, `.webp`, `logo-header.webp`, `logo.svg`
- `artifacts/skymark-eatery/src/lib/branding.ts`
- `artifacts/skymark-eatery/src/index.css` — global tokens, body, shells, section utilities.
- `artifacts/skymark-eatery/src/components/layout.tsx` — dark header/footer, logos, chrome colors.
- `artifacts/skymark-eatery/src/components/sections/hero.tsx` — taller hero, cooler overlays, brass kicker.
- `artifacts/skymark-eatery/src/components/sticky-section-nav.tsx` — dark sticky rail.
- `artifacts/skymark-eatery/src/pages/home.tsx` — editorial catering lane + row tiles; dark trust band.
- `artifacts/skymark-eatery/src/pages/menu.tsx`, `catering.tsx` — sticky CTA link colors.
- `artifacts/skymark-eatery/src/pages/login.tsx`, `signup.tsx`, `admin-login.tsx`, `order-board.tsx`
- `artifacts/skymark-eatery/src/components/admin-layout.tsx`
- `content/research/skymark/palette-directions.md` (this doc’s companion)

## Validation

- `pnpm build` (workspace root): **passed** after changes.

## Publish

Per instructions: **do not publish** until stakeholders sign off on screenshots in a real browser.
