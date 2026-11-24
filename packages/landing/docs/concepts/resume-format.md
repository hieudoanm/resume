# Resume format

`resume` reads YAML or JSON. Both commands accept either — `resume md -i
resume.json` works the same as `resume.yaml`. The schema is serde
`camelCase`, so keys are `fullName`, `jobTitle`, `startDate`, and so on.

## Top-level sections

| Key              | Type   | Contents                        |
| ---------------- | ------ | ------------------------------- |
| `personal`       | object | `fullName`, `jobTitle`          |
| `contact`        | object | `email`, `phone`, `address`     |
| `websites`       | object | `website`, `linkedin`, `github` |
| `summary`        | string | Short professional summary      |
| `experience`     | list   | Work history entries            |
| `education`      | list   | Degrees and schools             |
| `projects`       | list   | Side projects and portfolios    |
| `skills`         | list   | Grouped skill lists             |
| `certifications` | list   | Certificates and licenses       |
| `languages`      | list   | Spoken languages                |
| `interests`      | string | Free-text hobbies               |
| `references`     | list   | Professional references         |

Every field is optional — missing sections simply do not render.

## Example

```yaml
personal:
  fullName: Jane Doe
  jobTitle: Staff Engineer

contact:
  email: jane@example.com
  phone: +1 555 0100
  address: Berlin, Germany

websites:
  website: https://janedoe.dev
  github: https://github.com/janedoe

summary: |
  Staff engineer with 12 years building distributed systems.

experience:
  - id: exp-1
    company: Example Corp
    role: Staff Engineer
    location: Remote
    startDate: 2021-03
    endDate: Present
    description: |
      - Led the platform migration to Rust
      - Cut p99 latency by 40%
```

## Entry fields

### `experience[]`

`id`, `company`, `role`, `location`, `startDate`, `endDate`, `description`.
Dates are free-form strings — `2021-03`, `March 2021` and `Present` all work.

### `education[]`

`id`, `school`, `degree`, `field`, `location`, `startDate`, `endDate`,
`gpa`, `description`, `relevantSubjects`, `interests`.

### `projects[]`

`id`, `name`, `organization`, `description`, `technologies`.

### `skills[]`

`id`, `category`, `items` — `items` is a comma-separated string rendered as a
list (e.g. `Go, Python, Kubernetes`).

### `certifications[]`, `languages[]`, `references[]`

`certifications`: `id`, `name`, `issuer`, `date`.
`languages`: `id`, `name`, `proficiency`.
`references`: `id`, `name`, `title`, `organization`, `email`.

## Description formatting

`description` fields (summary, experience, education) accept light Markdown:

- Lines starting with `- ` render as bullet lists.
- Paragraphs are preserved.
- The `{{description}}` template helper HTML-escapes content and converts
  newlines to `<br>` — raw HTML in descriptions is escaped, not injected.

## Validation

`resume validate [file]` parses the document and runs the schema checks in
`resume-core` — it fails fast on the first error and prints it to stderr.
