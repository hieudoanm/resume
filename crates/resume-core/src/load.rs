use crate::types::ResumeData;

/// The default `resume.yaml` scaffold written by `resume init`.
pub const DEFAULT_RESUME_YAML: &str = r#"personal:
  fullName: John Doe
  jobTitle: Software Engineer

contact:
  email: john.doe@example.com
  phone: +1 123 456 7890
  address: 123 Main St, City, Country

websites:
  website: https://johndoe.com
  linkedin: https://linkedin.com/in/johndoe
  github: https://github.com/johndoe

summary: |
  Experienced software engineer with a passion for building scalable applications.

experience:
  - id: exp-1
    company: Example Corp
    role: Software Engineer
    location: City, Country
    startDate: 2020-01
    endDate: Present
    description: |
      - Built and maintained web applications
      - Improved performance by 50%

education:
  - id: edu-1
    school: University Name
    degree: Bachelor of Science
    field: Computer Science
    startDate: 2016-09
    endDate: 2020-06
    description: Graduated with honors

projects:
  - id: proj-1
    name: Project Name
    organization: Example Org
    description: A brief description of the project
    technologies: Go, React, PostgreSQL

skills:
  - id: skill-1
    category: Programming Languages
    items: Go, Python, JavaScript

certifications:
  - id: cert-1
    name: Certification Name
    issuer: Issuing Organization
    date: 2021-01

languages:
  - id: lang-1
    name: English
    proficiency: Native

interests: Reading, Hiking
"#;

/// Parses Resume data from a YAML document.
pub fn parse_resume_yaml(source: &str) -> Result<ResumeData, serde_yml::Error> {
    serde_yml::from_str(source)
}

/// Parses Resume data from a JSON document.
pub fn parse_resume_json(source: &str) -> Result<ResumeData, serde_json::Error> {
    serde_json::from_str(source)
}

/// Serializes Resume data to a JSON document.
pub fn to_json(data: &ResumeData) -> Result<String, serde_json::Error> {
    serde_json::to_string_pretty(data)
}

/// Serializes Resume data to a YAML document.
pub fn to_yaml(data: &ResumeData) -> Result<String, serde_yml::Error> {
    serde_yml::to_string(data)
}
