# How to install the resume CLI on macOS (Intel)

For Intel-based Macs. The `resume` CLI renders YAML/JSON resumes to Markdown,
PDF and HTML.

## Option 1: install script (recommended)

```sh
curl -fsSL https://raw.githubusercontent.com/hieudoanm/resume/master/scripts/install.sh | bash
```

The script detects `macos/x86_64` and downloads
`cli-resume-x86_64-apple-darwin` from the
[latest release](https://github.com/hieudoanm/resume/releases/latest). It
installs to `~/.local/bin/resume` — override with `INSTALL_DIR=/path`.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/resume/downloads/) and
   download **macOS (Intel)** under **CLI** —
   `cli-resume-x86_64-apple-darwin`.
2. Make it executable and move it onto your `PATH`:

```sh
chmod +x cli-resume-x86_64-apple-darwin
mv cli-resume-x86_64-apple-darwin ~/.local/bin/resume
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
