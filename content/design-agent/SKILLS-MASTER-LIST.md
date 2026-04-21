# Design & web quality — skills master list

Use this document when asking **ChatGPT** (or any model) to synthesize **one master redesign prompt** for Cursor. It lists (1) **web-researched skill libraries** you can pull from later, (2) **everything installed globally** in `~/.cursor/skills/`, and (3) **reference checklists vendored in this repo**.

---

## Part A — Web research: 18+ additional sources (beyond your first batch)

These are **directories, catalogs, or repos** that host many `SKILL.md`-style instructions for agents—not all are drop-in Cursor folders, but each is a credible place to discover **UI, motion, accessibility, performance, and “non-AI” craft** skills.

| # | Source | URL | What you get |
|---|--------|-----|----------------|
| 1 | **VoltAgent / awesome-agent-skills** | https://github.com/VoltAgent/awesome-agent-skills | Large curated index (company + community skills); good for discovery and install links. |
| 2 | **travisvn / awesome-claude-skills** | https://github.com/travisvn/awesome-claude-skills | Curated Claude Code skills & customization. |
| 3 | **hesreallyhim / awesome-claude-code** | https://github.com/hesreallyhim/awesome-claude-code | Broad Claude Code ecosystem (skills, hooks, plugins). |
| 4 | **karanb192 / awesome-claude-skills** | https://github.com/karanb192/awesome-claude-skills | Smaller verified set (TDD, git, docs, etc.). |
| 5 | **sickn33 / antigravity-awesome-skills** | https://github.com/sickn33/antigravity-awesome-skills | Very large installable library + installer patterns for multiple CLIs. |
| 6 | **GitHub / awesome-copilot** (`web-coder` skill) | https://github.com/github/awesome-copilot/tree/main/skills/web-coder | Web standards, security, performance, accessibility—**installed for you** as `github-web-coder`. |
| 7 | **addyosmani / agent-skills** | https://github.com/addyosmani/agent-skills | **20 production workflows** (define→ship); **frontend-ui-engineering** explicitly targets “not AI-generated” UI. **Cloned locally** at `~/.cursor/skill-sources/addyosmani-agent-skills`. |
| 8 | **obra / superpowers** | https://github.com/obra/superpowers | Agent methodology (planning, subagents, inspection)—helps disciplined redesign passes. |
| 9 | **obra / superpowers-skills** | https://github.com/obra/superpowers-skills | Community skill extensions (repo may be archived—still useful as patterns). |
| 10 | **tech-leads-club / agent-skills** | https://github.com/tech-leads-club/agent-skills | Example catalog-style skills (e.g. subagent creation). |
| 11 | **jwynia / agent-skills** | https://github.com/jwynia/agent-skills | Large categorized skill collection (includes creative + technical). |
| 12 | **ianho7 / ai-friendly-web-design-skill** | https://github.com/ianho7/ai-friendly-web-design-skill | Principles for UI that is easier for *both* humans and agents (semantic HTML, ARIA, forms). |
| 13 | **mgifford / accessibility-skills** | https://github.com/mgifford/accessibility-skills | Modular accessibility skills (WCAG-oriented). |
| 14 | **vercel-labs / agent-skills** | https://github.com/vercel-labs/agent-skills | Vercel-adjacent agent skills (e.g. accessibility PRs and Next.js-oriented guidance). |
| 15 | **neonwatty / css-animation-skill** | https://github.com/neonwatty/css-animation-skill | **Installed** as global skill `css-animation`—HTML/CSS walkthrough animations. |
| 16 | **dylanfeltus / skills** (`motion-design-patterns`) | https://github.com/dylanfeltus/skills/tree/main/motion-design-patterns | Framer Motion patterns (springs, staggers, layout). |
| 17 | **mxyhi / ok-skills** (`impeccable/animate`) | https://github.com/mxyhi/ok-skills | Motion / micro-interaction skill examples. |
| 18 | **pbakaus / impeccable** | https://github.com/pbakaus/impeccable | “Impeccable” agent skill pack incl. motion references. |
| 19 | **Cursor docs — Agent Skills** | https://cursor.com/docs/context/skills | Official Cursor skill discovery rules (`~/.cursor/skills`, project `.cursor/skills`). |
| 20 | **agentskills.help** (Cursor integration) | https://agentskills.help/en/docs/cursor | Third-party how-to for wiring skills into Cursor. |
| 21 | **design.dev — Claude skills guide** | https://design.dev/guides/claude-skills/ | Conceptual guide to skills for design/dev workflows. |

