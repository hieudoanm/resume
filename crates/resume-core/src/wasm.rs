//! WebAssembly bindings for `packages/landing`. All functions take and
//! return strings so callers can `JSON.parse`/`JSON.stringify` at the
//! boundary. Built via `make build-wasm` into `crates/resume-core/pkg`.

use wasm_bindgen::prelude::*;

use crate::{
    description::format_description, list_templates, parse_resume_json, parse_resume_yaml,
    render_html, to_json, to_markdown, to_yaml, validate, ResumeData, DEFAULT_RESUME_YAML,
};

fn parse(source: &str) -> Result<ResumeData, JsError> {
    parse_resume_yaml(source).map_err(|e| JsError::new(&e.to_string()))
}

/// Parses a resume.yaml or resume.json document (YAML first, JSON fallback) and
/// returns it as a JSON string.
#[wasm_bindgen]
pub fn resume_parse(text: &str) -> Result<String, JsError> {
    let data = parse_resume_yaml(text)
        .map_err(|e| e.to_string())
        .or_else(|_| parse_resume_json(text).map_err(|e| e.to_string()))
        .map_err(|e| JsError::new(&e))?;
    to_json(&data).map_err(|e| JsError::new(&e.to_string()))
}

/// Serializes a Resume document given as a JSON string to YAML.
#[wasm_bindgen]
pub fn resume_serialize_yaml(json: &str) -> Result<String, JsError> {
    let data = parse_resume_json(json).map_err(|e| JsError::new(&e.to_string()))?;
    to_yaml(&data).map_err(|e| JsError::new(&e.to_string()))
}

/// Serializes a Resume document given as a JSON string to pretty JSON.
#[wasm_bindgen]
pub fn resume_serialize_json(json: &str) -> Result<String, JsError> {
    let data = parse_resume_json(json).map_err(|e| JsError::new(&e.to_string()))?;
    to_json(&data).map_err(|e| JsError::new(&e.to_string()))
}

/// Returns an empty `ResumeData` document as a JSON string.
#[wasm_bindgen]
pub fn resume_empty() -> String {
    serde_json::to_string(&ResumeData::default()).unwrap_or_else(|_| "{}".to_string())
}

/// Returns the default `resume.yaml` scaffold.
#[wasm_bindgen]
pub fn resume_default() -> String {
    DEFAULT_RESUME_YAML.to_string()
}

/// Parses a resume.yaml document and returns it as a JSON string.
#[wasm_bindgen]
pub fn resume_parse_yaml(yaml: &str) -> Result<String, JsError> {
    let data = parse(yaml)?;
    to_json(&data).map_err(|e| JsError::new(&e.to_string()))
}

/// Converts a resume.yaml document to Markdown.
#[wasm_bindgen]
pub fn resume_to_markdown(yaml: &str) -> Result<String, JsError> {
    let data = parse(yaml)?;
    Ok(to_markdown(&data))
}

/// Renders a resume.yaml document to HTML with the named template.
#[wasm_bindgen]
pub fn resume_render_html(yaml: &str, template: &str) -> Result<String, JsError> {
    let data = parse(yaml)?;
    render_html(&data, template).map_err(|e| JsError::new(&e.to_string()))
}

/// Validates a resume.yaml document; returns "ok" or the first violation.
#[wasm_bindgen]
pub fn resume_validate(yaml: &str) -> Result<String, JsError> {
    let data = parse(yaml)?;
    match validate(&data) {
        Ok(()) => Ok("ok".to_string()),
        Err(e) => Ok(e),
    }
}

/// Lists available template names as a JSON array.
#[wasm_bindgen]
pub fn resume_list_templates() -> String {
    serde_json::to_string(&list_templates()).unwrap_or_else(|_| "[]".to_string())
}

/// Formats a description field as HTML-safe text with `<br>` line breaks.
#[wasm_bindgen]
pub fn resume_format_description(text: &str) -> String {
    format_description(text)
}
