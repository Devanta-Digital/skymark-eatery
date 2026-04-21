/** Raster logos processed with `pnpm run process-logo` (sharp, transparent plate). */
export const BRAND_LOGO = {
  /** Light UI: sheets, auth cards, mobile drawer on cream */
  onLight: "/logo-transparent.webp",
  /** Dark chrome: header, footer — transparent asset reads cleanly without blend hacks */
  onDark: "/logo-transparent.webp",
  pngFallback: "/logo-transparent.png",
} as const;