---

## Part A½ — Client delivery skills (repo + global)

These skills exist in **both** places so agents pick them up in this repo and in **any** Cursor workspace:

- **Repository:** `skymark-eatery/.cursor/skills/<name>/`
- **Global:** `~/.cursor/skills/<name>/` (same `SKILL.md` content — repo is source of truth; re-copy after edits if you want global to match).

**Project rule (this repo only):** `.cursor/rules/public-site-seo.mdc` — when matching files are in context, nudges agents to load `local-seo-spa-traffic` and keep SEO/NAP aligned.

| Folder | Use when |
|--------|----------|
| **client-site-excellence-pass** | One coordinated pass: bespoke visuals, SEO mechanics, copy, a11y, performance, build verification. |
| **client-bespoke-web** | Design/UX that could not be swapped to another logo without breaking—grounded in real NAP, cuisine, and geography. |
| **local-seo-spa-traffic** | Per-route meta, JSON-LD, FAQPage checklist, OG/Twitter, internal linking, NAP, CWV, prerender/SSR checklist for SPAs. |
| **seo-conversion-copy** | H1/H2, body, FAQs, and CTAs aligned to search intent without stuffing. |
| **frontend-design** | High-craft execution and anti–AI-slop aesthetics (repo + usually already under `~/.cursor/skills/`). |

**Skymark implementation anchors** (when in this monorepo): `artifacts/skymark-eatery/src/lib/seo.ts`, `artifacts/skymark-eatery/src/content/site.ts`, `artifacts/skymark-eatery/index.html`.

---

## Part B — Global installs (`~/.cursor/skills/`)

**Count:** 44 entries (43 named skills + 1 shared reference bundle `addyosmani-references`).

**Reference bundle:** `~/.cursor/skills/addyosmani-references/` mirrors Addy’s `references/` (accessibility, performance, security, testing, orchestration). Several Addy skills say “see `references/...`”—point agents at this folder when needed.

| Folder | Specializes in |
|--------|----------------|
| **frontend-design** | Your custom **bold aesthetic / anti–AI-slop** frontend brief (download-based). |
| **anthropic-frontend-design** | Official Anthropic **same philosophy** as above; canonical wording + LICENSE. |
| **compound-frontend-design** | Deeper **layered workflow**: detect design system → plan → build → **screenshot verification**. |
| **frontend-ui-engineering** | **Production UI**: component architecture, responsive layouts, WCAG 2.1 AA patterns, explicit **“Avoid the AI aesthetic”** table (purple gradients, card grids, etc.). |
| **github-web-coder** | **Web platform depth**: HTML/CSS/JS, HTTP, security, performance, accessibility vocabulary and standards. |
| **brand-guidelines** | Applying **brand voice and visual rules** consistently in UI. |
| **theme-factory** | **Themes / palettes / tokens** + bundled theme PDF and `themes/` samples. |
| **canvas-design** | **Canvas-style** compositions and design patterns (Anthropic). |
| **web-artifacts-builder** | **Self-contained HTML/CSS/JS artifacts** (demos, posters, one-pagers). |
| **algorithmic-art** | **Generative / atmospheric** visuals when you need a stronger visual concept. |
| **slack-gif-creator** | **Short motion assets** for social / marketing. |
| **css-animation** | **HTML/CSS animation walkthroughs** (feature demos & carousels; iterative review loop). |
| **doc-coauthoring** | **Long-form collaborative writing** (site copy, landing narratives). |
| **every-style-editor** | **Editorial / style-guide** line editing for on-brand copy. |
| **ce-brainstorm** | **Divergent/convergent** product and UX exploration before locking a direction. |
| **ce-ideate** | **Idea generation + critique** when you want more options than one moodboard. |
| **ce-plan** | **Structured implementation plans** for large redesigns. |
| **ce-optimize** | **Metric-driven iteration** when you can define measurable “better.” |
| **document-review** | **Multi-lens review** of specs/plans (catches IA / “AI slop” risk in documents). |
| **ce-review** | **PR-style code review** personas—useful after UI lands in code. |
| **code-review-and-quality** | **Five-axis review**, change sizing, severity labels—merge gate quality. |
| **code-simplification** | **Reduce complexity** without changing behavior (de-slops overbuilt UI code). |
| **spec-driven-development** | **PRD-style specs** before big UI rewrites. |
| **idea-refine** | **Sharpen vague redesign goals** into concrete proposals. |
| **incremental-implementation** | **Vertical slices**: implement → verify → commit (safe UI refactors). |
| **context-engineering** | **Better prompts + rules + MCP context** so design instructions stay coherent. |
| **browser-testing-with-devtools** | **Runtime truth**: DOM, console, network, performance via DevTools mindset. |
| **test-browser** | **Browser verification** flows for shipped UI (compound). |
| **webapp-testing** | Anthropic **webapp testing** playbook. |
| **performance-optimization** | **Core Web Vitals**, profiling workflow, bundle/image/React anti-patterns. |
| **shipping-and-launch** | **Launch discipline**: flags, rollouts, monitoring—when redesign goes live. |
| **gemini-imagegen** | **Image generation / editing** for bespoke visuals (not stock). |
| **ce-demo-reel** | **GIF/screenshot evidence** for UI changes and PRs. |
| **cursor-canvas** | Cursor **Canvas** (`.canvas.tsx`) for rich interactive design artifacts beside chat. |
| **agent-native-architecture** | **Agent/human parity** in product UX (important for “real” sites, not demos). |
| **skill-creator** | **Authoring new skills**—meta. |
| **doc-coauthoring** | *(listed above)* |
| **figma-use** | **Prerequisite** before `use_figma` tool calls. |
| **figma-implement-design** | **Figma → code** implementation fidelity. |
| **figma-generate-design** | **Code/spec → Figma** screens. |
| **figma-generate-library** | **Design systems in Figma** (tokens, components, themes). |
| **figma-create-design-system-rules** | **Custom design-system rules** for Figma↔code. |
| **figma-code-connect** | **Code Connect** mappings. |
| **figma-create-new-file** | **New Figma file** workflows. |
| **anthropic-frontend-design** | *(see above)* |

