# Cursor skills — full index (this machine + this repo)

## Policy: every skill lives in the repo

**All** Cursor skills from `~/.cursor/skills/` are **vendored** into **`.cursor/skills/`** in this repository so clones, teammates, and CI have the same agent context—even for skills a given sprint does not use.

When you **install or update** a skill globally, refresh the repo copy:

```bash
./scripts/sync-cursor-skills-from-global.sh
```

Optional override:

```bash
CURSOR_SKILLS_GLOBAL=/path/to/skills ./scripts/sync-cursor-skills-from-global.sh
```

If you **author or edit** a skill only inside this repo first, push the folder back to your machine’s global store:

```bash
rsync -a ./.cursor/skills/my-skill-name/ "$HOME/.cursor/skills/my-skill-name/"
```

---

## 1. Every skill folder under `~/.cursor/skills/` (global)

These are mirrored into **`.cursor/skills/`** (same names). Re-run `ls ~/.cursor/skills | wc -l` after installs; as of last sync: **48** folders.

| # | Skill folder |
|---|----------------|
| 1 | `addyosmani-references` |
| 2 | `agent-native-architecture` |
| 3 | `algorithmic-art` |
| 4 | `anthropic-frontend-design` |
| 5 | `brand-guidelines` |
| 6 | `browser-testing-with-devtools` |
| 7 | `canvas-design` |
| 8 | `ce-brainstorm` |
| 9 | `ce-demo-reel` |
| 10 | `ce-ideate` |
| 11 | `ce-optimize` |
| 12 | `ce-plan` |
| 13 | `ce-review` |
| 14 | `client-bespoke-web` |
| 15 | `client-site-excellence-pass` |
| 16 | `code-review-and-quality` |
| 17 | `code-simplification` |
| 18 | `compound-frontend-design` |
| 19 | `context-engineering` |
| 20 | `css-animation` |
| 21 | `cursor-canvas` |
| 22 | `doc-coauthoring` |
| 23 | `document-review` |
| 24 | `every-style-editor` |
| 25 | `figma-code-connect` |
| 26 | `figma-create-design-system-rules` |
| 27 | `figma-create-new-file` |
| 28 | `figma-generate-design` |
| 29 | `figma-generate-library` |
| 30 | `figma-implement-design` |
| 31 | `figma-use` |
| 32 | `frontend-design` |
| 33 | `frontend-ui-engineering` |
| 34 | `gemini-imagegen` |
| 35 | `github-web-coder` |
| 36 | `idea-refine` |
| 37 | `incremental-implementation` |
| 38 | `local-seo-spa-traffic` |
| 39 | `performance-optimization` |
| 40 | `seo-conversion-copy` |
| 41 | `shipping-and-launch` |
| 42 | `skill-creator` |
| 43 | `slack-gif-creator` |
| 44 | `spec-driven-development` |
| 45 | `test-browser` |
| 46 | `theme-factory` |
| 47 | `web-artifacts-builder` |
| 48 | `webapp-testing` |

**Vendored size (approx.):** ~8–10 MB under `.cursor/skills/` (themes, references, PDFs in some packs).

---

## 2. This repository — `.cursor/skills/`

**48** folders — full mirror of the table above. **Git is the team source of truth** after you sync; treat global `~/.cursor/skills` as “install location” on your Mac, then run the sync script to commit.

---

## 3. This repository — `.cursor/rules/`

| Rule file | Purpose |
|-----------|---------|
| `public-site-seo.mdc` | When editing the Skymark Vite app, load `local-seo-spa-traffic` and keep SEO/NAP aligned. |

---

## 4. Other repos (Devanta / future clients)

Copy **`scripts/sync-cursor-skills-from-global.sh`** into each repo’s `scripts/` (or symlink), keep **`.cursor/skills/`** in git, and run the same script after global skill changes so **every repo** carries the full skill set.

More context: `content/design-agent/SKILLS-MASTER-LIST.md`.
