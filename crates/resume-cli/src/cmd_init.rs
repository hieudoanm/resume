use anyhow::{bail, Context, Result};
use clap::Args;
use std::path::Path;

use resume_core::DEFAULT_RESUME_YAML;

#[derive(Args)]
pub struct InitArgs {}

pub fn run(_args: InitArgs) -> Result<()> {
    let file = "resume.yaml";
    if Path::new(file).exists() {
        bail!("{file} already exists");
    }
    std::fs::write(file, DEFAULT_RESUME_YAML).context("failed to write resume.yaml")?;
    println!("Created {file}");
    Ok(())
}
