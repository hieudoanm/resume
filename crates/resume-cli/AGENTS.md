# AGENTS.md — resume-cli

Thin `resume` binary over `resume-core`. See the root
[`AGENTS.md`](../../AGENTS.md).

- `src/main.rs` — clap derive CLI. Subcommands: `init`, `md`, `pdf`,
  `validate`, `serve`, `mcp`. Runtime errors print `resume: <err>` to stderr
  and exit 1; clap owns usage errors (exit 2) and help/version.
- `init` — writes `DEFAULT_RESUME_YAML` to `resume.yaml`; fails if it exists.
- `md` — `-i/--input` (default `resume.yaml`), `-o/--output` (default `resume.md`);
  parses YAML via `resume-core` and writes `to_markdown` output.
- `pdf` — `-i/--input`, `-o/--output` (default `resume.pdf`),
  `-t/--template` (default: first of `list_templates()`). Loads YAML, renders
  HTML in core, then `pdf.rs` shells out to `wkhtmltopdf`
  (`--page-size A4`, zero margins — same engine the Go version wraps).
  `wkhtmltopdf` must be on PATH.
- `validate [file]` — schema validation via `resume-core::validate`;
  `resume.yaml` default.
- `serve` — axum HTTP server on `PORT` (default 8080):
  `POST /api/v1/pdf` (JSON `ResumeData` body → PDF bytes, `?template=` optional),
  `GET /api/v1/health`, `GET /api/v1/openapi.json`, `GET /api/v1/docs`
  (Swagger UI). OpenAPI spec + Swagger HTML are consts in `serve.rs`.
- `mcp serve` — stdio JSON-RPC 2.0 server (`mcp.rs`): `initialize`,
  `tools/list`, `tools/call` (stub responses, same as the Go port).
  Unknown methods are ignored; requests without `id` get responses with the
  field omitted.
- `server_box.rs` — startup banner for `serve` (OSC-8 hyperlinks on TTY).
- `examples/render.rs` — dev helper: `cargo run -p resume-cli --example
  render -- <resume.yaml> <template>` prints rendered HTML.
- Keep it thin: argument parsing + file/process I/O only; all resume logic lives
  in `resume-core`. CLI-only deps (axum, tokio, tempfile) must not leak into
  core — core stays `wasm32-unknown-unknown` clean.
- `cargo run -p resume-cli -- --help`; `cargo test --workspace`.
