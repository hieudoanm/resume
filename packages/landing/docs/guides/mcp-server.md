# MCP server

`resume mcp serve` runs a Model Context Protocol server over stdio
(JSON-RPC 2.0), letting MCP clients — Claude, Cursor, custom agents — drive
the resume toolchain.

```sh
resume mcp serve
```

## Protocol

- Transport: stdio, newline-delimited JSON-RPC 2.0.
- Methods: `initialize`, `tools/list`, `tools/call`.
- Notifications (requests without an `id`) get no response; unknown methods
  are ignored.

## Tools

| Tool               | Description                                     | Input                           |
| ------------------ | ----------------------------------------------- | ------------------------------- |
| `resume_init`      | Create `resume.yaml` with the default structure | none                            |
| `resume_pdf`       | Generate a PDF from resume data                 | `template`, `output` (optional) |
| `resume_templates` | List available templates                        | none                            |

`tools/call` currently returns stub responses — the tool surface is defined
but execution is delegated to the CLI. Check `resume --help` and the
[CLI reference](../api-reference/cli.md) for the underlying commands.

## Client configuration

Point your MCP client at the binary, e.g.:

```json
{
  "mcpServers": {
    "resume": {
      "command": "resume",
      "args": ["mcp", "serve"]
    }
  }
}
```
