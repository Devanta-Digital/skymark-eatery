---
name: local-seo-spa-traffic
description: >-
  Maximizes discoverability and qualified traffic for client marketing sites
  built as JS SPAs (Vite/React/Next-style): per-route titles and meta, JSON-LD,
  FAQPage where appropriate, local entity signals, internal linking, Core Web
  Vitals, and share previews. Use for SEO, organic traffic, Google ranking, local
  pack alignment, schema.org, Open Graph, "drive traffic", restaurant or
  service-area sites, or technical SEO on any SPA codebase.
---

# Local + technical SEO (traffic-first SPA)

## Find the hooks in this project (any repo)

Before editing, **locate** (search if paths differ):

- A **per-route head helper** (e.g. `useSeo`, `Seo` component, Next `metadata`, Remix `meta`).
- **Central business config** (NAP, `siteUrl`, hours, social) — single source of truth for visible UI and JSON-LD.
- **Root HTML defaults** (`index.html`, root layout) — baseline title/description; SPAs still need route-level updates after navigation.
- **Structured data helpers** (Restaurant, LocalBusiness, BreadcrumbList, FAQPage).

Keep **NAP, hours, phone, and `siteUrl` identical** across footer, contact, JSON-LD, and OG `og:url` / canonical.

### Example: `skymark-eatery` monorepo

When working in **Devanta/skymark-eatery**, prefer these paths:

- `artifacts/skymark-eatery/src/lib/seo.ts` — `useSeo`, `restaurantStructuredData`, breadcrumbs, OG/Twitter, canonical.
- `artifacts/skymark-eatery/index.html` — static defaults.
- `artifacts/skymark-eatery/src/content/site.ts` — `BUSINESS_INFO`, `SITE_IMAGES`; must match schema and visible chrome.

---

## Per-page requirements

1. **Unique `<title>` and meta description** — Descriptions ~140–160 characters where possible; include **primary intent + city/neighbourhood** for local queries without keyword stuffing.
2. **Head helper on every indexable public route** — Title, description, canonical path, `og:image` / image alt when the page has a stronger visual than the site default.
3. **One `<h1>` per view** — Logical heading order; landmarks (`header`, `main`, `footer`, `nav`).
4. **Internal links** — Anchor text reflects real queries where natural (e.g. "office catering in {city}"), not "click here".

---

## Structured data (Google-rich results)

- Keep primary **Restaurant** / **LocalBusiness** (or accurate subtype) JSON-LD aligned with visible NAP and hours; keep `geo`, `openingHoursSpecification`, `menu`, `hasMap`, `sameAs` accurate.
- **BreadcrumbList** on deep views when it improves understanding and SERP display.
- **FAQPage** only when FAQs are **stable**, **visible on the page**, and **verbatim-aligned** with schema (see checklist below).
- Avoid duplicate conflicting `@id` graphs; prefer one clear primary entity per page.

### FAQPage checklist

- [ ] Each FAQ item is a **real** customer question with a **specific** answer (not generic marketing).
- [ ] Visible HTML **matches** the `acceptedAnswer.text` in JSON-LD (same wording or clearly the same meaning—avoid schema that promises details the page does not show).
- [ ] **No** FAQ schema for time-sensitive promos unless someone commits to updating schema when copy changes.
- [ ] Group by intent (catering vs hours vs dietary) rather than dozens of one-line FAQs.
- [ ] Inject FAQ JSON-LD via the same pipeline as other structured data (e.g. `useSeo` `structuredData` array) so it updates with the page.

---

## Local entity and E-E-A-T

- **NAP consistency** — Same spelling across UI, schema, and Google Business Profile (client verification).
- **Service area** — Use **truthful** local anchors (streets, districts, airports, office corridors) the business actually serves; avoid hollow "best in region" claims.
- **Proof** — Hours, pickup flow, dietary notes, and real contact paths improve both trust and quality signals.

---

## Performance = SEO

- **LCP**: Hero images sized appropriately, `fetchpriority` where appropriate, modern formats.
- **CLS**: Reserve space for images and fonts; stable header/nav.
- **INP**: Lazy-load non-critical routes and media; avoid blocking the main thread on first interaction.

---

## Crawling, indexing, prerender / SSR

- **CSR-only SPAs**: Google often renders JS, but **do not assume** all crawlers or social scrapers execute your bundle. Route-level head updates (`useSeo` on mount) are still mandatory for Google on navigations.
- **Money URLs** (typically `/`, `/menu`, `/catering`, `/contact` for restaurants): decide explicitly:
  - **Prerender / SSG** at build (e.g. `vite-plugin-ssg`, snapshot tools, or framework SSG) so HTML contains title, meta, and key JSON-LD without JS; **or**
  - **SSR** (Remix/Next/etc.) for HTML-first responses; **or**
  - Stay CSR and **document the limitation**; verify with **URL Inspection** / **Rich Results Test** after deploy and adjust if HTML is incomplete.
- **New landing pages** (blog, location pages): stable URLs + either prerendered HTML or SSR for content that must be visible without JS.

### Prerender / verification checklist

- [ ] Chosen strategy documented in code comments or project README for the team.
- [ ] For prerendered routes, build output HTML includes `<title>`, meta description, canonical, and critical JSON-LD.
- [ ] After deploy: spot-check with **View Page Source** (not only Elements panel) or Rich Results Test.
- [ ] `robots` meta and `noindex` only on genuinely private routes (admin, account).

---

## Deliverable self-check

- [ ] Each public URL has distinct title + description + canonical
- [ ] OG/Twitter image and alt appropriate for sharing
- [ ] JSON-LD matches visible business data
- [ ] Internal links and headings support target keywords **in context**
- [ ] CWV-friendly media and layout on mobile first
- [ ] FAQ schema (if any) matches visible FAQs and stable policy
