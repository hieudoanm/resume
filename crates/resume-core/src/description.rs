/// Renders a YAML description as HTML-safe text that keeps line breaks.
/// Newlines become `<br>` and bullet lines ("- " or "* ") become "• " markers
/// rather than block-level `<ul>`/`<li>` elements that would break the
/// surrounding paragraph in templates.
pub fn format_description(text: &str) -> String {
    let lines: Vec<String> = text
        .trim()
        .split('\n')
        .map(|line| {
            let line = line.trim();
            if line.is_empty() {
                String::new()
            } else if let Some(rest) = line.strip_prefix("- ").or_else(|| line.strip_prefix("* ")) {
                format!("• {}", escape_html(rest.trim()))
            } else {
                escape_html(line)
            }
        })
        .collect();

    compact(&lines).join("<br>")
}

/// Trims leading and trailing blank lines and collapses runs of blank lines
/// into a single blank line.
fn compact(lines: &[String]) -> Vec<&str> {
    let start = lines
        .iter()
        .position(|l| !l.is_empty())
        .unwrap_or(lines.len());
    let end = lines
        .iter()
        .rposition(|l| !l.is_empty())
        .map(|i| i + 1)
        .unwrap_or(start);

    let mut out: Vec<&str> = Vec::with_capacity(end - start);
    for line in &lines[start..end] {
        if line.is_empty() && out.last() == Some(&"") {
            continue;
        }
        out.push(line);
    }
    out
}

/// Equivalent of Go's `html.EscapeString`.
fn escape_html(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    for c in text.chars() {
        match c {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '\'' => out.push_str("&#39;"),
            '"' => out.push_str("&#34;"),
            _ => out.push(c),
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::format_description;

    #[test]
    fn single_line_unchanged() {
        assert_eq!(format_description("Built a thing"), "Built a thing");
    }

    #[test]
    fn blank_lines_separate_paragraphs() {
        assert_eq!(
            format_description("First paragraph.\n\nSecond paragraph."),
            "First paragraph.<br><br>Second paragraph."
        );
    }

    #[test]
    fn hyphen_bullets_become_markers() {
        assert_eq!(
            format_description("- one\n- two\n- three"),
            "• one<br>• two<br>• three"
        );
    }

    #[test]
    fn asterisk_bullets_become_markers() {
        assert_eq!(format_description("* one\n* two"), "• one<br>• two");
    }

    #[test]
    fn leading_and_trailing_whitespace_is_trimmed() {
        assert_eq!(format_description("\n  - one  \n\n"), "• one");
    }

    #[test]
    fn html_special_characters_are_escaped() {
        assert_eq!(format_description("R&D <team>"), "R&amp;D &lt;team&gt;");
    }
}
