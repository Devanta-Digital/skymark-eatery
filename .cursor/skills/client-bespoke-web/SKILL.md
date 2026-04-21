---
name: client-bespoke-web
description: >-
  Delivers web UI and UX that feel designed for one specific business—not a
  template—by grounding layout, typography, motion, and imagery in the client's
  real geography, cuisine, hours, and brand facts. Use when building or refining
  client sites, restaurant or hospitality brands, make it ours not generic,
  rebrands, competitor differentiation, or customer-tailored design for any
  codebase.
---

# Client-bespoke web (agency-grade tailoring)

## When this skill applies

Use for **marketing and product sites sold to a named client** where generic SaaS or "AI default" UI would undermine trust. The outcome should feel like a **custom commission**: a visitor could guess the city or concept from visuals alone.

## Before writing code

1. **Source of truth** — Read the client's structured facts first: central site/business module, env config, design brief, or research docs in the repo. In **skymark-eatery**, prioritize `artifacts/skymark-eatery/src/content/site.ts`, menu/catering content, and `content/` or `.firecrawl/` research if present. Names, spelling (accents, legal vs trade name), address, hours, phone, neighbourhoods, and **why they exist** must match the UI.
2. **One clear story** — Pick a single primary story per page (e.g. weekday lunch rhythm vs catering scale vs neighbourhood). Do not stack unrelated metaphors.
3. **Differentiation** — In one sentence: what would a local competitor *not* claim? Reflect that in layout emphasis and copy, not only in a generic "About" block.

## Design rules (non-negotiable)

- **No client-agnostic patterns**: Avoid interchangeable hero → three-icon feature grid → testimonial carousel → pricing cards unless the category truly demands it and it is heavily customized.
- **Typography and colour** — Derive palette and type personality from **cuisine, region, interior, or logo constraints** (not purple-on-white startup defaults). Load **`frontend-design`** for craft execution.
- **Photography and art direction** — Prefer real client or location-specific assets when paths exist; alts describe **what is in frame and why it matters**, not "image of food".
- **Motion** — Motions reinforce the story (e.g. staggered menu reveals for appetite, not random parallax). Respect `prefers-reduced-motion`.
- **Trust surfaces** — Hours, address, map, phone, and primary actions must be **obvious without hunting** on transactional pages.

## Implementation discipline

- Centralize business strings in content modules; avoid duplicating NAP in JSX literals that can drift from JSON-LD.
- Reuse shared layout, section, and SEO primitives rather than scattered magic numbers.
- After visual changes, sanity-check **mobile thumb reach**, **tap targets**, and **contrast** on light and dark chrome if the site mixes them.

## Handoff checklist (quick)

- [ ] Copy and visuals align with centralized business config
- [ ] No placeholder lorem; no wrong city or vertical
- [ ] Primary CTA matches page intent (order vs inquire vs call)
- [ ] Brand feels specific enough that swapping the logo alone would break the design
