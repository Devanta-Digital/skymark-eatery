# Implementation brief — Skymark premium pass (safe scope)

## Creative direction (single sentence)

Modern Italian eatery for busy professionals near Pearson and west Mississauga — **premium, efficient, elevated, approachable**.

## Visual system (locked)

- **Serif:** Playfair Display — display headings only.
- **Sans:** Plus Jakarta Sans — UI + body.
- **Surfaces:** `section-light`, `section-muted`, `section-dark` — alternate intentionally.
- **One accent:** **Terracotta** (`--primary` for filled CTAs). Olive only as **support** (kicker / subtle border), not competing fills.

## Signature gesture

- **Terracotta left rail** (4px) on key editorial sections + one **asymmetric** homepage category grid (catering tile dominant).

## Pages

1. **Home:** Hero → 4 category showcase (catering dominant tile) → asymmetric story → dark catering highlight → trust strip → final CTA.
2. **Menu:** Hero → **House picks** band (featured items) → existing sections (logic untouched).
3. **Catering:** Hero → occasion planner tabs → overview → packages + **comparison** → trays → **visual band** → dietary → inquiry planner → CTA.
4. **Contact:** Hero → elevated two-column utility (map + scan grid).

## Do not touch

- Auth, cart, API hooks, routing table, checkout/admin flows, catering form submit behaviour.

## Validation

- `pnpm build` after milestone.
