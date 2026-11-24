# HTTP API

`resume serve` exposes a small JSON API for generating PDFs from resume
documents. An interactive Swagger UI is served alongside the spec.

Base URL: `http://localhost:$PORT` (`PORT` env var, default `8080`).

## Endpoints

| Method | Path                   | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| `POST` | `/api/v1/pdf`          | Render a PDF from a JSON resume body |
| `GET`  | `/api/v1/health`       | Liveness probe                       |
| `GET`  | `/api/v1/openapi.json` | OpenAPI 3 spec (machine-readable)    |
| `GET`  | `/api/v1/docs`         | Swagger UI for the API above         |

## `POST /api/v1/pdf`

**Request body:** a `ResumeData` JSON document — the same schema as the YAML
input (see [Resume format](../concepts/resume-format.md)).

**Query parameters:**

| Param      | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `template` | Template name (`family/variant`); defaults to `classic/classic` |

**Response:** `application/pdf` bytes.

```sh
curl -s -X POST "http://localhost:8080/api/v1/pdf?template=classic/elegant" \
  -H 'Content-Type: application/json' \
  --data-binary @resume.json \
  -o resume.pdf
```

## Errors

Invalid JSON or schema failures return a non-2xx response with an error
message. `wkhtmltopdf` must be installed on the server host — the endpoint
shells out to it for PDF generation.
