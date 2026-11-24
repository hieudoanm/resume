# How to install the resume CLI on Windows

For 64-bit Windows. The `resume` CLI renders YAML/JSON resumes to Markdown,
PDF and HTML.

The release binary is a native `.exe`. The install script is bash, so on
Windows run it from **Git Bash** or **WSL** — or download the binary manually.

## Option 1: install script via Git Bash or WSL

```sh
curl -fsSL https://raw.githubusercontent.com/hieudoanm/resume/master/scripts/install.sh | bash
```

The script detects Windows and downloads
`cli-resume-x86_64-pc-windows-msvc.exe`, installing it to `~/.local/bin/resume`
(or the path you pass as `INSTALL_DIR`).

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/resume/downloads/) and
   download **Windows** under **CLI** —
   `cli-resume-x86_64-pc-windows-msvc.exe`.
2. Rename it to `resume.exe` and place it in a directory on your `PATH` (for
   example `%LOCALAPPDATA%\Programs\resume\` or `C:\tools\`).
3. Open a new terminal and verify:

```powershell
resume --version
```

## Troubleshooting

- `resume is not recognized` — the directory is not on `PATH`. Add it via
  Settings → Environment Variables, or call the binary by full path.
- SmartScreen warning — the binary is unsigned. Choose **More info → Run
  anyway**.
- `resume pdf` fails — install `wkhtmltopdf` for Windows, which the PDF
  renderer shells out to.
