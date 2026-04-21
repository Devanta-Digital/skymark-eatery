# Devanta Firecrawl research workflow

This folder stores **structured, committable** Firecrawl output for client audits (Skymark and future clients).

## Layout

| Path | Purpose |
|------|---------|
| `raw/<client>/current/` | Scrape output for the live client site (markdown as returned). |
| `raw/<client>/competitors/` | Competitor or peer reference pages. |
| `raw/<client>/ui-references/` | UI / interaction / gallery references. |
| `normalized/<client>/` | Optional trimmed or front-matter versions (same URL set, easier diff). |
| `screenshots/<client>/` | Manifest of screenshot URLs or local paths if captured. |
| `summaries/<client>/` | Human-written synthesis (diagnosis, patterns, brief). |

Ephemeral CLI junk stays in `scratchpad/` (gitignored).

## Commands

Use the Firecrawl CLI (authenticated via `FIRECRAWL_API_KEY` or `npx firecrawl-cli`):

```bash
npx firecrawl-cli scrape "https://example.com" --only-main-content -o .firecrawl/raw/client/current/home.md
```

Re-run for any URL when the site changes; keep filenames stable (`home.md`, `competitor-terroni.md`).
