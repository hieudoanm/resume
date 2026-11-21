use anyhow::{Context, Result};
use axum::{
    extract::{Query, State},
    http::{header, StatusCode},
    response::{Html, IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use serde_json::{json, Value};
use std::net::SocketAddr;

use resume_core::{list_templates, parse_resume_json, ResumeData};

use crate::pdf::render_pdf;
use crate::server_box;

const OPENAPI_SPEC: &str = r##"{
  "openapi": "3.0.3",
  "info": {
    "title": "Resume API",
    "version": "1.0.0",
    "description": "Generate a resume PDF from JSON data using HTML templates."
  },
  "servers": [
    { "url": "/", "description": "Local server" }
  ],
  "paths": {
    "/api/v1/health": {
      "get": {
        "summary": "Health check",
        "tags": ["Health"],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": { "type": "object", "properties": { "status": { "type": "string" } } }
              }
            }
          }
        }
      }
    },
    "/api/v1/openapi.json": {
      "get": {
        "summary": "OpenAPI document",
        "tags": ["Docs"],
        "responses": { "200": { "description": "OpenAPI 3 JSON document" } }
      }
    },
    "/api/v1/docs": {
      "get": {
        "summary": "Swagger UI",
        "tags": ["Docs"],
        "responses": { "200": { "description": "Swagger UI HTML page" } }
      }
    },
    "/api/v1/pdf": {
      "post": {
        "summary": "Generate a resume PDF",
        "tags": ["resume"],
        "parameters": [
          {
            "name": "template",
            "in": "query",
            "required": false,
            "schema": { "type": "string" },
            "description": "Template name (category/name). Defaults to the first available template."
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": { "schema": { "$ref": "#/components/schemas/ResumeData" } }
          }
        },
        "responses": {
          "200": {
            "description": "Generated PDF",
            "content": {
              "application/pdf": { "schema": { "type": "string", "format": "binary" } }
            }
          },
          "400": { "description": "Invalid JSON body" },
          "405": { "description": "Method not allowed" },
          "500": { "description": "PDF generation failed" }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ResumeData": {
        "type": "object",
        "properties": {
          "personal": { "$ref": "#/components/schemas/Personal" },
          "contact": { "$ref": "#/components/schemas/Contact" },
          "websites": { "$ref": "#/components/schemas/Websites" },
          "summary": { "type": "string" },
          "experience": { "type": "array", "items": { "$ref": "#/components/schemas/Experience" } },
          "education": { "type": "array", "items": { "$ref": "#/components/schemas/Education" } },
          "projects": { "type": "array", "items": { "$ref": "#/components/schemas/Project" } },
          "skills": { "type": "array", "items": { "$ref": "#/components/schemas/SkillGroup" } },
          "certifications": { "type": "array", "items": { "$ref": "#/components/schemas/Certification" } },
          "languages": { "type": "array", "items": { "$ref": "#/components/schemas/Language" } },
          "interests": { "type": "string" },
          "references": { "type": "array", "items": { "$ref": "#/components/schemas/Reference" } }
        }
      },
      "Personal": {
        "type": "object",
        "properties": {
          "fullName": { "type": "string" },
          "jobTitle": { "type": "string" }
        }
      },
      "Contact": {
        "type": "object",
        "properties": {
          "email": { "type": "string" },
          "phone": { "type": "string" },
          "address": { "type": "string" }
        }
      },
      "Websites": {
        "type": "object",
        "properties": {
          "website": { "type": "string" },
          "linkedin": { "type": "string" },
          "github": { "type": "string" }
        }
      },
      "Experience": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "company": { "type": "string" },
          "role": { "type": "string" },
          "location": { "type": "string" },
          "startDate": { "type": "string" },
          "endDate": { "type": "string" },
          "description": { "type": "string" }
        }
      },
      "Education": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "school": { "type": "string" },
          "degree": { "type": "string" },
          "field": { "type": "string" },
          "location": { "type": "string" },
          "startDate": { "type": "string" },
          "endDate": { "type": "string" },
          "gpa": { "type": "string" },
          "description": { "type": "string" },
          "relevantSubjects": { "type": "string" },
          "interests": { "type": "string" }
        }
      },
      "Project": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "organization": { "type": "string" },
          "description": { "type": "string" },
          "technologies": { "type": "string" }
        }
      },
      "SkillGroup": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "category": { "type": "string" },
          "items": { "type": "string" }
        }
      },
      "Certification": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "issuer": { "type": "string" },
          "date": { "type": "string" }
        }
      },
      "Language": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "proficiency": { "type": "string" }
        }
      },
      "Reference": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "title": { "type": "string" },
          "organization": { "type": "string" },
          "email": { "type": "string" }
        }
      }
    }
  }
}"##;

const SWAGGER_UI_HTML: &str = r#"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Resume API - Swagger UI</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    SwaggerUIBundle({ url: '/api/v1/openapi.json', dom_id: '#swagger-ui' });
  </script>
</body>
</html>"#;

#[derive(Deserialize)]
struct PdfQuery {
    template: Option<String>,
}

pub fn run(port: &str) -> Result<()> {
    let app = Router::new()
        .route("/api/v1/health", get(handle_health))
        .route("/api/v1/openapi.json", get(handle_openapi))
        .route("/api/v1/docs", get(handle_swagger_ui))
        .route("/api/v1/pdf", post(handle_pdf))
        .with_state(());

    server_box::print_server_box(port);

    let addr: SocketAddr = format!("0.0.0.0:{port}").parse().context("invalid PORT")?;
    let listener =
        std::net::TcpListener::bind(addr).with_context(|| format!("failed to bind {addr}"))?;
    listener.set_nonblocking(true)?;

    let runtime = tokio::runtime::Runtime::new()?;
    runtime
        .block_on(async move {
            let listener = tokio::net::TcpListener::from_std(listener)?;
            axum::serve(listener, app).await
        })
        .context("server error")
}

async fn handle_health() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

async fn handle_openapi() -> Response {
    ([(header::CONTENT_TYPE, "application/json")], OPENAPI_SPEC).into_response()
}

async fn handle_swagger_ui() -> Html<&'static str> {
    Html(SWAGGER_UI_HTML)
}

async fn handle_pdf(State(()): State<()>, Query(query): Query<PdfQuery>, body: String) -> Response {
    let data: ResumeData = match parse_resume_json(&body) {
        Ok(data) => data,
        Err(e) => {
            return error_response(StatusCode::BAD_REQUEST, &e.to_string());
        }
    };

    let template = query.template.unwrap_or_default();
    let template = if template.is_empty() {
        list_templates().first().cloned().unwrap_or_default()
    } else {
        template
    };

    match render_pdf(&data, &template) {
        Ok(pdf) => ([(header::CONTENT_TYPE, "application/pdf")], pdf).into_response(),
        Err(e) => error_response(StatusCode::INTERNAL_SERVER_ERROR, &e.to_string()),
    }
}

fn error_response(status: StatusCode, message: &str) -> Response {
    (status, Json(json!({ "error": message }))).into_response()
}
