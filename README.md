# Astro + Supabase CMS migration kit (Antigravity + GSD)

## What's inside
| Path | Purpose |
|---|---|
| `AGENTS.md`, `GEMINI.md` | Always-loaded project brief (short on purpose) |
| `.agent/rules/*.md` | Parity, Astro, Supabase/CMS, git/review, token rules |
| `.agent/workflows/*.md` | `/parity`, `/review`, `/commit` workflows |
| `.planning-seed/` | Brief + roadmap to feed `/gsd-new-project` |
| `docs/PROMPTS.md` | Copy-paste prompts: new-project → discuss → plan → execute → verify → review → ship |
| `legacy/reference.html` | Your original (read-only truth) |
| `scripts/split-reference.mjs` | Splits the 120 KB file into 41 small files (+ MANIFEST) |
| `scripts/extract-content.mjs` | Extracts all CMS content → `supabase/seed.json` |
| `scripts/parity.mjs` | Pixel + computed-style diff of reference vs Astro, 3 viewports |
| `scripts/seed-supabase.mjs` | Upserts seed into Supabase |
| `supabase/migrations/0001_init.sql` | Tables, RLS, storage bucket, admin check |

## Setup (≈10 min)
```bash
git init && npm init -y
npm i -D cheerio @supabase/supabase-js playwright pixelmatch pngjs && npx playwright install chromium
node scripts/split-reference.mjs && node scripts/extract-content.mjs   # already run once; rerun is idempotent
# do NOT commit the harness: AGENTS.md, .agent/, .planning*/, legacy/ are git-ignored on purpose
```
1. Install GSD for Antigravity per its README (`npx get-shit-done-cc@latest` — pick Antigravity; or the community `get-shit-done-antigravity` port). Run `/gsd-help` and note whether commands use `-` or `:`.
2. Open this folder in Antigravity. In **Customizations → Rules**, confirm `.agent/rules/*` are loaded (set `01`, `04`, `05` to *Always On*; `02`, `03` to *Glob* if the frontmatter isn't honored).
3. Create a Supabase project, run `supabase/migrations/0001_init.sql` in the SQL editor, copy keys to `.env`, then `node --env-file=.env scripts/seed-supabase.mjs` (Phase 3 — not before).
4. Follow `docs/PROMPTS.md` from step 0. Discuss phase is skipped: defaults are in `.planning-seed/DECISIONS.md` (edit before step 0 if you disagree, e.g. host).

## Keeping the repo clean
`.gitignore` excludes all agent files, `legacy/` and the one-off generators; `.agent/rules/04-git.md` adds a pre-commit path check and explicit-staging rule. Want zero trace in `.gitignore` too? Move those lines to `.git/info/exclude` (local only).
Trade-off: CI can't run `parity` against `legacy/` unless you keep a copy of the reference outside the repo or commit it deliberately.

## Why these choices
- **No CSS framework on the public page:** Tailwind/scoped CSS would reorder or re-specify your 18 style blocks. Verbatim CSS is the only way to guarantee identical styles. Tailwind/shadcn are used only inside `/admin`.
- **Same GSAP/Lenis, bundled:** identical motion engine, one fewer CDN round-trip (3 requests removed), exact pins.
- **Static public site + Supabase at build time:** best Core Web Vitals and crawlability; admin edits trigger a rebuild via deploy hook.
- **Parity script as acceptance test:** agents can't "feel" a visual diff; numbers keep them honest and cut review tokens.

## Known limits
- `parity --mode=motion` compares scrubbed scroll states with a tolerance (1%); it can't prove easing curves are identical — that's guaranteed by shipping the original scene scripts unmodified.
- The placeholder OG image (`example.com/preview.png`), contact URLs (`github.com/placeholder`) and the 2 certificate images (inline SVG placeholders) in your HTML need real content via the CMS.
- The SQL and Playwright/seed scripts were syntax-checked but not run against a live Supabase project/browser here; Phase 3 and Phase 0 of the roadmap include running them.
