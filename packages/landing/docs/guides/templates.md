# Templates

`resume pdf` renders through HTML templates embedded in the binary — 64
templates in 8 families, named `family/variant`. Pass one with `-t`:

```sh
resume pdf -t classic/elegant
```

The default is `classic/classic`. Unknown names fall back to
`classic/classic`, then to a minimal built-in page — a typo will not error,
but will not give you the design you asked for.

## Families and variants

| Family      | Variants                                                               |
| ----------- | ---------------------------------------------------------------------- |
| `classic`   | classic, ceremony, elegant, inkwell, pinnacle, terra, topaz, vintage   |
| `minimal`   | minimal, simple, compact, align, lattice, quartz, slate, zen           |
| `sidebar`   | modern, clean, aurora, beacon, dusk, harbor, iris, nova                |
| `colorful`  | amber, azure, glow, prism, pulse, saffron, sol, solstice               |
| `natural`   | flora, grove, nectar, oasis, peaks, pine, ridge, tide                  |
| `soft`      | breeze, canvas, copper, coral, marble, opal, rose, sherbet             |
| `bands`     | ember, executive, kinetic, meadow, sterling, summit, timber, wave      |
| `specialty` | academic, bold, creative, muse, orbit, professional, sierra, technical |

So `minimal/zen`, `sidebar/harbor` and `bands/wave` are all valid `-t`
values. The same template names work for the `template` query parameter on
[`POST /api/v1/pdf`](../api-reference/http-api.md).

## Listing programmatically

There is no `resume templates` CLI subcommand — the list is exposed through
the [MCP server](mcp-server.md) (`resume_templates` tool) and the WASM
`resume_list_templates` export used by the web app.

## Customizing

Templates are generated from the Go sources in the original project and
embedded at compile time — they cannot be overridden at runtime. To use a
custom design, render Markdown with `resume md` and style it yourself, or
contribute a template upstream.
