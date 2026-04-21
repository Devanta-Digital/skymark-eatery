/** Raster logos processed with `pnpm run process-logo` (sharp, transparent plate). */
export const BRAND_LOGO = {
  /** Light UI: sheets, auth cards, mobile drawer on cream */
  onLight: "/logo-transparent.webp",
  /** Dark chrome: header, footer — lifted cream tint so navy wordmark reads on charcoal */
  onDark: "/logo-header.webp",
  pngFallback: "/logo-transparent.png",
} as const;
