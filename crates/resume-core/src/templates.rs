use minijinja::syntax::SyntaxConfig;
use minijinja::value::Serde;
use minijinja::{Environment, Error, Value};
use std::sync::OnceLock;

use crate::description::format_description;
use crate::types::ResumeData;

mod generated {
    include!(concat!(env!("OUT_DIR"), "/templates.rs"));
}
use generated::TEMPLATES;

static ENV: OnceLock<Result<Environment<'static>, Error>> = OnceLock::new();

fn env() -> Result<&'static Environment<'static>, Error> {
    ENV.get_or_init(|| {
        let mut env = Environment::new();
        // Go's text/template preserves the file's trailing newline.
        env.set_syntax(
            SyntaxConfig::builder()
                .keep_trailing_newline(true)
                .build()?,
        );
        env.add_function("description", |value: Value| -> Result<String, Error> {
            Ok(format_description(value.as_str().unwrap_or_default()))
        });
        for (name, source) in TEMPLATES {
            env.add_template(name, source)?;
        }
        Ok(env)
    })
    .as_ref()
    .map_err(|e| Error::new(e.kind(), e.to_string()))
}

/// Lists available template names (e.g. `classic/classic`), mirroring the Go
/// `ListTemplates` walk over the templates directory.
pub fn list_templates() -> Vec<String> {
    let names: Vec<String> = TEMPLATES.iter().map(|(name, _)| name.to_string()).collect();
    if names.is_empty() {
        vec!["classic/classic".to_string()]
    } else {
        names
    }
}

/// Renders Resume data to HTML using the named template, falling back to
/// `classic/classic` and then to a minimal built-in page — same chain as the
/// Go `renderTemplate`.
pub fn render_html(data: &ResumeData, template_name: &str) -> Result<String, Error> {
    let env = env()?;

    if env.get_template(template_name).is_ok() {
        return render(env, template_name, data);
    }
    if env.get_template("classic/classic").is_ok() {
        return render(env, "classic/classic", data);
    }
    Ok(default_html(data))
}

fn render(env: &Environment<'_>, name: &str, data: &ResumeData) -> Result<String, Error> {
    let template = env.get_template(name)?;
    let ctx = minijinja::context! { resume => Value::from(Serde(data)) };
    template.render(ctx)
}

fn default_html(data: &ResumeData) -> String {
    format!(
        "<html><head><meta charset=\"utf-8\"></head><body><h1>{}</h1><p>{}</p></body></html>",
        data.personal.full_name, data.personal.job_title
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::load::parse_resume_yaml;
    use crate::load::DEFAULT_RESUME_YAML;

    #[test]
    fn every_template_renders_the_default_resume() {
        let data = parse_resume_yaml(DEFAULT_RESUME_YAML).unwrap();
        for name in list_templates() {
            let html = render_html(&data, &name)
                .unwrap_or_else(|e| panic!("template {name} failed to render: {e}"));
            assert!(html.contains("John Doe"), "template {name} missing name");
        }
    }

    #[test]
    fn unknown_template_falls_back_to_classic() {
        let data = parse_resume_yaml(DEFAULT_RESUME_YAML).unwrap();
        let html = render_html(&data, "does/not-exist").unwrap();
        assert!(html.contains("John Doe"));
    }
}
