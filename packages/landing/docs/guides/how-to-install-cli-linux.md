# How to install the resume CLI on Linux

For x86_64 Linux distributions. The `resume` CLI renders YAML/JSON resumes to
Markdown, PDF and HTML.

## Option 1: install script (recommended)

```sh
curl -fsSL https://raw.githubusercontent.com/hieudoanm/resume/master/scripts/install.sh | bash
```

The script detects `linux/x86_64` and downloads
`cli-resume-x86_64-unknown-linux-gnu` from the
[latest release](https://github.com/hieudoanm/resume/releases/latest). It
installs to `~/.local/bin/resume` — override with `INSTALL_DIR=/path`.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/resume/downloads/) and
   download **Linux** under **CLI** —
   `cli-resume-x86_64-unknown-linux-gnu`.
2. Make it executable and move it onto your `PATH`:

```sh
chmod +x cli-resume-x86_64-unknown-linux-gnu
mv cli-resume-x86_64-unknown-linux-gnu ~/.local/bin/resume
```

3. Verify:

```sh
resume --version
```

## Troubleshooting

- `resume: command not found` — ensure `~/.local/bin` is on your `PATH`
  (most distributions already include it).
- `No such file or directory` on a glibc system — the binary is built against
  glibc; on musl-based distros (Alpine) build from source instead.
- `resume pdf` fails — install `wkhtmltopdf` (`apt install wkhtmltopdf` or
  your distro's equivalent), which the PDF renderer shells out to.
