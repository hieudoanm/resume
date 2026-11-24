# HTTP server

`resume serve` starts an axum HTTP server that turns resume JSON into PDFs —
useful for preview services, CI pipelines, or anything that already speaks
HTTP.

```sh
resume serve          # listens on 0.0.0.0:8080
PORT=9090 resume serve
```

The port comes from the `PORT` environment variable (default `8080`).

## What it serves

| Endpoint                   | Purpose                                                |
| -------------------------- | ------------------------------------------------------ |
| `POST /api/v1/pdf`         | Resume JSON in → PDF bytes out (`?template=` optional) |
| `GET /api/v1/health`       | Liveness probe                                         |
| `GET /api/v1/openapi.json` | OpenAPI spec                                           |
| `GET /api/v1/docs`         | Swagger UI playground                                  |

Full request/response details are in the [HTTP API reference](../api-reference/http-api.md).

## Requirements

`wkhtmltopdf` must be installed on the host — PDF rendering shells out to it,
exactly like `resume pdf`.

## Example

```sh
resume serve &
curl -s -X POST "http://localhost:8080/api/v1/pdf" \
  -H 'Content-Type: application/json' \
  --data-binary @resume.json -o resume.pdf
```
