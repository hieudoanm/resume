use std::io::IsTerminal;

const BOX_TITLE: &str = " Resume Server ";

struct ServerLink {
    label: &'static str,
    url: String,
}

pub fn print_server_box(port: &str) {
    let mut links = vec![ServerLink {
        label: "Local",
        url: format!("http://localhost:{port}"),
    }];
    if let Some(ip) = external_ip() {
        links.push(ServerLink {
            label: "Network",
            url: format!("http://{ip}:{port}"),
        });
    }
    links.push(ServerLink {
        label: "Docs",
        url: format!("http://localhost:{port}/api/v1/docs"),
    });

    print!(
        "{}",
        render_server_box(&links, std::io::stdout().is_terminal())
    );
}

fn render_server_box(links: &[ServerLink], use_ansi: bool) -> String {
    let label_width = links.iter().map(|l| l.label.len()).max().unwrap_or(0);

    let mut rows = Vec::with_capacity(links.len());
    let mut inner = BOX_TITLE.len() + 1;
    for l in links {
        let row = format!("  {}  {}", pad_right(l.label, label_width), l.url);
        rows.push(row);
        inner = inner.max(rows.last().unwrap().len() + 1);
    }

    let mut out = String::new();
    out.push_str(&format!(
        "╭─{}{}╮\n",
        BOX_TITLE,
        "─".repeat(inner - BOX_TITLE.len() - 1)
    ));
    out.push_str(&format!("│{}│\n", " ".repeat(inner)));
    for (i, row) in rows.iter().enumerate() {
        let mut content = pad_right(row, inner);
        if use_ansi {
            content = content.replacen(&links[i].url, &hyperlink(&links[i].url, &links[i].url), 1);
        }
        out.push_str(&format!("│{content}│\n"));
    }
    out.push_str(&format!("│{}│\n", " ".repeat(inner)));
    out.push_str(&format!("╰{}╯\n", "─".repeat(inner)));
    out
}

/// UDP "connect" to a public address to discover the primary local IP,
/// without sending any packets.
fn external_ip() -> Option<String> {
    let socket = std::net::UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    socket.local_addr().ok().map(|a| a.ip().to_string())
}

/// OSC 8 hyperlink escape sequence.
fn hyperlink(url: &str, text: &str) -> String {
    format!("\x1b]8;;{url}\x1b\\{text}\x1b]8;;\x1b\\")
}

fn pad_right(s: &str, n: usize) -> String {
    if s.len() >= n {
        return s.to_string();
    }
    format!("{}{}", s, " ".repeat(n - s.len()))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn links() -> Vec<ServerLink> {
        vec![
            ServerLink {
                label: "Local",
                url: "http://localhost:8080".into(),
            },
            ServerLink {
                label: "Network",
                url: "http://192.168.1.42:8080".into(),
            },
        ]
    }

    #[test]
    fn box_contains_local_url_and_title() {
        let out = render_server_box(&links(), false);
        for want in ["╭", "╯", "Resume Server", "http://localhost:8080", "Local"] {
            assert!(out.contains(want), "output missing {want:?}:\n{out}");
        }
    }

    #[test]
    fn non_tty_has_no_escape_sequences() {
        let out = render_server_box(&links(), false);
        assert!(!out.contains('\x1b'), "unexpected ANSI escapes:\n{out:?}");
    }

    #[test]
    fn borders_align_with_and_without_ansi() {
        for use_ansi in [false, true] {
            let out = render_server_box(&links(), use_ansi);
            let visible: Vec<String> = out
                .lines()
                .map(|l| {
                    let mut s = l.to_string();
                    // strip OSC8 sequences for width check
                    while let Some(start) = s.find("\x1b]8;;") {
                        let end = s[start..].find("\x1b\\").map(|i| start + i + 2).unwrap();
                        s.replace_range(start..end, "");
                    }
                    s
                })
                .collect();
            let width = visible[0].chars().count();
            for (i, line) in visible.iter().enumerate() {
                assert_eq!(
                    line.chars().count(),
                    width,
                    "use_ansi={use_ansi} line {i} width mismatch: {line:?}"
                );
            }
        }
    }

    #[test]
    fn hyperlink_wraps_text_in_osc8() {
        assert_eq!(
            hyperlink("http://localhost:8080", "http://localhost:8080"),
            "\x1b]8;;http://localhost:8080\x1b\\http://localhost:8080\x1b]8;;\x1b\\"
        );
    }

    #[test]
    fn pad_right_pads_and_never_truncates() {
        assert_eq!(pad_right("ab", 4), "ab  ");
        assert_eq!(pad_right("abcd", 2), "abcd");
    }
}
