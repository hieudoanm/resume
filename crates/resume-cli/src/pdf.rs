use anyhow::{bail, Context, Result};
use resume_core::{render_html, ResumeData};
use std::io::Read;
use std::process::Command;

/// Renders resume data to a PDF using the named HTML template and the
/// `wkhtmltopdf` binary — the same engine the Go implementation wraps.
pub fn render_pdf(data: &ResumeData, template: &str) -> Result<Vec<u8>> {
    let html = render_html(data, template).context("failed to render template")?;

    let dir = tempfile::tempdir().context("failed to create temp dir")?;
    let html_path = dir.path().join("resume.html");
    let pdf_path = dir.path().join("resume.pdf");
    std::fs::write(&html_path, html).context("failed to write temp HTML")?;

    let status = Command::new("wkhtmltopdf")
        .args([
            "--page-size",
            "A4",
            "--margin-top",
            "0mm",
            "--margin-right",
            "0mm",
            "--margin-bottom",
            "0mm",
            "--margin-left",
            "0mm",
            "--quiet",
        ])
        .arg(&html_path)
        .arg(&pdf_path)
        .status()
        .context("failed to run wkhtmltopdf (is it installed?)")?;

    if !status.success() {
        bail!("wkhtmltopdf exited with {status}");
    }

    let mut pdf = Vec::new();
    std::fs::File::open(&pdf_path)
        .context("failed to open generated PDF")?
        .read_to_end(&mut pdf)
        .context("failed to read generated PDF")?;
    Ok(pdf)
}
