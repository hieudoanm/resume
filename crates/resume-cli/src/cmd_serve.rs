use anyhow::Result;
use clap::Args;

use crate::serve;

#[derive(Args)]
pub struct ServeArgs {}

pub fn run(_args: ServeArgs) -> Result<()> {
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    serve::run(&port)
}
