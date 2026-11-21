# Resume

Rust port of the Go resume CLI (`hieudoanm.github.io/packages/app/headless/cv/languages/go`).

## Layout

- `crates/resume-core` — pure resume logic, `wasm32-unknown-unknown` compatible.
  Types (`types.rs`), YAML/JSON parsing + default resume (`load.rs`), Markdown
  rendering (`markdown.rs`), HTML template rendering via minijinja
  (`templates.rs` + `templates/` + `build.rs` embed), validation
  (`validate.rs`), description formatting (`description.rs`), WASM exports
  (`wasm.rs`).
- `crates/resume-cli` — `resume` binary (clap). Commands: `init`, `md`,
  `pdf`, `validate`, `serve` (axum), `mcp` (stdio JSON-RPC). PDF is produced
  by rendering HTML in core and shelling out to `wkhtmltopdf`.
- `scripts/` — `install.sh` (prebuilt release → cargo fallback),
  `install-local.sh` (local release build → `~/.local/bin`),
  `convert_templates.py` (regenerates `templates/` from the Go sources).
- `packages/landing` — consumes `resume-core` compiled to WASM via the
  `@resume/core` pnpm package (`crates/resume-core/pkg`).

## Commands

```bash
cargo build                 # builds resume binary at target/debug/resume
cargo test --workspace      # unit tests
cargo fmt --all && cargo clippy --workspace --all-targets -- -D warnings
cargo build -p resume-core --target wasm32-unknown-unknown
make -C crates/resume-core build-wasm   # release wasm -> crates/resume-core/pkg (gitignored)
pnpm --filter @resume/core run build:wasm  # same, via pnpm
./scripts/install-local.sh  # release build of `resume` -> ~/.local/bin
```

JS workspace (pnpm — `packages/landing`):

```bash
pnpm install     # also installs husky hooks via the prepare script
pnpm lint && pnpm typecheck && pnpm build
```

Git hooks: `.husky/pre-commit` runs `pnpm exec lint-staged` (prettier for
web files, `rustfmt --edition 2021` for `.rs`); `.husky/commit-msg` runs
commitlint (Conventional Commits — see `commitlint.config.mjs`).
CI: `.github/workflows/ci.yaml` — Rust quality gate, release binaries on
master, landing build + GitHub Pages deploy.

## Notes

- `resume-core` templates are generated; do not edit `templates/` by hand —
  edit the Go sources and re-run `scripts/convert_templates.py`.
- Template rendering is verified byte-identical to the Go implementation.
- `wkhtmltopdf` must be installed for `pdf`/`serve` PDF generation.
