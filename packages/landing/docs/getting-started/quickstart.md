# Quickstart

From zero to a rendered resume in three commands.

## 1. Install the CLI

Pick the guide for your platform:

- [macOS (Apple Silicon)](../guides/how-to-install-cli-macos-silicon.md)
- [macOS (Intel)](../guides/how-to-install-cli-macos-intel.md)
- [Linux](../guides/how-to-install-cli-linux.md)
- [Windows](../guides/how-to-install-cli-windows.md)

Or install straight from a checkout:

```sh
./scripts/install-local.sh   # release build -> ~/.local/bin/resume
```

## 2. Scaffold a resume

```sh
resume init
```

This writes a starter `resume.yaml` in the current directory (it refuses to
overwrite an existing file). Edit it with your real details — the schema is
documented in [Resume format](../concepts/resume-format.md).

Prefer a GUI? The [browser editor](https://hieudoanm.github.io/resume/editor/)
produces the same YAML/JSON — download it and feed it to the CLI.

## 3. Render

```sh
resume validate                 # check the file parses and validates
resume md                       # resume.yaml -> resume.md
resume pdf -t classic/elegant   # resume.yaml -> resume.pdf (needs wkhtmltopdf)
```

`md` and `pdf` default to `resume.yaml` / `resume.md` / `resume.pdf` — override
with `-i/--input` and `-o/--output`. See the [CLI reference](../api-reference/cli.md)
for every flag.

## Next steps

- Pick a design from the [template gallery](../guides/templates.md) — 64
  built-in HTML templates in 8 families.
- Expose the CLI to agents with the [MCP server](../guides/mcp-server.md).
- Serve PDFs over HTTP with the [HTTP server](../guides/http-server.md).
