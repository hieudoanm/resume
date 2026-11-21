use anyhow::{bail, Context, Result};
use clap::Args;
use std::path::Path;

use resume_core::{list_templates, parse_resume_yaml};

use crate::pdf::render_pdf;

#[derive(Args)]
pub struct PdfArgs {
    /// template name
    #[arg(short, long)]
    template: Option<String>,
    /// output PDF file
    #[arg(short, long, default_value = "resume.pdf")]
    output: String,
    /// input YAML file
    #[arg(short, long, default_value = "resume.yaml")]
    input: String,
}

pub fn run(args: PdfArgs) -> Result<()> {
    let input = if args.input.is_empty() {
        "resume.yaml".to_string()
    } else {
        args.input
    };
    let output = if args.output.is_empty() {
        "resume.pdf".to_string()
    } else {
        args.output
    };

    if !Path::new(&input).exists() {
        bail!("resume.yaml not found. Run 'resume init' first");
    }

    let source =
        std::fs::read_to_string(&input).with_context(|| format!("failed to read {input}"))?;
    let data = parse_resume_yaml(&source).context("failed to load resume")?;

    let template = match args.template {
        Some(t) if !t.is_empty() => t,
        _ => {
            let templates = list_templates();
            if templates.is_empty() {
                bail!("no templates found");
            }
            templates[0].clone()
        }
    };

    let pdf = render_pdf(&data, &template).context("failed to generate PDF")?;
    std::fs::write(&output, pdf).with_context(|| format!("failed to write {output}"))?;

    println!("Generated {output} using template {template}");
    Ok(())
}
