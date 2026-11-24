# How to install the resume CLI on macOS (Apple Silicon)

For Macs with an M-series chip (arm64). The `resume` CLI renders YAML/JSON
resumes to Markdown, PDF and HTML.

## Option 1: install script (recommended)

```sh
curl -fsSL https://raw.githubusercontent.com/hieudoanm/resume/master/scripts/install.sh | bash
```

The script detects `macos/arm64` and downloads
`cli-resume-aarch64-apple-darwin` from the
[latest release](https://github.com/hieudoanm/resume/releases/latest). It
installs to `~/.local/bin/resume` — override with `INSTALL_DIR=/path`.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/resume/downloads/) and
   download **macOS (Silicon)** under **CLI** —
   `cli-resume-aarch64-apple-darwin`.
2. Make it executable and move it onto your `PATH`:

```sh
chmod +x cli-resume-aarch64-apple-darwin
mv cli-resume-aarch64-apple-darwin ~/.local/bin/resume
```

3. Verify:

```sh
resume --version
```

## Troubleshooting

- `resume: command not found` — the install directory is not on your `PATH`.
  Add `export PATH="$HOME/.local/bin:$PATH"` to your shell profile.
- Gatekeeper warning — the binary is unsigned. Right-click → Open, or run
  `xattr -d com.apple.quarantine` on the installed binary.
- `resume pdf` fails — install `wkhtmltopdf` (`brew install wkhtmltopdf`),
  which the PDF renderer shells out to.
