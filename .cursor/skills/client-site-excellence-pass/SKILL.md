---
name: client-site-excellence-pass
description: >-
  End-to-end pass for client-owned marketing sites: bespoke visual identity tied
  to real business facts, SEO/traffic mechanics (meta, JSON-LD, local signals),
  conversion copy, accessibility, and performance. Use when launching or
  hardening a client site, full polish, organic growth goals, or combining
  design + SEO + copy in one engagement—in any repository (skills live under
  ~/.cursor/skills or .cursor/skills).
---

# Client site excellence pass

## Trigger

Run when the user wants a **client-tailored** site that also **earns traffic**—not only a visual refresh. **Read** the companion skills (same names in `~/.cursor/skills/<name>/SKILL.md` or `.cursor/skills/<name>/SKILL.md`) and follow them in order:

1. `client-bespoke-web`
2. `frontend-design` (craft / anti–generic UI execution)
3. `local-seo-spa-traffic`
4. `seo-conversion-copy`

Do not substitute vague generic web advice for these steps.

---

## Phase 1 — Truth and differentiation

1. **Locate** the project's central business config (e.g. `site.ts`, `business.ts`, CMS types, env-based `siteUrl`). In **skymark-eatery**: `artifacts/skymark-eatery/src/content/site.ts` and related content modules.
2. Note **location**, **hours**, **cuisine or vertical**, **proof points** (what they actually sell).
3. Write one line: **why this site wins vs a template** for this client.

---

## Phase 2 — Bespoke design

Apply **`client-bespoke-web`** and **`frontend-design`**.

- Visual system, typography, motion, and imagery must feel **owned** by this client.
- Reject interchangeable SaaS or stock restaurant patterns unless deliberately customized.

---

## Phase 3 — SEO and traffic

Apply **`local-seo-spa-traffic`**.

- Every indexable public route: head/meta, canonical, unique title/description, OG/Twitter as needed.
- JSON-LD aligned with visible NAP; FAQPage only per that skill's checklist.
- Internal links and heading hierarchy support **real search intents**.

---

## Phase 4 — Copy and conversion

Apply **`seo-conversion-copy`**.

- H1/H2, body, and CTAs match intent; FAQs where they earn trust and snippets.

---

## Phase 5 — Ship quality bar

- **Accessibility**: focus order, labels, contrast on light and dark surfaces, meaningful image alts.
- **Performance**: LCP/CLS/INP sanity—hero media, fonts, bundle discipline.
- **Regression**: run the site's production build (e.g. `pnpm run build` from the **package root** that ships the client app). For **skymark-eatery**, that is `artifacts/skymark-eatery/`.

---

## Output expectation

Summarize for the user:

1. **Brand fit** — What changed that is specific to this client.
2. **SEO/traffic** — Routes, meta, schema, links, prerender stance if touched.
3. **Conversion** — CTAs, clarity, friction removed.
4. **Residual risks** — SPA rendering limits, content still needed from client, GBP not verified, etc.
