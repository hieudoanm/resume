use std::fmt::Write as _;

use crate::types::{
    Certification, Contact, Education, Experience, Language, Personal, Project, ResumeData,
    SkillGroup, Websites,
};

/// Renders Resume data as Markdown, mirroring the Go `generateMarkdown`.
pub fn to_markdown(data: &ResumeData) -> String {
    let mut buf = String::new();

    write_personal(&mut buf, &data.personal, &data.contact, &data.websites);
    write_summary(&mut buf, &data.summary);
    write_experience(&mut buf, &data.experience);
    write_education(&mut buf, &data.education);
    write_projects(&mut buf, &data.projects);
    write_skills(&mut buf, &data.skills);
    write_certifications(&mut buf, &data.certifications);
    write_languages(&mut buf, &data.languages);
    write_interests(&mut buf, &data.interests);

    buf
}

/// Writes an ATX heading followed by a blank line so block content that
/// follows (lists, paragraphs) always starts on its own line.
fn heading(buf: &mut String, level: usize, text: &str) {
    let _ = writeln!(buf, "{} {}\n", "#".repeat(level), text);
}

fn bullet(buf: &mut String, label: &str, value: &str) {
    let _ = writeln!(buf, "- **{label}:** {value}");
}

fn write_personal(buf: &mut String, p: &Personal, c: &Contact, w: &Websites) {
    heading(buf, 1, &p.full_name);
    write_personal_details(buf, p);
    write_contact(buf, c);
    write_websites(buf, w);
}

fn write_personal_details(buf: &mut String, p: &Personal) {
    if p.job_title.is_empty() {
        return;
    }
    heading(buf, 2, "Personal");
    bullet(buf, "Job Title", &p.job_title);
    buf.push('\n');
}

fn write_contact(buf: &mut String, c: &Contact) {
    write_entries(
        buf,
        "Contact",
        &[
            Entry {
                label: "Email",
                value: &c.email,
                is_link: false,
            },
            Entry {
                label: "Phone",
                value: &c.phone,
                is_link: false,
            },
            Entry {
                label: "Address",
                value: &c.address,
                is_link: false,
            },
        ],
    );
}

fn write_websites(buf: &mut String, w: &Websites) {
    write_entries(
        buf,
        "Websites",
        &[
            Entry {
                label: "Website",
                value: &w.website,
                is_link: true,
            },
            Entry {
                label: "LinkedIn",
                value: &w.linkedin,
                is_link: true,
            },
            Entry {
                label: "GitHub",
                value: &w.github,
                is_link: true,
            },
        ],
    );
}

/// A labelled value in a contact or website list. Links render as Markdown
/// links so the address stays clickable while the label stays readable.
struct Entry<'a> {
    label: &'a str,
    value: &'a str,
    is_link: bool,
}

fn write_entries(buf: &mut String, title: &str, entries: &[Entry]) {
    if !entries.iter().any(|e| !e.value.is_empty()) {
        return;
    }

    heading(buf, 2, title);
    for e in entries {
        if e.value.is_empty() {
            continue;
        }
        if e.is_link {
            bullet(buf, e.label, &format!("[{}]({})", e.value, e.value));
        } else {
            bullet(buf, e.label, e.value);
        }
    }
    buf.push('\n');
}

fn write_summary(buf: &mut String, summary: &str) {
    if summary.is_empty() {
        return;
    }
    heading(buf, 2, "Professional Summary");
    let _ = writeln!(buf, "{}\n", summary.trim_end_matches('\n'));
}

fn write_experience(buf: &mut String, items: &[Experience]) {
    if items.is_empty() {
        return;
    }
    heading(buf, 2, "Experience");
    for e in items {
        heading(buf, 3, &format!("{} at {}", e.role, e.company));
        bullet(buf, "Period", &date_range(&e.start_date, &e.end_date));
        if !e.location.is_empty() {
            bullet(buf, "Location", &e.location);
        }
        write_text(buf, &e.description);
        buf.push('\n');
    }
}

fn write_education(buf: &mut String, items: &[Education]) {
    if items.is_empty() {
        return;
    }
    heading(buf, 2, "Education");
    for e in items {
        heading(buf, 3, &education_title(e));
        bullet(buf, "Period", &date_range(&e.start_date, &e.end_date));
        if !e.location.is_empty() {
            bullet(buf, "Location", &e.location);
        }
        if !e.gpa.is_empty() {
            bullet(buf, "GPA", &e.gpa);
        }
        write_paragraph(buf, &e.description);
        buf.push('\n');
    }
}

fn education_title(e: &Education) -> String {
    let mut title = e.degree.clone();
    if !e.field.is_empty() {
        title += &format!(" in {}", e.field);
    }
    if !e.school.is_empty() {
        title += &format!(" - {}", e.school);
    }
    title
}

fn write_projects(buf: &mut String, items: &[Project]) {
    if items.is_empty() {
        return;
    }
    heading(buf, 2, "Projects");
    for p in items {
        heading(buf, 3, &project_title(p));
        if !p.technologies.is_empty() {
            bullet(buf, "Technologies", &p.technologies);
            write_paragraph(buf, &p.description);
        } else {
            write_text(buf, &p.description);
        }
        buf.push('\n');
    }
}

