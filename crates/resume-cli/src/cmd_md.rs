use anyhow::{bail, Context, Result};
use clap::Args;
use std::path::Path;

use resume_core::{parse_resume_yaml, to_markdown};

#[derive(Args)]
pub struct MdArgs {
    /// input YAML file
    #[arg(short, long, default_value = "resume.yaml")]
    input: String,
    /// output Markdown file
    #[arg(short, long, default_value = "resume.md")]
    output: String,
}

pub fn run(args: MdArgs) -> Result<()> {
    if !Path::new(&args.input).exists() {
        bail!("{} not found", args.input);
    }

    let source = std::fs::read_to_string(&args.input)
        .with_context(|| format!("failed to read {}", args.input))?;
    let data = parse_resume_yaml(&source).context("failed to parse resume.yaml")?;

    let markdown = to_markdown(&data);
    if let Some(dir) = Path::new(&args.output).parent() {
        if !dir.as_os_str().is_empty() && dir != Path::new(".") {
            std::fs::create_dir_all(dir).context("failed to create output directory")?;
        }
    }
    std::fs::write(&args.output, markdown)
        .with_context(|| format!("failed to write {}", args.output))?;

    println!("Generated {}", args.output);
    Ok(())
}
