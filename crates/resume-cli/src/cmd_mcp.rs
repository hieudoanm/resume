use anyhow::Result;
use clap::Args;

use crate::mcp;

#[derive(Args)]
pub struct McpArgs {
    #[command(subcommand)]
    command: McpCommand,
}

#[derive(clap::Subcommand)]
enum McpCommand {
    /// Start MCP server on stdio
    Serve,
}

pub fn run(args: McpArgs) -> Result<()> {
    match args.command {
        McpCommand::Serve => mcp::run(),
    }
}
