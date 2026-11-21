# resume-cli

The `resume` command-line binary: converts `resume.yaml` into Markdown, HTML and
PDF, validates it against the schema, serves an HTTP PDF API, and runs an MCP
server for LLM clients. All resume logic lives in
[`resume-core`](../resume-core).

## Commands

```sh
resume init                      # create resume.yaml with the default structure
resume md [-i resume.yaml] [-o resume.md]        # YAML -> Markdown
resume pdf [-i resume.yaml] [-o resume.pdf] [-t template]  # YAML -> PDF
resume validate [file]           # check resume.yaml against the schema
resume serve                     # HTTP API on $PORT (default 8080)
resume mcp serve                 # MCP server over stdio (JSON-RPC 2.0)
resume --version
```

`pdf` renders HTML via `resume-core` templates, then invokes `wkhtmltopdf`
(A4, zero margins) — install it for PDF output.

## serve endpoints

| Route               | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `POST /api/v1/pdf`  | JSON `ResumeData` body → `application/pdf`; `?template=`     |
| `GET /api/v1/health`| `{"status":"ok"}`                                       |
| `GET /api/v1/openapi.json` | OpenAPI 3 document                                |
| `GET /api/v1/docs`  | Swagger UI                                              |

## Examples

```sh
resume init
resume validate
resume md -i resume.yaml -o resume.md
resume pdf -t classic/classic -o resume.pdf
PORT=8080 resume serve &
curl -X POST localhost:8080/api/v1/pdf -H 'content-type: application/json' -d @resume.json -o resume.pdf
```

See the crate `AGENTS.md` for conventions.
