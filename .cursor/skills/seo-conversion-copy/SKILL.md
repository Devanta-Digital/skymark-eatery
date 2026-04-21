---
name: seo-conversion-copy
description: >-
  Writes page copy and information architecture that serve both search intent
  and commercial outcomes: clear H1/H2, FAQ-style answers for long-tail
  queries, strong CTAs, and scannable sections—without keyword stuffing. Use when
  rewriting marketing pages, improving conversions, SEO copy, local restaurant
  marketing, or aligning headings with how people actually search in any
  project.
---

# SEO-informed conversion copy

## Principles

1. **Intent first** — Map each page to a primary intent (e.g. *order lunch near work*, *book office catering*, *find phone/hours*). Headline, first paragraph, and primary CTA must answer that intent in **five seconds**.
2. **Search language, human voice** — Use phrases people type (e.g. cuisine + city, "catering near {landmark}") **only** where they fit natural speech. Prefer **one strong phrase** in the H1 or opening over repeating the same string in every section.
3. **Structure for machines and skimmers** — Descriptive H2s that could stand alone as subtopics; short paragraphs; lists for menus, packages, and steps (order → pickup).
4. **FAQ = snippet opportunity** — Real questions (dietary, minimums, parking, payment, lead time) with **specific** answers tied to **centralized business facts** (e.g. `BUSINESS_INFO`, CMS fields). Pair visible FAQ with structured data only when answers are stable—coordinate with **`local-seo-spa-traffic`**.

## Page-specific guidance

| Page        | SEO + conversion focus |
|------------|-------------------------|
| **Home**   | Brand + location + primary offer + paths to proof (menu breadth, catering, etc.). |
| **Menu**   | Dish-forward language; dietary and serving hints; link to catering or bulk paths if relevant. |
| **Catering** | Package clarity, headcount, lead time, contact channel; neighbourhood and office context. |
| **Contact** | NAP, hours, map, parking/transit if known; reduce friction to call or email. |

## Anti-patterns

- Filler superlatives ("world-class", "best in class") with no proof.
- **Keyword stuffing** in footers or hidden text.
- Duplicate blocks across pages with only the city swapped—rewrite with page-specific detail.
- Legal or accent errors in the brand name—sync with approved business config.

## Collaboration with code

- When copy changes, update **per-route SEO** (e.g. `useSeo`, `metadata`) and any **FAQ / LocalBusiness / Restaurant** schema that quotes those strings.
- Add **id anchors** only when they improve UX (deep links, FAQs), not for fake keyword URLs.

## Done when

- [ ] H1 and meta description reflect the same primary intent
- [ ] A local customer can act (call, order, email) without scrolling through hype
- [ ] Headings read naturally aloud and still contain useful keywords where appropriate
