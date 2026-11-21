# resume

Resume tooling: a Rust CLI/core (`crates/`) that renders YAML resumes to
Markdown/HTML/PDF, and a static Next.js site (`packages/landing`) with the
resume at `/` and a browser resume editor at `/editor`.

## Layout

- `crates/resume-core` — resume schema (`src/types.rs`, camelCase YAML/JSON),
  loading, markdown rendering, validation; minijinja HTML templates in
  `templates/`
- `crates/resume-cli` — `resume` binary (clap)
- `packages/landing` — Next.js static site (see its `AGENTS.md`)
- `scripts/convert_templates.py` — Go template → minijinja converter

## Commands

```bash
cargo build --release -p resume-cli   # Rust workspace
pnpm dev                              # landing dev server (turbo)
pnpm build                            # static export → packages/landing/out
```