---

## Part C — Vendored in this repo (for ChatGPT / offline)

| Path | Purpose |
|------|---------|
| `content/design-agent/addy-references/accessibility-checklist.md` | WCAG-oriented accessibility checklist (Addy pack). |
| `content/design-agent/addy-references/performance-checklist.md` | Web performance checklist + commands. |
| `content/design-agent/addy-references/security-checklist.md` | Security checklist for public sites. |
| `content/design-agent/addy-references/testing-patterns.md` | Testing patterns reference. |
| `content/design-agent/addy-references/orchestration-patterns.md` | Multi-step / agent orchestration notes. |

---

## Part D — Local clones (optional, for full Addy pack + updates)

| Path | Contents |
|------|----------|
| `~/.cursor/skill-sources/addyosmani-agent-skills` | Full **addyosmani/agent-skills** repo (`skills/`, `references/`, `agents/`, `docs/`). |
| `~/.cursor/skill-sources/css-animation-skill` | Upstream **neonwatty/css-animation-skill** (for updates / diffing). |

---

## Part E — Paste block for ChatGPT (compact skill IDs)

Copy everything inside the code fence into ChatGPT when asking it to build your **one master redesign prompt**:

```
GLOBAL_CURSOR_SKILLS_INSTALLED:
frontend-design, anthropic-frontend-design, compound-frontend-design,
frontend-ui-engineering, github-web-coder, brand-guidelines, theme-factory,
canvas-design, web-artifacts-builder, algorithmic-art, slack-gif-creator,
css-animation, doc-coauthoring, every-style-editor, ce-brainstorm, ce-ideate,
ce-plan, ce-optimize, document-review, ce-review, code-review-and-quality,
code-simplification, spec-driven-development, idea-refine, incremental-implementation,
context-engineering, browser-testing-with-devtools, test-browser, webapp-testing,
performance-optimization, shipping-and-launch, gemini-imagegen, ce-demo-reel,
cursor-canvas, agent-native-architecture, skill-creator,
figma-use, figma-implement-design, figma-generate-design, figma-generate-library,
figma-create-design-system-rules, figma-code-connect, figma-create-new-file

REFERENCE_BUNDLE_PATHS:
- ~/.cursor/skills/addyosmani-references/
- Repo: content/design-agent/addy-references/*.md

FULL_SKILL_SOURCE_CLONES:
- ~/.cursor/skill-sources/addyosmani-agent-skills
- ~/.cursor/skill-sources/css-animation-skill
```

Next: open `CHATGPT-MASTER-PROMPT-BUILDER.md` in this folder for assembly instructions.
