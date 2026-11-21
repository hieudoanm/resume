mod cmd_init;
mod cmd_mcp;
mod cmd_md;
mod cmd_pdf;
mod cmd_serve;
mod cmd_validate;
mod mcp;
mod pdf;
mod serve;
mod server_box;

use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(
    name = "resume",
    version,
    about = "Resume CLI - Generate resume from YAML to PDF",
    long_about = "Resume CLI helps you create and convert resume from YAML format to PDF using templates.\n\nCommands:\n  init     create resume.yaml with default structure\n  md       convert resume.yaml to resume.md\n  pdf      convert resume.yaml to resume.pdf using a template\n  validate validate resume.yaml against schema\n  mcp      run MCP server\n  serve    start HTTP server to generate PDF from JSON"
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Create resume.yaml with default structure
    Init(cmd_init::InitArgs),
    /// Convert resume.yaml to resume.md
    Md(cmd_md::MdArgs),
    /// Convert resume.yaml to resume.pdf using a template
    Pdf(cmd_pdf::PdfArgs),
    /// Validate resume.yaml against schema
    Validate(cmd_validate::ValidateArgs),
    /// Start HTTP server with endpoint POST /api/v1/pdf to generate PDF from JSON
    Serve(cmd_serve::ServeArgs),
    /// Run MCP server for LLM clients
    Mcp(cmd_mcp::McpArgs),
}

fn main() {
    let cli = Cli::parse();
    if let Err(err) = run(cli) {
        eprintln!("resume: {err:#}");
        std::process::exit(1);
    }
}

fn run(cli: Cli) -> anyhow::Result<()> {
    match cli.command {
        Commands::Init(args) => cmd_init::run(args),
        Commands::Md(args) => cmd_md::run(args),
        Commands::Pdf(args) => cmd_pdf::run(args),
        Commands::Validate(args) => cmd_validate::run(args),
        Commands::Serve(args) => cmd_serve::run(args),
        Commands::Mcp(args) => cmd_mcp::run(args),
    }
}
