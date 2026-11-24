# AGENTS.md — packages/landing

Next.js 16 (App Router) static-export site, Tailwind CSS v4 + DaisyUI 5,
deployed to GitHub Pages at `https://hieudoanm.github.io/resume/`
(project site — `basePath: "/resume"`, `assetPrefix` likewise in
production).

Pages:

- `/` — landing page (hero, features, templates, quickstart, CTA) — the
  resume itself lives at `https://hieudoanm.github.io/`
- `/editor` — a client-side resume editor producing YAML/JSON matching the
  `resume-core` schema (`crates/resume-core/src/types.rs`, camelCase)
- `/downloads`, `/docs` — release binaries and documentation

## Commands

```bash
pnpm install
pnpm run dev      # dev server (no basePath)
pnpm run build    # static export → out/ (uploaded to Pages by CI)
pnpm run lint
pnpm run typecheck
```

## Structure

- `src/app/layout.tsx` — metadata, fonts, global `Navbar`/`Footer`.
- `src/app/page.tsx` — landing page.
- `src/app/editor/page.tsx` — resume editor page.
- `src/lib/resume-data.ts` — resume seed data for the editor (moved from
  `components/resume/`; the rendered resume lives in the
  `hieudoanm.github.io` repo).
- `src/components/editor/` — editor shell (`ResumeEditor.tsx`), live preview
  (`ResumePreview.tsx`), form inputs (`inputs.tsx`) and per-section forms
  (`forms/`).
- `src/components/molecules/` — shared `Navbar`, `Footer`, `SectionHead`.
  These files are **byte-identical across all `hieudoanm/*/packages/landing`
  repos** — do not fork them; pass content via props instead.
- `src/lib/resume.ts` — `ResumeData` types (mirror of the Rust schema), seed data
  (`defaultResume`), localStorage persistence and YAML/JSON (de)serialisation.
- `src/app/globals.css` — Tailwind v4 imports + the custom DaisyUI
  `resume` light theme (teal accent).
- `public/` — `favicon.ico`/`favicon.svg`, `logo.svg`, `og.png`,
  `robots.txt`, `sitemap.xml`, `humans.txt`, `llms.txt`, served under
  `/resume/` in production. Canonical sources live in `assets/` — edit
  `assets/branding/svg/*`, then run `assets/svg-to-png.sh` and
  `assets/sync-assets.sh`; do not hand-edit `public/` binaries.

## Conventions

- Keep `output: "export"` in `next.config.ts` — the site must build to
  static HTML in `out/`; no server features or API routes.
- `basePath`/`assetPrefix` are `/resume` in production builds; `next/link`
  and metadata get it automatically, raw `<img src>` paths must include it
  (see the `LOGO` constant in `layout.tsx`).
- Theme is light-only via `data-theme="resume"` on `<html>`.
- The editor state lives in `localStorage` under `resume-data` as YAML; the
  `ResumeData` TypeScript types must stay in sync with
  `crates/resume-core/src/types.rs` (serde `camelCase`).
- Arrow functions only, explicit types on exports, files ≤ ~200 lines,
  functions ≤ ~30 lines.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
