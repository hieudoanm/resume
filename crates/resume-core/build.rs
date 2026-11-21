use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let manifest = env::var("CARGO_MANIFEST_DIR").unwrap();
    let templates = Path::new(&manifest).join("templates");

    println!("cargo:rerun-if-changed=templates");

    let mut entries: Vec<(String, String)> = Vec::new();
    collect(&templates, &templates, &mut entries);
    entries.sort();

    let mut out = String::from("pub(crate) static TEMPLATES: &[(&str, &str)] = &[\n");
    for (name, rel) in entries {
        out.push_str(&format!(
            "    ({name:?}, include_str!(concat!(env!(\"CARGO_MANIFEST_DIR\"), \"/{rel}\"))),\n"
        ));
    }
    out.push_str("];\n");

    let dest = Path::new(&env::var("OUT_DIR").unwrap()).join("templates.rs");
    fs::write(dest, out).unwrap();
}

fn collect(root: &Path, dir: &Path, entries: &mut Vec<(String, String)>) {
    for entry in fs::read_dir(dir).unwrap() {
        let path = entry.unwrap().path();
        if path.is_dir() {
            collect(root, &path, entries);
        } else if path.extension().is_some_and(|e| e == "html") {
            let name = path
                .strip_prefix(root)
                .unwrap()
                .with_extension("")
                .to_string_lossy()
                .replace('\\', "/");
            let rel = path
                .strip_prefix(root.parent().unwrap())
                .unwrap()
                .to_string_lossy()
                .replace('\\', "/");
            entries.push((name, rel));
        }
    }
}