/// Pairs the project name with its organisation, mirroring how experience
/// headings read "Role at Company".
fn project_title(p: &Project) -> String {
    if p.organization.is_empty() {
        p.name.clone()
    } else {
        format!("{} at {}", p.name, p.organization)
    }
}

fn write_skills(buf: &mut String, skills: &[SkillGroup]) {
    if skills.is_empty() {
        return;
    }
    heading(buf, 2, "Skills");
    for s in skills {
        bullet(buf, &s.category, &s.items);
    }
    buf.push('\n');
}

fn write_certifications(buf: &mut String, certs: &[Certification]) {
    if certs.is_empty() {
        return;
    }
    heading(buf, 2, "Certifications");
    for c in certs {
        let _ = writeln!(buf, "- {}", certification_line(c));
    }
    buf.push('\n');
}

/// Renders a certification as "**Name** — Issuer (Date)", omitting whichever
/// of issuer and date the entry leaves empty.
fn certification_line(c: &Certification) -> String {
    let mut line = format!("**{}**", c.name);
    if !c.issuer.is_empty() {
        line += &format!(" — {}", c.issuer);
    }
    if !c.date.is_empty() {
        line += &format!(" ({})", c.date);
    }
    line
}

fn write_languages(buf: &mut String, langs: &[Language]) {
    if langs.is_empty() {
        return;
    }
    heading(buf, 2, "Languages");
    for l in langs {
        bullet(buf, &l.name, &l.proficiency);
    }
    buf.push('\n');
}

fn write_interests(buf: &mut String, interests: &str) {
    if interests.is_empty() {
        return;
    }
    heading(buf, 2, "Interests");
    let _ = writeln!(buf, "{}", interests.trim_end_matches('\n'));
}

/// Appends pre-formatted block text, trimming the trailing newline so the
/// caller owns the surrounding blank lines. Used for a description that is
/// either a bullet list (experience) or a paragraph (projects).
fn write_text(buf: &mut String, text: &str) {
    let text = text.trim_end_matches('\n');
    if text.is_empty() {
        return;
    }
    let _ = writeln!(buf, "{text}");
}

/// Appends text as its own paragraph, separated from any list above it by a
/// blank line so it is not swallowed as a lazy continuation.
fn write_paragraph(buf: &mut String, text: &str) {
    let text = text.trim_end_matches('\n');
    if text.is_empty() {
        return;
    }
    let _ = writeln!(buf, "\n{text}");
}

/// Renders a start/end pair, tolerating an empty end date (some resumes fold the
/// whole range into the start field).
fn date_range(start: &str, end: &str) -> String {
    if end.is_empty() {
        start.to_string()
    } else {
        format!("{start} - {end}")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn formats_headings_and_lists() {
        let data = ResumeData {
            personal: Personal {
                full_name: "Jane Doe".into(),
                job_title: "Engineer".into(),
            },
            contact: Contact {
                email: "jane@example.com".into(),
                ..Default::default()
            },
            websites: Websites {
                website: "https://example.com".into(),
                ..Default::default()
            },
            summary: "A summary.".into(),
            experience: vec![Experience {
                company: "Acme".into(),
                role: "Staff Engineer".into(),
                location: "Remote".into(),
                start_date: "2020".into(),
                end_date: "2024".into(),
                description: "- Did a thing.\n- Did another.\n".into(),
                ..Default::default()
            }],
            education: vec![Education {
                school: "MIT".into(),
                degree: "BSc".into(),
                field: "CS".into(),
                start_date: "2010 - 2014".into(),
                description: "Thesis on things.\n".into(),
                ..Default::default()
            }],
            certifications: vec![Certification {
                name: "AWS Certified Solutions Architect - Associate".into(),
                issuer: "Amazon Web Services (AWS)".into(),
                date: "2021-09-11".into(),
                ..Default::default()
            }],
            projects: vec![Project {
                name: "House Pricing Prediction".into(),
                organization: "Acme".into(),
                description: "Automated valuation.\n".into(),
                ..Default::default()
            }],
            ..Default::default()
        };

        let md = to_markdown(&data);

        for want in [
            "# Jane Doe\n\n",
            "## Personal\n\n",
            "- **Job Title:** Engineer\n",
            "## Contact\n\n",
            "- **Email:** jane@example.com\n",
            "## Websites\n\n",
            "- **Website:** [https://example.com](https://example.com)\n",
            "## Experience\n\n",
            "### Staff Engineer at Acme\n\n",
            "- **Period:** 2020 - 2024\n",
            "- Did a thing.\n",
            "## Education\n\n",
            "### BSc in CS - MIT\n\n",
            "- **Period:** 2010 - 2014\n",
            "\nThesis on things.\n",
            "## Projects\n\n",
            "### House Pricing Prediction at Acme\n\n",
            "Automated valuation.\n",
            "## Certifications\n\n",
            "- **AWS Certified Solutions Architect - Associate** — Amazon Web Services (AWS) (2021-09-11)\n",
        ] {
            assert!(md.contains(want), "markdown missing {want:?}\n---\n{md}");
        }

        assert!(!md.contains("2010 - 2014 - "), "trailing separator:\n{md}");
    }

    #[test]
    fn date_range_renders_start_and_end() {
        assert_eq!(date_range("2020", "2024"), "2020 - 2024");
        assert_eq!(date_range("2010 - 2014", ""), "2010 - 2014");
    }
}
