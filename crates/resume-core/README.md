# resume-core

Core resume library for resume: YAML/JSON parsing, Markdown and HTML rendering,
validation — shared by the `resume` CLI and the WebAssembly build consumed by
`packages/landing`.

## Layout

| File              | What it is                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `src/types.rs`    | `ResumeData` and section structs (personal, contact, websites, experience, education, …).        |
| `src/load.rs`     | `parse_resume_yaml` / `parse_resume_json` / `to_json` / `to_yaml`, `DEFAULT_RESUME_YAML`.                   |
| `src/markdown.rs` | `to_markdown(&ResumeData) -> String` — the `resume.md` renderer.                                      |
| `src/templates.rs`| `list_templates()` / `render_html(&ResumeData, name)` — 64 minijinja HTML templates.              |
| `src/description.rs` | `format_description` — HTML-safe description formatting used by templates.                 |
| `src/validate.rs` | `validate(&ResumeData)` — schema validation, first violation wins.                                |
| `src/wasm.rs`     | `#[wasm_bindgen]` exports for the landing page.                                               |

`templates/` holds minijinja-syntax templates generated from the Go
`text/template` sources by `scripts/convert_templates.py` — do not edit them
by hand. `build.rs` embeds them into the binary at compile time.

## Usage

```rust
use resume_core::{parse_resume_yaml, to_markdown, render_html, validate};

let data = parse_resume_yaml(std::fs::read_to_string("resume.yaml")?.as_str())?;
validate(&data)?;
let markdown = to_markdown(&data);
let html = render_html(&data, "classic/classic")?;
```

## WebAssembly

```sh
make build-wasm    # or: pnpm --filter @resume/core run build:wasm
```

Produces `pkg/` (`resume_core.js`, `resume_core_bg.wasm`, `resume_core.d.ts`)
via `wasm-bindgen --target web`. `pkg/` is gitignored; `package.json` exposes
it to pnpm as `@resume/core`.

Exported functions (all string-in/string-out): `resume_default`, `resume_empty`,
`resume_parse` (YAML or JSON → JSON), `resume_parse_yaml`, `resume_serialize_yaml`,
`resume_serialize_json`, `resume_to_markdown`, `resume_render_html`, `resume_validate`,
`resume_list_templates`, `resume_format_description`.
