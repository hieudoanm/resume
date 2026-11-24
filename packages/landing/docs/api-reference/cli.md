# CLI reference

`resume` is a single binary with six subcommands. Run `resume --help` or
`resume <command> --help` for the authoritative flag list.

## `resume init`

Writes `DEFAULT_RESUME_YAML` to `resume.yaml` in the current directory.
Fails if the file already exists — delete it first to regenerate.

```sh
resume init
```

## `resume md`

Renders the resume to Markdown.

| Flag             | Default       | Description             |
| ---------------- | ------------- | ----------------------- |
| `-i`, `--input`  | `resume.yaml` | Input YAML or JSON file |
| `-o`, `--output` | `resume.md`   | Output Markdown file    |

```sh
resume md -i cv.yaml -o cv.md
```

## `resume pdf`

Renders the resume to PDF via HTML + `wkhtmltopdf`.

| Flag               | Default           | Description                      |
| ------------------ | ----------------- | -------------------------------- |
| `-i`, `--input`    | `resume.yaml`     | Input YAML or JSON file          |
| `-o`, `--output`   | `resume.pdf`      | Output PDF file                  |
| `-t`, `--template` | `classic/classic` | Template name (`family/variant`) |

`wkhtmltopdf` must be on your `PATH`. See [Templates](../guides/templates.md)
for the full list.

```sh
resume pdf -t sidebar/modern -o resume.pdf
```

## `resume validate`

Parses and validates a resume file against the schema. Prints the first
error to stderr and exits nonzero on failure.

```sh
resume validate            # defaults to resume.yaml
resume validate cv.json
```

## `resume serve`

Starts an HTTP server that accepts resume JSON and returns PDFs — see
[HTTP server](../guides/http-server.md) and the
[HTTP API reference](http-api.md). The listen port comes from the `PORT`
environment variable (default `8080`).

```sh
PORT=9090 resume serve
```

## `resume mcp serve`

Runs an MCP (Model Context Protocol) stdio server for LLM clients — see
[MCP server](../guides/mcp-server.md).

```sh
resume mcp serve
```

## Exit codes

- `0` — success (including `--help`/`--version`, owned by clap)
- `1` — runtime error; message printed as `resume: <err>` on stderr
- `2` — usage error (bad flags, missing subcommand)
