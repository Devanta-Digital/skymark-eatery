# Devanta reusable workflow: client vs competitor (SEO + design)

Use this checklist for any hospitality or local-service client.

## 1. Capture current state

- Map the live domain → save JSON under `.firecrawl/raw/<client>/current/site-map.json`.
- Scrape each money page (home, primary service, contact, booking/catering) → one markdown file per URL.
- Export combined bundle for LLM handoff if desired (`firecrawl-site-export/` or `normalized/`).

## 2. Build reference set

- **Peers (local):** 3–6 operators in the same city or cuisine band.
- **Aspiration (premium):** 4–8 regional or national brands with strong art direction.
- **UI systems:** 3–6 non-competitor sites (SaaS, gallery, product marketing) for pacing, hierarchy, and sticky patterns only — not to copy visuals literally.

## 3. Normalize findings

For each reference URL, fill `content/research/_templates/design-pattern-template.md` once, then merge into `ui-pattern-library.md`.

## 4. Gap matrix (client vs field)

| Dimension | Client | Best peer | Gap | Priority |
|-----------|--------|-----------|-----|----------|
| Local SEO modifiers | | | | |
| H1 uniqueness per page | | | | |
| Catering / conversion clarity | | | | |
| Hero confidence | | | | |
| Trust / proof density | | | | |
| Image art direction | | | | |
| Mobile CTA path | | | | |

## 5. Implementation brief

- Single creative direction statement.
- Locked visual tokens (type scale, one accent, surface tiers).
- Page-level acceptance criteria.
- Explicit “do not change” list (auth, cart, APIs, routing).

## 6. Ship safely

- Implement in the existing stack only.
- `pnpm build` after each milestone.
- Do not push until stakeholder sign-off.
