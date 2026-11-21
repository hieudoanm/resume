# AGENTS.md — assets

Rules for working in `assets/`.

## Sources of truth

- `branding/svg/*.svg` are the canonical logo/OG sources. `branding/png/`
  is generated output — never edit PNGs directly.
- `demo/svg/demo.svg` is the animated terminal demo (SMIL `<animate>`);
  `demo/svg/terminal.svg` is its static final frame. `demo/png/` and
  `demo/gif/` are generated.

## After editing an SVG

1. Run `assets/svg-to-png.sh` (requires `rsvg-convert`) to regenerate the
   sibling `png/` outputs.
2. If the SVG feeds the landing page (`branding/*`), run
   `assets/sync-assets.sh` to update `packages/landing/public/`.
3. `demo.gif` has no in-repo generator — flag to the user that it needs
   regeneration when `demo.svg` changes.

## Content rules

- Terminal/demo text must match real `resume` behaviour:
  - Commands: `resume init`, `resume validate [file]`, `resume md
    [-i in.yaml] [-o out.md]`, `resume pdf [-i in.yaml] [-o out.pdf]
    [-t template]`, `resume serve` (PORT env, default 8080), `resume mcp`.
  - `init` writes `resume.yaml` and prints `Created resume.yaml`; it does **not**
    produce a valid resume — `validate` fails fast on the first missing field
    (e.g. `resume: validation failed: contact.email is required`).
  - `md` prints `Generated resume.md`; `pdf` prints `Generated resume.pdf using
    template <name>` and requires `wkhtmltopdf` on PATH.
  - `serve` prints the "Resume Server" box with Local/Network/Docs links on
    port 8080 by default.
- Keep the demo dark-terminal aesthetic: `#0b0b0b` background, `#141414`
  window, `#5eead4` prompt (teal, matching the `resume` theme), `#7dd3a8`
  success, `#f87171` errors, mono font stack.
- `og.svg` is 1280x640 (2:1); `logo.svg` is a 512x512 badge — teal resume
  document glyph (`#0f766e`) on white.
