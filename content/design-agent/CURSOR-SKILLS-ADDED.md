# Devanta client-site skills — inventory

These skills were added for **client-tailored** marketing sites and **SEO / organic traffic**. Each exists in **two** locations (keep them in sync when you edit):

| Skill folder | Repo path | Global path |
|--------------|-----------|-------------|
| `client-site-excellence-pass` | `.cursor/skills/client-site-excellence-pass/` | `~/.cursor/skills/client-site-excellence-pass/` |
| `client-bespoke-web` | `.cursor/skills/client-bespoke-web/` | `~/.cursor/skills/client-bespoke-web/` |
| `local-seo-spa-traffic` | `.cursor/skills/local-seo-spa-traffic/` | `~/.cursor/skills/local-seo-spa-traffic/` |
| `seo-conversion-copy` | `.cursor/skills/seo-conversion-copy/` | `~/.cursor/skills/seo-conversion-copy/` |

**Related (pre-existing in repo, often already global):** `frontend-design` — craft / anti–AI-slop UI; `~/.cursor/skills/frontend-design/` on this machine.

**Project rule (repo only):** `.cursor/rules/public-site-seo.mdc` — applies when working under `artifacts/skymark-eatery/**/*.{tsx,ts}` or that app’s `index.html`; points agents at `local-seo-spa-traffic` and NAP/schema alignment.

**After editing any `SKILL.md` in `.cursor/skills/`**, re-copy to global:

```bash
for s in client-bespoke-web local-seo-spa-traffic seo-conversion-copy client-site-excellence-pass; do
  cp ".cursor/skills/$s/SKILL.md" "$HOME/.cursor/skills/$s/SKILL.md"
done
```

(Run from the `skymark-eatery` repository root.)
