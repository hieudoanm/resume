use resume_core::{parse_resume_yaml, render_html};

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let yaml_path = args.get(1).map(String::as_str).unwrap_or("resume.yaml");
    let template = args.get(2).map(String::as_str).unwrap_or("classic/classic");
    let source = std::fs::read_to_string(yaml_path).unwrap();
    let data = parse_resume_yaml(&source).unwrap();
    print!("{}", render_html(&data, template).unwrap());
}
