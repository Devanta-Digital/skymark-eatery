export const BUSINESS_INFO = {
  primaryName: "Skymark Eatery by Caffe E Pranzo",
  secondaryName: "Skymark Eatery",
  name: "Skymark Eatery by Caffe E Pranzo",
  siteUrl: "https://skymarkeatery.ca",
  phone: "(905) 206-5550",
  phoneHref: "tel:+19052065550",
  /** E.164-style string for JSON-LD `telephone`. */
  telephoneSchema: "+1-905-206-5550",
  email: "info@skymarkeatery.ca",
  emailHref: "mailto:info@skymarkeatery.ca",
  addressLine1: "2630 Skymark Ave Unit 102",
  addressLine2: "Mississauga, ON L4W 5A4",
  city: "Mississauga",
  region: "ON",
  postalCode: "L4W 5A4",
  country: "CA",
  hoursLabel: "Monday to Friday, 7:30 AM to 4:30 PM",
  mapsHref:
    "https://maps.google.com/?q=2630+Skymark+Ave+Unit+102+Mississauga+ON+L4W+5A4",
  mapsEmbedHref:
    "https://maps.google.com/maps?q=2630+Skymark+Ave+Unit+102+Mississauga+ON+L4W+5A4&hl=en&z=16&output=embed",
  instagramHref: "https://www.instagram.com/skymark___eatery/",
  tagline:
    "Italian takeout, weekday lunch, and office catering from Skymark Avenue in Mississauga — convenient for teams near Pearson Airport and across western Mississauga.",
};

/**
 * Marketing photography: 16:9 assets under /images/marketing/ are generated with
 * `node scripts/optimize-marketing-heroes.mjs` (sharp) from in-store Instagram stills.
 * For AI-enhanced re-runs, use `.cursor/skills/gemini-imagegen` with GEMINI_API_KEY, then
 * replace the sources and re-run the script (or update paths below).
 */
export const SITE_IMAGES = {
  /** Primary hero photography for homepage and menu surfaces. */
  hero: "/images/instagram/hero-pasta-enhanced.jpg",
  /** 16:9 takeout story — pasta-forward editorial crop (replaces utilitarian hot-line). */
  menuHero: "/images/marketing/menu-hero-16x9.jpg",
  menuHeroAlt:
    "Italian pasta and plated lunch from Skymark Eatery by Caffe E Pranzo, Mississauga",
  saladSandwich: "/images/instagram/salad-sandwich.jpg",
  /** 16:9 office-ready trays — fresh vegetables and colour (distinct from menu hero). */
  cateringHero: "/images/marketing/catering-hero-16x9.jpg",
  cateringHeroAlt:
    "Greek salad and fresh vegetable catering from Skymark Eatery by Caffe E Pranzo, Mississauga",
  caesar: "/images/instagram/caesar.jpg",
  focaccia: "/images/instagram/post-8.jpg",
  veggieTray: "/images/instagram/veggie-tray.jpg",
  greekSaladTray: "/images/instagram/greek-salad.jpg",
  hotTable: "/images/instagram/hot-table.jpg",
  dining: "/images/interior-2.jpg",
  catering: "/images/instagram/greek-salad.jpg",
  /** Supporting trust / location — not the primary marketing hero */
  locationInterior: "/images/interior-3.jpg",
  locationInteriorAlt:
    "Dining room and counter at Skymark Eatery by Caffe E Pranzo, Mississauga",
  /** Appetizing hero for contact (utility page — food-forward, not storefront) */
  contactHero: "/images/instagram/salad-sandwich.jpg",
  contactHeroAlt:
    "Fresh pasta and Italian lunch from Skymark Eatery by Caffe E Pranzo, Mississauga",
  /** Default OG / JSON-LD — aligned with warm Italian lunch story (pasta counter). */
  og: "/images/marketing/og-share-16x9.jpg",
  ogImageAlt:
    "Italian lunch and pasta from Skymark Eatery by Caffe E Pranzo, Mississauga",
  /** Open Graph / share previews: match the page (menu & catering). */
  shareMenu: "/images/marketing/menu-hero-16x9.jpg",
  shareMenuAlt:
    "Italian pasta and weekday takeout from Skymark Eatery by Caffe E Pranzo, Mississauga",
  shareCatering: "/images/marketing/catering-hero-16x9.jpg",
  shareCateringAlt:
    "Catering vegetables and salad trays from Skymark Eatery by Caffe E Pranzo, Mississauga",
};

export const WHY_SKYMARK = [
  {
    title: "Made for the weekday lunch rhythm",
    text: "Breakfast, sandwiches, salads, pizza, and pasta are organized around quick pickup and repeat office visits.",
  },
  {
    title: "Catering that is easy to plan",
    text: "Buffet packages, hot trays, sandwich platters, desserts, and extras are set up clearly for meetings and hosted events.",
  },
  {
    title: "Comfort food with real range",
    text: "From croissants and omelette sandwiches to chicken parm, pasta, salads, pizza, and homemade sweets, the menu stays broad without feeling scattered.",
  },
];

export const CATERING_HELPER_TEXT =
  "Email info@skymarkeatery.ca for tray counts, buffet pairings, or dietary notes — we help Mississauga offices and hosts near Pearson plan the right spread.";

/**
 * Homepage editorial copy — the "counter" story module. Forty-odd words of
 * brand voice so the site stops feeling transactional.
 */
export const COUNTER_STORY = {
  kicker: "The counter",
  headline: "One kitchen, the whole workday.",
  body:
    "Caffe E Pranzo opened on Skymark Ave to feed the Mississauga weekday — Italian, made by hand, priced for lunch, organized for offices. One kitchen runs the counter, the pickup line, and the catering trays. Same menu, same cooks, same plates.",
  attribution: "The Skymark counter, Mon–Fri",
};

/**
 * Operational proof points. Every value here should be defensible — do not
 * invent ratings, review counts, or named clients. Swap in real data when it
 * is captured.
 */
export const HOMEPAGE_PROOF = {
  operational: {
    kicker: "The promise",
    headline: "Quote by next business day.",
    body: "Confirmation 48 hours before service. Trays arrive 30 minutes early, with chafers when the package includes them — one email thread from quote to setup.",
  },
  serviceArea: {
    kicker: "Where we cater",
    headline: "Built for the Skymark corridor.",
    body: "Office catering for teams across Skymark Ave, Airport Corporate Centre, Matheson Blvd East, Spectrum Way, and the Pearson-west corridor in Mississauga.",
  },
  kitchen: {
    kicker: "Same kitchen",
    headline: "The counter + the boardroom.",
    body: "The Tuesday sandwich run and the Thursday boardroom buffet are cooked by the same team, on the same line, inside 2630 Skymark Ave — not a separate catering label.",
  },
};
