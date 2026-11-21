//! Core resume logic shared by the CLI and the WASM build used by the landing page.
//!
//! Everything here is pure or string-in/string-out so the crate compiles to
//! `wasm32-unknown-unknown`. File system access lives in `resume-cli`.

pub mod description;
pub mod load;
pub mod markdown;
pub mod templates;
pub mod types;
pub mod validate;

pub use load::{parse_resume_json, parse_resume_yaml, to_json, to_yaml, DEFAULT_RESUME_YAML};
pub use markdown::to_markdown;
pub use templates::{list_templates, render_html};
pub use types::ResumeData;
pub use validate::validate;

pub mod wasm;
