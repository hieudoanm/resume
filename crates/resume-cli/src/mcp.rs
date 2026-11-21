//! Minimal MCP (JSON-RPC 2.0 over stdio) server, ported from the Go
//! `internal/mcp` package.

use anyhow::Result;
use serde_json::{json, Map, Value};
use std::io::{BufRead, Write};

const PROTOCOL_VERSION: &str = "2024-11-05";
const SERVER_NAME: &str = "resume";
const SERVER_VERSION: &str = "1.0.0";

const ERR_PARSE: i64 = -32700;
const ERR_INVALID_PARAMS: i64 = -32602;

pub fn run() -> Result<()> {
    let stdin = std::io::stdin();
    let mut stdout = std::io::stdout().lock();

    for line in stdin.lock().lines() {
        let line = line?;
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        handle_message(line.as_bytes(), &mut stdout)?;
    }
    Ok(())
}

fn handle_message(raw: &[u8], out: &mut impl Write) -> Result<()> {
    let req: Value = match serde_json::from_slice(raw) {
        Ok(v) => v,
        Err(_) => {
            write_response(out, error_response(None, ERR_PARSE, "parse error"))?;
            return Ok(());
        }
    };

    // The Go implementation echoes the raw `id` field; requests without one
    // (notifications) get a response with the field omitted.
    let id = req.get("id").cloned();
    let method = req.get("method").and_then(Value::as_str).unwrap_or("");

    match method {
        "initialize" => {
            let result = json!({
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": { "tools": { "listChanged": false } },
                "serverInfo": { "name": SERVER_NAME, "version": SERVER_VERSION },
            });
            write_response(out, success_response(id, result))?;
        }
        "tools/list" => {
            let tools = json!([
                {
                    "name": "resume_init",
                    "description": "Create resume.yaml with default structure",
                    "inputSchema": { "type": "object", "properties": {} },
                },
                {
                    "name": "resume_pdf",
                    "description": "Generate PDF from resume",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "template": { "type": "string" },
                            "output": { "type": "string" },
                        },
                    },
                },
                {
                    "name": "resume_templates",
                    "description": "List available templates",
                    "inputSchema": { "type": "object", "properties": {} },
                },
            ]);
            write_response(out, success_response(id, json!({ "tools": tools })))?;
        }
        "tools/call" => {
            let params = req.get("params");
            let name = params.and_then(|p| p.get("name")).and_then(Value::as_str);
            match name {
                Some(name) => handle_tool(id, name, out)?,
                None => {
                    write_response(
                        out,
                        error_response(id, ERR_INVALID_PARAMS, "invalid params"),
                    )?;
                }
            }
        }
        // Unknown methods are ignored, as in the Go implementation.
        _ => {}
    }
    Ok(())
}

fn handle_tool(id: Option<Value>, name: &str, out: &mut impl Write) -> Result<()> {
    let _ = name;
    let result = json!({
        "content": [{ "type": "text", "text": "ok" }],
    });
    write_response(out, success_response(id, result))?;
    Ok(())
}

fn response(id: Option<Value>, extra: Map<String, Value>) -> Value {
    let mut map = Map::new();
    map.insert("jsonrpc".into(), json!("2.0"));
    if let Some(id) = id {
        map.insert("id".into(), id);
    }
    map.extend(extra);
    Value::Object(map)
}

fn success_response(id: Option<Value>, result: Value) -> Value {
    response(id, Map::from_iter([("result".into(), result)]))
}

fn error_response(id: Option<Value>, code: i64, message: &str) -> Value {
    response(
        id,
        Map::from_iter([("error".into(), json!({ "code": code, "message": message }))]),
    )
}

fn write_response(out: &mut impl Write, resp: Value) -> Result<()> {
    writeln!(out, "{}", serde_json::to_string(&resp)?)?;
    out.flush()?;
    Ok(())
}
