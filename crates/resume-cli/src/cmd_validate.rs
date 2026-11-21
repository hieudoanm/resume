use anyhow::{bail, Context, Result};
use clap::Args;
use std::path::Path;

use resume_core::{parse_resume_yaml, validate};

#[derive(Args)]
pub struct ValidateArgs {
    /// YAML file to validate (default: resume.yaml)
    file: Option<String>,
}

pub fn run(args: ValidateArgs) -> Result<()> {
    let input = args.file.unwrap_or_else(|| "resume.yaml".to_string());

    if !Path::new(&input).exists() {
        bail!("input file not found: {input}");
    }

    let source =
        std::fs::read_to_string(&input).with_context(|| format!("failed to read {input}"))?;
    let data = parse_resume_yaml(&source).context("failed to load resume")?;

    validate(&data)
        .map_err(anyhow::Error::msg)
        .context("validation failed")?;

    println!("Validation passed: {input}");
    Ok(())
}
