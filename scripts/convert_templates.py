#!/usr/bin/env python3
"""Convert Go text/template resume templates into minijinja syntax.

Usage: convert_templates.py <go-templates-dir> <output-dir>

Handles the subset used by the Go templates: {{.Field}}, {{.A.B}},
{{if .X}}, {{range .X}}, {{else}}, {{end}} and {{description .X}}.
Dotted paths are always top-level (resume.*); single fields resolve against the
innermost range variable when inside a {{range}} block. {{if}} does not
rebind the dot, matching Go template semantics.
"""

import re
import sys
from pathlib import Path

ACTION = re.compile(r"\{\{-?\s*(.*?)\s*-?\}\}")

# Singular loop variable names per ranged collection.
LOOP_VARS = {
    "Experience": "experience",
    "Education": "education",
    "Projects": "project",
    "Skills": "skill",
    "Certifications": "certification",
    "Languages": "language",
}

# Go initialisms -> serde camelCase names.
FIELD_NAMES = {"GPA": "gpa", "ID": "id"}


def camel(name: str) -> str:
    if name in FIELD_NAMES:
        return FIELD_NAMES[name]
    return name[0].lower() + name[1:] if name else name


def innermost_var(stack: list) -> str | None:
    for entry in reversed(stack):
        if entry is not None:
            return entry
    return None


def convert_expr(expr: str, stack: list) -> str:
    expr = expr.strip()
    if not expr.startswith("."):
        raise ValueError(f"unsupported expression: {expr!r}")
    parts = expr.lstrip(".").split(".")
    if len(parts) == 1:
        field = camel(parts[0])
        var = innermost_var(stack)
        return f"{var}.{field}" if var else f"resume.{field}"
    if innermost_var(stack):
        raise ValueError(f"dotted path inside range: {expr!r}")
    return "resume." + ".".join(camel(p) for p in parts)


def convert_file(src: Path) -> str:
    text = src.read_text()
    stack: list = []  # None for {{if}}, loop var name for {{range}}
    out: list[str] = []
    pos = 0
    for m in ACTION.finditer(text):
        out.append(text[pos : m.start()])
        action = m.group(1).strip()
        pos = m.end()

        if action.startswith("if "):
            stack.append(None)
            out.append("{% if " + convert_expr(action[3:], stack[:-1]) + " %}")
        elif action.startswith("range "):
            expr = action[6:].strip()
            var = LOOP_VARS.get(expr.lstrip("."), expr.lstrip(".").lower())
            stack.append(var)
            out.append("{% for " + var + " in " + convert_expr(expr, stack[:-1]) + " %}")
        elif action == "else":
            out.append("{% else %}")
        elif action == "end":
            top = stack.pop()
            out.append("{% endif %}" if top is None else "{% endfor %}")
        elif action.startswith("description "):
            out.append("{{ description(" + convert_expr(action[12:], stack) + ") }}")
        else:
            out.append("{{ " + convert_expr(action, stack) + " }}")

    out.append(text[pos:])
    if stack:
        raise ValueError(f"unbalanced template actions in {src}")
    return "".join(out).replace(">CV - ", ">Resume - ")


def main() -> None:
    src_dir = Path(sys.argv[1])
    dst_dir = Path(sys.argv[2])
    count = 0
    for src in sorted(src_dir.rglob("*.html")):
        rel = src.relative_to(src_dir).with_suffix("")
        dst = dst_dir / (str(rel) + ".html")
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(convert_file(src))
        count += 1
    print(f"converted {count} templates -> {dst_dir}")


if __name__ == "__main__":
    main()
